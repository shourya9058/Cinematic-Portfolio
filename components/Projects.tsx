"use client";

import React, { useRef } from "react";
import ProjectCard from "./ProjectCard";
import { motion, useScroll, useTransform } from "framer-motion";

const PROJECTS = [
    {
        title: "Roomwati Platform",
        description: "High-fidelity property listing and rental ecosystem with seamless UX.",
        image: "/Roomwati/RoomwatiCover.png",
        slug: "roomwati",
        tech: ["Node.js", "MongoDB", "EJS"]
    },
    {
        title: "AstraLock Security",
        description: "Advanced website protection extension ensuring complete browser privacy.",
        image: "/Astralock/AstralockHero.png",
        slug: "astralock",
        tech: ["JavaScript", "Chrome API", "Security"]
    },
    {
        title: "Feelit Music Player",
        description: "A modern, minimalist web audio experience built with zero dependencies.",
        image: "/FeelIt/FeelItHero.png",
        slug: "feelit",
        tech: ["JavaScript", "HTML5 Audio", "CSS3"]
    },
    {
        title: "Anon E-Commerce",
        description: "Modern, responsive fashion retail platform with high-fidelity UI.",
        image: "/Anon E-Commerce/AnonHero.png",
        slug: "anon",
        tech: ["HTML5", "CSS3", "JavaScript"]
    }
];

export default function Projects() {
    const sectionRef = useRef<HTMLDivElement>(null);

    // Ensure scroll restoration works for the "Work" section
    React.useEffect(() => {
        if ((window.location.hash === "#work" || window.location.hash === "#projects") && sectionRef.current) {
            // Use a slight timeout to ensure styles are ready
            setTimeout(() => {
                sectionRef.current?.scrollIntoView({ behavior: "instant" });
                // Clear the hash after restoration to prevent scroll on manual refresh
                window.history.replaceState(null, "", window.location.pathname);
            }, 50);
        }
    }, []);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "center start"] // Track progress across the whole section
    });

    const headingLines = [
        "A COLLECTION OF",
        "REFINED DIGITAL",
        "EXPERIENCES"
    ];

    let charCount = 0;

    return (
        <section ref={sectionRef} id="projects" className="bg-[#0B0B0F] relative border-t border-white/10 py-10 md:py-0">
            {/* Grid background lines */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="h-full w-[25%] border-r border-white/10 absolute left-0" />
                <div className="h-full w-[25%] border-r border-white/10 absolute left-[25%]" />
                <div className="h-full w-[25%] border-r border-white/10 absolute left-[50%]" />
                <div className="h-full w-[25%] border-r border-white/10 absolute left-[75%]" />
            </div>

            {/* "+" Corner Markers */}
            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 text-white/40 font-light text-xl z-10">+</div>
            <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 text-white/40 font-light text-xl z-10">+</div>

            <div className="relative z-10">
                {/* Header Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 border-b border-white/10">
                    {/* Selected Works Label */}
                    <div className="md:col-span-1 p-8 border-r border-white/10">
                        <span className="text-[10px] font-mono tracking-[0.3em] text-gray-500 uppercase">
                            • Selected Works (04)
                        </span>
                    </div>
                    {/* Empty spacer */}
                    <div className="hidden md:block md:col-span-2 border-r border-white/10 p-8" />
                    {/* Right-side Description */}
                    <div className="md:col-span-1 p-8 flex items-end">
                        <p className="text-[10px] font-mono tracking-widest text-gray-500 uppercase leading-relaxed">
                            Every project here was shaped with intention.
                        </p>
                    </div>
                </div>

                {/* Big Statement Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 border-b border-white/10">
                    <div className="col-span-1 md:col-span-3 p-6 sm:p-8 md:p-12 lg:p-20 border-r border-white/10">
                        <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black text-[#EAEAEA] uppercase tracking-tighter leading-[0.85] whitespace-normal">
                            {headingLines.map((line, lineIdx) => (
                                <span
                                    key={lineIdx}
                                    className={`block ${lineIdx === 2 ? "text-gray-500" : ""}`}
                                >
                                    {line.split("").map((char) => {
                                        const globalIdx = charCount++;
                                        return (
                                            <motion.span
                                                key={globalIdx}
                                                style={{
                                                    opacity: useTransform(
                                                        scrollYProgress,
                                                        [(globalIdx * 0.003), (globalIdx * 0.003) + 0.2],
                                                        [0.2, 1]
                                                    ),
                                                    filter: useTransform(
                                                        scrollYProgress,
                                                        [(globalIdx * 0.003), (globalIdx * 0.003) + 0.2],
                                                        ["blur(4px)", "blur(0px)"]
                                                    )
                                                }}
                                            >
                                                {char === " " ? "\u00A0" : char}
                                            </motion.span>
                                        );
                                    })}
                                </span>
                            ))}
                        </h2>
                    </div>
                    <div className="hidden md:block md:col-span-1" />
                </div>

                {/* Projects Grid Container */}
                <div className="flex flex-col relative z-20">
                    {PROJECTS.map((project, index) => {
                        // Pattern: Left, Right, Center
                        const modes: ("left" | "right" | "center")[] = ["left", "right", "center", "left"];
                        const mode = modes[index % modes.length];

                        return (
                            <ProjectCard
                                key={project.slug}
                                index={index}
                                layoutMode={mode}
                                {...project}
                            />
                        );
                    })}
                </div>

                {/* Footer / Call to Action */}
                <div className="grid grid-cols-1 md:grid-cols-4 border-t border-white/10">
                    <div className="md:col-span-3 p-12 md:p-24 border-r border-white/10 flex items-center">
                        <h3 className="text-5xl md:text-7xl lg:text-9xl font-black text-white uppercase tracking-tighter leading-none">
                            More to Come.
                        </h3>
                    </div>
                    <div className="md:col-span-1 p-8 flex items-center justify-center">
                        <div className="text-white/20 text-8xl font-black select-none">SS</div>
                    </div>
                </div>
            </div>
        </section>
    );
}

