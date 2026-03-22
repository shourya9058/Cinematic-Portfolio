"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ScrollStorySection() {
    const sectionRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"], // Start when section enters view
    });

    // Map vertical scroll to horizontal movement with parallax
    // Completed much earlier in the scroll
    const x1 = useTransform(scrollYProgress, [0, 0.5], ["50%", "-10%"]);

    // Line 2: Starts further off-screen (delayed feel), moves Left
    const x2 = useTransform(scrollYProgress, [0, 0.6], ["100%", "-10%"]);

    // Fade in at start, stay visible
    const opacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

    // Background Parallax
    const bgX = useTransform(scrollYProgress, [0, 0.8], ["-10%", "10%"]);

    return (
        <div ref={sectionRef} className="relative h-[200vh] bg-black z-20" style={{ overflowX: "clip" }}>
            <div className="sticky top-0 h-screen flex flex-col justify-center overflow-hidden">

                {/* Background Layer (Huge Hollow Text) */}
                <motion.div
                    style={{ x: bgX }}
                    className="absolute inset-0 flex flex-col justify-center items-center z-0 opacity-20 select-none pointer-events-none"
                >
                    <h2 className="text-[30vw] font-black text-transparent text-outline leading-none whitespace-nowrap">
                        THE STORY CONTINUES
                    </h2>
                </motion.div>

                {/* Line 1: THE STORY */}
                <motion.div
                    style={{ x: x1, opacity }}
                    className="whitespace-nowrap flex items-center relative z-10 will-change-transform"
                >
                    <h2 className="text-[15vw] font-black tracking-tighter text-white leading-none ml-[10vw]" style={{ textShadow: "0 0 30px rgba(255,255,255,0.3)" }}>
                        <span className="mr-[4vw]">THE</span> STORY
                    </h2>
                    <h2 className="text-[15vw] font-black tracking-tighter text-transparent text-outline leading-none ml-8 opacity-50">
                        <span className="mr-[4vw]">THE</span> STORY
                    </h2>
                    <h2 className="text-[15vw] font-black tracking-tighter text-transparent text-outline leading-none ml-8 opacity-30">
                        <span className="mr-[4vw]">THE</span> STORY
                    </h2>
                </motion.div>

                {/* Line 2: CONTINUES */}
                <motion.div
                    style={{ x: x2, opacity }}
                    className="whitespace-nowrap flex items-center mt-[-2vw] relative z-10 will-change-transform"
                >
                    <h2 className="text-[15vw] font-black tracking-tighter text-white leading-none ml-[20vw]" style={{ textShadow: "0 0 30px rgba(139,0,0,0.6)" }}>
                        <span className="text-crimson">CONTINUES</span>
                    </h2>
                    <h2 className="text-[15vw] font-black tracking-tighter text-transparent text-outline leading-none ml-8 opacity-50">
                        CONTINUES
                    </h2>
                    <h2 className="text-[15vw] font-black tracking-tighter text-transparent text-outline leading-none ml-8 opacity-30">
                        CONTINUES
                    </h2>
                </motion.div>

                {/* Background Noise/Grain */}
                <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay z-20"></div>
            </div>
        </div>
    );
}
