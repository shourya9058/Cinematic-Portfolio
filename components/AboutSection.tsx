"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// ─── Design Tokens ─────────────────────────────────────────────────────────────
// Professional (default) — strictly B&W
const PRO_BG = "#F5F0E8"; // off-white comic paper
const PRO_INK = "#000000";
const PRO_MUTE = "#555555";
const PRO_TAG_BG = "#fff";
const PRO_TAG_BORDER = "#000";

// Fun (hover) — full colour
const FUN_RED = "#8B0000";
const FUN_GOLD = "#FFD700";
const FUN_DARK = "#111111";

const PANEL_BORDER = "7px solid #000";
const PANEL_SHADOW = "6px 6px 0px #000";
const GUTTER = "18px";

// ─── Background textures ───────────────────────────────────────────────────────
const bwHalftone: React.CSSProperties = {
    backgroundImage: `radial-gradient(circle, rgba(0,0,0,0.15) 1px, transparent 1px)`,
    backgroundSize: "8px 8px",
};
const colourHalftone: React.CSSProperties = {
    backgroundImage: `radial-gradient(circle, rgba(139,0,0,0.22) 1px, transparent 1px)`,
    backgroundSize: "7px 7px",
};

// ─── Typography tokens ─────────────────────────────────────────────────────────
const BANGERS: React.CSSProperties = {
    fontFamily: "'Bangers', 'Arial Black', sans-serif",
    letterSpacing: "0.06em",
};
const BOLD: React.CSSProperties = {
    fontFamily: "'Arial Black', 'Arial', sans-serif",
    fontWeight: 900,
};

// ─── Shared Sub-components ─────────────────────────────────────────────────────

/** Caption label — bw=true for the professional (default) layer */
function Caption({ text, bw = true }: { text: string; bw?: boolean }) {
    return (
        <div
            style={{
                display: "inline-block",
                background: bw ? "#000" : FUN_RED,
                color: "#fff",
                padding: "4px 16px",
                marginBottom: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.3em",
                fontSize: "clamp(9px, 0.9vw, 11px)",
                boxShadow: "3px 3px 0 rgba(0,0,0,0.4)",
                ...BOLD,
            }}
        >
            {text}
        </div>
    );
}

/** Comic speech bubble — always B&W (shown only on image panel default) */
function Bubble({ text }: { text: string }) {
    return (
        <div style={{ position: "relative", display: "inline-block" }}>
            <div
                style={{
                    background: "#fff",
                    border: "4px solid #000",
                    borderRadius: "18px",
                    padding: "8px 18px",
                    fontSize: "clamp(10px, 1vw, 13px)",
                    lineHeight: 1.4,
                    color: "#000",
                    boxShadow: "4px 4px 0 #000",
                    maxWidth: "260px",
                    whiteSpace: "nowrap",
                    ...BOLD,
                    textTransform: "uppercase",
                }}
            >
                {text}
            </div>
            <div
                style={{
                    position: "absolute", bottom: "-13px", left: "24px",
                    width: 0, height: 0,
                    borderLeft: "12px solid transparent",
                    borderRight: "12px solid transparent",
                    borderTop: "13px solid #000",
                }}
            />
            <div
                style={{
                    position: "absolute", bottom: "-6px", left: "27px",
                    width: 0, height: 0,
                    borderLeft: "9px solid transparent",
                    borderRight: "9px solid transparent",
                    borderTop: "9px solid #fff",
                }}
            />
        </div>
    );
}

/** Starburst (colour – hover only) */
function Starburst({ text, bg = FUN_GOLD, size = 76 }: {
    text: string; bg?: string; size?: number;
}) {
    return (
        <div
            style={{
                width: size, height: size,
                background: bg,
                clipPath: "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: `${size * 0.135}px`,
                color: bg === FUN_GOLD ? "#000" : FUN_GOLD,
                textAlign: "center", lineHeight: 1, flexShrink: 0,
                textTransform: "uppercase",
                ...BANGERS,
            }}
        >
            {text}
        </div>
    );
}

