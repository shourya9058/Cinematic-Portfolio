"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, FileText } from "lucide-react";

interface ResumeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
    const [resumeUrl, setResumeUrl] = React.useState("/resume/current_resume.pdf");

    useEffect(() => {
        if (isOpen) {
            // Robust scroll lock
            const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
            document.body.style.overflow = "hidden";
            document.body.style.paddingRight = `${scrollBarWidth}px`;
            
            // Update URL with cache buster every time it opens
            setResumeUrl(`/resume/current_resume.pdf?v=${Date.now()}#toolbar=0`);
        } else {
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
        }
        return () => {
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0B0B0F]/90 backdrop-blur-md px-4 py-6 md:p-12 overflow-hidden"
                    onClick={(e) => {
                        // Close if clicking outside the inner box
                        if (e.target === e.currentTarget) onClose();
                    }}
                >
                    {/* Background Ambient Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vh] bg-crimson/5 blur-[120px] rounded-full pointer-events-none" />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                        className="relative w-full max-w-5xl h-full flex flex-col bg-black border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-[10000]"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
                            <div className="flex items-center gap-4">
                                <div className="w-9 h-9 rounded-full bg-crimson/20 flex items-center justify-center border border-crimson/30">
                                    <FileText className="w-4 h-4 text-crimson" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black tracking-[0.3em] uppercase text-white/40">Professional</span>
                                    <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-white">Curriculum Vitae</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <a
                                    href="/resume/current_resume.pdf"
                                    download="Shourya_Singh_Resume.pdf"
                                    className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-crimson transition-all duration-300 border border-white/10 hover:border-crimson"
                                >
                                    <Download className="w-3.5 h-3.5 text-white/70 group-hover:text-white" />
                                    <span className="text-[9px] font-bold tracking-widest uppercase text-white/70 group-hover:text-white">Download</span>
                                </a>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        onClose();
                                    }}
                                    className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10 group active:scale-95"
                                    aria-label="Close Modal"
                                >
                                    <X className="w-5 h-5 text-white/70 group-hover:text-white" />
                                </button>
                            </div>
                        </div>

                        {/* Viewer Wrapper */}
                        <div className="flex-1 relative bg-[#1A1A1A] overflow-auto touch-auto">
                            <iframe
                                src={resumeUrl}
                                className="w-full h-full border-none min-h-[60vh]"
                                title="Resume Viewer"
                                style={{ display: 'block' }}
                            />
                            
                            {/* Cinematic Overlay - removed pointer-events-none just to be safe if it was somehow intercepting, 
                                but keep it for visual. Actually, let's just make it a shadow on the wrapper */}
                        </div>

                        {/* Mobile Footer */}
                        <div className="md:hidden p-3 border-t border-white/5 bg-white/[0.01] flex justify-center">
                            <button
                                onClick={onClose}
                                className="w-full py-3 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-white transition-colors"
                            >
                                Close Document
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
