"use client";

import React from "react";
import { motion, useTransform, MotionValue } from "framer-motion";

interface SkillOverlayProps {
    progress: MotionValue<number>;
}

const SkillOverlay: React.FC<SkillOverlayProps> = ({ progress }) => {
    // Thresholds (normalized 0-1)
    // 0.00 - 0.15: Initial Title
    // 0.20 - 0.80: Frontend (Skill 1)
    // 0.35 - 0.80: Backend (Skill 2)
    // 0.50 - 0.80: Tools (Skill 4)
    // 0.65 - 0.80: Programming Languages (Skill 5 - New)
    // 0.83 - 1.00: Full Stack Development (Skill 3)

    // Initial Section Title
    const titleOpacity = useTransform(progress, [0, 0.15], [1, 0]);
    const titleY = useTransform(progress, [0, 0.15], [0, -20]);

    // Skill 1 (Frontend) - Appears at 0.20
    const opacity1 = useTransform(progress, [0.18, 0.24, 0.8, 0.85], [0, 1, 1, 0]);
    const y1 = useTransform(progress, [0.18, 0.24], [20, 0]);
    const dim1 = useTransform(progress, [0.33, 0.39], [1, 0.4]); // Dim when Backend appears

    // Skill 2 (Backend) - Appears at 0.35
    const opacity2 = useTransform(progress, [0.33, 0.39, 0.8, 0.85], [0, 1, 1, 0]);
    const y2 = useTransform(progress, [0.33, 0.39], [20, 0]);
    const dim2 = useTransform(progress, [0.48, 0.54], [1, 0.4]); // Dim when Tools appear

    // Skill 4 (Tools & Technologies) - Appears at 0.50
    const opacity4 = useTransform(progress, [0.48, 0.54, 0.8, 0.85], [0, 1, 1, 0]);
    const y4 = useTransform(progress, [0.48, 0.54], [20, 0]);
    const dim4 = useTransform(progress, [0.63, 0.69], [1, 0.4]); // Dim when Languages appear

    // Skill 5 (Programming Languages) - Appears at 0.65
    const opacity5 = useTransform(progress, [0.63, 0.69, 0.8, 0.85], [0, 1, 1, 0]);
    const y5 = useTransform(progress, [0.63, 0.69], [20, 0]);

    // Skill 3 (Full Stack Development) - Smile Moment (0.83+)
    const opacity3 = useTransform(progress, [0.8, 0.85], [0, 1]);
    const scale3 = useTransform(progress, [0.8, 0.85], [0.95, 1]);

    return (
        <div className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center font-bold uppercase tracking-[0.2em] text-[#EAEAEA]">

            {/* Section Title - HUD Style */}
            <motion.div
                style={{ opacity: titleOpacity, y: titleY }}
                className="absolute top-[10%] left-[10%] flex flex-col items-start"
            >
                <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-[10px] md:text-sm tracking-[0.4em] text-[#8B0000] mb-2 font-mono flex items-center"
                >
                    <span className="w-2 h-2 bg-[#8B0000] rounded-full mr-2 animate-pulse" />
                    CORE CAPABILITY PROFILING
                </motion.span>
                <h2 className="text-2xl md:text-5xl tracking-[0.2em] font-black text-[#EAEAEA]">
                    TECH STACK I WORK WITH
                </h2>
                <div className="h-[1px] w-full bg-gradient-to-r from-[#8B0000] to-transparent mt-4" />
            </motion.div>

            {/* Skill 1: Frontend */}
            <motion.div
                style={{ opacity: opacity1, y: y1 }}
                className="absolute left-[8%] top-[35%] text-left"
            >
                <motion.div style={{ opacity: dim1 }}>
                    <h3 className="text-xl md:text-3xl mb-2 text-[#EAEAEA]">FRONTEND DEVELOPMENT</h3>
                    <p className="text-xs md:text-base text-gray-500 max-w-[400px]">HTML5 • CSS3 • JavaScript • React • TailwindCSS • Bootstrap • Responsive UI</p>
                    <div className="h-[1px] w-12 bg-[#8B0000] mt-3" />
                </motion.div>
            </motion.div>

            {/* Skill 2: Backend */}
            <motion.div
                style={{ opacity: opacity2, y: y2 }}
                className="absolute right-[8%] top-[45%] text-right"
            >
                <motion.div style={{ opacity: dim2 }}>
                    <h3 className="text-xl md:text-3xl mb-2 text-[#EAEAEA]">BACKEND & DATABASE</h3>
                    <p className="text-xs md:text-base text-gray-500 max-w-[400px]">Node.js • Express.js • REST APIs • MongoDB • Mongoose • MySQL • Authentication</p>
                    <div className="h-[1px] w-12 bg-[#8B0000] mt-3 ml-auto" />
                </motion.div>
            </motion.div>

            {/* Skill 4: Tools & Technologies */}
            <motion.div
                style={{ opacity: opacity4, y: y4 }}
                className="absolute left-[12%] bottom-[20%] text-left"
            >
                <motion.div style={{ opacity: dim4 }}>
                    <h3 className="text-lg md:text-2xl mb-2 text-[#EAEAEA]">TOOLS & TECHNOLOGIES</h3>
                    <p className="text-xs md:text-base text-gray-500 max-w-[400px]">Git • GitHub • Postman • VS Code • Cloudinary • Multer • Passport.js</p>
                    <div className="h-[1px] w-12 bg-[#8B0000] mt-3" />
                </motion.div>
            </motion.div>

            {/* Skill 5: Programming Languages */}
            <motion.div
                style={{ opacity: opacity5, y: y5 }}
                className="absolute right-[12%] bottom-[25%] text-right"
            >
                <h3 className="text-lg md:text-2xl mb-2 text-[#EAEAEA]">PROGRAMMING LANGUAGES</h3>
                <p className="text-xs md:text-base text-gray-500 max-w-[300px]">JavaScript • C++ • Python • SQL</p>
                <div className="h-[1px] w-12 bg-[#8B0000] mt-3 ml-auto" />
            </motion.div>

            {/* Skill 3: Full Stack Development (Final) */}
            <motion.div
                style={{ opacity: opacity3, scale: scale3 }}
                className="text-center"
            >
                <motion.span className="text-[10px] md:text-xs tracking-[0.5em] text-[#8B0000] mb-4 block">SYSTEM IDENTIFIED</motion.span>
                <h2 className="text-4xl md:text-7xl mb-6 tracking-[0.2em] font-black text-white">MERN FULL STACK DEVELOPER</h2>
                <div className="flex flex-col items-center gap-2">
                    <p className="text-sm md:text-xl text-gray-400 max-w-[800px] tracking-widest">MONGODB • EXPRESS • REACT • NODE.JS • REST APIS • FULL STACK ARCHITECTURE</p>
                    <div className="h-[2px] w-48 bg-[#8B0000] mt-8 shadow-[0_0_25px_rgba(139,0,0,1)]" />
                </div>
            </motion.div>
        </div>
    );
};

export default SkillOverlay;
