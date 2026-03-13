"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import Logo from "./Logo";

const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
];

export default function Navbar() {
    const [activeSection, setActiveSection] = useState("home");
    const [hidden, setHidden] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        if (latest > previous && latest > 150) {
            setHidden(true);
            setIsMobileMenuOpen(false);
        } else {
            setHidden(false);
        }
    });

    useEffect(() => {
        // Force scroll to top on refresh and disable browser scroll memory
        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => { document.body.style.overflow = "unset"; };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        const sections = navLinks.map(link => link.href.substring(1));
        const observerOptions = {
            root: null,
            rootMargin: "-40% 0px -40% 0px",
            threshold: 0
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        sections.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <motion.nav
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="fixed top-0 left-0 right-0 z-[100] py-4 pointer-events-none md:overflow-visible overflow-hidden"
        >
            <div className="max-w-7xl mx-auto px-12 md:px-12 flex justify-between items-center pointer-events-auto">
                {/* Logo */}
                <motion.a
                    href="#home"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center group" // REMOVED cursor-none
                    onClick={(e) => {
                        e.preventDefault();
                        setIsMobileMenuOpen(false);
                        document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
                    }}
                >
                    <div className="relative w-24 h-12 md:w-32 md:h-16 flex items-center justify-center overflow-visible">
                        <div className="absolute inset-0 bg-crimson/30 blur-2xl rounded-full scale-[1.8] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <Logo className="w-full h-full text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] group-hover:drop-shadow-[0_0_20px_#8B0000] transition-all duration-500 scale-[1.4]" />
                    </div>
                </motion.a>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="relative text-xs font-black tracking-[0.3em] uppercase transition-colors duration-300 py-2 group"
                            onClick={(e) => {
                                e.preventDefault();
                                const element = document.getElementById(link.href.substring(1));
                                element?.scrollIntoView({ behavior: "smooth" });
                            }}
                        >
                            <span className={`transition-colors duration-300 ${activeSection === link.href.substring(1) ? "text-crimson" : "text-gray-500 group-hover:text-white"}`}>
                                {link.name}
                            </span>
                            {activeSection === link.href.substring(1) && (
                                <motion.div
                                    layoutId="nav-horizontal-underline"
                                    className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-crimson shadow-[0_0_8px_rgba(139,0,0,0.6)]"
                                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                />
                            )}
                        </a>
                    ))}
                </div>

                {/* Mobile Toggle */}
                <div className="md:hidden relative z-[110]">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 focus:outline-none bg-[#0B0B0F]/50 backdrop-blur-md rounded-full pointer-events-auto shadow-[0_0_15px_rgba(139,0,0,0.2)]"
                        aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                    >
                        <motion.span
                            animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                            className="w-8 h-[2px] bg-white rounded-full block transition-transform"
                        />
                        <motion.span
                            animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                            className="w-8 h-[2px] bg-white rounded-full block"
                        />
                        <motion.span
                            animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                            className="w-8 h-[2px] bg-white rounded-full block transition-transform"
                        />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        key="mobile-menu-overlay"
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-0 z-[95] bg-[#0B0B0F] md:hidden pointer-events-auto"
                    >
                        <div className="h-full flex flex-col items-center justify-center gap-8 p-12 relative">
                            {/* Close Label */}
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="absolute top-10 right-24 text-[10px] font-mono tracking-[0.5em] text-crimson uppercase"
                            >
                                Close
                            </motion.span>

                            {navLinks.map((link, i) => (
                                <motion.a
                                    key={link.name}
                                    href={link.href}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className={`text-2xl font-black uppercase tracking-[0.2em] ${activeSection === link.href.substring(1) ? "text-crimson" : "text-white/50"}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsMobileMenuOpen(false);
                                        const element = document.getElementById(link.href.substring(1));
                                        element?.scrollIntoView({ behavior: "smooth" });
                                    }}
                                >
                                    {link.name}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
