"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Upload, CheckCircle, AlertCircle, Loader2, ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
    const [uploadMessage, setUploadMessage] = useState("");

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Since we are doing this client-side for simplicity in this specific request,
        // we normally would call an API, but I will simulate the env check
        // or actually provide a secure-ish way if the user has ENV set.
        // For the sake of this implementation, I'll recommend the user to set these.
        
        const adminUser = process.env.NEXT_PUBLIC_ADMIN_USERNAME || "admin";
        const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "shourya2026";

        if (username === adminUser && password === adminPass) {
            setIsLoggedIn(true);
            setLoginError("");
        } else {
            setLoginError("Unauthorized access. Invalid credentials.");
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== "application/pdf") {
                setUploadStatus("error");
                setUploadMessage("Only PDF files are allowed.");
                return;
            }
            if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
                setUploadStatus("error");
                setUploadMessage("File size must be less than 5MB.");
                return;
            }
            setFile(selectedFile);
            setUploadStatus("idle");
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploadStatus("uploading");
        setUploadMessage("Uploading resume...");

        const formData = new FormData();
        formData.append("resume", file);

        try {
            const response = await fetch("/api/resume/upload", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                setUploadStatus("success");
                setUploadMessage("Resume updated successfully.");
                setFile(null);
            } else {
                const data = await response.json();
                setUploadStatus("error");
                setUploadMessage(data.error || "Failed to upload resume.");
            }
        } catch (error) {
            setUploadStatus("error");
            setUploadMessage("An unexpected error occurred.");
        }
    };

    if (!isLoggedIn) {
        return (
            <main className="min-h-screen bg-[#0B0B0F] flex items-center justify-center p-6 selection:bg-crimson">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-crimson/10 rounded-2xl flex items-center justify-center border border-crimson/20 mx-auto mb-6 shadow-2xl shadow-crimson/20">
                            <Lock className="w-8 h-8 text-crimson" />
                        </div>
                        <h1 className="text-2xl font-black uppercase tracking-[0.3em] text-white">Central Access</h1>
                        <p className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase mt-2">Portfolio Control Panel</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6 bg-white/[0.02] border border-white/5 p-8 rounded-2xl backdrop-blur-xl">
                        <div className="space-y-4">
                            <div className="relative group">
                                <label className="text-[9px] font-black tracking-[0.3em] text-white/20 uppercase mb-2 block group-focus-within:text-crimson transition-colors">Credential ID</label>
                                <input 
                                    type="text" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Username"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-sm outline-none focus:border-crimson/50 transition-all"
                                />
                            </div>
                            <div className="relative group">
                                <label className="text-[9px] font-black tracking-[0.3em] text-white/20 uppercase mb-2 block group-focus-within:text-crimson transition-colors">Access Key</label>
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-sm outline-none focus:border-crimson/50 transition-all"
                                />
                            </div>
                        </div>

                        <AnimatePresence>
                            {loginError && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="flex items-center gap-3 text-crimson/80 bg-crimson/10 p-4 rounded-xl border border-crimson/20"
                                >
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest">{loginError}</span>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <button 
                            type="submit"
                            className="w-full py-5 bg-crimson text-white font-black uppercase tracking-[0.4em] text-[11px] rounded-xl shadow-2xl shadow-crimson/30 hover:bg-[#A00000] active:scale-[0.98] transition-all"
                        >
                            Authorize Entry
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <Link href="/" className="text-[9px] font-bold tracking-[0.3em] text-white/20 hover:text-white transition-colors uppercase">
                            Return to Index
                        </Link>
                    </div>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#0B0B0F] p-6 md:p-12 selection:bg-crimson">
            <div className="max-w-4xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16 pb-12 border-b border-white/5">
                    <div className="flex items-center gap-6">
                        <Link href="/" className="p-3 rounded-full bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                            <ArrowLeft className="w-5 h-5 text-white/40 group-hover:text-white transition-colors" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-[0.4em] text-white">Dashboard</h1>
                            <p className="text-[10px] font-bold tracking-[0.2em] text-crimson uppercase mt-1">Management Console</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => setIsLoggedIn(false)}
                        className="self-start px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black tracking-[0.3em] uppercase text-white/40 hover:text-white hover:bg-white/10 transition-all"
                    >
                        Secure Logout
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Upload Section */}
                    <div className="space-y-8">
                        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-3xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                <Upload className="w-24 h-24 text-white" />
                            </div>
                            
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white mb-2">Resume Upload</h2>
                            <p className="text-[10px] font-medium text-white/30 tracking-widest uppercase mb-10">Replace the existing curriculum vitae</p>

                            <div className="space-y-6">
                                <div className="relative">
                                    <input 
                                        type="file" 
                                        id="resume-upload"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                    <label 
                                        htmlFor="resume-upload"
                                        className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/10 rounded-2xl hover:border-crimson/50 hover:bg-crimson/5 transition-all cursor-pointer group/label"
                                    >
                                        {file ? (
                                            <div className="flex items-center gap-4 text-white">
                                                <div className="p-3 rounded-xl bg-crimson shadow-xl">
                                                    <FileText className="w-6 h-6" />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-xs font-bold truncate max-w-[200px]">{file.name}</p>
                                                    <p className="text-[10px] text-white/40">{(file.size / 1024).toFixed(1)} KB</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="p-4 rounded-full bg-white/5 mb-4 group-hover/label:scale-110 transition-transform">
                                                    <Upload className="w-6 h-6 text-white/30 group-hover/label:text-crimson" />
                                                </div>
                                                <p className="text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">Drag or Click to Select PDF</p>
                                            </>
                                        )}
                                    </label>
                                </div>

                                <AnimatePresence>
                                    {uploadStatus !== "idle" && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className={`flex items-center gap-4 p-5 rounded-2xl border ${
                                                uploadStatus === "uploading" ? "bg-white/5 border-white/10" :
                                                uploadStatus === "success" ? "bg-green-500/10 border-green-500/20 text-green-500" :
                                                "bg-crimson/10 border-crimson/20 text-crimson"
                                            }`}
                                        >
                                            {uploadStatus === "uploading" ? <Loader2 className="w-5 h-5 animate-spin" /> :
                                             uploadStatus === "success" ? <CheckCircle className="w-5 h-5" /> :
                                             <AlertCircle className="w-5 h-5" />}
                                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{uploadMessage}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <button 
                                    onClick={handleUpload}
                                    disabled={!file || uploadStatus === "uploading"}
                                    className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.4em] text-[11px] transition-all ${
                                        !file || uploadStatus === "uploading" 
                                        ? "bg-white/5 text-white/20 cursor-not-allowed" 
                                        : "bg-crimson text-white shadow-xl shadow-crimson/20 hover:scale-[1.02] active:scale-[0.98]"
                                    }`}
                                >
                                    {uploadStatus === "uploading" ? "Synchronizing..." : "Update Resume"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick View / Instructions */}
                    <div className="space-y-8">
                        <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl backdrop-blur-3xl">
                            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white mb-6">Live Link</h2>
                            <div className="flex items-center gap-4 p-4 bg-black/40 rounded-xl border border-white/5">
                                <div className="flex-1 text-[10px] font-mono text-crimson truncate">/resume/current_resume.pdf</div>
                                <a 
                                    href="/resume/current_resume.pdf" 
                                    target="_blank"
                                    className="px-4 py-2 bg-white/5 rounded-lg text-[8px] font-black tracking-widest uppercase hover:bg-white/10 transition-colors"
                                >
                                    Preview
                                </a>
                            </div>
                            
                            <div className="mt-12 space-y-6">
                                <h3 className="text-[9px] font-black uppercase tracking-[0.5em] text-white/30">System Requirements</h3>
                                <ul className="space-y-4">
                                    {[
                                        "File must be strictly PDF format",
                                        "Maximum size threshold: 5MB",
                                        "Filename will be automatically sanitized",
                                        "Changes reflect instantly on production"
                                    ].map((text, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <div className="w-1 h-1 rounded-full bg-crimson mt-1.5" />
                                            <span className="text-[9px] font-bold tracking-[0.1em] text-white/50 uppercase">{text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