/** Radiating speed lines SVG */
function SpeedLines({ color = "rgba(0,0,0,0.06)" }: { color?: string }) {
    return (
        <svg
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}
            viewBox="0 0 400 400"
            preserveAspectRatio="xMidYMid slice"
        >
            {Array.from({ length: 28 }).map((_, i) => {
                const angle = (i / 28) * 360;
                const rad = (angle * Math.PI) / 180;
                return (
                    <line key={i} x1="200" y1="200"
                        x2={200 + Math.cos(rad) * 500}
                        y2={200 + Math.sin(rad) * 500}
                        stroke={color}
                        strokeWidth={i % 3 === 0 ? "2" : "1"}
                    />
                );
            })}
        </svg>
    );
}

/** Onomatopoeia stamp (colour – hover only) */
function Ono({ text, rotate = 10, bg = FUN_GOLD, color = "#000" }: {
    text: string; rotate?: number; bg?: string; color?: string;
}) {
    return (
        <div
            style={{
                display: "inline-block",
                background: bg, color,
                border: "4px solid #000",
                padding: "4px 14px",
                transform: `rotate(${rotate}deg)`,
                fontSize: "clamp(18px, 2.5vw, 30px)",
                textTransform: "uppercase",
                boxShadow: "4px 4px 0 #000",
                ...BANGERS,
            }}
        >
            {text}
        </div>
    );
}

// ─── Panel Wrapper ─────────────────────────────────────────────────────────────
function Panel({
    professional,
    fun,
    style = {},
}: {
    professional: React.ReactNode;
    fun: React.ReactNode;
    style?: React.CSSProperties;
}) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            style={{
                position: "relative",
                overflow: "hidden",
                border: PANEL_BORDER,
                boxShadow: PANEL_SHADOW,
                background: PRO_BG,
                cursor: "default",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                transform: hovered ? "scale(1.015)" : "scale(1)",
                ...style,
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* ── Professional (B&W) layer ── */}
            <div
                style={{
                    position: "absolute", inset: 0,
                    transition: "opacity 0.38s ease, transform 0.38s ease",
                    opacity: hovered ? 0 : 1,
                    transform: hovered ? "scale(0.97)" : "scale(1)",
                    padding: "22px",
                    display: "flex", flexDirection: "column", justifyContent: "center", gap: "6px",
                }}
            >
                {professional}
            </div>

            {/* ── Fun (colour) layer ── */}
            <div
                style={{
                    position: "absolute", inset: 0,
                    transition: "opacity 0.38s ease, transform 0.38s ease",
                    opacity: hovered ? 1 : 0,
                    transform: hovered ? "scale(1)" : "scale(1.04)",
                    padding: "22px",
                    display: "flex", flexDirection: "column", justifyContent: "center", gap: "6px",
                }}
            >
                {fun}
            </div>

            {/* Ghost spacer keeps panel height */}
            <div style={{ visibility: "hidden", padding: "22px", display: "flex", flexDirection: "column", gap: "6px" }}>
                {professional}
            </div>
        </div>
    );
}

