"use client";

import React, { useContext } from "react";
import { motion, useTransform, MotionValue } from "framer-motion";
import { ScrollContext } from "./ScrollyCanvas";

export default function Overlay() {
    const scrollYProgress = useContext(ScrollContext);

    if (!scrollYProgress) {
        // Safety chack - should not happen if inside ScrollyCanvas
        return null;
    }

    // Animation Maps

    // Phase 1: Look Right -> Text on Right (0.05 -> 0.35)
    const phase1Opacity = useTransform(scrollYProgress, [0.05, 0.15, 0.3, 0.4], [0, 1, 1, 0]);
    const phase1X = useTransform(scrollYProgress, [0.05, 0.15], [50, 0]);

    // Phase 2: Look Left -> Text on Left (0.60 -> 1.00)
    const phase2Opacity = useTransform(scrollYProgress, [0.60, 0.70, 0.90, 1.00], [0, 1, 1, 0]);
    const phase2X = useTransform(scrollYProgress, [0.60, 0.70], [-50, 0]);

    // Scroll Indicator: Visible only at start (0 -> 0.05)
    const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

    return (
        <div className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Scroll Indicator */}
            <motion.div
                style={{ opacity: scrollIndicatorOpacity }}
                className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-30 pointer-events-none"
            >
                <span className="text-sm font-light text-white tracking-[0.4em] uppercase opacity-80 animate-pulse">
                    Scroll to unlock
                </span>
                {/* Animated Line */}
                <div className="w-[1px] h-16 bg-gradient-to-b from-crimson via-crimson to-transparent opacity-80" />
            </motion.div>

            {/* Phase 1: Right Aligned */}
            <motion.div
                style={{ opacity: phase1Opacity, x: phase1X }}
                className="absolute top-[30%] right-[10%] max-w-2xl text-right z-20"
            >
                <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-2 text-white leading-none">
                    SHOURYA SINGH<span className="text-crimson">.</span>
                </h1>
                <p className="text-xl md:text-3xl font-light tracking-[0.2em] text-text-muted uppercase">
                    Full Stack Developer
                </p>
            </motion.div>

            {/* Phase 2: Left Aligned */}
            <motion.div
                style={{ opacity: phase2Opacity, x: phase2X }}
                className="absolute bottom-[30%] left-[10%] max-w-2xl text-left z-20"
            >
                <h2 className="text-4xl md:text-6xl font-bold leading-tight text-white uppercase tracking-tighter">
                    Turning Ideas <span className="text-crimson">Into</span><br />
                    Scalable Applications
                </h2>
            </motion.div>
        </div>
    );
}
