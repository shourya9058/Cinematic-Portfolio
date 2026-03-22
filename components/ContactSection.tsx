"use client";

import React, { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import ResumeModal from "./Resume/ResumeModal";
import { Copy, FileText } from "lucide-react";

function RevealText({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
}

const PROFANITY_LIST = ["abusive", "spam", "scam", "fuck", "shit", "ass", "bitch"]; // Basic list for demonstration

export default function ContactSection() {
    const [copied, setCopied] = useState(false);
    const email = "imparas07singh@gmail.com";
    const phone = "+91 9058369153";

    // Form State
    const [formData, setFormData] = useState({
        from_name: "",
        from_email: "",
        subject: "",
        message: "",
        honeypot: "" // Anti-spam hidden field
    });

    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isResumeOpen, setIsResumeOpen] = useState(false);

    React.useEffect(() => {
        emailjs.init("iuLlpcip4Tx4isOlO");
    }, []);

    const handleCopy = () => {
        navigator.clipboard.writeText(email).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        const { from_name, from_email, subject, message, honeypot } = formData;

        // Honeypot check
        if (honeypot) return false;

        // Name validation
        if (!from_name.trim()) {
            newErrors.from_name = "Name is required";
        } else if (from_name.trim().length < 3) {
            newErrors.from_name = "Minimum 3 characters";
        } else if (!/^[a-zA-Z\s]+$/.test(from_name.trim())) {
            newErrors.from_name = "Only alphabetic characters allowed";
        }

        // Email validation
        if (!from_email.trim()) {
            newErrors.from_email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from_email.trim())) {
            newErrors.from_email = "Invalid email format";
        }

        // Subject validation
        if (!subject.trim()) {
            newErrors.subject = "Subject is required";
        } else if (subject.trim().length < 5) {
            newErrors.subject = "Minimum 5 characters";
        }

        // Message validation
        if (!message.trim()) {
            newErrors.message = "Message is required";
        } else if (message.trim().length < 20) {
            newErrors.message = "Minimum 20 characters";
        }

        // Profanity filter
        const combinedText = `${subject} ${message}`.toLowerCase();
        if (PROFANITY_LIST.some(word => combinedText.includes(word))) {
            newErrors.general = "Please keep the conversation professional.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Rate limiting check (60 seconds)
        const lastSent = localStorage.getItem("lastContactSent");
        const now = Date.now();
        if (lastSent && now - parseInt(lastSent) < 60000) {
            setErrors({ general: "Please wait a minute before sending another message." });
            return;
        }

        if (!validate()) return;

        setStatus("sending");
        setErrors({});

        try {
            // Sanitize: Trim and escape basic HTML
            const sanitize = (str: string) => str.trim().replace(/[<>]/g, "");
            
            const templateParams = {
                from_name: sanitize(formData.from_name),
                from_email: sanitize(formData.from_email),
                subject: sanitize(formData.subject),
                message: sanitize(formData.message)
            };

            await emailjs.send(
                "service_vf5ze9r",
                "template_t6400y4",
                templateParams,
                "iuLlpcip4Tx4isOlO"
            );

            setStatus("success");
            localStorage.setItem("lastContactSent", now.toString());
            setFormData({
                from_name: "",
                from_email: "",
                subject: "",
                message: "",
                honeypot: ""
            });

            setTimeout(() => setStatus("idle"), 5000);
        } catch (error: any) {
            console.error("EmailJS Error Detail:", {
                message: error?.text || error?.message || "Unknown error",
                status: error?.status || "No status",
                fullError: error
            });
            setStatus("error");
            setTimeout(() => setStatus("idle"), 5000);
        }
    };

    return (
        <section
            id="contact"
            className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black text-white"
        >
            {/* Background Image - Reference style with silhouette/smoke */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: "url('/ConatactMe bg.png')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.8,
                }}
            >
                {/* Vignette/Darken Overlay to match reference mood */}
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
            </div>

            {/* Content Container */}
            <div className="container relative z-10 px-6 py-20 mx-auto max-w-7xl h-full flex flex-col justify-center items-center">

                {/* Sidebars for Desktop */}

                {/* Left Sidebar: Socials */}
                <div className="hidden lg:flex absolute left-8 top-1/2 -translate-y-1/2 flex-col items-start gap-12 z-20">
                    <div className="flex items-center gap-4 origin-left -rotate-90 -translate-x-1/2 translate-y-24">
                        <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-white/30 whitespace-nowrap">
                            SOCIALS
                        </span>
                        <div className="w-12 h-[1px] bg-white/10" />
                    </div>
                    <div className="flex flex-col gap-8 pt-32">
                        {[
                            { name: "GITHUB", href: "https://github.com/shourya9058" },
                            { name: "LINKEDIN", href: "https://www.linkedin.com/in/shaurya-singh007/" },
                            { name: "EMAIL", href: `mailto:${email}` },
                            { name: "INSTAGRAM", href: "https://www.instagram.com/_Shouryasingh__/" }
                        ].map((item) => (
                            <motion.a
                                key={item.name}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ x: 5 }}
                                className="text-[10px] font-black tracking-[0.2em] uppercase text-white/40 hover:text-white transition-colors cursor-pointer no-underline"
                            >
                                {item.name}
                            </motion.a>
                        ))}
                    </div>
                </div>

                {/* Right Sidebar: Contact Info */}
                <div className="hidden lg:flex absolute right-8 top-1/2 -translate-y-1/2 flex-col items-end text-right gap-6 z-20">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-white/30 tracking-widest uppercase">Email</p>
                            <p className="text-sm font-medium text-white/80 tracking-wide lowercase">{email}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-white/30 tracking-widest uppercase">Phone</p>
                            <p className="text-sm font-medium text-white/80 tracking-wide">{phone}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold text-white/30 tracking-widest uppercase">Social</p>
                            <p className="text-sm font-medium text-white/60 tracking-wide">@shourya9058</p>
                            <p className="text-sm font-medium text-white/60 tracking-wide">/in/shaurya-singh007/</p>
                        </div>
                        
                        <div className="pt-4 flex justify-end">
                            <button
                                onClick={() => setIsResumeOpen(true)}
                                className="group flex items-center gap-3 px-6 py-3 rounded-full bg-white/5 border border-white/5 hover:border-crimson/50 transition-all duration-500"
                            >
                                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white/40 group-hover:text-white transition-colors">View Resume</span>
                                <FileText className="w-4 h-4 text-white/20 group-hover:text-crimson transition-colors" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Center Content: Main Heading & Form */}
                <div className="w-full max-w-2xl text-center space-y-16">

                    {/* Headings */}
                    <div className="space-y-4">
                        <RevealText delay={0.2}>
                            <h2
                                className="text-[10px] md:text-xs font-black tracking-[0.4em] uppercase text-white/40 mb-4 max-w-md mx-auto leading-relaxed"
                                style={{ fontFamily: "'Inter', sans-serif" }}
                            >
                                Always open to exciting ideas
                            </h2>
                        </RevealText>

                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="space-y-0"
                        >
                            <RevealText delay={0.3}>
                                <h2
                                    className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-thin tracking-[-0.02em] text-white/90 leading-none uppercase"
                                    style={{ fontFamily: "'Inter', sans-serif" }}
                                >
                                    Let's Build
                                </h2>
                            </RevealText>
                            <RevealText delay={0.4}>
                                <h2
                                    className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-black tracking-[-0.05em] text-white leading-[0.85] uppercase italic"
                                    style={{ fontFamily: "'Inter', sans-serif" }}
                                >
                                    Something
                                </h2>
                            </RevealText>
                            <RevealText delay={0.5}>
                                <h2
                                    className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black tracking-[-0.05em] text-crimson leading-[0.85] uppercase relative inline-block group"
                                    style={{
                                        fontFamily: "'Inter', sans-serif",
                                        textShadow: "0 0 30px rgba(139,0,0,0.3)"
                                    }}
                                >
                                    Meaningful<span className="text-white">.</span>
                                    {/* Subtle underline animation */}
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: "100%" }}
                                        transition={{ delay: 1, duration: 1 }}
                                        className="h-[2px] bg-crimson absolute -bottom-2 left-0 opacity-50"
                                    />
                                </h2>
                            </RevealText>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.5, delay: 0.8 }}
                            className="text-xs md:text-sm text-white/30 font-medium tracking-[0.2em] max-w-md mx-auto leading-relaxed pt-8 uppercase"
                        >
                            Designing and engineering scalable web experiences.
                        </motion.p>
                    </div>

                    {/* Contact Form */}
                    <div className="space-y-8">
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 1 }}
                            className="text-[10px] text-white/40 uppercase tracking-widest max-w-xs mx-auto"
                        >
                            If you're building something exciting or looking for a developer who enjoys solving real problems, I'd be glad to connect.
                        </motion.p>

                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.6 }}
                            onSubmit={handleSubmit}
                            className="space-y-12 pt-8"
                        >
                            {/* Honeypot field - Hidden from users */}
                            <input
                                type="text"
                                className="hidden"
                                value={formData.honeypot}
                                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                            />

                            <div className="grid grid-cols-1 gap-12 text-left">
                                <div className="relative border-b border-white/10 pb-4 group">
                                    <label className="text-[9px] font-black tracking-[0.4em] uppercase text-white/20 block mb-3 group-focus-within:text-crimson/80 transition-colors">NAME</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.from_name}
                                        onChange={(e) => setFormData({ ...formData, from_name: e.target.value })}
                                        className="bg-transparent border-none outline-none w-full text-white font-medium tracking-wide"
                                        placeholder="Your name"
                                    />
                                    {errors.from_name && <span className="text-[8px] text-crimson uppercase tracking-widest absolute -bottom-4 left-0">{errors.from_name}</span>}
                                </div>

                                <div className="relative border-b border-white/10 pb-4 group">
                                    <label className="text-[9px] font-black tracking-[0.4em] uppercase text-white/20 block mb-3 group-focus-within:text-crimson/80 transition-colors">EMAIL</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.from_email}
                                        onChange={(e) => setFormData({ ...formData, from_email: e.target.value })}
                                        className="bg-transparent border-none outline-none w-full text-white font-medium tracking-wide"
                                        placeholder="your@email.com"
                                    />
                                    {errors.from_email && <span className="text-[8px] text-crimson uppercase tracking-widest absolute -bottom-4 left-0">{errors.from_email}</span>}
                                </div>

                                <div className="relative border-b border-white/10 pb-4 group">
                                    <label className="text-[9px] font-black tracking-[0.4em] uppercase text-white/20 block mb-3 group-focus-within:text-crimson/80 transition-colors">SUBJECT</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="bg-transparent border-none outline-none w-full text-white font-medium tracking-wide"
                                        placeholder="Project Inquiry / Job Opportunity"
                                    />
                                    {errors.subject && <span className="text-[8px] text-crimson uppercase tracking-widest absolute -bottom-4 left-0">{errors.subject}</span>}
                                </div>

                                <div className="relative border-b border-white/10 pb-4 group">
                                    <label className="text-[9px] font-black tracking-[0.4em] uppercase text-white/20 block mb-3 group-focus-within:text-crimson/80 transition-colors">MESSAGE</label>
                                    <textarea
                                        rows={1}
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        className="bg-transparent border-none outline-none w-full text-white font-medium tracking-wide resize-none min-h-[40px]"
                                        placeholder="Tell me about your idea or opportunity..."
                                    />
                                    {errors.message && <span className="text-[8px] text-crimson uppercase tracking-widest absolute -bottom-4 left-0">{errors.message}</span>}
                                </div>
                            </div>

                            {/* Status and Errors */}
                            <AnimatePresence>
                                {errors.general && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="text-[10px] text-crimson uppercase tracking-widest font-black"
                                    >
                                        {errors.general}
                                    </motion.div>
                                )}
                                {status === "success" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="text-[10px] text-green-500 uppercase tracking-widest font-black"
                                    >
                                        Message sent successfully.
                                    </motion.div>
                                )}
                                {status === "error" && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="text-[10px] text-crimson uppercase tracking-widest font-black"
                                    >
                                        Something went wrong. Please try again.
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Send Button */}
                            <div className="flex justify-center pt-10">
                                <motion.button
                                    whileHover={{ scale: 1.05, backgroundColor: status === "sending" ? "#444" : "#B22222" }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={status === "sending"}
                                    type="submit"
                                    className={`px-16 py-5 ${status === "sending" ? "bg-gray-800 cursor-not-allowed" : "bg-crimson"} text-white font-black uppercase tracking-[0.4em] text-[11px] transition-all shadow-2xl shadow-crimson/20`}
                                >
                                    {status === "sending" ? "Sending message..." : "SEND"}
                                </motion.button>
                            </div>
                        </motion.form>
                    </div>
                </div>

                {/* Mobile Sidebars (Stacked at bottom) */}
                <div className="lg:hidden w-full flex flex-col items-center gap-8 mt-16 pt-12 border-t border-white/5">
                    <div className="flex gap-8">
                        {[
                            { name: "GITHUB", href: "https://github.com/shourya9058" },
                            { name: "LINKEDIN", href: "https://www.linkedin.com/in/shaurya-singh007/" },
                            { name: "EMAIL", href: `mailto:${email}` }
                        ].map((item) => (
                            <a 
                                key={item.name} 
                                href={item.href} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase no-underline"
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>
                    <div className="flex flex-col items-center gap-2 opacity-30 text-[9px] font-mono tracking-widest">
                        <div>{email}</div>
                        <div>{phone}</div>
                    </div>
                </div>

            </div>

            {/* Very Bottom Footer Bar (Subtle) */}
            <div className="absolute bottom-6 w-full flex justify-center opacity-10 pointer-events-none">
                <span className="text-[9px] font-mono tracking-[0.5em] uppercase">© 2026 SHOURYA SINGH</span>
            </div>

            {/* Resume Modal */}
            <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
        </section>
    );
}
