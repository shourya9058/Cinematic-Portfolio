"use client";

import React, { useState, useEffect, createContext, useContext, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import AppleHello from "./AppleHello";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface LoadingContextType {
    setIsLoaded: (loaded: boolean) => void;
    isLoaded: boolean;
    registerAsset: (id: string) => void;
    setAssetLoaded: (id: string) => void;
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
    const [animationDone, setAnimationDone] = useState(false);
    const [assetsToLoad, setAssetsToLoad] = useState<Set<string>>(new Set());
    const [loadedAssets, setLoadedAssets] = useState<Set<string>>(new Set());

    const registerAsset = (id: string) => {
        setAssetsToLoad(prev => new Set(prev).add(id));
    };

    const setAssetLoaded = (id: string) => {
        setLoadedAssets(prev => new Set(prev).add(id));
    };

    const allAssetsLoaded = assetsToLoad.size > 0 
        ? assetsToLoad.size === loadedAssets.size 
        : true;

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

    // Unified check for dismissal
    useEffect(() => {
        if (showLoader && animationDone && allAssetsLoaded) {
            // Tiny delay for smoothness
            const timer = setTimeout(() => {
                setShowLoader(false);
                setIsLoaded(true);
                sessionStorage.setItem("hasVisited", "true");
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [showLoader, animationDone, allAssetsLoaded]);

    const handleAnimationComplete = () => {
        setAnimationDone(true);
    };

    // GSAP ScrollTrigger refresh after loader is gone
    useEffect(() => {
        if (isLoaded) {
            const timer = setTimeout(() => {
                // Aggressive refresh to catch all scroll-based features
                ScrollTrigger.refresh();
                window.dispatchEvent(new Event('resize'));
                gsap.ticker.tick();
            }, 1500); // 1.2s fade + 0.3s buffer
            return () => clearTimeout(timer);
        }
    }, [isLoaded]);

    // Safety fallback
    useEffect(() => {
        if (!showLoader) return;
        const safety = setTimeout(() => {
            setShowLoader(false);
            setIsLoaded(true);
        }, 15000);
        return () => clearTimeout(safety);
    }, [showLoader]);

    return (
        <LoadingContext.Provider value={{ isLoaded, setIsLoaded, registerAsset, setAssetLoaded }}>
            <AnimatePresence mode="wait">
                {showLoader && (
                    <motion.div
                        key="loader-overlay"
                        initial={{ opacity: 1 }}
                        exit={{
                            opacity: 0,
                            scale: 1,
                            filter: "blur(10px)",
                            transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1] }
                        }}
                        className="fixed inset-0 z-[99999] flex items-center justify-center bg-[#050505]"
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

            {/* Use visibility: hidden instead of display: none to ensure measurements are still possible if needed, 
                and hide until we know if we're loading or not */}
            <div 
                className="relative w-full h-full"
                style={{ 
                    visibility: (!isInitialized || (showLoader && !isLoaded)) ? 'hidden' : 'visible',
                    opacity: (!isInitialized || (showLoader && !isLoaded)) ? 0 : 1,
                    transition: 'opacity 0.5s ease-in'
                }}
            >
                {children}
            </div>
        </LoadingContext.Provider>
    );
};
