"use client";

import React, { useRef, useState, useMemo } from "react";
import { motion, useScroll, useTransform, useSpring, useInView, useMotionValue } from "framer-motion";

interface Experience {
    id: number;
    period: string;
    role: string;
    company: string;
    description: string;
    highlights: string[];
    tech: string[];
    alignment: "left" | "right";
    position: number;
}

const experiences: Experience[] = [
    {
        id: 1,
        period: "July 2025 – September 2025",
        role: "MERN Stack Developer Intern",
        company: "SoftPro India Pvt. Ltd. (Remote)",
        description: "Worked as a full-stack MERN intern focusing on backend APIs, authentication, and responsive frontend development in an Agile environment.",
        highlights: [
            "Developed RESTful APIs using Node.js, Express.js, MongoDB",
            "Implemented JWT-based authentication & authorization",
            "Built responsive frontend components using React.js",
            "Delivered production-ready features for internal projects"
        ],
        tech: ["Node.js", "Express.js", "MongoDB", "React.js", "JWT", "Git"],
        alignment: "left",
        position: 18
    },
    {
        id: 2,
        period: "June 2025 – July 2025",
        role: "AI & Machine Learning Intern",
        company: "IBM SkillsBuild (AICTE) (Remote)",
        description: "Worked on applied machine learning projects with focus on data preprocessing, model training, evaluation, and deployment.",
        highlights: [
            "Built Employee Salary Prediction System using regression models",
            "Performed data cleaning & feature engineering",
            "Trained and evaluated ML models using Python",
            "Completed end-to-end ML pipeline"
        ],
        tech: ["Python", "Scikit-learn", "Pandas", "NumPy", "ML"],
        alignment: "right",
        position: 42
    },
    {
        id: 3,
        period: "April 2025 – May 2025",
        role: "Mentor & Facilitator Intern",
        company: "Nobel Internship Program (Remote)",
        description: "Served as a mentor and facilitator in a global peer-learning program, focusing on communication, leadership, and cohort engagement.",
        highlights: [
            "Mentored 40+ students",
            "Delivered interactive sessions",
            "Strengthened public speaking & communication skills",
            "Recognized for mentorship quality"
        ],
        tech: ["Leadership", "Communication", "Mentoring", "Public Speaking"],
        alignment: "left",
        position: 68
    },
    {
        id: 4,
        period: "July 2024 – August 2024",
        role: "Web Development Intern",
        company: "CETPA Infotech Pvt. Ltd. (Remote)",
        description: "Focused on frontend web development and responsive UI design for practice and client-oriented applications.",
        highlights: [
            "Developed web pages using HTML, CSS, JavaScript",
            "Created responsive layouts using Flexbox & Grid",
            "Built multiple responsive interfaces",
            "Strengthened frontend fundamentals"
        ],
        tech: ["HTML5", "CSS3", "JavaScript", "Flexbox", "Grid"],
        alignment: "right",
        position: 90
    }
];

const TechnicalDataPoint = ({ top, left, delay, value }: { top: string, left: string, delay: number, value: string }) => (
    <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: [0, 0.2, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay }}
        className="absolute font-mono text-[8px] text-white pointer-events-none select-none"
        style={{ top, left }}
    >
        {value}
    </motion.div>
);

