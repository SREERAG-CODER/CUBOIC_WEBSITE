"use client";

import { useState } from "react";
import { Anton } from "next/font/google";
import SpaceBackground from "@/components/spaceBackground";
import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";

const anton = Anton({
    weight: "400",
    subsets: ["latin"],
});

export default function Home() {
    const [loaded, setLoaded] = useState(false);

    return (
        <main style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
            {!loaded && <Preloader onComplete={() => setLoaded(true)} />}

            <SpaceBackground />
            <Navbar />

            <div style={{
                position: "absolute",
                top: "72px",
                left: 0,
                right: 0,
                zIndex: 1,
                opacity: loaded ? 1 : 0,
                transition: "opacity 0.6s ease",
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
        </main>
    );
}