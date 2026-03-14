"use client";

import React, { useEffect, useRef, useState } from "react";
import { useScroll, useMotionValueEvent, useSpring } from "framer-motion";
import SkillOverlay from "./SkillOverlay";
import { useLoading } from "./Preloader";

export default function SkillsSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const currentFrameRef = useRef(0);
    const { setAssetLoaded, registerAsset } = useLoading();
    const [isLocalLoaded, setIsLocalLoaded] = useState(false);
    const totalFrames = 120;

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"],
    });

    // Create a smooth version of the scroll progress
    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        registerAsset("skills-sequence");
    }, []);

    useEffect(() => {
        // Preload all frames
        let loadedCount = 0;
        const preloadImages = async () => {
            const promises = Array.from({ length: totalFrames }, (_, i) => {
                return new Promise<HTMLImageElement>((resolve) => {
                    const img = new Image();
                    img.src = `/sequence2/frame_${i.toString().padStart(3, "0")}.png`;

                    img.onload = () => {
                        loadedCount++;
                        if (loadedCount === totalFrames) {
                            setIsLocalLoaded(true);
                            setAssetLoaded("skills-sequence");
                            // Draw first frame once loaded
                            drawFrame(0);
                        }
                        resolve(img);
                    };
                    img.onerror = () => {
                        console.warn(`Failed to load ${img.src}`);
                        resolve(img);
                    };
                    return img;
                });
            });

            const loadedImages = await Promise.all(promises);
            imagesRef.current = loadedImages as HTMLImageElement[];
        };

        preloadImages();

        const handleResize = () => {
            if (canvasRef.current) {
                renderCanvas();
                drawFrame(currentFrameRef.current);
            }
        };

        window.addEventListener("resize", handleResize);
        renderCanvas();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const renderCanvas = () => {
        if (canvasRef.current) {
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
        }
    };

    const drawFrame = (index: number) => {
        if (!canvasRef.current || !imagesRef.current[index]) return;
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        const img = imagesRef.current[index];
        const canvas = canvasRef.current;

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

        // Apply slight zoom to crop out watermark (matching Hero section)
        const ZOOM = 1.05;
        drawWidth *= ZOOM;
        drawHeight *= ZOOM;

        // Recalculate offsets to center with zoom
        offsetX = (canvas.width - drawWidth) / 2;
        offsetY = (canvas.height - drawHeight) / 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

        currentFrameRef.current = index;
    };

    useMotionValueEvent(smoothProgress, "change", (latest) => {
        const frameIndex = Math.min(
            Math.floor(latest * (totalFrames - 1)),
            totalFrames - 1
        );

        if (frameIndex !== currentFrameRef.current) {
            requestAnimationFrame(() => drawFrame(frameIndex));
        }
    });

    return (
        <div ref={sectionRef} className="relative h-[500vh] bg-[#0B0B0F]">
            <div className="sticky top-0 h-screen w-full overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full"
                />
                <SkillOverlay progress={smoothProgress} />

                {/* Subtle Vignette for cinematic feel */}
                <div className="absolute inset-0 pointer-events-none bg-radial-vignette opacity-40" />
            </div>
        </div>
    );
}