// ─── Image Panel ──────────────────────────────────────────────────────────────
function ImagePanel({ style = {} }: { style?: React.CSSProperties }) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            style={{
                position: "relative", overflow: "hidden",
                border: PANEL_BORDER, boxShadow: PANEL_SHADOW,
                background: "#000", cursor: "default",
                transition: "transform 0.2s ease",
                transform: hovered ? "scale(1.015)" : "scale(1)",
                ...style,
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Black & White Image (Default) */}
            <img
                src="/AboutMe(black).png"
                alt="Shourya Singh BW"
                style={{
                    width: "100%", height: "100%",
                    objectFit: "cover", objectPosition: "center top",
                    display: "block",
                    position: "absolute", inset: 0,
                    opacity: hovered ? 0 : 1,
                    transition: "opacity 0.4s ease",
                }}
            />

            {/* Colored Image (Hover) */}
            <img
                src="/AboutMe(colored).png"
                alt="Shourya Singh Colored"
                style={{
                    width: "100%", height: "100%",
                    objectFit: "cover", objectPosition: "center top",
                    display: "block",
                    position: "absolute", inset: 0,
                    opacity: hovered ? 1 : 0,
                    transition: "opacity 0.4s ease",
                }}
            />

            {/* B&W Halftone overlay (default) */}
            <div style={{
                ...bwHalftone,
                position: "absolute", inset: 0,
                opacity: hovered ? 0 : 0.45,
                transition: "opacity 0.4s ease",
                pointerEvents: "none",
            }} />

            {/* Red gradient overlay (hover) */}
            <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(160deg, transparent 55%, rgba(139,0,0,0.4) 100%)",
                opacity: hovered ? 1 : 0,
                transition: "opacity 0.4s ease",
                pointerEvents: "none",
            }} />

            {/* Default label (B&W) */}
            <div style={{
                position: "absolute", top: "14px", left: 0,
                background: "#000", color: "#fff",
                padding: "4px 14px 4px 16px",
                fontSize: "clamp(9px, 0.9vw, 11px)",
                textTransform: "uppercase", letterSpacing: "0.25em",
                boxShadow: "3px 3px 0 rgba(0,0,0,0.4)",
                opacity: hovered ? 0 : 1,
                transition: "opacity 0.3s ease",
                ...BOLD,
            }}>
                Portrait — Shourya Singh<br />Full Stack Developer
            </div>

            {/* Hover bubble (colour) */}
            <div style={{
                position: "absolute", bottom: "20px", left: "50%",
                transform: "translateX(-50%)",
                transition: "opacity 0.4s ease",
                opacity: hovered ? 1 : 0,
                pointerEvents: "none",
            }}>
                <Bubble text="Sup!" />
            </div>
        </div>
    );
}

