"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCursor } from "@/components/CursorContext";

interface ProjectFloatingLinksProps {
    liveUrl: string;
    repoUrl: string;
    isTransitioned: boolean;
}

export default function ProjectFloatingLinks({ liveUrl, repoUrl, isTransitioned }: ProjectFloatingLinksProps) {
    const { setCursorType } = useCursor();

    const handleMouseEnter = () => setCursorType("project");
    const handleMouseLeave = () => setCursorType("default");

    return (
        <AnimatePresence>
            {isTransitioned && (
                <motion.div
                    initial={{ y: 50, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 50, opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="fixed bottom-6 md:bottom-10 left-0 right-0 z-[300] pointer-events-none flex justify-center items-center"
                >
                    <div className="flex items-center justify-center bg-[#0B0B11]/80 backdrop-blur-xl rounded-full border border-white/10 p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.6)] relative overflow-hidden group/container transition-all duration-700 hover:border-white/20 pointer-events-auto">
                        <a
                            href={liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            className="group relative flex items-center justify-center px-6 md:px-8 py-3 rounded-full overflow-hidden transition-all duration-500 hover:bg-white/5"
                        >
                            <span className="relative z-10 text-[10px] md:text-[11px] font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase font-syncopate text-white whitespace-nowrap">Live Project ↗</span>
                        </a>
                        
                        <div className="w-[1px] h-6 bg-white/10 mx-1 md:mx-2" />
                        
                        <a
                            href={repoUrl}
                            target="_blank"
                            rel="noreferrer"
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            className="group relative flex items-center justify-center px-6 md:px-8 py-3 rounded-full overflow-hidden transition-all duration-500 hover:bg-white/5"
                            aria-label="GitHub Repository"
                        >
                            <svg className="w-5 h-5 text-white/60 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                        </a>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
