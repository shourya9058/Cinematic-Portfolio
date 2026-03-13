"use client";

import React, { useState, useEffect, createContext, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AppleHello from "./AppleHello";

interface LoadingContextType {
    setIsLoaded: (loaded: boolean) => void;
    isLoaded: boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useLoading = () => {
    const context = useContext(LoadingContext);
    if (!context) {
        throw new Error("useLoading must be used within a LoadingProvider");
    }
    return context;
};

// Cinematic Background Elements
const BackgroundElements = () => {
    const technicalStrings = ["0x4F2A", "PROFILE_INIT", "SEC_ACTIVE", "SYS_v2.0", "SYNC_01", "77.29.11", "INDEX_88"];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            {/* Technical Labels */}
            {technicalStrings.map((text, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: [0.1, 0.3, 0.1],
                        x: [0, 10, 0],
                    }}
                    transition={{
                        duration: 8 + i,
                        repeat: Infinity,
                        delay: i * 2,
                        ease: "linear"
                    }}
                    className="absolute text-[8px] font-mono tracking-widest text-[#EAEAEA]"
                    style={{
                        top: `${(i + 1) * 12}%`,
                        left: i % 2 === 0 ? "2%" : "92%",
                    }}
                >
                    {text}
                </motion.div>
            ))}

            {/* Faint Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]" />

            {/* Scanning Line */}
            <div className="scanning-line scanning-line-active" />

            {/* Grain */}
            <div className="absolute inset-0 grain-overlay" />

            {/* Atmospheric Lighting */}
            <div className="absolute inset-0 bg-radial-vignette" />
        </div>
    );
};

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        // Force scroll to top on initial landing/refresh
        window.scrollTo(0, 0);
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }

        // Show loader only on first visit per session
        const hasVisited = sessionStorage.getItem("hasVisited");
        if (!hasVisited) {
            setShowLoader(true);
        } else {
            setIsLoaded(true);
        }
        setIsInitialized(true);
    }, []);

    // Called by AppleHello when the SVG finishes drawing — dismiss after a short grace period
    const handleAnimationComplete = () => {
        setTimeout(() => {
            setShowLoader(false);
            setIsLoaded(true);
            sessionStorage.setItem("hasVisited", "true");
        }, 200); // just enough for the final stroke to be seen before exit
    };

    // Hard safety cap: never show loader longer than 8s
    useEffect(() => {
        if (!showLoader) return;
        const safety = setTimeout(() => {
            setShowLoader(false);
            setIsLoaded(true);
        }, 8000);
        return () => clearTimeout(safety);
    }, [showLoader]);

    return (
        <LoadingContext.Provider value={{ isLoaded, setIsLoaded }}>
            <AnimatePresence mode="wait">
                {showLoader && (
                    <motion.div
                        key="loader-overlay"
                        initial={{ opacity: 1 }}
                        exit={{
                            opacity: 0,
                            scale: 0.95,
                            filter: "blur(20px)",
                            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
                        }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#050505]"
                    >
                        <BackgroundElements />

                        <div className="relative z-10 w-full max-w-[600px] px-10">
                            <AppleHello
                                className="w-full h-full"
                                onAnimationComplete={handleAnimationComplete}
                            />

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.15 }}
                                transition={{ delay: 2, duration: 2 }}
                                className="mt-12 text-center"
                            >
                                <p className="text-white text-[8px] md:text-[10px] tracking-[0.5em] uppercase font-extralight opacity-50">
                                    System Profiling :: Initializing
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={false}
                animate={{
                    opacity: (!isInitialized || showLoader) ? 0 : 1,
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative w-full h-full"
            >
                {isInitialized && children}
            </motion.div>
        </LoadingContext.Provider>
    );
};
