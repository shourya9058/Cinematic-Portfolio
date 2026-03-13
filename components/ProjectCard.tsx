"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useCursor } from "./CursorContext";

interface ProjectCardProps extends ProjectCardData {
    index: number;
    layoutMode: "left" | "right" | "center";
}

interface ProjectCardData {
    title: string;
    description: string;
    image: string;
    slug: string;
    tech: string[];
}

export default function ProjectCard({ title, description, image, slug, tech, index, layoutMode }: ProjectCardProps) {
    const { setCursorType } = useCursor();
    const cardRef = useRef(null);

    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["start end", "end start"]
    });

    // Subtle upward parallax for the whole card
    const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
    // Parallax shift for the image inside the container
    const imgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

    // Mapping modes to grid column classes
    const imageCols = {
        left: "md:col-span-3",
        right: "md:col-span-3",
        center: "md:col-span-2"
    };

    const textCols = {
        left: "md:col-span-1",
        right: "md:col-span-1 border-r",
        center: "md:col-span-1"
    };

    return (
        <div ref={cardRef} className="group border-b border-white/10 relative overflow-hidden">
            {/* "+" Markers */}
            <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 text-white/20 font-light text-sm z-10">+</div>
            <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 text-white/20 font-light text-sm z-10">+</div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                style={{ y }}
                className="w-full"
            >
                <Link
                    href={`/projects/${slug}`}
                    onClick={() => {
                        window.history.pushState(null, "", "/#work");
                        setCursorType("default");
                    }}
                    className="grid grid-cols-1 md:grid-cols-12 w-full m-[1px]"
                >
                    {/* ASYMMETRIC LOGIC PER MODE */}

                    {/* 1. LEFT MODE: IMAGE (1-7) | TEXT (8-12) */}
                    {layoutMode === "left" && (
                        <>
                            <div className="md:col-span-7 lg:col-span-8 p-6 md:p-12 lg:p-20 border-r border-white/10 border-b md:border-b-0 order-1">
                                <ImageBlock
                                    image={image}
                                    title={title}
                                    scrollY={imgY}
                                    onMouseEnter={() => setCursorType("project")}
                                    onMouseLeave={() => setCursorType("default")}
                                />
                            </div>
                            <div className="md:col-span-5 lg:col-span-4 p-8 md:p-10 flex flex-col justify-between order-2">
                                <TextBlock title={title} tech={tech} />
                            </div>
                        </>
                    )}

                    {/* 2. RIGHT MODE: TEXT (1-5) | IMAGE (6-12) */}
                    {layoutMode === "right" && (
                        <>
                            <div className="md:col-span-5 lg:col-span-4 p-8 md:p-10 border-r border-white/10 border-b md:border-b-0 order-2 md:order-1">
                                <TextBlock title={title} tech={tech} />
                            </div>
                            <div className="md:col-span-7 lg:col-span-8 p-6 md:p-12 lg:p-20 order-1 md:order-2">
                                <ImageBlock
                                    image={image}
                                    title={title}
                                    scrollY={imgY}
                                    onMouseEnter={() => setCursorType("project")}
                                    onMouseLeave={() => setCursorType("default")}
                                />
                            </div>
                        </>
                    )}

                    {/* 3. CENTER MODE: SPACER (1) | IMAGE (2-7) | TEXT (8-12) */}
                    {layoutMode === "center" && (
                        <>
                            <div className="hidden md:block md:col-span-1 border-r border-white/10" />
                            <div className="md:col-span-6 lg:col-span-7 p-6 md:p-12 lg:p-24 border-r border-white/10 border-b md:border-b-0 order-1">
                                <ImageBlock
                                    image={image}
                                    title={title}
                                    scrollY={imgY}
                                    onMouseEnter={() => setCursorType("project")}
                                    onMouseLeave={() => setCursorType("default")}
                                />
                            </div>
                            <div className="md:col-span-5 lg:col-span-4 p-8 md:p-10 flex flex-col justify-between order-2">
                                <TextBlock title={title} tech={tech} />
                            </div>
                        </>
                    )}
                </Link>
            </motion.div>
        </div>
    );
}

// Sub-components for cleaner logic
function ImageBlock({ image, title, scrollY, onMouseEnter, onMouseLeave }: {
    image: string,
    title: string,
    scrollY: any,
    onMouseEnter: () => void,
    onMouseLeave: () => void
}) {
    return (
        <div
            className="relative w-full aspect-[16/9] overflow-hidden bg-[#121212] transition-all duration-700 shadow-2xl group-hover:shadow-[0_0_60px_rgba(139,0,0,0.15)] group-hover:scale-[1.02] cursor-none"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-10"></div>
            <motion.div
                style={{ y: scrollY }}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8 }}
                className="w-full h-full scale-110" // Initial scale to allow parallax room
            >
                <Image
                    src={encodeURI(image)}
                    alt={title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 ease-in-out"
                    sizes="(max-width: 768px) 100vw, 75vw"
                />
            </motion.div>
            <div className="absolute inset-0 bg-crimson opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-20" />
        </div>
    );
}

function TextBlock({ title, tech }: { title: string, tech: string[] }) {
    return (
        <div className="h-full flex flex-col justify-between py-6">
            <h3 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter text-[#EAEAEA] leading-[0.9] mb-12 hover:text-crimson transition-colors duration-300">
                {title}
            </h3>
            <div className="space-y-2">
                {tech.map((tag) => (
                    <p key={tag} className="text-[10px] font-mono tracking-[0.2em] text-gray-400 uppercase leading-none">
                        {tag}
                    </p>
                ))}
            </div>
        </div>
    );
}
