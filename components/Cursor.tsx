"use client";

import React, { useEffect, useRef } from "react";
import { useCursor } from "./CursorContext";
import { motion, useSpring, useMotionValue, AnimatePresence } from "framer-motion";

export default function Cursor() {
    const { cursorType } = useCursor();
    const mouseX = useMotionValue(-100);
    const mouseY = useMotionValue(-100);

    // Spring physics for smooth LERP-like motion
    const springConfig = { stiffness: 500, damping: 28, mass: 0.5 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
            <motion.div
                style={{
                    x,
                    y,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                className="flex items-center justify-center pointer-events-none"
            >
                <AnimatePresence mode="wait">
                    {cursorType === "project" && (
                        <motion.div
                            key="project-cursor"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#0B0B0F]"
                        >
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="7" y1="17" x2="17" y2="7"></line>
                                <polyline points="7 7 17 7 17 17"></polyline>
                            </svg>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