const ScanningBeam = ({ delay }: { delay: number }) => (
    <motion.div
        initial={{ top: "-10vh", opacity: 0 }}
        animate={{ top: "110vh", opacity: [0, 0.15, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear", delay }}
        className="absolute left-0 right-0 h-[30vh] bg-gradient-to-b from-transparent via-crimson/5 to-transparent z-0 pointer-events-none"
    />
);

const ExperienceCard = ({ exp }: { exp: Experience }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(cardRef, { once: false, amount: 0.3 });

    // 3D Tilt Values
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    // Glow Effect
    const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
    const handleGlowMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setGlowPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, x: exp.alignment === "left" ? -50 : 50, y: 30 }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: exp.alignment === "left" ? -50 : 50, y: 30 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            onMouseMove={(e) => {
                handleMouseMove(e);
                handleGlowMove(e);
            }}
            onMouseLeave={handleMouseLeave}
            className={`relative w-full md:w-[45%] group z-20`}
            style={{
                perspective: 1000,
                rotateX: isInView ? rotateX : 0,
                rotateY: isInView ? rotateY : 0,
            }}
        >
            <div className="relative p-6 md:p-10 rounded-2xl border border-white/5 bg-[#121212]/40 backdrop-blur-xl overflow-hidden transition-all duration-500 hover:border-crimson/40 group-hover:shadow-[0_0_50px_rgba(139,0,0,0.15)]">

                {/* Cursor Glow Effect */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        background: `radial-gradient(600px circle at ${glowPos.x}px ${glowPos.y}px, rgba(139, 0, 0, 0.1), transparent 40%)`
                    }}
                />

                <div className="flex justify-between items-start mb-6">
                    <span className="text-crimson font-mono text-xs tracking-[0.3em] uppercase block">
                        MILESTONE_{exp.id.toString().padStart(2, '0')}
                    </span>
                    <span className="text-white/20 font-mono text-[10px] tracking-widest uppercase">
                        LOC_REMOTE
                    </span>
                </div>

                <span className="text-text-muted font-mono text-xs tracking-widest block mb-1">{exp.period}</span>
                <h3 className="text-2xl md:text-3xl font-black text-white mb-2 group-hover:text-crimson transition-colors duration-300 tracking-tight">{exp.role}</h3>
                <h4 className="text-crimson/80 text-sm md:text-base font-bold mb-6 tracking-widest uppercase flex items-center gap-2">
                    <span className="w-4 h-[1px] bg-crimson" />
                    {exp.company}
                </h4>

                <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 font-medium">
                    {exp.description}
                </p>

                <div className="space-y-3 mb-10">
                    {exp.highlights.map((item, i) => (
                        <div key={i} className="flex items-start gap-4">
                            <span className="w-1 h-1 rounded-full bg-crimson mt-2.5 shrink-0 shadow-[0_0_8px_rgba(139,0,0,1)]" />
                            <p className="text-xs md:text-sm text-gray-400/90 leading-snug">{item}</p>
                        </div>
                    ))}
                </div>

                <div className="flex flex-wrap gap-2 pt-6 border-t border-white/5">
                    {exp.tech.map((t, i) => (
                        <span key={i} className="px-3 py-1.5 text-[10px] md:text-xs font-bold tracking-widest rounded-md bg-white/5 text-gray-500 border border-white/5 group-hover:border-crimson/30 group-hover:text-white transition-all duration-300 uppercase">
                            {t}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default function ExperienceSection() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const pathLength = useSpring(scrollYProgress, {
        stiffness: 40,
        damping: 20
    });

    const curvyPath = "M50 0 C70 10, 80 20, 50 30 S20 50, 50 60 S80 80, 50 90 L50 100";

    const techPoints = useMemo(() => [
        { top: "15%", left: "15%", value: "X: 124.032 | Y: 92.421" },
        { top: "25%", left: "80%", value: "LAT: 28.6139 | LON: 77.2090" },
        { top: "45%", left: "10%", value: "SYSTEM_SCAN_COMPLETE... [98%]" },
        { top: "60%", left: "85%", value: "TRACE_ID: 0x9f2e3a" },
        { top: "75%", left: "20%", value: "DEPLOY_STAMP: 2026.02.20" },
        { top: "90%", left: "70%", value: "CAPABILITY_MODEL: V4.0.2" },
    ], []);

    return (
        <section ref={containerRef} className="relative min-h-[500vh] bg-[#0B0B0F] overflow-hidden py-20 md:py-32">

            {/* Background Map Imprint & Animated Technical HUD */}
            <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
                <svg width="100%" height="100%" viewBox="0 0 1000 3000" fill="none" opacity="0.04" preserveAspectRatio="none">
                    <defs>
                        <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="white" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="1000" height="3000" fill="url(#grid)" />

                    {/* Abstract Blueprints */}
                    <motion.circle
                        animate={{ r: [150, 160, 150] }}
                        transition={{ duration: 10, repeat: Infinity }}
                        cx="200" cy="500" r="150" stroke="white" strokeWidth="1"
                    />
                    <circle cx="200" cy="500" r="100" stroke="white" strokeWidth="0.5" strokeDasharray="5 5" />
                    <path d="M800 200 L950 400 L700 600 Z" stroke="white" strokeWidth="1" />

                    {/* Scrolling Technical Lines */}
                    <path d="M0 1500 Q300 1200 600 1500 T1000 1500" stroke="white" strokeWidth="2" strokeDasharray="20 10" />
                    <circle cx="850" cy="2200" r="120" stroke="white" strokeWidth="1" />

                    {/* Compass Rose */}
                    <g transform="translate(150, 200) scale(0.5)">
                        <circle cx="0" cy="0" r="100" stroke="white" strokeWidth="1" />
                        <motion.path
                            animate={{ rotate: 360 }}
                            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                            d="M0 -120 L10 0 L0 120 L-10 0 Z" fill="white"
                        />
                    </g>
                </svg>

                {/* Technical HUD Elements */}
                {techPoints.map((p, i) => (
                    <TechnicalDataPoint key={i} {...p} delay={i * 1.5} />
                ))}

                {/* Scanning Radials */}
                <ScanningBeam delay={0} />
                <ScanningBeam delay={7.5} />

                {/* Floating Technical Symbols */}
                <motion.div
                    animate={{ x: [0, 50, 0], y: [0, -30, 0], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[20%] left-[70%] text-[4vw] font-black text-white/5 select-none"
                >
                    &lt;/&gt;
                </motion.div>
                <motion.div
                    animate={{ x: [0, -40, 0], y: [0, 60, 0], opacity: [0.05, 0.15, 0.05] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute bottom-[30%] left-[10%] text-[3vw] font-black text-white/5 select-none"
                >
                    { }
                </motion.div>
            </div>

            {/* Curvy Road Route SVG */}
            <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none z-10 flex justify-center">
                <svg width="1000" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full">
                    <path
                        d={curvyPath}
                        stroke="rgba(255,255,255,0.02)"
                        strokeWidth="1"
                        fill="none"
                    />
                    <motion.path
                        d={curvyPath}
                        stroke="#8B0000"
                        strokeWidth="0.4"
                        fill="none"
                        style={{ pathLength }}
                        strokeLinecap="round"
                    />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto relative z-20 px-4 md:px-10">
                <div className="text-center mb-40 md:mb-80">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="flex flex-col items-center gap-6"
                    >
                        <span className="px-4 py-1 border border-crimson/30 text-crimson font-mono tracking-[0.5em] text-[10px] uppercase rounded-full bg-crimson/5">
                            Journey Mapping v2.5
                        </span>
                        <h2 className="text-4xl sm:text-6xl md:text-9xl font-black text-white tracking-tighter leading-none uppercase">
                            ROAD TO<br />
                            <span className="text-transparent text-outline opacity-40 italic">MASTERY</span>
                        </h2>
                    </motion.div>
                </div>

                <div className="relative">
                    {experiences.map((exp, index) => (
                        <div
                            key={exp.id}
                            className={`relative flex items-center w-full min-h-[60vh] mb-40 md:mb-0`}
                        >
                            <div className={`w-full flex ${exp.alignment === "left" ? 'justify-start md:pr-[10%]' : 'justify-end md:pl-[10%]'}`}>
                                <ExperienceCard exp={exp} />
                            </div>

                            <div className="absolute left-[50%] -translate-x-1/2 flex items-center justify-center pointer-events-none">
                                <motion.div
                                    className="w-4 h-4 md:w-6 md:h-6 rounded-full bg-deep-black border-2 md:border-4 border-crimson z-30 shadow-[0_0_15px_rgba(139,0,0,0.5)]"
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ margin: "-20%" }}
                                >
                                    <div className="absolute inset-0 w-full h-full rounded-full bg-crimson animate-ping opacity-25" />
                                </motion.div>

                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: "80px" }}
                                    className={`absolute h-[1px] bg-gradient-to-r ${exp.alignment === 'left' ? 'from-transparent to-crimson/30 right-full' : 'from-crimson/30 to-transparent left-full'} hidden md:block`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Final Goal Node */}
            <div className="flex flex-col items-center mt-60 relative z-20">
                <div className="w-[2px] h-40 bg-gradient-to-b from-crimson/30 via-crimson to-transparent mb-10" />
                <motion.div
                    className="w-12 h-12 rounded-full border-2 border-crimson flex items-center justify-center p-1.5 mb-8"
                    animate={{ scale: [1, 1.15, 1], boxShadow: ["0 0 10px rgba(139,0,0,0.5)", "0 0 30px rgba(139,0,0,0.8)", "0 0 10px rgba(139,0,0,0.5)"] }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                >
                    <div className="w-full h-full rounded-full bg-crimson shadow-[0_0_20px_rgba(139,0,0,1)] flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    </div>
                </motion.div>
                <h3 className="text-crimson font-mono tracking-[0.8em] text-center text-[10px] md:text-sm font-bold uppercase">
                    The Infinite Horizon
                </h3>
            </div>
        </section>
    );
}
