"use client";

import { Orbitron } from "next/font/google";
import { useEffect, useState } from "react";
import DroneModel from "./DroneModel";

const orbitron = Orbitron({
    weight: ["400", "700"],
    subsets: ["latin"],
});

const THAMBI = {
    id: "01",
    codename: "THAMBI",
    tagline: "RESTAURANT DELIVERY AUTOMATION",
    category: "HOSPITALITY ROBOTICS",
    status: "DEPLOYED",
    year: "2024",
    description:
        "THAMBI is an autonomous indoor delivery robot engineered for restaurant environments. It navigates dynamic floor layouts, avoids obstacles in real time, and delivers food to tables with zero human intervention — reducing delivery time by 60% and operational overhead significantly.",
    specs: [
        { label: "NAVIGATION", value: "LIDAR + DEPTH CAM FUSION" },
        { label: "PAYLOAD", value: "UP TO 5 KG" },
        { label: "BATTERY", value: "8 HRS CONTINUOUS" },
        { label: "OBSTACLE AVOID", value: "360° REAL-TIME" },
        { label: "CONNECTIVITY", value: "LAN / CLOUD SYNC" },
        { label: "AI VERSION", value: "V4.2" },
    ],
    tags: ["AI NAVIGATION", "AUTONOMOUS", "INDOOR", "ZERO EMISSIONS"],
};

