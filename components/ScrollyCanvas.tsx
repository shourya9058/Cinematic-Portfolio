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

    const { setAssetLoaded, registerAsset } = useLoading();

    const { scrollYProgress } = useScroll({
        target: wrapperRef,
        offset: ["start start", "end end"],
    });

    useEffect(() => {
        registerAsset("hero-sequence");
    }, []);

    useEffect(() => {
        // Preload images
        let loadedCount = 0;

        const loadImage = (index: number) => {
            return new Promise<HTMLImageElement>((resolve) => {
                const img = new Image();
                // Assuming the sequence path is correct based on previous context
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

        // Load frame 0 first to show something immediately
        loadImage(0).then((firstFrame) => {
            imagesRef.current[0] = firstFrame;
            drawFrame(0);

            // Load the rest in background
            const imagePromises = Array.from({ length: totalFrames - 1 }, (_, i) => loadImage(i + 1));

            Promise.all(imagePromises).then((restImages) => {
                const allImages = [firstFrame, ...restImages];
                imagesRef.current = allImages;
                isLoadingRef.current = false;
                setAssetLoaded("hero-sequence"); // Signal that hero assets are ready
            });
        });

        const handleResize = () => {
            if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
            resizeTimeoutRef.current = setTimeout(() => {
                if (canvasRef.current) {
                    resizeCanvas();
                    drawFrame(currentFrameRef.current);
                }
            }, 100);
        };

        window.addEventListener("resize", handleResize);
        resizeCanvas();

        return () => {
            window.removeEventListener("resize", handleResize);
            if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
        };
    }, []);

    const resizeCanvas = () => {
        if (!canvasRef.current) return;
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
    };

    const drawFrame = (frameIndex: number) => {
        if (!canvasRef.current || !imagesRef.current[frameIndex]) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const img = imagesRef.current[frameIndex];

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

        ctx.clearRect(0, 0, canvas.width, canvas.height);
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
            requestAnimationFrame(() => drawFrame(frameIndex));
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
