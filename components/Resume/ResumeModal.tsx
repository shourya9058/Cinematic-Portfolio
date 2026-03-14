"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, FileText } from "lucide-react";

interface ResumeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
    const [timestamp, setTimestamp] = React.useState(Date.now());

    useEffect(() => {
        if (isOpen) {
            setTimestamp(Date.now()); // Update timestamp only when opening
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0B0B0F]/95 backdrop-blur-2xl px-4 py-8 md:p-12 pointer-events-auto"
                    onClick={(e) => {
                        // Close if clicking the backdrop
                        if (e.target === e.currentTarget) onClose();
                    }}
                >
                    {/* Background Ambient Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-[#8B0000]/10 blur-[120px] rounded-full pointer-events-none" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                        className="relative w-full max-w-5xl h-full flex flex-col bg-black/60 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/[0.02]">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-crimson/20 flex items-center justify-center border border-crimson/30">
                                    <FileText className="w-5 h-5 text-crimson" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white/40">Professional</span>
                                    <span className="text-xs font-bold tracking-[0.1em] uppercase text-white">Curriculum Vitae</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <a
                                    href="/resume/current_resume.pdf"
                                    download="Shourya_Singh_Resume.pdf"
                                    className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 hover:bg-crimson transition-all duration-500 border border-white/5 hover:border-crimson"
                                >
                                    <Download className="w-4 h-4 text-white/70 group-hover:text-white" />
                                    <span className="text-[10px] font-bold tracking-widest uppercase text-white/70 group-hover:text-white">Download</span>
                                </a>
                                <button
                                    onClick={onClose}
                                    className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
                                >
                                    <X className="w-5 h-5 text-white/70" />
                                </button>
                            </div>
                        </div>

                        {/* Viewer Wrapper */}
                        <div className="flex-1 relative bg-[#121212] overflow-auto touch-auto">
                            <iframe
                                src={`/resume/current_resume.pdf?t=${timestamp}#toolbar=0`}
                                className="w-full h-full border-none min-h-[500px]"
                                style={{ display: 'block' }}
                                title="Resume Viewer"
                            />
                            
                            {/* Cinematic Overlay - subtle gradient to match brand - pointer-events-none to allow iframe interaction */}
                            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.4)]" />
                        </div>

                        {/* Mobile Footer (visible on small screens) */}
                        <div className="md:hidden p-4 border-t border-white/5 bg-white/[0.02] flex justify-center">
                            <button
                                onClick={onClose}
                                className="w-full py-4 text-[11px] font-black uppercase tracking-[0.4em] text-white/40 active:text-white"
                            >
                                Tap to close
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
