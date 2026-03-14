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

// ─── Data ─────────────────────────────────────────────────────────────────────
// Data is now sourced from @/constants/projects.ts

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
    // Calibrated for a "Liquid Fill" effect that occurs as the text enters the mid-viewport
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
    // Reveal: Ghost White -> Crimson
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProjectPage({ params }: { params: { slug: string } }) {
    const { setCursorType } = useCursor();
    const data = PROJECT_DATA[params.slug] || PROJECT_DATA["default"];

    React.useEffect(() => {
        setCursorType("default");
    }, [setCursorType]);

    const slides: any[] = data.slides;

    return (
        <main className="bg-[#0B0B11] text-white">

            {/* Fixed nav */}
            <nav className="fixed top-0 left-0 w-full z-[200] pointer-events-none">
                <div className="flex items-center justify-between px-6 md:px-12 py-7 pointer-events-auto">
                    <Link href="/#work" className="group flex items-center gap-3 text-[9px] font-black tracking-[0.45em] uppercase text-white/50 hover:text-white transition-colors duration-500 mix-blend-difference">
                        <span className="inline-block w-5 h-px bg-current group-hover:w-9 transition-all duration-400 ease-out" />
                        Index
                    </Link>
                    <span className="text-[9px] font-black tracking-[0.45em] uppercase text-white/30 mix-blend-difference">{data.year}</span>
                </div>
            </nav>

            {/* ── PAGE 1 (BASE SECTION) ───────────────────────── */}
            {slides.slice(0, 1).map((slide) => {
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const heroRef = useRef<HTMLDivElement>(null);

                return (
                    <section
                        key={slide.id}
                        id={slide.id}
                        ref={heroRef}
                        className="relative overflow-hidden"
                        style={{
                            position: "sticky",
                            top: 0,
                            height: "100vh",
                            zIndex: 1,
                            background: "#0B0B11"
                        }}
                    >
                        <div className="w-full h-full">
                            <ScrollClipImage
                                src={slide.image}
                                alt={slide.heading ?? data.title}
                                fill
                                priority={slide.isHero}
                                wipedBy="project-content"
                            />

                            {/* High-Intensity Technical Vignettes */}
                            <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-[#0B0B11] via-transparent to-[#0B0B11]/40 opacity-95" />

                            {/* HERO content */}
                            <div className="absolute inset-0 z-20 flex flex-col justify-end px-6 md:px-14 pb-14 md:pb-20">
                                <motion.div
                                    initial={{ opacity: 0, y: 14 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
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
                                        transition={{ delay: 0.1, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
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
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 2, duration: 1 }}
                                    className="absolute right-8 bottom-10 flex flex-col items-center gap-2"
                                >
                                    <div className="w-px h-14 bg-gradient-to-b from-white/50 to-transparent" />
                                    <p className="text-[8px] font-black tracking-[0.4em] uppercase text-white/25" style={{ writingMode: "vertical-rl" }}>Scroll</p>
                                </motion.div>
                            </div>
                        </div>
                    </section>
                );
            })}

            {/* ── PAGE 2 (THE LID) ────────────────────────────── */}
            <div className="relative z-10 bg-[#0B0B11]">
                {/* Subsequent Slides (Screenshots) */}
                {slides.slice(1).map((slide, index) => (
                    <section
                        key={slide.id}
                        className="relative overflow-hidden h-screen"
                    >
                        <ScrollClipImage
                            src={slide.image}
                            alt={slide.heading ?? data.title}
                            fill
                        />
                        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-[#0B0B11] via-transparent to-[#0B0B11]/40 opacity-95" />
                        <div className="absolute inset-0 z-20 flex flex-col justify-end px-6 md:px-14 pb-14 md:pb-20">
                            <div className="absolute top-20 left-6 md:left-14">
                                <p className="text-[9px] font-black tracking-[0.5em] uppercase text-white/30">{slide.index} — {slide.label}</p>
                            </div>
                            <motion.h2
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-20%" }}
                                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                                className="text-4xl md:text-6xl lg:text-[4.5rem] font-black uppercase tracking-tighter leading-[0.9] whitespace-pre-line max-w-3xl"
                            >
                                {slide.heading}
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-20%" }}
                                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                                className="mt-4 text-base md:text-lg font-light text-white/40 max-w-md leading-relaxed"
                            >
                                {slide.body}
                            </motion.p>
                        </div>
                    </section>
                ))}

                {/* ── 3D GALLERY ───────────────────────────────────────────── */}
                {data.gallery?.length > 0 && (
                    <section
                        id="project-gallery"
                        className="relative w-full py-20 md:py-28 overflow-hidden bg-[#06060a]"
                    >
                        {/* Orb backgrounds... (already in code) */}
                        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, animation: "orb-1 18s ease-in-out infinite" }}>
                            <div style={{ position: "absolute", top: "-10%", left: "-5%", width: "55vw", height: "55vw", background: "radial-gradient(ellipse at center, rgba(59,76,180,0.28) 0%, transparent 70%)", filter: "blur(40px)" }} />
                        </div>
                        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, animation: "orb-2 22s ease-in-out infinite" }}>
                            <div style={{ position: "absolute", bottom: "-15%", right: "-8%", width: "60vw", height: "60vw", background: "radial-gradient(ellipse at center, rgba(120,40,200,0.22) 0%, transparent 70%)", filter: "blur(50px)" }} />
                        </div>
                        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0, animation: "orb-3 26s ease-in-out infinite" }}>
                            <div style={{ position: "absolute", top: "30%", left: "40%", width: "40vw", height: "40vw", background: "radial-gradient(ellipse at center, rgba(180,100,30,0.12) 0%, transparent 70%)", filter: "blur(60px)" }} />
                        </div>
                        <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none", background: "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(6,6,10,0.7) 100%)" }} />
                        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "80px", zIndex: 1, pointerEvents: "none", background: "linear-gradient(to bottom, #090909, transparent)" }} />
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "80px", zIndex: 1, pointerEvents: "none", background: "linear-gradient(to top, #090909, transparent)" }} />

                        <div className="relative z-10">
                            <div className="max-w-screen-xl mx-auto px-6 md:px-14 mb-12">
                                <div className="flex items-center gap-6">
                                    <p className="text-[9px] font-black tracking-[0.5em] uppercase text-white/25">Screenshots</p>
                                    <div className="flex-1 h-px bg-white/[0.06]" />
                                    <p className="text-[9px] font-black tracking-[0.5em] uppercase text-white/15">{data.gallery.length} Images</p>
                                </div>
                            </div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none select-none z-0 overflow-hidden">
                                <WatermarkTitle title={data.title} />
                            </div>
                            <MediaCarousel3D media={data.gallery} cardWidth={900} cardHeight={560} gap={55} scaleStep={0.13} zStep={90} perspective={1100} radius={12} dragEnabled showButtons primaryColor="#ffffff" />
                            <div className="max-w-screen-xl mx-auto px-6 md:px-14 mt-12">
                                <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="text-[9px] font-black tracking-[0.4em] uppercase text-white/15 text-center">{data.title} — Visual Reference</motion.p>
                            </div>
                        </div>
                    </section>
                )}

                {/* ── PROJECT DETAILS (Description, Tech, etc.) ───────── */}
                <div id="project-content" className="relative bg-[#0B0B11]">
                    <section className="px-6 md:px-14 py-20 md:py-24">
                        <div className="max-w-screen-xl mx-auto">
                            <HR />
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-16">
                                <div className="md:col-span-3 space-y-8">
                                    <SectionLabel>Project Info</SectionLabel>
                                    <div className="space-y-6">
                                        {[{ label: "Role", value: data.role }, { label: "Client", value: data.client }, { label: "Year", value: data.year }, { label: "Duration", value: data.duration }].map((m) => (
                                            <div key={m.label}>
                                                <p className="text-[9px] font-black tracking-widest uppercase text-white/20 mb-1">{m.label}</p>
                                                <p className="text-sm font-medium text-white/55">{m.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="md:col-span-8 md:col-start-5 space-y-8">
                                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 md:p-14 backdrop-blur-sm relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                        <SectionLabel>Overview</SectionLabel>
                                        <div className="mt-8">
                                            <ScrollFillText text={data.overview} className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-white font-syncopate" />
                                        </div>
                                    </div>
                                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-8 md:p-14 backdrop-blur-sm relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                        <SectionLabel>Problem</SectionLabel>
                                        <motion.p initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.1 }} className="mt-8 text-base md:text-xl font-light leading-relaxed text-white/50">{data.problem}</motion.p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="px-6 md:px-14 py-12 md:py-16 text-center">
                        <div className="max-w-screen-xl mx-auto flex flex-col items-center">
                            <p className="text-[9px] font-bold tracking-[0.6em] uppercase text-white/20 mb-10">Technical Protocol / Connections</p>
                            <div className="flex flex-col sm:flex-row gap-6 justify-center w-full max-w-4xl">
                                <a href={data.liveUrl} target="_blank" rel="noreferrer" className="group relative flex-1 flex flex-col items-center text-center p-10 md:p-14 bg-white/[0.01] border border-white/5 hover:bg-[#8B0000]/5 hover:border-[#8B0000]/40 transition-all duration-700 overflow-hidden">
                                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-100 transition-opacity"><span className="text-[#8B0000] text-3xl">↗</span></div>
                                    <span className="text-[9px] font-bold tracking-[0.6em] uppercase text-white/30 mb-4">Live System</span>
                                    <span className="text-sm md:text-base font-bold tracking-[0.2em] uppercase font-syncopate text-white">View Live Project</span>
                                    <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#8B0000] group-hover:w-full transition-all duration-1000" />
                                </a>
                                <a href={data.repoUrl} target="_blank" rel="noreferrer" className="group relative flex-1 flex flex-col items-center text-center p-10 md:p-14 bg-white/[0.01] border border-white/5 hover:border-white/20 transition-all duration-700 overflow-hidden">
                                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-100 transition-opacity"><span className="text-white text-lg tracking-tighter uppercase font-syncopate">Source</span></div>
                                    <span className="text-[9px] font-bold tracking-[0.6em] uppercase text-white/30 mb-4">Technical Registry</span>
                                    <span className="text-sm md:text-base font-bold tracking-[0.2em] uppercase font-syncopate text-white">Source Code</span>
                                    <div className="absolute bottom-0 left-0 w-0 h-1 bg-white/30 group-hover:w-full transition-all duration-1000" />
                                </a>
                            </div>
                        </div>
                    </section>

                    {data.features.length > 0 && (
                        <section className="px-6 md:px-14 py-16 md:py-20">
                            <div className="max-w-screen-xl mx-auto">
                                <HR />
                                <div className="pt-14">
                                    <SectionLabel>Key Features</SectionLabel>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                                        {data.features.map((f: any, i: number) => (
                                            <motion.div key={f.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }} className="group relative bg-[#0B0B11] border border-white/5 p-12 hover:border-[#8B0000]/40 transition-all duration-700 overflow-hidden shadow-2xl">
                                                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700"><div className="w-8 h-8 border-t border-r border-[#8B0000]" /></div>
                                                <div className="relative z-10">
                                                    <div className="flex items-center gap-4 mb-8"><span className="text-[#8B0000] text-4xl opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out drop-shadow-[0_0_15px_rgba(139,0,0,0.3)]">{f.icon}</span><div className="h-[1px] w-0 bg-[#8B0000]/30 group-hover:w-12 transition-all duration-1000" /></div>
                                                    <h3 className="text-[11px] font-bold uppercase tracking-[0.45em] text-white font-syncopate mb-5 group-hover:translate-x-2 transition-transform duration-500">{f.title}</h3>
                                                    <p className="text-xs font-light text-white/25 leading-relaxed font-inter group-hover:text-white/50 transition-colors duration-500">{f.desc}</p>
                                                </div>
                                                <div className="absolute inset-0 bg-gradient-to-b from-[#8B0000]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {data.techStack.length > 0 && (
                        <section className="px-6 md:px-14 py-16 md:py-20">
                            <div className="max-w-screen-xl mx-auto">
                                <HR />
                                <div className="pt-14 grid grid-cols-1 md:grid-cols-12 gap-10">
                                    <div className="md:col-span-3"><SectionLabel>Tech Stack</SectionLabel></div>
                                    <div className="md:col-span-8 md:col-start-5 grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {data.techStack.map((layer: any, i: number) => (
                                            <motion.div key={layer.layer} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, margin: "-5%" }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }} className="bg-white/[0.015] border border-white/[0.03] p-8 hover:border-[#8B0000]/20 transition-all duration-700 group relative">
                                                <p className="text-[9px] font-bold tracking-[0.6em] uppercase text-[#8B0000]/60 mb-8 group-hover:tracking-[0.8em] transition-all duration-700">{layer.layer}</p>
                                                <div className="space-y-3">{layer.items.map((item: string) => (<p key={item} className="text-xs md:text-sm font-bold tracking-tight text-white/80 font-syncopate uppercase group-hover:text-white transition-colors">{item}</p>))}</div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {data.process.length > 0 && (
                        <section className="px-6 md:px-14 py-16 md:py-20">
                            <div className="max-w-screen-xl mx-auto">
                                <HR />
                                <div className="pt-14"><SectionLabel>Process</SectionLabel>
                                    <div className="mt-12 space-y-4">
                                        {data.process.map((p: any, i: number) => (
                                            <motion.div key={p.index} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-5%" }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }} className="grid grid-cols-12 gap-8 p-10 md:p-14 bg-white/[0.015] border border-white/[0.03] hover:bg-white/[0.01] hover:border-[#8B0000]/20 transition-all duration-700 group relative">
                                                <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none"><div className="absolute top-4 right-4 w-2 h-2 border-t border-r border-white/10 group-hover:border-[#8B0000] transition-colors" /></div>
                                                <div className="col-span-12 md:col-span-2"><p className="text-[10px] md:text-xs font-bold tracking-[0.5em] uppercase text-[#8B0000] opacity-40 group-hover:opacity-100 transition-opacity duration-700">{p.index}</p></div>
                                                <div className="col-span-12 md:col-span-4"><h3 className="text-xl md:text-2xl font-bold uppercase tracking-[-0.04em] leading-tight text-white/90 group-hover:text-white transition-colors duration-500 font-syncopate">{p.heading}</h3></div>
                                                <div className="col-span-12 md:col-span-6"><p className="text-xs md:text-sm font-light text-white/30 leading-relaxed group-hover:text-white/50 transition-colors duration-500 font-inter">{p.body}</p></div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    <section className="px-6 md:px-14 py-24 md:py-36 text-center">
                        <div className="max-w-screen-xl mx-auto flex flex-col items-center">
                            <HR />
                            <div className="pt-24">
                                <motion.h2 initial={{ opacity: 0, y: 80 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-5%" }} transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }} className="text-[14vw] md:text-[10vw] font-bold uppercase tracking-[-0.08em] leading-none font-syncopate"><span className="text-white">Solutions</span><br /><span className="text-white/10 italic text-[12vw] md:text-[8vw]">Redefined.</span></motion.h2>
                                <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }} className="mt-14"><Link href="/#work" className="group inline-flex items-center gap-6 text-[10px] font-bold tracking-[0.5em] uppercase text-white/30 hover:text-[#8B0000] transition-all duration-700 font-syncopate"><div className="w-12 h-px bg-current group-hover:w-24 transition-all duration-700" /><span>Return to Station</span></Link></motion.div>
                            </div>
                        </div>
                    </section>

                    <motion.div initial={{ y: 100, opacity: 0, x: "-50%" }} animate={{ y: 0, opacity: 1, x: "-50%" }} transition={{ delay: 2, duration: 1, ease: [0.22, 1, 0.36, 1] }} style={{ left: "50%" }} className="fixed bottom-10 z-[300] pointer-events-auto">
                        <div className="flex items-center gap-1 p-1 bg-[#0B0B11]/80 border border-white/10 backdrop-blur-2xl rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                            <a href={data.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-6 py-3 bg-[#8B0000] text-white rounded-lg group transition-all duration-300 hover:bg-[#a00000]"><span className="text-[10px] font-bold tracking-[0.3em] uppercase font-syncopate">View Live Project</span><span className="text-xs transition-transform group-hover:translate-x-1">↗</span></a>
                            <div className="w-px h-6 bg-white/10 mx-1" /><a href={data.repoUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center p-3 text-white/40 hover:text-white transition-colors group"><span className="text-[10px] font-bold tracking-[0.3em] uppercase font-syncopate hidden sm:inline mr-3">Source</span><svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1 5.07 5.07 0 0 0 14.25 3a8.91 8.91 0 0 0-4.5 0A5.07 5.07 0 0 0 4.1 1 5.07 5.07 0 0 0 4 4.77 5.44 5.44 0 0 0 1 9c0 5.42 3.3 6.61 6.44 7a3.37 3.37 0 0 0-.94 2.58V22" /></svg></a>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Grain Overlay */}
            <div className="fixed inset-0 pointer-events-none z-[999] opacity-[0.03]"
                style={{ backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')", mixBlendMode: "overlay" }} />
        </main>
    );
}