export default function WorksSection({
    scrollProgress = 1,
    isExiting = false,
}: {
    scrollProgress?: number;
    isExiting?: boolean;
}) {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [hovered, setHovered] = useState(false);
    const [vw, setVw] = useState(1440);
    const [vh, setVh] = useState(900);

    // Track window size for drone position math
    useEffect(() => {
        const update = () => { setVw(window.innerWidth); setVh(window.innerHeight); };
        update();
        window.addEventListener('resize', update);
        return () => window.removeEventListener('resize', update);
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const droneX = window.innerWidth - 100;
            const droneY = 100;
            const deltaX = e.clientX - droneX;
            const deltaY = e.clientY - droneY;
            const rotY = (deltaX / window.innerWidth) * 1.5;
            const rotX = (deltaY / window.innerHeight) * 1.2;
            setMousePos({ x: rotY, y: rotX });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    // ── EXIT ANIMATION (Works → Home) ─────────────────────────────────────────
    // exitT: 0 when fully on Works (scrollProgress=1), 1 when blackout peak (scrollProgress=0.5)
    const exitT = isExiting
        ? Math.max(0, Math.min(1, (1 - scrollProgress) / 0.5))
        : 0;
    // Ease-out cubic: slow deceleration as drone lands at center
    const exitEased = 1 - Math.pow(1 - exitT, 3);

    // Drone container size grows from 400 → Full Screen to prevent clipping during dive
    const droneW = 400 + exitEased * (vw - 400);
    const droneH = 400 + exitEased * (vh - 400);

    // Position: anchored top-left=0,0, then translated
    // At exitT=0: sits top-right (right:-80, top:-60)
    //   tx0 = vw - 400 + 80 = vw - 320
    // At exitT=1: centered/full screen
    //   tx1 = 0, ty1 = 0
    const tx0 = vw - 320;
    const ty0 = -60;
    const tx = tx0 + exitEased * (0 - tx0);
    const ty = ty0 + exitEased * (0 - ty0);

    return (
        <section
            id="works"
            style={{
                minHeight: "100vh",
                padding: "140px 80px 100px",
                display: "flex",
                flexDirection: "column",
                gap: "70px",
                position: "relative",
                zIndex: 5,
                background: "transparent",
            }}
        >
            {/* Peek-in Drone — flies to center during Works→Home exit */}
            <div style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: `${droneW}px`,
                height: `${droneW}px`,
                transform: `translate(${tx}px, ${ty}px)`,
                zIndex: 100,
                pointerEvents: "none",
                opacity: 0.85,
                mixBlendMode: "screen",
                transition: "none", // purely driven by exitT, no CSS easing
            }}>
                <DroneModel mode="follow" mousePos={mousePos} exitProgress={exitEased} />
            </div>

            {/* ── SECTION HEADING ─────────────────────── */}
            <div style={{ maxWidth: "1300px", width: "100%" }}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: "24px", marginBottom: "6px" }}>
                    <span style={{
                        fontFamily: "monospace",
                        fontSize: "11px",
                        color: "rgba(255,165,0,0.7)",
                        letterSpacing: "0.3em",
                        lineHeight: 1,
                    }}>
                        ◈  CUBOIC / WORKS
                    </span>
                </div>
                <h2
                    className={orbitron.className}
                    style={{
                        fontSize: "clamp(48px, 6vw, 80px)",
                        fontWeight: 800,
                        letterSpacing: "0.12em",
                        margin: "0 0 24px 0",
                        textTransform: "uppercase",
                        background: "linear-gradient(to right, #ffffff 30%, #666)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        lineHeight: 1,
                    }}
                >
                    WORKS
                </h2>
                <div style={{
                    height: "1px",
                    width: "100%",
                    background: "linear-gradient(to right, rgba(255,165,0,0.4), rgba(255,255,255,0.08), transparent)",
                }} />
            </div>

            {/* ── PROJECT CARD — THAMBI (Minimal) ────── */}
            <div
                style={{
                    maxWidth: "680px",
                    width: "100%",
                    border: `1px solid ${hovered ? "rgba(255,165,0,0.25)" : "rgba(255,255,255,0.07)"}`,
                    background: hovered ? "rgba(255,140,0,0.03)" : "rgba(255,255,255,0.015)",
                    backdropFilter: "blur(12px)",
                    padding: "32px 36px",
                    position: "relative",
                    cursor: "pointer",
                    transition: "border-color 0.4s ease, background 0.4s ease",
                }}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
            >
                {/* Index */}
                <span style={{
                    position: "absolute",
                    top: "14px",
                    right: "18px",
                    fontFamily: "monospace",
                    fontSize: "10px",
                    color: "rgba(255,255,255,0.15)",
                    letterSpacing: "0.2em",
                }}>01</span>

                {/* Name + badges */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                    <h3 className={orbitron.className} style={{
                        fontSize: "26px",
                        fontWeight: 800,
                        color: "white",
                        margin: 0,
                        letterSpacing: "0.08em",
                    }}>
                        THAMBI
                    </h3>
                    <span style={{
                        fontFamily: "monospace",
                        fontSize: "9px",
                        color: "rgba(255,165,0,0.75)",
                        border: "1px solid rgba(255,140,0,0.2)",
                        padding: "3px 10px",
                        letterSpacing: "0.2em",
                    }}>
                        HOSPITALITY
                    </span>
                    <span style={{
                        fontFamily: "monospace",
                        fontSize: "9px",
                        color: "rgba(80,255,120,0.75)",
                        border: "1px solid rgba(80,255,120,0.15)",
                        padding: "3px 10px",
                        letterSpacing: "0.2em",
                    }}>
                        ● DEPLOYED
                    </span>
                </div>

                {/* Divider */}
                <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", marginBottom: "20px" }} />

                {/* 3 key specs inline */}
                <div style={{ display: "flex", gap: "40px" }}>
                    {[
                        { label: "NAVIGATION", value: "LIDAR + AI" },
                        { label: "PAYLOAD", value: "5 KG" },
                        { label: "BATTERY", value: "8 HRS" },
                    ].map(s => (
                        <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <span style={{ fontFamily: "monospace", fontSize: "9px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.2em" }}>
                                {s.label}
                            </span>
                            <span style={{ fontFamily: "monospace", fontSize: "12px", color: "rgba(255,255,255,0.8)", letterSpacing: "0.1em" }}>
                                {s.value}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
