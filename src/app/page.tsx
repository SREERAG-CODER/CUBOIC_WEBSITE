"use client";

import { useState } from "react";
import { Anton } from "next/font/google";
import SpaceBackground from "@/components/spaceBackground";
import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";
import DroneModel from "@/components/DroneModel";
import { Orbitron } from "next/font/google";

const orbitron = Orbitron({
    weight: ["400", "700"],
    subsets: ["latin"],
});

const anton = Anton({
    weight: "400",
    subsets: ["latin"],
});

export default function Home() {
    const [loaded, setLoaded] = useState(false);

    return (
        <main style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden", backgroundColor: "#000" }}>
            {!loaded && <Preloader onComplete={() => setLoaded(true)} />}

            <SpaceBackground />
            <Navbar />

            {/* Giant background text - CUBOIC */}
            <div style={{
                position: "absolute",
                top: "72px",
                left: 0,
                right: 0,
                zIndex: 1,
                opacity: loaded ? 1 : 0,
                transition: "opacity 1s ease 0.5s",
                pointerEvents: "none",
            }}>
                <h1
                    className={anton.className}
                    style={{
                        fontSize: "32vw",
                        lineHeight: 0.85,
                        color: "white",
                        margin: 0,
                        textAlign: "center",
                        whiteSpace: "nowrap",
                        letterSpacing: "0.1em",
                        width: "100%",
                    }}
                >
                    CUBOIC
                </h1>
            </div>

            {/* Drone — overlapping the bottom of the text, major part below */}
            <div style={{
                position: "absolute",
                top: "34vh", // Positioned lower to overlap only the bottom of the text
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 2,
                opacity: loaded ? 1 : 0,
                transition: "opacity 1.5s ease 0.8s",
            }}>
                <DroneModel />
            </div>

            {/* Hero Subtext */}
            <div style={{
                position: "absolute",
                bottom: "40px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 10,
                textAlign: "center",
                opacity: loaded ? 1 : 0,
                transition: "opacity 1s ease 1.5s",
            }}>

            </div>
            {/* Bottom Left Branding */}
            <div style={{
                position: "absolute",
                bottom: "30px",
                left: "35px",
                zIndex: 10,
                opacity: loaded ? 1 : 0,
                transition: "opacity 0.8s ease 1.2s",
            }}>
                <p
                    className={orbitron.className}
                    style={{
                        fontSize: "24px",
                        color: "white",
                        fontWeight: "bold",
                        letterSpacing: "0.2em",
                        margin: 0,
                        background: "linear-gradient(to bottom, #ffffff, #888888)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    THE FUTURE, DELIVERED
                </p>
            </div>

            {/* Bottom Right Brand Statement */}
            <div style={{
                fontWeight: "bolder",
                position: "absolute",
                bottom: "250px",
                right: "35px",
                zIndex: 10,
                opacity: loaded ? 1 : 0,
                transition: "opacity 0.8s ease 1.2s",
                fontFamily: "'Courier New', monospace",
                textAlign: "right"
            }}>
                <p style={{ fontSize: "17px", color: "rgba(255, 255, 255, 0.59)", letterSpacing: "0.05em", margin: "0 0 4px 0" }}>CREATING ROBOTIC SOLUTIONS</p>
                <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.59)", letterSpacing: "0.05em", margin: 0 }}>TO REAL WORLD PROBLEMS</p>
            </div>


        </main>
    );
}