"use client";

import {
    useState,
    useCallback,
    useMemo,
    useEffect,
    useRef,
    startTransition,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
export type MediaItem = {
    type: "image" | "video";
    src: string;
    alt?: string;
    title?: string;
    description?: string;
};

interface MediaCarousel3DProps {
    media: MediaItem[];
    /** Card width in px (responsive-clamped internally) */
    cardWidth?: number;
    /** Card height in px (responsive-clamped internally) */
    cardHeight?: number;
    /** Horizontal spacing between stacked cards */
    gap?: number;
    /** How much each card behind shrinks (0.12 = default) */
    scaleStep?: number;
    /** Z depth offset per card (px) */
    zStep?: number;
    /** CSS perspective for 3D stage */
    perspective?: number;
    /** Card border radius */
    radius?: number;
    /** Enable drag-to-navigate */
    dragEnabled?: boolean;
    /** Show prev/next arrow buttons */
    showButtons?: boolean;
    /** Primary color for buttons + active dot */
    primaryColor?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function MediaCarousel3D({
    media = [],
    cardWidth = 420,
    cardHeight = 280,
    gap = 44,
    scaleStep = 0.12,
    zStep = 80,
    perspective = 900,
    radius = 20,
    dragEnabled = true,
    showButtons = true,
    primaryColor = "#8B0000",
}: MediaCarousel3DProps) {
    const total = media.length;
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    const [index, setIndex] = useState(0);
    const [hoveredCard, setHoveredCard] = useState<number | null>(null);
    const [containerW, setContainerW] = useState(0);
    const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
    const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
    const [dragOffset, setDragOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    // Resize observer
    useEffect(() => {
        if (!containerRef.current) return;
        const ro = new ResizeObserver(entries => {
            const e = entries[0];
            if (e) startTransition(() => setContainerW(e.contentRect.width));
        });
        ro.observe(containerRef.current);
        return () => ro.disconnect();
    }, []);

    // Responsive card dimensions — fill the container, not a fixed px value
    const rCardW = useMemo(() => containerW === 0 ? cardWidth : Math.max(200, Math.min(cardWidth, containerW * 0.80)), [cardWidth, containerW]);
    const rCardH = useMemo(() => containerW === 0 ? cardHeight : Math.max(140, Math.min(cardHeight, containerW * 0.55)), [cardHeight, containerW]);
    const rGap = useMemo(() => containerW === 0 ? gap : Math.max(24, gap * Math.min(containerW / 500, 1.4)), [gap, containerW]);

    const handlePrev = useCallback(() => startTransition(() => setIndex(i => (i - 1 + total) % total)), [total]);
    const handleNext = useCallback(() => startTransition(() => setIndex(i => (i + 1) % total)), [total]);

    // Touch — swipe
    const onTouchStart = useCallback((e: React.TouchEvent) => {
        const t = e.touches[0];
        setTouchStart({ x: t.clientX, y: t.clientY });
    }, []);
    const onTouchEnd = useCallback((e: React.TouchEvent) => {
        if (!touchStart) return;
        const t = e.changedTouches[0];
        const dx = t.clientX - touchStart.x;
        const dy = t.clientY - touchStart.y;
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
            dx > 0 ? handlePrev() : handleNext();
        }
        setTouchStart(null);
    }, [touchStart, handlePrev, handleNext]);

    // Mouse drag
    const onMouseDown = useCallback((e: React.MouseEvent) => {
        if (!dragEnabled) return;
        setDragStart({ x: e.clientX, y: e.clientY });
        setIsDragging(false);
    }, [dragEnabled]);

    useEffect(() => {
        if (!dragStart || !dragEnabled) return;
        const onMove = (e: MouseEvent) => {
            const dx = e.clientX - dragStart.x;
            const dy = e.clientY - dragStart.y;
            if (!isDragging && (Math.abs(dx) > 5 || Math.abs(dy) > 5))
                startTransition(() => setIsDragging(true));
            if (isDragging || Math.abs(dx) > 5)
                startTransition(() => setDragOffset(dx));
        };
        const onUp = () => {
            if (Math.abs(dragOffset) > 50) { dragOffset > 0 ? handlePrev() : handleNext(); }
            setDragStart(null);
            setIsDragging(false);
            startTransition(() => setDragOffset(0));
        };
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    }, [dragStart, isDragging, dragOffset, handlePrev, handleNext, dragEnabled]);

    // Keyboard
    useEffect(() => {
        const h = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") { e.preventDefault(); handlePrev(); }
            if (e.key === "ArrowRight") { e.preventDefault(); handleNext(); }
        };
        window.addEventListener("keydown", h);
        return () => window.removeEventListener("keydown", h);
    }, [handlePrev, handleNext]);

    // Auto-play video on active card, pause others
    useEffect(() => {
        videoRefs.current.forEach((vid, i) => {
            if (!vid) return;
            if (i === index) { vid.play().catch(() => { }); }
            else { vid.pause(); }
        });
    }, [index]);

    // Build card transforms
    const cards = useMemo(() => media.map((item, i) => {
        let rel = i - index;
        if (rel < -Math.floor(total / 2)) rel += total;
        if (rel > Math.floor(total / 2)) rel -= total;
        const abs = Math.abs(rel);
        const z = -abs * zStep;
        const scale = 1 / (1 + abs * scaleStep);
        const x = rel * rGap + (isDragging && rel === 0 ? dragOffset : 0);
        const y = rel * 60;
        const rotate = rel * 10;
        const opacity = rel === 0 ? 1 : Math.max(0, 0.7 - 0.1 * abs);
        return { item, rel, abs, z, scale, x, y, rotate, opacity, isCenter: rel === 0 };
    }), [media, index, total, zStep, scaleStep, rGap, isDragging, dragOffset]);

    if (total === 0) return null;

    const stageH = rCardH * 1.8; // Reduced height to remove extra space while keeping 3D illusion

    return (
        <div className="relative w-full select-none" style={{ height: stageH + 40 }}>
            {/* ── 3D Stage ── */}
            <div
                ref={containerRef}
                className="absolute inset-0 flex items-center justify-center overflow-visible"
                style={{ perspective, perspectiveOrigin: "50% 50%" }}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                onMouseDown={onMouseDown}
            >
                <div
                    className="relative"
                    style={{
                        width: rCardW,
                        height: rCardH,
                        transformStyle: "preserve-3d",
                    }}
                >
                    {cards.map(({ item, rel, abs, z, scale, x, y, rotate, opacity, isCenter }, i) => {
                        const isHovered = hoveredCard === i;
                        const shadow = isCenter
                            ? "0 32px 80px rgba(0,0,0,0.45), 0 8px 24px rgba(0,0,0,0.30)"
                            : "0 8px 24px rgba(0,0,0,0.20)";
                        const isDrag = isDragging && rel === 0;

                        return (
                            <div
                                key={i}
                                style={{
                                    position: "absolute",
                                    left: "50%",
                                    top: "50%",
                                    width: rCardW,
                                    height: rCardH,
                                    transform: `translate(-50%, -50%) translateX(${x}px) translateY(${y}px) translateZ(${z}px) scale(${scale}) rotateZ(${rotate}deg)`,
                                    zIndex: 100 - abs,
                                    borderRadius: radius,
                                    overflow: "hidden",
                                    opacity,
                                    boxShadow: shadow,
                                    cursor: isCenter ? "grab" : "default",
                                    pointerEvents: rel === 0 ? "auto" : "none",
                                    transition: isDrag
                                        ? "opacity 0.4s, box-shadow 0.3s"
                                        : "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                                    background: "#111",
                                }}
                                onMouseEnter={() => isCenter && startTransition(() => setHoveredCard(i))}
                                onMouseLeave={() => isCenter && startTransition(() => setHoveredCard(null))}
                            >
                                {/* Media */}
                                {item.type === "video" ? (
                                    <video
                                        ref={el => { videoRefs.current[i] = el; }}
                                        src={item.src}
                                        muted
                                        loop
                                        playsInline
                                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                    />
                                ) : (
                                    <img
                                        src={item.src}
                                        alt={item.alt ?? `Slide ${i + 1}`}
                                        draggable={false}
                                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                    />
                                )}

                                {/* Hover overlay with title/description on active card */}
                                {isCenter && (item.title || item.description) && (
                                    <div
                                        style={{
                                            position: "absolute",
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            height: "60%",
                                            background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 100%)",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "flex-end",
                                            padding: "24px",
                                            opacity: isHovered ? 1 : 0,
                                            transition: "opacity 0.3s ease",
                                            pointerEvents: "none",
                                        }}
                                    >
                                        {item.title && (
                                            <h3 style={{ margin: 0, color: "#fff", fontSize: "1.1rem", fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                                                {item.title}
                                            </h3>
                                        )}
                                        {item.description && (
                                            <p style={{ margin: "6px 0 0", color: "rgba(255,255,255,0.7)", fontSize: "0.85rem", fontWeight: 500, lineHeight: 1.35 }}>
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Always-visible gradient on non-active cards (atmospheric) */}
                                {!isCenter && (
                                    <div
                                        className="absolute inset-0 pointer-events-none"
                                        style={{ background: "rgba(0,0,0,0.25)" }}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── LEFT arrow ── */}
            {showButtons && (
                <button
                    onClick={handlePrev}
                    aria-label="Previous"
                    className="absolute top-1/2 -translate-y-1/2 z-[200] flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 hover:border-[#8B0000] hover:text-[#8B0000] active:scale-95 group"
                    style={{
                        left: "calc(10% - 38px)",
                        width: 52, height: 52,
                        background: "rgba(11,11,15,0.7)",
                        border: "1px solid rgba(139,0,0,0.2)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        color: "rgba(255,255,255,0.6)",
                    }}
                >
                    <div className="absolute inset-0 rounded-full bg-[#8B0000]/0 group-hover:bg-[#8B0000]/10 transition-colors duration-500" />
                    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                        <path d="M19 12H5M5 12L12 19M5 12L12 5" />
                    </svg>
                </button>
            )}

            {/* ── RIGHT arrow ── */}
            {showButtons && (
                <button
                    onClick={handleNext}
                    aria-label="Next"
                    className="absolute top-1/2 -translate-y-1/2 z-[200] flex items-center justify-center rounded-full transition-all duration-300 hover:scale-110 hover:border-[#8B0000] hover:text-[#8B0000] active:scale-95 group"
                    style={{
                        right: "calc(10% - 38px)",
                        width: 52, height: 52,
                        background: "rgba(11,11,15,0.7)",
                        border: "1px solid rgba(139,0,0,0.2)",
                        backdropFilter: "blur(20px)",
                        WebkitBackdropFilter: "blur(20px)",
                        color: "rgba(255,255,255,0.6)",
                    }}
                >
                    <div className="absolute inset-0 rounded-full bg-[#8B0000]/0 group-hover:bg-[#8B0000]/10 transition-colors duration-500" />
                    <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square">
                        <path d="M5 12H19M19 12L12 5M19 12L12 19" />
                    </svg>
                </button>
            )}

            {/* ── Dot pagination (bottom center) ── */}
            <div
                className="absolute left-1/2 -translate-x-1/2 z-[200] flex items-center gap-2"
                style={{ bottom: 16 }}
            >
                {media.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => startTransition(() => setIndex(i))}
                        aria-label={`Go to ${i + 1}`}
                        className="rounded-full transition-all duration-300"
                        style={{
                            width: i === index ? 22 : 7,
                            height: 7,
                            padding: 0,
                            border: "none",
                            cursor: "pointer",
                            background: i === index ? primaryColor : "rgba(255,255,255,0.22)",
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