// ─── PAGE 1 – THE ORIGIN ──────────────────────────────────────────────────────
// Grid:  [col: 1.6fr | 1fr | 1.1fr]  ×  [row: 1.4fr | 1fr | 0.55fr]
//   hero  (col 1–2, row 1)   |  img  (col 3, rows 1–2)
//   edu   (col 1,   row 2)   |  quote(col 2, row 2)
//   strip (col 1–3, row 3)
function PageOne() {
    return (
        <div style={{
            width: "100%", height: "100%",
            padding: GUTTER, boxSizing: "border-box",
            display: "grid",
            gridTemplateColumns: "1.6fr 1fr 1.1fr",
            gridTemplateRows: "1.4fr 1fr 0.55fr",
            gap: GUTTER,
            overflow: "hidden",
            background: PRO_BG,
        }}>

            {/* ── Panel 1: Hero ── */}
            <Panel
                style={{ gridColumn: "1 / 3", gridRow: "1 / 2" }}
                professional={
                    <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: "12px", height: "100%", justifyContent: "center", padding: "4px" }}>
                        {/* B&W speed lines */}
                        <SpeedLines color="rgba(0,0,0,0.05)" />
                        <Caption text="Origin Story · Case File #001" bw />
                        <h2 style={{ ...BANGERS, fontSize: "clamp(2rem, 5vw, 4.5rem)", lineHeight: 0.95, color: PRO_INK, textTransform: "uppercase", margin: 0, position: "relative" }}>
                            Shourya<br />Singh.
                        </h2>
                        <p style={{ ...BOLD, fontSize: "clamp(11px, 1.1vw, 14px)", color: PRO_MUTE, lineHeight: 1.5, maxWidth: "420px", margin: 0, position: "relative" }}>
                            A Computer Science undergraduate focused on building scalable web applications and solving real-world problems through code.
                        </p>
                        {/* ghost panel number */}
                        <div style={{ position: "absolute", bottom: "8px", right: "14px", opacity: 0.07, ...BANGERS, fontSize: "90px", color: PRO_INK, lineHeight: 1, pointerEvents: "none" }}>①</div>
                    </div>
                }
                fun={
                    <div style={{ background: FUN_RED, position: "absolute", inset: 0, padding: "22px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "12px", overflow: "hidden" }}>
                        <SpeedLines color="rgba(255,255,255,0.06)" />
                        <Caption text="Level 1 Unlocked" bw={false} />
                        <h2 style={{ ...BANGERS, fontSize: "clamp(1.8rem, 4.5vw, 4rem)", lineHeight: 0.95, color: FUN_GOLD, textTransform: "uppercase", margin: 0, textShadow: "4px 4px 0 #000", position: "relative" }}>
                            Future Full Stack<br />Architect!
                        </h2>
                        <div style={{ position: "absolute", bottom: "14px", right: "20px" }}>
                            <Starburst text={"LEVEL\nUP!"} size={72} bg={FUN_GOLD} />
                        </div>
                    </div>
                }
            />

            {/* ── Panel 2: Image (col 3, rows 1–2) ── */}
            <ImagePanel style={{ gridColumn: "3 / 4", gridRow: "1 / 3", minHeight: 0 }} />

            {/* ── Panel 3: Education ── */}
            <Panel
                style={{ gridColumn: "1 / 2", gridRow: "2 / 3", background: PRO_INK }}
                professional={
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        <Caption text="Education" bw />
                        <h3 style={{ ...BANGERS, fontSize: "clamp(1.2rem, 2.2vw, 2rem)", lineHeight: 0.95, color: "#fff", textTransform: "uppercase", margin: 0 }}>
                            B.Tech Computer Science
                        </h3>
                        <p style={{ ...BOLD, fontSize: "clamp(9px, 0.9vw, 12px)", color: "#888", textTransform: "uppercase", letterSpacing: "0.2em", margin: 0 }}>
                            2022 – 2026<br />
                            Focused on software engineering, algorithms and full stack development.
                        </p>
                    </div>
                }
                fun={
                    <div style={{ background: FUN_GOLD, position: "absolute", inset: 0, padding: "22px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "8px" }}>
                        <h3 style={{ ...BANGERS, fontSize: "clamp(1.1rem, 2vw, 1.8rem)", lineHeight: 1, color: "#000", textTransform: "uppercase", margin: 0, textShadow: `2px 2px 0 ${FUN_RED}` }}>
                            Quest Log<br />Updated!
                        </h3>
                        <p style={{ ...BOLD, fontSize: "clamp(9px, 0.9vw, 11px)", color: FUN_RED, textTransform: "uppercase", margin: 0 }}>
                            Side quests: Assignments<br />
                            Boss fights: Deadlines<br />
                            XP gained: Debugging skills
                        </p>
                    </div>
                }
            />

            {/* ── Panel 4: Quote accent ── */}
            <Panel
                style={{ gridColumn: "2 / 3", gridRow: "2 / 3", background: PRO_BG }}
                professional={
                    <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: "6px", height: "100%", justifyContent: "center" }}>
                        <div style={{ ...bwHalftone, position: "absolute", inset: 0, opacity: 0.5 }} />
                        <blockquote style={{
                            ...BANGERS,
                            fontSize: "clamp(1rem, 1.8vw, 1.6rem)", lineHeight: 1.05,
                            color: PRO_INK, textTransform: "uppercase", margin: 0,
                            borderLeft: `6px solid ${PRO_INK}`,
                            paddingLeft: "12px", position: "relative",
                        }}>
                            "Building reliable systems while crafting clean and engaging digital experiences."
                        </blockquote>
                    </div>
                }
                fun={
                    <div style={{ background: FUN_RED, position: "absolute", inset: 0, padding: "22px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "8px", overflow: "hidden" }}>
                        <div style={{ ...colourHalftone, position: "absolute", inset: 0, opacity: 0.3 }} />
                        <p style={{ ...BANGERS, fontSize: "clamp(1rem, 1.8vw, 1.7rem)", color: FUN_GOLD, textTransform: "uppercase", margin: 0, textShadow: "2px 2px 0 #000", position: "relative", lineHeight: 1.1 }}>
                            Turning caffeine into code since 2022.
                        </p>
                    </div>
                }
            />

            {/* ── Panel 5: Bottom attribute strip ── */}
            <Panel
                style={{ gridColumn: "1 / -1", gridRow: "3 / 4", background: PRO_INK }}
                professional={
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
                        <p style={{ ...BANGERS, fontSize: "clamp(1rem, 2.5vw, 2rem)", color: "#fff", textTransform: "uppercase", margin: 0, letterSpacing: "0.06em" }}>
                            Moradabad, Uttar Pradesh · India
                        </p>
                        <p style={{ ...BOLD, fontSize: "clamp(9px, 0.9vw, 12px)", color: "#777", textTransform: "uppercase", letterSpacing: "0.25em", margin: 0 }}>
                            Full Stack Web Developer
                        </p>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                            {["Problem Solver", "Quick Learner", "Builder"].map(tag => (
                                <span key={tag} style={{
                                    border: `2px solid #fff`, color: "#fff",
                                    padding: "2px 10px",
                                    fontSize: "clamp(8px, 0.8vw, 10px)",
                                    textTransform: "uppercase", letterSpacing: "0.2em",
                                    ...BOLD,
                                }}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                }
                fun={
                    <div style={{ background: FUN_RED, position: "absolute", inset: 0, padding: "22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", overflow: "hidden" }}>
                        <SpeedLines color="rgba(255,255,255,0.05)" />
                        <p style={{ ...BANGERS, fontSize: "clamp(1rem, 2.8vw, 2.2rem)", color: FUN_GOLD, textTransform: "uppercase", margin: 0, textShadow: "3px 3px 0 #000", position: "relative" }}>
                            Certified Bug Hunter
                        </p>
                        <div style={{ position: "relative" }}>
                            <Ono text="POW!" rotate={-8} bg="#fff" color={FUN_RED} />
                        </div>
                    </div>
                }
            />
        </div>
    );
}

// ─── PAGE 2 – THE JOURNEY ─────────────────────────────────────────────────────
// Grid:  [col: 0.85fr | 1.5fr | 0.85fr]  ×  [row: 1.3fr | 1fr]
//   p1(col1,r1)  |  p2(col2,r1)  |  p3(col3,r1)
//   p4(col1-2,r2)              |  p5(col3,r2)
function PageTwo() {
    return (
        <div style={{
            width: "100%", height: "100%",
            padding: GUTTER, boxSizing: "border-box",
            display: "grid",
            gridTemplateColumns: "0.85fr 1.5fr 0.85fr",
            gridTemplateRows: "1.3fr 1fr",
            gap: GUTTER,
            overflow: "hidden",
            background: PRO_BG,
        }}>

            {/* ── Panel 1: Philosophy ── */}
            <Panel
                style={{ gridColumn: "1 / 2", gridRow: "1 / 2", background: PRO_INK }}
                professional={
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", height: "100%", justifyContent: "center" }}>
                        <Caption text="The Journey" bw />
                        <h3 style={{ ...BANGERS, fontSize: "clamp(1.3rem, 2.5vw, 2.6rem)", lineHeight: 0.95, color: "#fff", textTransform: "uppercase", margin: 0 }}>
                            Code is the<br />Invisible<br />Architecture.
                        </h3>
                        {/* B&W accent bar */}
                        <div style={{ width: "40px", height: "4px", background: "#fff", marginTop: "4px" }} />
                    </div>
                }
                fun={
                    <div style={{ background: FUN_RED, position: "absolute", inset: 0, padding: "22px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "10px", overflow: "hidden" }}>
                        <SpeedLines color="rgba(255,255,255,0.05)" />
                        <Caption text="Developer Philosophy" bw={false} />
                        <h3 style={{ ...BANGERS, fontSize: "clamp(1.3rem, 2.5vw, 2.6rem)", lineHeight: 0.95, color: FUN_GOLD, textTransform: "uppercase", margin: 0, textShadow: "3px 3px 0 #000", position: "relative" }}>
                            If it compiles,<br />ship it.
                        </h3>
                        <div style={{ width: "60px", height: "4px", background: FUN_GOLD, marginTop: "4px", position: "relative" }} />
                    </div>
                }
            />

            {/* ── Panel 2: Skills (wide centre) ── */}
            <Panel
                style={{ gridColumn: "2 / 3", gridRow: "1 / 2", background: PRO_BG }}
                professional={
                    <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: "12px", height: "100%", justifyContent: "center" }}>
                        <div style={{ ...bwHalftone, position: "absolute", inset: 0, opacity: 0.55 }} />
                        <Caption text="Field Observations · Intel Report" bw />
                        <h3 style={{ ...BANGERS, fontSize: "clamp(1.5rem, 3vw, 3rem)", lineHeight: 0.95, color: PRO_INK, textTransform: "uppercase", margin: 0, position: "relative" }}>
                            Arsenal<br />&amp; Skills
                        </h3>
                        {/* B&W skill tags */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", position: "relative" }}>
                            {["HTML", "CSS", "JavaScript", "React", "Node.js", "Express", "MongoDB", "REST APIs", "Git", "UI/UX"].map(s => (
                                <span key={s} style={{
                                    border: `3px solid ${PRO_INK}`,
                                    background: PRO_TAG_BG,
                                    color: PRO_INK,
                                    padding: "3px 10px",
                                    fontSize: "clamp(9px, 0.9vw, 12px)",
                                    textTransform: "uppercase", letterSpacing: "0.15em",
                                    boxShadow: `2px 2px 0 ${PRO_INK}`,
                                    ...BOLD,
                                }}>
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>
                }
                fun={
                    <div style={{ background: FUN_DARK, position: "absolute", inset: 0, padding: "22px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "10px", overflow: "hidden" }}>
                        <Caption text="Rank: MERN Specialist" bw={false} />
                        <h3 style={{ ...BANGERS, fontSize: "clamp(1.5rem, 3vw, 3rem)", lineHeight: 0.95, color: FUN_GOLD, textTransform: "uppercase", margin: 0, textShadow: `4px 4px 0 ${FUN_RED}` }}>
                            Full Stack<br />Builder
                        </h3>
                        {/* Coloured skill tags */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                            {["HTML", "CSS", "JavaScript", "React", "Node.js", "Express", "MongoDB", "REST APIs", "Git", "UI/UX"].map(s => (
                                <span key={s} style={{
                                    border: `2px solid ${FUN_RED}`,
                                    background: FUN_RED,
                                    color: FUN_GOLD,
                                    padding: "3px 10px",
                                    fontSize: "clamp(9px, 0.9vw, 12px)",
                                    textTransform: "uppercase", letterSpacing: "0.1em",
                                    boxShadow: `2px 2px 0 ${FUN_GOLD}`,
                                    ...BOLD,
                                }}>
                                    {s}
                                </span>
                            ))}
                        </div>
                        <div style={{ position: "absolute", bottom: "14px", right: "14px" }}>
                            <Starburst text={"POWER\nUP!"} size={68} bg={FUN_RED} />
                        </div>
                    </div>
                }
            />

            {/* ── Panel 3: Projects ── */}
            <Panel
                style={{ gridColumn: "3 / 4", gridRow: "1 / 2", background: PRO_INK }}
                professional={
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", height: "100%", justifyContent: "center" }}>
                        <Caption text="Projects" bw />
                        <h3 style={{ ...BANGERS, fontSize: "clamp(1.1rem, 2vw, 2rem)", lineHeight: 0.95, color: "#fff", textTransform: "uppercase", margin: 0 }}>
                            Shipped<br />Work
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            {["RoomWati – MERN rental platform", "Feelit – Web music player", "AstraLock – Browser security extension"].map(p => (
                                <p key={p} style={{
                                    ...BOLD,
                                    fontSize: "clamp(9px, 0.9vw, 11px)",
                                    color: "#ccc", margin: 0,
                                    textTransform: "uppercase", letterSpacing: "0.1em",
                                    borderLeft: "3px solid #fff",
                                    paddingLeft: "8px",
                                }}>
                                    {p}
                                </p>
                            ))}
                        </div>
                    </div>
                }
                fun={
                    <div style={{ background: FUN_GOLD, position: "absolute", inset: 0, padding: "22px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "8px", overflow: "hidden" }}>
                        <h3 style={{ ...BANGERS, fontSize: "clamp(1.1rem, 2vw, 2rem)", lineHeight: 1, color: "#000", textTransform: "uppercase", margin: 0, textShadow: `2px 2px 0 ${FUN_RED}` }}>
                            Boss Fights<br />Completed!
                        </h3>
                        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                            {["✓ Authentication", "✓ REST APIs", "✓ Debugging Chaos"].map(p => (
                                <p key={p} style={{ ...BOLD, fontSize: "clamp(9px, 0.9vw, 11px)", color: FUN_RED, margin: 0, textTransform: "uppercase" }}>
                                    {p}
                                </p>
                            ))}
                        </div>
                    </div>
                }
            />

            {/* ── Panel 4: Future Vision (wide bottom-left) ── */}
            <Panel
                style={{ gridColumn: "1 / 3", gridRow: "2 / 3", background: PRO_BG }}
                professional={
                    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px", height: "100%" }}>
                        <SpeedLines color="rgba(0,0,0,0.04)" />
                        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: "8px" }}>
                            <Caption text="Future Vision · Mission Log" bw />
                            <h3 style={{ ...BANGERS, fontSize: "clamp(1.5rem, 3vw, 3rem)", lineHeight: 0.95, color: PRO_INK, textTransform: "uppercase", margin: 0 }}>
                                Aiming to launch my own<br />application before 30.
                            </h3>
                        </div>
                        {/* B&W delivery stamp */}
                        <div style={{ flexShrink: 0 }}>
                            <div style={{
                                border: `5px solid ${PRO_INK}`, background: "#fff",
                                width: "clamp(72px, 8vw, 100px)", height: "clamp(72px, 8vw, 100px)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                textAlign: "center", transform: "rotate(3deg)",
                                boxShadow: `5px 5px 0 ${PRO_INK}`,
                            }}>
                                <span style={{ ...BANGERS, fontSize: "clamp(18px, 2vw, 28px)", lineHeight: 1, color: PRO_INK, textTransform: "uppercase" }}>
                                    MISSION:<br />&lt;30
                                </span>
                            </div>
                        </div>
                    </div>
                }
                fun={
                    <div style={{ background: FUN_DARK, position: "absolute", inset: 0, padding: "22px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px", overflow: "hidden" }}>
                        <SpeedLines color="rgba(255,255,255,0.04)" />
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", position: "relative" }}>
                            <Caption text="Final Boss" bw={false} />
                            <h3 style={{ ...BANGERS, fontSize: "clamp(1.5rem, 3vw, 3rem)", lineHeight: 0.95, color: FUN_GOLD, textTransform: "uppercase", margin: 0, textShadow: `4px 4px 0 ${FUN_RED}` }}>
                                Build something<br />unforgettable.
                            </h3>
                        </div>
                        <div style={{ position: "relative", flexShrink: 0 }}>
                            <Ono text="BOOM!" rotate={-8} bg={FUN_RED} color={FUN_GOLD} />
                        </div>
                    </div>
                }
            />

            {/* ── Panel 5: Year accent (bottom-right) ── */}
            <Panel
                style={{ gridColumn: "3 / 4", gridRow: "2 / 3", background: PRO_BG }}
                professional={
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center" }}>
                        <div style={{ ...bwHalftone, position: "absolute", inset: 0, opacity: 0.5 }} />
                        <div style={{ ...BANGERS, fontSize: "clamp(2rem, 4vw, 3.5rem)", color: PRO_INK, lineHeight: 1, textTransform: "uppercase", position: "relative" }}>
                            2026
                        </div>
                        <p style={{ ...BOLD, fontSize: "clamp(8px, 0.8vw, 10px)", color: PRO_MUTE, textTransform: "uppercase", letterSpacing: "0.25em", margin: 0, position: "relative" }}>
                            Final Year · Computer Science
                        </p>
                        <div style={{ width: "32px", height: "3px", background: PRO_INK, margin: "4px auto 0", position: "relative" }} />
                    </div>
                }
                fun={
                    <div style={{ background: FUN_RED, position: "absolute", inset: 0, padding: "22px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", overflow: "hidden", textAlign: "center" }}>
                        <Starburst text={"NO\nSTOP!"} size={80} bg={FUN_GOLD} />
                        <p style={{ ...BOLD, fontSize: "clamp(8px, 0.8vw, 10px)", color: "#fff", textTransform: "uppercase", letterSpacing: "0.2em", margin: 0 }}>
                            Still grinding commits.
                        </p>
                    </div>
                }
            />
        </div>
    );
}

// ─── Root Export ───────────────────────────────────────────────────────────────
export default function AboutSection() {
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    });

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
    const [pageIndex, setPageIndex] = useState(0);

    useEffect(() => {
        return scrollYProgress.on("change", v => setPageIndex(v > 0.45 ? 1 : 0));
    }, [scrollYProgress]);

    const HeaderBar = ({ vol }: { vol: "I" | "II" }) => (
        <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "44px",
            background: "#000",
            display: "flex", alignItems: "center",
            padding: "0 20px", justifyContent: "space-between",
            zIndex: 10, flexShrink: 0,
        }}>
            <span style={{ ...BANGERS, color: "#fff", fontSize: "clamp(12px, 1.4vw, 16px)", letterSpacing: "0.25em", textTransform: "uppercase" }}>
                {vol === "I" ? "The Origin" : "The Journey"}
            </span>
            <span style={{ ...BOLD, color: "#fff", fontSize: "clamp(9px, 0.9vw, 11px)", letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.5 }}>
                Vol.{vol} · 2026 · Shourya Singh
            </span>
        </div>
    );

    return (
        <section
            id="about"
            ref={containerRef}
            style={{ height: "300vh", background: PRO_BG, position: "relative", zIndex: 20 }}
        >
            <div style={{ position: "sticky", top: 0, height: "100vh", width: "100%", overflow: "hidden" }}>

                <motion.div style={{ x, display: "flex", width: "200vw", height: "100%" }}>

                    {/* ── Page 1 ── */}
                    <div style={{ width: "100vw", height: "100%", flexShrink: 0, overflow: "hidden", background: PRO_BG, position: "relative" }}>
                        <HeaderBar vol="I" />
                        <div style={{ paddingTop: "44px", height: "100%", boxSizing: "border-box", overflow: "hidden" }}>
                            <PageOne />
                        </div>
                    </div>

                    {/* ── Page 2 ── */}
                    <div style={{ width: "100vw", height: "100%", flexShrink: 0, overflow: "hidden", background: PRO_BG, position: "relative" }}>
                        <HeaderBar vol="II" />
                        <div style={{ paddingTop: "44px", height: "100%", boxSizing: "border-box", overflow: "hidden" }}>
                            <PageTwo />
                        </div>
                    </div>

                </motion.div>

                {/* Navigation dots */}
                <div style={{
                    position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)",
                    zIndex: 50, display: "flex", alignItems: "center", gap: "36px", pointerEvents: "none",
                }}>
                    {["The Origin", "The Journey"].map((label, i) => (
                        <div key={label} style={{
                            display: "flex", flexDirection: "column", alignItems: "center", gap: "5px",
                            transition: "all 0.3s ease",
                            opacity: pageIndex === i ? 1 : 0.3,
                            transform: pageIndex === i ? "scale(1.1)" : "scale(0.9)",
                        }}>
                            <span style={{ fontSize: "8px", fontWeight: 900, letterSpacing: "0.3em", textTransform: "uppercase", color: "#000", fontFamily: "'Arial Black', sans-serif" }}>
                                {label}
                            </span>
                            <div style={{ width: "44px", height: "5px", background: "#000", borderRadius: "2px", boxShadow: "3px 3px 0 rgba(0,0,0,0.2)" }} />
                        </div>
                    ))}
                </div>

                {/* Scroll hint */}
                <motion.div style={{
                    opacity: useTransform(scrollYProgress, [0, 0.15], [0.6, 0]),
                    position: "absolute", right: "24px", top: "50%", y: "-50%",
                    zIndex: 50, display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", pointerEvents: "none",
                }}>
                    <span style={{ fontSize: "8px", fontWeight: 900, letterSpacing: "0.2em", writingMode: "vertical-lr", color: "#000", textTransform: "uppercase", fontFamily: "'Arial Black', sans-serif" }}>
                        Scroll Down
                    </span>
                    <div style={{ width: "1px", height: "44px", background: "#000" }} />
                </motion.div>

            </div>
        </section>
    );
}
