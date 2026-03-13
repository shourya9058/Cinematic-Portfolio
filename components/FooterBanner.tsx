"use client";

import React from "react";
import { motion } from "framer-motion";

export default function FooterBanner() {
    const bannerText = "SHOURYA SINGH";
    const repeats = [0, 1, 2, 3, 4, 5];

    return (
        <div className="pt-20 pb-0 overflow-hidden border-t border-white/10 relative bg-[#0B0B0F]">
            <motion.div
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                    duration: 25,
                    repeat: Infinity,
                    ease: "linear"
                }}
                className="flex w-max"
            >
                {[0, 1].map((blockIdx) => (
                    <div key={blockIdx} className="flex items-center">
                        {repeats.map((i) => (
                            <div key={i} className="flex items-center">
                                <span className="text-[120px] md:text-[180px] lg:text-[220px] font-black text-[#8B0000] uppercase tracking-tighter italic leading-none">
                                    {bannerText}
                                </span>
                                <div className="mx-12 md:mx-20 text-gray-500 text-4xl md:text-6xl">
                                    ✦
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </motion.div>
        </div>
    );
}
