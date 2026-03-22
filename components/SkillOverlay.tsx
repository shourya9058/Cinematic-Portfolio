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
                className="absolute top-[8%] md:top-[10%] left-[5%] md:left-[10%] flex flex-col items-start px-4 md:px-0"
            >
                <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-[8px] md:text-sm tracking-[0.4em] text-[#8B0000] mb-2 font-mono flex items-center"
                >
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-[#8B0000] rounded-full mr-2 animate-pulse" />
                    CORE CAPABILITY PROFILING
                </motion.span>
                <h2 className="text-xl md:text-5xl tracking-[0.2em] font-black text-[#EAEAEA] leading-tight">
                    TECH STACK I WORK WITH
                </h2>
                <div className="h-[1px] w-full bg-gradient-to-r from-[#8B0000] to-transparent mt-3 md:mt-4" />
            </motion.div>

            {/* Skill 1: Frontend */}
            <motion.div
                style={{ opacity: opacity1, y: y1 }}
                className="absolute left-[5%] md:left-[8%] top-[30%] md:top-[35%] text-left max-w-[85%] md:max-w-none"
            >
                <motion.div style={{ opacity: dim1 }}>
                    <h3 className="text-lg md:text-3xl mb-1 md:mb-2 text-[#EAEAEA] tracking-wider">FRONTEND DEVELOPMENT</h3>
                    <p className="text-[10px] md:text-base text-gray-500 max-w-[300px] md:max-w-[400px] leading-relaxed">HTML5 • CSS3 • JavaScript • React • TailwindCSS • Bootstrap • Responsive UI</p>
                    <div className="h-[1px] w-8 md:w-12 bg-[#8B0000] mt-2 md:mt-3" />
                </motion.div>
            </motion.div>

            {/* Skill 2: Backend */}
            <motion.div
                style={{ opacity: opacity2, y: y2 }}
                className="absolute right-[5%] md:right-[8%] top-[42%] md:top-[45%] text-right max-w-[85%] md:max-w-none"
            >
                <motion.div style={{ opacity: dim2 }}>
                    <h3 className="text-lg md:text-3xl mb-1 md:mb-2 text-[#EAEAEA] tracking-wider">BACKEND & DATABASE</h3>
                    <p className="text-[10px] md:text-base text-gray-500 max-w-[300px] md:max-w-[400px] leading-relaxed ml-auto">Node.js • Express.js • REST APIs • MongoDB • Mongoose • MySQL • Authentication</p>
                    <div className="h-[1px] w-8 md:w-12 bg-[#8B0000] mt-2 md:mt-3 ml-auto" />
                </motion.div>
            </motion.div>

            {/* Skill 4: Tools & Technologies */}
            <motion.div
                style={{ opacity: opacity4, y: y4 }}
                className="absolute left-[5%] md:left-[12%] bottom-[25%] md:bottom-[20%] text-left max-w-[85%] md:max-w-none"
            >
                <motion.div style={{ opacity: dim4 }}>
                    <h3 className="text-base md:text-2xl mb-1 md:mb-2 text-[#EAEAEA] tracking-wider">TOOLS & TECHNOLOGIES</h3>
                    <p className="text-[10px] md:text-base text-gray-500 max-w-[280px] md:max-w-[400px] leading-relaxed">Git • GitHub • Postman • VS Code • Cloudinary • Multer • Passport.js</p>
                    <div className="h-[1px] w-8 md:w-12 bg-[#8B0000] mt-2 md:mt-3" />
                </motion.div>
            </motion.div>

            {/* Skill 5: Programming Languages */}
            <motion.div
                style={{ opacity: opacity5, y: y5 }}
                className="absolute right-[5%] md:right-[12%] bottom-[32%] md:bottom-[25%] text-right max-w-[85%] md:max-w-none"
            >
                <h3 className="text-base md:text-2xl mb-1 md:mb-2 text-[#EAEAEA] tracking-wider">PROGRAMMING LANGUAGES</h3>
                <p className="text-[10px] md:text-base text-gray-500 max-w-[250px] md:max-w-[300px] leading-relaxed ml-auto">JavaScript • C++ • Python • SQL</p>
                <div className="h-[1px] w-8 md:w-12 bg-[#8B0000] mt-2 md:mt-3 ml-auto" />
            </motion.div>

            {/* Skill 3: Full Stack Development (Final) */}
            <motion.div
                style={{ opacity: opacity3, scale: scale3 }}
                className="text-center px-4"
            >
                <motion.span className="text-[8px] md:text-xs tracking-[0.5em] text-[#8B0000] mb-3 md:mb-4 block">SYSTEM IDENTIFIED</motion.span>
                <h2 className="text-3xl md:text-7xl mb-4 md:mb-6 tracking-[0.2em] font-black text-white leading-tight">MERN FULL STACK DEVELOPER</h2>
                <div className="flex flex-col items-center gap-2">
                    <p className="text-[10px] md:text-xl text-gray-400 max-w-[90%] md:max-w-[800px] tracking-widest leading-loose">MONGODB • EXPRESS • REACT • NODE.JS • REST APIS • FULL STACK ARCHITECTURE</p>
                    <div className="h-[1px] md:h-[2px] w-32 md:w-48 bg-[#8B0000] mt-6 md:mt-8 shadow-[0_0_20px_rgba(139,0,0,0.8)]" />
                </div>
            </motion.div>
        </div>
    );
};

export default SkillOverlay;
