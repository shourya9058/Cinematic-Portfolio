"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

interface ScrollClipImageProps {
    src: string;
    alt: string;
    /**
     * The ID of the section that, when it scrolls into the viewport,
     * causes THIS image to clip away (bottom-to-top wipe).
     * If omitted, no clip animation is applied (last slide).
     */
    wipedBy?: string;
    fill?: boolean;
    width?: number;
    height?: number;
    priority?: boolean;
    className?: string;
    scroller?: string | HTMLElement | React.RefObject<HTMLElement>;
}

/**
 * Next.js port of "ScrollClip_Image_1" by Studio Sandcastle.
 *
 * The image starts fully visible (inset 0 0 0% 0).
 * As the section identified by `wipedBy` scrolls into the viewport from below,
 * this image is progressively clipped upward (inset 0 0 100% 0) — scrubbed 1:1 with scroll.
 *
 * This creates the "stacking sections overlapping each other" effect.
 */
export default function ScrollClipImage({
    src,
    alt,
    wipedBy,
    fill = false,
    width,
    height,
    priority = false,
    className = "",
}: ScrollClipImageProps) {
    const wrapRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLDivElement>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    useEffect(() => {
        if (!mounted || !wipedBy) return;
        const el = imgRef.current;
        const wrap = wrapRef.current;
        if (!el || !wrap) return;

        const id = wipedBy.startsWith("#") ? wipedBy : `#${wipedBy}`;
        const triggerEl = document.querySelector<HTMLElement>(id);
        if (!triggerEl) return;

        const ctx = gsap.context(() => {
            // Set initial state: image fully visible
            gsap.set(el, {
                clipPath: "inset(0 0 0% 0)",
                willChange: "clip-path",
            });

            // As `wipedBy` section enters from below → clip this image upward
            gsap.fromTo(
                el,
                { clipPath: "inset(0 0 0% 0)" },
                {
                    clipPath: "inset(0 0 100% 0)",
                    ease: "none",
                    immediateRender: false,
                    scrollTrigger: {
                        trigger: triggerEl,
                        scroller: typeof scroller === "string" || scroller instanceof HTMLElement ? scroller : (scroller?.current || undefined),
                        start: "top bottom",   // triggerEl's top hits viewport bottom
                        end: "bottom bottom",  // triggerEl's bottom hits viewport bottom
                        scrub: true,
                        invalidateOnRefresh: true,
                    },
                }
            );
        }, wrap);

        return () => ctx.revert();
    }, [mounted, wipedBy]);

    return (
        <div
            ref={wrapRef}
            className={`relative overflow-hidden w-full h-full ${className}`}
        >
            <div ref={imgRef} className="absolute inset-0 w-full h-full">
                {src.endsWith(".mp4") || src.endsWith(".webm") ? (
                    <video
                        src={src}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                    />
                ) : fill ? (
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        priority={priority}
                        className="object-cover"
                        sizes="100vw"
                    />
                ) : (
                    <Image
                        src={src}
                        alt={alt}
                        width={width ?? 1200}
                        height={height ?? 800}
                        priority={priority}
                        className="w-full h-full object-cover"
                        sizes="100vw"
                    />
                )}
            </div>
        </div>
    );
}
