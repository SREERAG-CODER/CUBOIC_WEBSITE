import { Orbitron } from "next/font/google";
import { useEffect, useState } from "react";
import DroneModel from "./DroneModel";
import ProjectCard from "./ProjectCard";

const orbitron = Orbitron({
    weight: ["400", "700"],
    subsets: ["latin"],
});

const PROJECTS = [
    {
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
        ],
        tags: ["AI NAVIGATION", "AUTONOMOUS", "INDOOR", "ZERO EMISSIONS"],
    },


];

export default function WorksSection({
    scrollProgress = 1,
    isExiting = false,
}: {
    scrollProgress?: number;
    isExiting?: boolean;
}) {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
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
    const exitT = isExiting
        ? Math.max(0, Math.min(1, (1 - scrollProgress) / 0.5))
        : 0;
    const exitEased = 1 - Math.pow(1 - exitT, 3);

    const droneW = 400 + exitEased * (vw - 400);
    const tx0 = vw - 320;
    const ty0 = -60;
    const tx = tx0 + exitEased * (0 - tx0);
    const ty = ty0 + exitEased * (0 - ty0);

    return (
        <section
            id="works"
            style={{
                minHeight: "100vh",
                padding: "140px 80px 300px",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "70px",
                position: "relative",
                zIndex: 5,
                background: "transparent",
            }}
        >
            {/* Peek-in Drone */}
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

            {/* ── PROJECT LIST ────── */}
            <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "30px",
                maxWidth: "1300px",
                width: "100%",
            }}>
                {PROJECTS.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                ))}
            </div>
        </section>
    );
}
