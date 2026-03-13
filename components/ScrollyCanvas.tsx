"use client";

import React, { useEffect, useRef } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { useLoading } from "./Preloader";

export const ScrollContext = React.createContext<import("framer-motion").MotionValue<number> | null>(null);

export default function ScrollyCanvas({ children }: { children: React.ReactNode }) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const currentFrameRef = useRef(0);
    const totalFrames = 120;
    const isLoadingRef = useRef(true);
    const resizeTimeoutRef = useRef<NodeJS.Timeout>();

    const { setIsLoaded } = useLoading();

    const { scrollYProgress } = useScroll({
        target: wrapperRef,
        offset: ["start start", "end end"],
    });

    useEffect(() => {
        // Preload images
        let loadedCount = 0;

        const loadImage = (index: number) => {
            return new Promise<HTMLImageElement>((resolve) => {
                const img = new Image();
                img.src = `/sequence/frame_${index.toString().padStart(3, "0")}.png`;
                img.onload = () => {
                    loadedCount++;
                    resolve(img);
                };
                img.onerror = () => {
                    console.error(`Failed to load frame ${index}`);
                    resolve(img);
                };
            });
        };

        const handleResize = () => {
            if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
            resizeTimeoutRef.current = setTimeout(() => {
                if (canvasRef.current) {
                    resizeCanvas();
                    if (!isLoadingRef.current) {
                        drawFrame(currentFrameRef.current);
                    }
                }
            }, 100);
        };

        window.addEventListener("resize", handleResize);
        
        // Ensure canvas is sized before drawing the first frame
        resizeCanvas();

        // Load frame 0 first to show something immediately
        loadImage(0).then((firstFrame) => {
            if (!firstFrame) return;
            imagesRef.current[0] = firstFrame;
            
            // Only draw if we haven't already scrolled away
            requestAnimationFrame(() => {
               drawFrame(currentFrameRef.current);
            });

            // Load the rest in background
            const imagePromises = Array.from({ length: totalFrames - 1 }, (_, i) => loadImage(i + 1));

            Promise.all(imagePromises).then((restImages) => {
                const allImages = [firstFrame, ...restImages];
                imagesRef.current = allImages;
                isLoadingRef.current = false;
                setIsLoaded(true); // Signal that initial assets are ready
            });
        });

        return () => {
            window.removeEventListener("resize", handleResize);
            if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
        };
    }, [setIsLoaded]);

    const resizeCanvas = () => {
        if (!canvasRef.current) return;
        const parent = canvasRef.current.parentElement;
        if (parent) {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
        }
    };

    const drawFrame = (frameIndex: number) => {
        if (!canvasRef.current || !imagesRef.current[frameIndex]) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d", { alpha: false }); // Optimize for non-transparent sequence
        if (!ctx) return;
        
        // Prevent drawing if canvas is somehow 0 width/height
        if (canvas.width === 0 || canvas.height === 0) return;

        const img = imagesRef.current[frameIndex];
        
        // Double check image is fully loaded with dimensions
        if (img.width === 0 || img.height === 0) return;

        // Object-fit: cover logic
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasRatio > imgRatio) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgRatio;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
        } else {
            drawHeight = canvas.height;
            drawWidth = canvas.height * imgRatio;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
        }

        // Apply slight zoom to crop out watermark
        const ZOOM = 1.05;
        drawWidth *= ZOOM;
        drawHeight *= ZOOM;

        // Recalculate offsets to center with zoom
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = (canvas.height - drawHeight) / 2;

        ctx.fillStyle = "#000000"; // Fill black background first
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        currentFrameRef.current = frameIndex;
    };

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
        if (isLoadingRef.current || !imagesRef.current.length) return;

        const frameIndex = Math.min(
            Math.floor(latest * (totalFrames - 1)),
            totalFrames - 1
        );

        if (frameIndex !== currentFrameRef.current) {
            drawFrame(frameIndex); // Removed requestAnimationFrame here as useMotionValueEvent is already optimized
        }
    });

    return (
        <ScrollContext.Provider value={scrollYProgress}>
            <div ref={wrapperRef} className="relative w-full h-[500vh]">
                <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-deep-black">
                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 z-10 w-full h-full pointer-events-none">
                        {children}
                    </div>
                </div>
            </div>
        </ScrollContext.Provider>
    );
}
