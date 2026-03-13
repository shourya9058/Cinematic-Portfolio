"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface DeckCard {
    src: string;
    alt?: string;
    positionX?: number;  // object-position X% (default 50)
    positionY?: number;  // object-position Y% (default 50)
}

interface DepthDeckCarouselProps {
    cards: DeckCard[];
    aspectRatio?: "9:16" | "2:3" | "3:4" | "1:1" | "4:3" | "3:2" | "16:9";
    autoPlay?: boolean;
    autoPlayInterval?: number; // ms
    showNavigation?: boolean;
    showPagination?: boolean;
    primaryColor?: string;
    borderRadius?: number;
    shadowStrength?: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const SPRING_CONFIG = { stiffness: 260, damping: 20, mass: 0.8 } as const;

const ASPECT_RATIOS: Record<string, number> = {
    "9:16": 0.5625,
    "2:3": 0.6667,
    "3:4": 0.75,
    "1:1": 1,
    "4:3": 1.3333,
    "3:2": 1.5,
    "16:9": 1.7778,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getResponsiveConfig(containerWidth: number) {
    const isMobile = containerWidth < 480;
    const isTablet = containerWidth >= 480 && containerWidth < 900;

    return {
        cardWidth: isMobile ? Math.min(containerWidth * 0.7, 200) : isTablet ? Math.min(containerWidth * 0.35, 280) : Math.min(containerWidth * 0.2, 320),
        cardSpacing: isMobile ? 40 : isTablet ? 80 : 130,
        verticalOffset: isMobile ? 10 : isTablet ? 18 : 25,
        scaleStep: isMobile ? 0.15 : isTablet ? 0.12 : 0.1,
        rotationOffset: isMobile ? -8 : isTablet ? -12 : -15,
        perspective: isMobile ? 800 : isTablet ? 1200 : 1500,
        brightnessStep: isMobile ? 0.15 : 0.1,
        minHeight: isMobile ? 400 : isTablet ? 500 : 650,
        isMobile,
        isTablet,
    };
}

function getPositionData(
    index: number,
    activeIndex: number,
    total: number,
    config: ReturnType<typeof getResponsiveConfig>
) {
    let rel = (index - activeIndex + total) % total - Math.floor(total / 2);
    if (rel > total / 2) rel -= total;
    if (rel < -total / 2) rel += total;
    const abs = Math.abs(rel);
    const baseZ = config.isMobile || config.isTablet ? 500 : 200;

    return {
        x: rel * config.cardSpacing,
        y: abs * config.verticalOffset,
        scale: 1 - abs * config.scaleStep,
        rotateY: rel * config.rotationOffset,
        brightness: 1 - abs * config.brightnessStep,
        zIndex: baseZ - abs * 10,
        isCenter: rel === 0,
        relativePosition: rel,
    };
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function DepthDeckCarousel({
    cards,
    aspectRatio = "2:3",
    autoPlay = true,
    autoPlayInterval = 4000,
    showNavigation = true,
    showPagination = true,
    primaryColor = "#ffffff",
    borderRadius = 16,
    shadowStrength = 0.8,
}: DepthDeckCarouselProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [width, setWidth] = useState(1200);

    // Container resize observer
    useEffect(() => {
        if (!containerRef.current) return;
        const ro = new ResizeObserver(entries => {
            const e = entries[0];
            if (e) setWidth(e.contentRect.width);
        });
        ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, []);

    const config = useMemo(() => getResponsiveConfig(width), [width]);
    const cardHeight = config.cardWidth / ASPECT_RATIOS[aspectRatio];
    const positions = useMemo(
        () => cards.map((_, i) => getPositionData(i, activeIndex, cards.length, config)),
        [activeIndex, cards.length, config]
    );

    const shadows = useMemo(() => {
        const s = Math.max(0, shadowStrength);
        return {
            center: `0 18px 50px rgba(0,0,0,${0.18 * s}), 0 6px 18px rgba(0,0,0,${0.12 * s})`,
            side: `0 10px 28px rgba(0,0,0,${0.12 * s}), 0 3px 10px rgba(0,0,0,${0.08 * s})`,
        };
    }, [shadowStrength]);

    const stopAutoPlay = useCallback(() => {
        setIsPlaying(false);
        if (autoPlayRef.current) { clearInterval(autoPlayRef.current); autoPlayRef.current = null; }
    }, []);

    const goToNext = useCallback(() => { stopAutoPlay(); setActiveIndex(p => (p + 1) % cards.length); }, [cards.length, stopAutoPlay]);
    const goToPrev = useCallback(() => { stopAutoPlay(); setActiveIndex(p => (p - 1 + cards.length) % cards.length); }, [cards.length, stopAutoPlay]);
    const goTo = useCallback((i: number) => { stopAutoPlay(); setActiveIndex(i); }, [stopAutoPlay]);

    // Auto play
    useEffect(() => {
        if (!isPlaying || cards.length === 0) return;
        autoPlayRef.current = setInterval(() => setActiveIndex(p => (p + 1) % cards.length), autoPlayInterval);
        return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
    }, [isPlaying, cards.length, autoPlayInterval]);

    // Keyboard navigation
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") { e.preventDefault(); goToPrev(); }
            if (e.key === "ArrowRight") { e.preventDefault(); goToNext(); }
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [goToNext, goToPrev]);

    const handleCardClick = useCallback((index: number, relPos: number) => {
        if (relPos === 0) return;
        stopAutoPlay();
        setActiveIndex((activeIndex + relPos + cards.length) % cards.length);
    }, [activeIndex, cards.length, stopAutoPlay]);

    if (cards.length === 0) return null;

    return (
        <div
            ref={containerRef}
            className="relative w-full select-none"
            style={{ minHeight: config.minHeight }}
        >
            {/* Subtle center line accent */}
            <div className="absolute top-1/2 left-0 right-0 h-px pointer-events-none"
                style={{ background: `linear-gradient(to right, transparent, ${primaryColor}22, transparent)` }} />

            {/* Card stage */}
            <div
                className="relative w-full flex items-center justify-center"
                style={{
                    minHeight: config.minHeight,
                    perspective: `${config.perspective}px`,
                    transformStyle: "preserve-3d",
                    overflow: "visible",
                }}
            >
                {cards.map((card, index) => {
                    const pos = positions[index];
                    const isHover = hoveredIndex === index;
                    const objPos = `${card.positionX ?? 50}% ${card.positionY ?? 50}%`;

                    return (
                        <motion.div
                            key={index}
                            role="button"
                            tabIndex={0}
                            aria-label={`Slide ${index + 1} of ${cards.length}${pos.isCenter ? " — active" : ""}`}
                            onClick={() => handleCardClick(index, pos.relativePosition)}
                            onHoverStart={() => { if (!config.isMobile) setHoveredIndex(index); }}
                            onHoverEnd={() => setHoveredIndex(null)}
                            onKeyDown={e => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    handleCardClick(index, pos.relativePosition);
                                }
                            }}
                            initial={false}
                            animate={{
                                x: pos.x,
                                y: isHover ? pos.y - 24 : pos.y,
                                scale: isHover ? pos.scale * 1.05 : pos.scale,
                                rotateY: pos.rotateY,
                                filter: `brightness(${pos.brightness})`,
                                zIndex: pos.zIndex,
                            }}
                            transition={{ type: "spring", ...SPRING_CONFIG }}
                            style={{
                                position: "absolute",
                                width: config.cardWidth,
                                height: cardHeight,
                                borderRadius,
                                overflow: "hidden",
                                cursor: "pointer",
                                backfaceVisibility: "hidden",
                                transformOrigin: "center center",
                                willChange: "transform",
                                boxShadow: pos.isCenter ? shadows.center : shadows.side,
                                backgroundColor: "#111",
                            }}
                        >
                            {/* Image */}
                            <img
                                src={card.src}
                                alt={card.alt ?? `Slide ${index + 1}`}
                                draggable={false}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    objectPosition: objPos,
                                    borderRadius,
                                    transform: isHover ? "scale(1.06)" : "scale(1)",
                                    transition: "transform 700ms ease",
                                    display: "block",
                                }}
                            />

                            {/* Active card gradient overlay */}
                            <AnimatePresence>
                                {pos.isCenter && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 pointer-events-none"
                                        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent 60%)" }}
                                    />
                                )}
                            </AnimatePresence>

                            {/* Active card border ring */}
                            {pos.isCenter && (
                                <div
                                    className="absolute inset-0 pointer-events-none"
                                    style={{ borderRadius, border: `1.5px solid ${primaryColor}30` }}
                                />
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Navigation + Pagination */}
            {(showNavigation || showPagination) && (
                <div
                    className="absolute left-1/2 -translate-x-1/2 flex items-center gap-5 z-[1000]"
                    style={{ bottom: config.isMobile ? 16 : 32 }}
                >
                    {showNavigation && (
                        <button
                            onClick={goToPrev}
                            aria-label="Previous slide"
                            className="flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
                            style={{
                                width: config.isMobile ? 36 : 44,
                                height: config.isMobile ? 36 : 44,
                                background: "rgba(255,255,255,0.08)",
                                border: "1px solid rgba(255,255,255,0.12)",
                                backdropFilter: "blur(12px)",
                                WebkitBackdropFilter: "blur(12px)",
                                color: "rgba(255,255,255,0.7)",
                            }}
                        >
                            <svg width={config.isMobile ? 16 : 20} height={config.isMobile ? 16 : 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </button>
                    )}

                    {showPagination && (
                        <div className="flex items-center gap-2">
                            {cards.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goTo(i)}
                                    aria-label={`Go to slide ${i + 1}`}
                                    aria-current={i === activeIndex ? "true" : "false"}
                                    className="transition-all duration-300 rounded-full"
                                    style={{
                                        width: i === activeIndex ? (config.isMobile ? 18 : 24) : (config.isMobile ? 6 : 7),
                                        height: config.isMobile ? 6 : 7,
                                        background: i === activeIndex ? primaryColor : "rgba(255,255,255,0.25)",
                                        border: "none",
                                        padding: 0,
                                        cursor: "pointer",
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {showNavigation && (
                        <button
                            onClick={goToNext}
                            aria-label="Next slide"
                            className="flex items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95"
                            style={{
                                width: config.isMobile ? 36 : 44,
                                height: config.isMobile ? 36 : 44,
                                background: "rgba(255,255,255,0.08)",
                                border: "1px solid rgba(255,255,255,0.12)",
                                backdropFilter: "blur(12px)",
                                WebkitBackdropFilter: "blur(12px)",
                                color: "rgba(255,255,255,0.7)",
                            }}
                        >
                            <svg width={config.isMobile ? 16 : 20} height={config.isMobile ? 16 : 20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
