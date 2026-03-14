"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";

export default function ResumePage() {
    const [resumeUrl, setResumeUrl] = React.useState("/resume/current_resume.pdf");

    React.useEffect(() => {
        setResumeUrl(`/resume/current_resume.pdf?v=${Date.now()}`);
    }, []);

    return (
        <main className="min-h-screen bg-[#0B0B0F] text-white selection:bg-crimson selection:text-white flex flex-col">
            {/* Minimal Header */}
            <nav className="w-full px-6 py-6 md:px-12 md:py-8 flex justify-between items-center z-10">
                <Link 
                    href="/#home" 
                    className="flex items-center gap-3 group px-4 py-2 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 transition-all duration-500"
                >
                    <ArrowLeft className="w-4 h-4 text-white/50 group-hover:text-white group-hover:-translate-x-1 transition-all" />
                    <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white/50 group-hover:text-white transition-colors">Return</span>
                </Link>

                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black tracking-[0.5em] uppercase text-crimson mb-1">Résumé</span>
                    <span className="text-[8px] font-bold tracking-[0.2em] uppercase text-white/30">Shourya Singh</span>
                </div>

                <a
                    href="/resume/current_resume.pdf"
                    download="Shourya_Singh_Resume.pdf"
                    className="flex items-center gap-3 group px-4 py-2 rounded-full bg-crimson/10 border border-crimson/20 hover:bg-crimson transition-all duration-500"
                >
                    <span className="text-[10px] font-black tracking-[0.3em] uppercase text-crimson group-hover:text-white transition-colors">Download</span>
                    <Download className="w-4 h-4 text-crimson group-hover:text-white transition-all scale-90" />
                </a>
            </nav>

            {/* Viewer */}
            <div className="flex-1 w-full max-w-5xl mx-auto px-4 pb-12">
                <div className="w-full h-full bg-black/40 border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
                    <iframe
                        src={resumeUrl}
                        className="w-full h-full min-h-[80vh] border-none"
                        title="Resume Full Viewer"
                    />
                    
                    {/* Dark gradient to blend with the page */}
                    <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_60px_rgba(0,0,0,0.3)]" />
                </div>
                
                {/* Secondary Info */}
                <div className="mt-8 text-center flex flex-col items-center gap-4 opacity-30">
                    <p className="text-[9px] font-mono tracking-widest uppercase italic">The document is embedded from /public/resume</p>
                    <div className="w-12 h-px bg-white/20" />
                </div>
            </div>
        </main>
    );
}
