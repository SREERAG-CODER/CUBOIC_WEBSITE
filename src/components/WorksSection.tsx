"use client";

import { Orbitron } from "next/font/google";
import { useEffect, useState } from "react";

const orbitron = Orbitron({
    weight: ["400", "700"],
    subsets: ["latin"],
});

const PROJECTS = [
    {
        id: "X-1",
        title: "THAMBI - FOOD DELIVERY ROBOT",
        category: "RESTRAUNT BASED",
        specs: ["FLIGHT TIME: 45M", "RANGE: 12KM", "AI NAVIGATION: V4.2"],
        description: "Next-gen aerial drone platform with integrated neural processing and carbon-fiber lattice structure."
    },

];

export default function WorksSection() {
    return (
        <section
            id="works"
            style={{
                minHeight: "100vh",
                padding: "120px 60px",
                display: "flex",
                flexDirection: "column",
                gap: "80px",
                position: "relative",
                zIndex: 5,
                background: "transparent",
            }}
        >
            <div style={{ maxWidth: "1200px" }}>
                <h2
                    className={orbitron.className}
                    style={{
                        fontSize: "64px",
                        color: "white",
                        letterSpacing: "0.15em",
                        margin: "0 0 20px 0",
                        textTransform: "uppercase",
                        background: "linear-gradient(to right, #fff, #444)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    WORKS
                </h2>
                <div style={{ height: "1px", width: "100%", background: "rgba(255,255,255,0.15)" }} />
            </div>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
                gap: "40px",
                maxWidth: "1400px"
            }}>
                {PROJECTS.map((project) => (
                    <div
                        key={project.id}
                        style={{
                            border: "1px solid rgba(255,255,255,0.08)",
                            padding: "40px",
                            background: "rgba(255,255,255,0.02)",
                            backdropFilter: "blur(10px)",
                            display: "flex",
                            flexDirection: "column",
                            gap: "24px",
                            transition: "border-color 0.3s, background 0.3s",
                            cursor: "pointer",
                            position: "relative",
                            overflow: "hidden"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                            e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                        }}
                    >
                        <div style={{ position: "absolute", top: 0, right: 0, padding: "12px", borderLeft: "1px solid rgba(255,255,255,0.1)", borderBottom: "1px solid rgba(255,255,255,0.1)", fontSize: "10px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>
                            REG_{project.id}
                        </div>

                        <div>
                            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.2em", fontFamily: "monospace" }}>
                                {project.category}
                            </span>
                            <h3 className={orbitron.className} style={{ fontSize: "28px", color: "white", margin: "8px 0", letterSpacing: "0.05em" }}>
                                {project.title}
                            </h3>
                        </div>

                        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: "1.6", fontFamily: "monospace" }}>
                            {project.description}
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            {project.specs.map(spec => (
                                <div key={spec} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <div style={{ width: "4px", height: "4px", background: "rgba(255,255,255,0.4)" }} />
                                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", fontFamily: "monospace" }}>{spec}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
