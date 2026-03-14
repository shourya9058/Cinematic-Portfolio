"use client";

import React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import ScrollClipImage from "@/components/ProjectDetail/ScrollClipImage";
import MediaCarousel3D from "@/components/ProjectDetail/MediaCarousel3D";
import { useCursor } from "@/components/CursorContext";

// ─── Data ─────────────────────────────────────────────────────────────────────
import { PROJECT_DATA } from "@/constants/projects";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex items-center gap-4 mb-10 overflow-hidden">
            <div className="w-1.5 h-1.5 bg-[#8B0000] rotate-45" />
            <p className="text-[10px] font-bold tracking-[0.6em] uppercase text-white/40 font-syncopate whitespace-nowrap">{children}</p>
            <div className="w-full h-px bg-white/[0.03] ml-4" />
        </div>
    );
}

function HR() {
    return <div className="w-full h-px bg-white/[0.06]" />;
}

// ─── Scroll-Fill Text Component ───────────────────────────────────────────────
function ScrollFillText({ text, className = "" }: { text: string; className?: string }) {
    const ref = useRef<HTMLParagraphElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 0.9", "start 0.1"]
    });

    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    const words = text.split(" ");
    return (
        <p ref={ref} className={`flex flex-wrap gap-x-[0.25em] gap-y-[0.1em] ${className}`}>
            {words.map((word, i) => {
                const start = i / words.length;
                const end = start + (1 / words.length);
                return (
                    <Word key={i} word={word} progress={smoothProgress} range={[start, end]} />
                );
            })}
        </p>
    );
}

function Word({ word, progress, range }: { word: string; progress: any; range: [number, number] }) {
    const opacity = useTransform(progress, range, [0.35, 1]);
    const color = useTransform(progress, range, ["rgba(255,255,255,0.08)", "#8B0000"]);
    const y = useTransform(progress, range, [8, 0]);
    const scale = useTransform(progress, range, [0.98, 1]);

    return (
        <span className="relative overflow-hidden inline-block py-1 pr-2">
            <span className="absolute inset-0 opacity-5 text-white/5 select-none blur-[4px] pointer-events-none">{word}</span>
            <motion.span style={{ opacity, color, y, scale }} className="inline-block relative z-10 font-syncopate tracking-tight">
                {word}
            </motion.span>
        </span>
    );
}

// ─── Watermark Title Component ───────────────────────────────────────────────
function WatermarkTitle({ title }: { title: string }) {
    const ref = useRef<HTMLHeadingElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [-200, 200]);
    const opacity = useTransform(scrollYProgress, [0, 0.45, 0.55, 1], [0, 0.12, 0.12, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1, 1.15]);
    const blur = useTransform(scrollYProgress, [0, 0.5, 1], ["blur(10px)", "blur(0px)", "blur(10px)"]);

    return (
        <motion.h2
            ref={ref}
            style={{ y, opacity, scale, filter: blur }}
            className="text-[26vw] leading-none font-bold tracking-[-0.12em] text-white whitespace-nowrap font-syncopate mix-blend-overlay pointer-events-none select-none"
        >
            {title}
        </motion.h2>
    );
}

