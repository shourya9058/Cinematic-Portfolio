"use client";

import { useRef } from "react";
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
} from "framer-motion";
import Image from "next/image";

interface ScrollRevealImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    className?: string;
    delay?: number;
    priority?: boolean;
}

export default function ScrollRevealImage({
    src,
    alt,
    width,
    height,
    fill,
    className = "",
    delay = 0,
    priority = false,
}: ScrollRevealImageProps) {
    // ref goes on the outermost real DOM container (not a motion.div)
    // so it has layout dimensions for useScroll to track
    const ref = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 95%", "center 45%"],
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 80,
        damping: 20,
        mass: 1.2,
        restDelta: 0.001,
    });

    // ─── Outer wrapper: clip-path mask (bottom-to-top wipe) ───────────────────
    const clipPath = useTransform(
        smoothProgress,
        [0, 1],
        ["inset(100% 0 0 0 round 0px)", "inset(0% 0 0 0 round 0px)"]
    );

    // ─── Inner wrapper: scale, translateY, opacity, blur ─────────────────────
    const scale = useTransform(smoothProgress, [0, 1], [1.1, 1.0]);
    const y = useTransform(smoothProgress, [0, 1], ["60px", "0px"]);
    const opacity = useTransform(smoothProgress, [0, 0.25, 1], [0, 0.5, 1]);
    const blur = useTransform(smoothProgress, [0, 1], ["blur(12px)", "blur(0px)"]);

    return (
        // Plain div — no motion, no opacity:0, so it always has layout dimensions
        // This is crucial: fill images need a positioned ancestor with real height
        <div
            ref={ref}
            className={`relative overflow-hidden ${fill ? "w-full h-full" : "w-full"}`}
        >
            {/* Clip-path mask layer */}
            <motion.div
                className={`relative ${fill ? "w-full h-full" : "w-full"}`}
                style={{
                    clipPath,
                    willChange: "clip-path",
                }}
            >
                {/* Transform layer: scale + parallax + opacity + blur */}
                <motion.div
                    className={`relative ${fill ? "w-full h-full" : "w-full"}`}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "-5%" }}
                    transition={{ delay, duration: 0 }}
                    style={{
                        scale,
                        y,
                        opacity,
                        filter: blur,
                        willChange: "transform, opacity, filter",
                    }}
                >
                    {fill ? (
                        <Image
                            src={src}
                            alt={alt}
                            fill
                            priority={priority}
                            className={`object-cover ${className}`}
                            sizes="100vw"
                        />
                    ) : (
                        <Image
                            src={src}
                            alt={alt}
                            width={width ?? 1200}
                            height={height ?? 800}
                            priority={priority}
                            className={`w-full h-auto ${className}`}
                            sizes="100vw"
                        />
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
}
