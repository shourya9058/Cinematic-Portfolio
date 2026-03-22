"use client";

import React from "react";
import { motion } from "framer-motion";

const NAV_LINKS = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
];

const SOCIALS = [
    { name: "GitHub", href: "https://github.com/shourya9058" },
    { name: "LinkedIn", href: "https://www.linkedin.com/in/shaurya-singh007/" },
    { name: "Instagram", href: "https://www.instagram.com/_shauryasingh__" },
];

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative bg-black border-t border-white/5 pt-24 pb-12 overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            <div className="container relative z-10 mx-auto px-6 max-w-7xl">
                <div className="flex flex-col lg:flex-row justify-between gap-16 mb-20">

                    {/* Brand Section */}
                    <div className="lg:w-1/2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.85] tracking-tighter text-white font-syncopate uppercase italic">
                                SHOURYA<br />SINGH<span className="text-[#8B0000]">.</span>
                            </h2>
                            <p className="mt-6 text-gray-500 max-w-sm text-sm leading-relaxed font-medium uppercase tracking-wider">
                                Full Stack Developer focused on building scalable web applications and meaningful digital experiences.
                            </p>
                        </motion.div>

                        <div className="flex gap-4">
                            {SOCIALS.map((social) => (
                                <motion.a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -3, color: "#fff" }}
                                    className="text-white/30 text-xs font-bold tracking-widest uppercase transition-colors"
                                >
                                    {social.name}
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Columns */}
                    <div className="lg:w-1/2 grid grid-cols-2 md:grid-cols-3 gap-12">
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase">Navigation</h3>
                            <ul className="space-y-4">
                                {NAV_LINKS.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            className="text-sm font-bold text-white/50 hover:text-white transition-colors uppercase tracking-widest"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase">Location</h3>
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-white/50 uppercase tracking-widest">Moradabad, Uttar Pradesh</p>
                                <p className="text-sm font-bold text-white/50 uppercase tracking-widest">India</p>
                            </div>
                            <div className="pt-4 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-crimson animate-pulse" />
                                <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Open to meaningful opportunities</span>
                            </div>
                        </div>

                        <div className="hidden md:block space-y-6">
                            <h3 className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase">Back to Top</h3>
                            <motion.button
                                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:border-white/40 hover:text-white transition-all"
                            >
                                ↑
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-8 text-center lg:text-left">
                    <div className="text-[10px] font-mono tracking-[0.3em] text-white/20 uppercase">
                        © {currentYear} Shourya Singh · All Rights Reserved
                    </div>

                    <div className="flex items-center gap-6">
                        <span className="text-[10px] font-mono tracking-[0.3em] text-white/10 uppercase italic">Crafted with</span>
                        <div className="flex gap-4">
                            {["Next.js", "Framer Motion", "Tailwind CSS"].map((tech) => (
                                <span key={tech} className="text-[9px] font-black tracking-widest text-white/30 uppercase">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative Silhouette / Large Text Background */}
            <div className="absolute -bottom-20 -right-20 pointer-events-none select-none opacity-[0.02]">
                <h2 className="text-[10rem] sm:text-[15rem] md:text-[20rem] font-black text-white italic tracking-tighter leading-none">
                    SS
                </h2>
            </div>
        </footer>
    );
}