// ─── Header Component ────────────────────────────────────────────────────────
function PageHeader({ data }: { data: any }) {
    return (
        <nav className="fixed top-0 left-0 w-full z-[200] pointer-events-none">
            <div className="flex items-center justify-between px-6 md:px-12 py-7 pointer-events-auto">
                <Link href="/#work" className="group flex items-center gap-3 text-[9px] font-black tracking-[0.45em] uppercase text-white/50 hover:text-white transition-colors duration-500 mix-blend-difference">
                    <span className="inline-block w-5 h-px bg-current group-hover:w-9 transition-all duration-400 ease-out" />
                    Index
                </Link>
                <span className="text-[9px] font-black tracking-[0.45em] uppercase text-white/30 mix-blend-difference">{data.year}</span>
            </div>
        </nav>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProjectPage({ params }: { params: { slug: string } }) {
    const { setCursorType } = useCursor();
    const [isTransitioned, setIsTransitioned] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const touchY = useRef(0);
    const data = PROJECT_DATA[params.slug] || PROJECT_DATA["default"];

    React.useEffect(() => {
        setCursorType("default");
    }, [setCursorType]);

    const slides: any[] = data.slides;
    const springConfig = {
        type: "spring" as const,
        stiffness: 120,
        damping: 22,
        mass: 0.9
    };

    // ─── Transition Handlers ──────────────────────────────────────────────────
    const handleTransition = (direction: "down" | "up") => {
        if (isAnimating) return;

        if (direction === "down" && !isTransitioned) {
            setIsTransitioned(true);
            setIsAnimating(true);
            setTimeout(() => setIsAnimating(false), 800);
        } else if (direction === "up" && isTransitioned) {
            // Only return to hero if at the very top of the card
            if (scrollContainerRef.current && scrollContainerRef.current.scrollTop <= 5) {
                setIsTransitioned(false);
                setIsAnimating(true);
                setTimeout(() => setIsAnimating(false), 800);
            }
        }
    };

    const handleWheel = (e: React.WheelEvent) => {
        if (e.deltaY > 30) handleTransition("down");
        else if (e.deltaY < -30) handleTransition("up");
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        const deltaY = touchY.current - e.changedTouches[0].clientY;
        if (deltaY > 50) handleTransition("down");
        else if (deltaY < -50) handleTransition("up");
    };

    return (
        <main
            className="relative h-screen h-[100dvh] overflow-hidden bg-[#0B0B11] text-white"
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <PageHeader data={data} />

            {/* ── HERO LAYER (BOTTOM) ────────────────────────── */}
            <motion.div
                animate={{
                    scale: isTransitioned ? 0.92 : 1,
                    filter: isTransitioned ? "blur(8px) brightness(0.7)" : "blur(0px) brightness(1)",
                    opacity: isTransitioned ? 0.6 : 1
                }}
                transition={springConfig}
                className="absolute inset-0 z-0 h-full w-full"
            >
                {slides.slice(0, 1).map((slide) => (
                    <section
                        key={slide.id}
                        className="relative w-full h-full overflow-hidden"
                    >
                        <ScrollClipImage
                            src={slide.image}
                            alt={slide.heading ?? data.title}
                            fill
                            priority={slide.isHero}
                        />
                        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-[#0B0B11] via-transparent to-[#0B0B11]/40 opacity-95" />

                        <div className="absolute inset-0 z-20 flex flex-col justify-end px-6 md:px-14 pb-14 md:pb-24">
                            <motion.div
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 1 }}
                                className="flex items-center gap-5 mb-4"
                            >
                                <p className="text-[9px] font-black tracking-[0.5em] uppercase text-white/35">{data.category}</p>
                                <div className="w-8 h-px bg-white/15" />
                                <p className="text-[9px] font-black tracking-[0.5em] uppercase text-white/35">{data.subtitle}</p>
                            </motion.div>
                            <div className="overflow-hidden">
                                <motion.h1
                                    initial={{ y: "100%" }}
                                    animate={{ y: "0%" }}
                                    transition={{ delay: 0.1, duration: 1.4 }}
                                    className="text-[15vw] md:text-[9.5vw] font-bold uppercase tracking-[-0.06em] leading-[0.9] font-syncopate"
                                >
                                    {data.title}
                                </motion.h1>
                            </div>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.1, duration: 1 }}
                                className="flex flex-wrap gap-3 mt-6"
                            >
                                {[data.role, data.year, data.duration].map((tag: string) => (
                                    <span key={tag} className="text-[8px] font-black tracking-[0.4em] uppercase text-white/30 border border-white/10 px-3 py-1.5">{tag}</span>
                                ))}
                            </motion.div>
                        </div>

                        {/* Visual Scroll Indicator */}
                        <motion.div
                            animate={{ opacity: isTransitioned ? 0 : 1 }}
                            transition={{ duration: 1 }}
                            className="absolute left-1/2 bottom-8 -translate-x-1/2 z-30 flex flex-col items-center gap-3"
                        >
                            <span className="text-[8px] font-black tracking-[0.5em] uppercase text-white/20">Scroll to Explore</span>
                            <div className="relative w-px h-12 bg-white/10 overflow-hidden">
                                <motion.div
                                    animate={{ y: ["-100%", "100%"] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 bg-gradient-to-b from-transparent via-[#8B0000] to-transparent"
                                />
                            </div>
                        </motion.div>
                    </section>
                ))}
            </motion.div>

            {/* ── CONTENT LAYER (TOP CARD) ────────────────────── */}
            <motion.div
                ref={scrollContainerRef}
                initial={{ y: "100vh" }}
                animate={{ y: isTransitioned ? "0vh" : "100vh" }}
                transition={springConfig}
                className="absolute inset-0 z-[100] w-full h-full overflow-y-auto bg-[#0B0B11] shadow-[0_-20px_80px_rgba(0,0,0,0.8)]"
                style={{ WebkitOverflowScrolling: "touch" }}
            >
                <div className="relative">
                    {/* Subsequent Slides */}
                    {slides.slice(1).map((slide) => (
                        <section key={slide.id} className="relative overflow-hidden h-screen h-[100dvh]">
                            <ScrollClipImage src={slide.image} alt={slide.heading ?? data.title} fill />
                            <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-[#0B0B11] via-transparent to-[#0B0B11]/40 opacity-95" />
                            <div className="absolute inset-0 z-20 flex flex-col justify-end px-6 md:px-14 pb-14 md:pb-24">
                                <div className="absolute top-24 left-6 md:left-14">
                                    <p className="text-[9px] font-black tracking-[0.5em] uppercase text-white/30">{slide.index} — {slide.label}</p>
                                </div>
                                <motion.h2
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-10%" }}
                                    transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                                    className="text-4xl md:text-6xl lg:text-[4.5rem] font-black uppercase tracking-tighter leading-[0.9] whitespace-pre-line max-w-3xl"
                                >
                                    {slide.heading}
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: 24 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-10%" }}
                                    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                                    className="mt-4 text-base md:text-lg font-light text-white/40 max-w-md leading-relaxed"
                                >
                                    {slide.body}
                                </motion.p>
                            </div>
                        </section>
                    ))}

                    {/* 3D Gallery Section */}
                    {data.gallery?.length > 0 && (
                        <section id="project-gallery" className="relative w-full py-20 md:py-32 overflow-hidden bg-[#06060a]">
                            <div className="max-w-screen-xl mx-auto px-6 md:px-14 mb-12">
                                <div className="flex items-center gap-6">
                                    <p className="text-[9px] font-black tracking-[0.5em] uppercase text-white/25">Screenshots</p>
                                    <div className="flex-1 h-px bg-white/[0.06]" />
                                    <p className="text-[9px] font-black tracking-[0.5em] uppercase text-white/15">{data.gallery.length} Images</p>
                                </div>
                            </div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none select-none z-0">
                                <WatermarkTitle title={data.title} />
                            </div>
                            <MediaCarousel3D media={data.gallery} cardWidth={900} cardHeight={560} gap={55} primaryColor="#ffffff" />
                        </section>
                    )}

                    {/* Project Info & Overview */}
                    <div id="project-content" className="bg-[#0B0B11]">
                        <section className="px-6 md:px-14 py-24 md:py-32">
                            <div className="max-w-screen-xl mx-auto">
                                <HR />
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-16 pt-20">
                                    <div className="md:col-span-3 space-y-10">
                                        <SectionLabel>Project Info</SectionLabel>
                                        <div className="space-y-8">
                                            {[{ label: "Role", value: data.role }, { label: "Client", value: data.client }, { label: "Year", value: data.year }, { label: "Duration", value: data.duration }].map((m) => (
                                                <div key={m.label}>
                                                    <p className="text-[10px] font-black tracking-widest uppercase text-white/20 mb-2">{m.label}</p>
                                                    <p className="text-base font-medium text-white/60">{m.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="md:col-span-8 md:col-start-5 space-y-10">
                                        <div className="bg-white/[0.01] border border-white/[0.03] rounded-[2rem] p-10 md:p-16 backdrop-blur-sm relative overflow-hidden group">
                                            <SectionLabel>Overview</SectionLabel>
                                            <div className="mt-10">
                                                <ScrollFillText text={data.overview} className="text-2xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-white font-syncopate" />
                                            </div>
                                        </div>
                                        <div className="bg-white/[0.01] border border-white/[0.03] rounded-[2rem] p-10 md:p-16 backdrop-blur-sm relative overflow-hidden group">
                                            <SectionLabel>Problem</SectionLabel>
                                            <motion.p initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.4 }} className="mt-10 text-lg md:text-2xl font-light leading-relaxed text-white/50">{data.problem}</motion.p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="px-6 md:px-14 py-20 text-center">
                            <div className="max-w-screen-xl mx-auto flex flex-col items-center">
                                <p className="text-[9px] font-bold tracking-[0.6em] uppercase text-white/20 mb-12">Technical Protocol</p>
                                <div className="flex flex-col sm:flex-row gap-8 justify-center w-full max-w-4xl">
                                    <a href={data.liveUrl} target="_blank" rel="noreferrer" className="group relative flex-1 p-12 bg-white/[0.01] border border-white/5 hover:border-[#8B0000]/40 transition-all duration-700">
                                        <span className="text-[9px] font-bold tracking-[0.6em] uppercase text-white/30 block mb-4">Live System</span>
                                        <span className="text-base font-bold tracking-[0.2em] uppercase font-syncopate text-white">View Project ↗</span>
                                    </a>
                                    <a href={data.repoUrl} target="_blank" rel="noreferrer" className="group relative flex-1 p-12 bg-white/[0.01] border border-white/5 hover:border-white/20 transition-all duration-700">
                                        <span className="text-[9px] font-bold tracking-[0.6em] uppercase text-white/30 block mb-4">Registry</span>
                                        <span className="text-base font-bold tracking-[0.2em] uppercase font-syncopate text-white">Get Source</span>
                                    </a>
                                </div>
                            </div>
                        </section>

                        {data.features?.length > 0 && (
                            <section className="px-6 md:px-14 py-24">
                                <div className="max-w-screen-xl mx-auto">
                                    <HR />
                                    <div className="pt-20">
                                        <SectionLabel>Core Systems</SectionLabel>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-16">
                                            {data.features.map((f: any, i: number) => (
                                                <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-[#0D0D14] border border-white/5 p-12 hover:border-[#8B0000]/40 transition-all duration-700">
                                                    <span className="text-[#8B0000] text-4xl mb-8 block">{f.icon}</span>
                                                    <h3 className="text-[12px] font-bold uppercase tracking-[0.4em] text-white font-syncopate mb-6">{f.title}</h3>
                                                    <p className="text-sm font-light text-white/30 leading-relaxed font-inter">{f.desc}</p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        )}

                        <section className="px-6 md:px-14 py-36 text-center">
                            <motion.h2 className="text-[12vw] md:text-[8vw] font-bold uppercase tracking-[-0.08em] leading-none font-syncopate">
                                <span className="text-white">Experience</span><br />
                                <span className="text-white/10 italic">Evolution.</span>
                            </motion.h2>
                            <Link href="/#work" className="mt-20 group inline-flex items-center gap-8 text-[11px] font-bold tracking-[0.5em] uppercase text-white/30 hover:text-white transition-all duration-700">
                                <div className="w-12 h-px bg-current group-hover:w-24 transition-all duration-700" />
                                <span>Back home</span>
                            </Link>
                        </section>
                    </div>
                </div>
            </motion.div>

            {/* Grain Overlay */}
            <div className="fixed inset-0 pointer-events-none z-[999] opacity-[0.03]"
                style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')", mixBlendMode: "overlay" }} />
        </main>
    );
}
