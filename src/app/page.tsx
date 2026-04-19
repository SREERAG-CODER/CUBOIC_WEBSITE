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

import WorksSection from "@/components/WorksSection";
import { useEffect, useRef } from "react";

export default function Home() {
    const [loaded, setLoaded] = useState(false);
    const [viewSection, setViewSection] = useState<"home" | "works">("home");
    const [scrollAmount, setScrollAmount] = useState(0); // 0 to 1000 for transition
    const transitionActive = useRef(false);

    // Synchronized scroll progress (0 to 1)
    const scrollProgress = scrollAmount / 1000;

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (transitionActive.current) return;

            const isMid = scrollAmount > 0 && scrollAmount < 1000;
            const isHomeStart = viewSection === "home" && scrollAmount === 0 && e.deltaY > 0;
            const isWorksStart = viewSection === "works" && scrollAmount === 1000 && e.deltaY < 0 && window.scrollY <= 10;

            if (isMid || isHomeStart || isWorksStart) {
                setScrollAmount(prev => {
                    const newVal = Math.max(0, Math.min(1000, prev + e.deltaY * 0.5));
                    if (newVal >= 990 && viewSection === "home") setViewSection("works");
                    if (newVal <= 10 && viewSection === "works") setViewSection("home");
                    return newVal;
                });
            }
        };

        window.addEventListener("wheel", handleWheel, { passive: true });
        return () => window.removeEventListener("wheel", handleWheel);
    }, [viewSection, scrollAmount]);

    const navigateToSection = (section: string) => {
        if (transitionActive.current) return;
        transitionActive.current = true;

        const target = section === "Home" ? 0 : 1000;
        const start = scrollAmount;
        const startTime = performance.now();
        const duration = 1200; // ms

        const animateNav = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease-in-out quint
            const ease = progress < 0.5 
                ? 16 * progress * progress * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 5) / 2;

            const nextVal = start + (target - start) * ease;
            setScrollAmount(nextVal);

            if (progress < 1) {
                requestAnimationFrame(animateNav);
            } else {
                setScrollAmount(target);
                setViewSection(section === "Home" ? "home" : "works");
                transitionActive.current = false;
            }
        };

        requestAnimationFrame(animateNav);
    };

    // Simple touch handling
    const lastTouchY = useRef(0);
    useEffect(() => {
        const handleTouchStart = (e: TouchEvent) => { lastTouchY.current = e.touches[0].clientY; };
        const handleTouchMove = (e: TouchEvent) => {
            const touchY = e.touches[0].clientY;
            const deltaY = lastTouchY.current - touchY;
            
            const isMid = scrollAmount > 0 && scrollAmount < 1000;
            const isHomeStart = viewSection === "home" && scrollAmount === 0 && deltaY > 0;
            const isWorksStart = viewSection === "works" && scrollAmount === 1000 && deltaY < 0 && window.scrollY <= 10;

            if (isMid || isHomeStart || isWorksStart) {
                setScrollAmount(prev => {
                    const newVal = Math.max(0, Math.min(1000, prev + deltaY * 2));
                    if (newVal >= 990 && viewSection === "home") setViewSection("works");
                    if (newVal <= 10 && viewSection === "works") setViewSection("home");
                    return newVal;
                });
            }
            lastTouchY.current = touchY;
        };
        window.addEventListener("touchstart", handleTouchStart);
        window.addEventListener("touchmove", handleTouchMove, { passive: false });
        return () => {
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchmove", handleTouchMove);
        };
    }, [viewSection, scrollAmount]);

    return (
        <main style={{ 
            position: "relative", 
            width: "100%", 
            minHeight: "100vh", 
            overflowX: "hidden",
            overflowY: viewSection === "home" && scrollAmount < 1000 ? "hidden" : "auto",
            backgroundColor: "#000" 
        }}>
            {!loaded && <Preloader onComplete={() => setLoaded(true)} />}

            <SpaceBackground />
            <Navbar 
                onNavigate={navigateToSection} 
                activeSection={scrollAmount < 500 ? "Home" : "Works"} 
            />

            {/* Blackout Overlay for Transitions */}
            <div style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "black",
                zIndex: 40,
                pointerEvents: "none",
                opacity: Math.pow(Math.sin(scrollProgress * Math.PI), 2), // Peaks at 0.5 progress
                transition: "opacity 0.1s linear"
            }} />

            {/* HERO SECTION */}
            <div style={{ 
                height: "100vh", 
                width: "100%", 
                position: scrollAmount > 0 ? "fixed" : "relative", 
                top: 0, 
                left: 0, 
                zIndex: 2,
                visibility: viewSection === "home" || scrollAmount > 0 ? "visible" : "hidden",
                opacity: 1 - scrollProgress * 2 // Fade out as we dive
            }}>
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

                {/* Drone — passing scrollProgress for the cinematic dive */}
                <div style={{
                    position: "absolute",
                    top: "34vh",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 2,
                    opacity: loaded ? 1 : 0,
                    transition: "opacity 1.5s ease 0.8s",
                }}>
                    <DroneModel scrollProgress={scrollProgress} />
                </div>

                {/* Hero Subtext / Branding */}
                <div style={{
                    position: "absolute",
                    bottom: "30px",
                    left: "35px",
                    zIndex: 10,
                    opacity: loaded ? 1 - scrollProgress * 3 : 0,
                    transition: "opacity 0.8s ease",
                }}>
                    <p className={orbitron.className} style={{ fontSize: "28px", color: "white", fontWeight: "bold", letterSpacing: "0.2em", margin: 0, background: "linear-gradient(to bottom, #ffffff, #888888)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        THE FUTURE, DELIVERED
                    </p>
                </div>

                <div style={{
                    fontWeight: "bolder",
                    position: "absolute",
                    bottom: "250px",
                    right: "35px",
                    zIndex: 10,
                    opacity: loaded ? 1 - scrollProgress * 3 : 0,
                    transition: "opacity 0.8s ease",
                    fontFamily: "'Courier New', monospace",
                    textAlign: "right"
                }}>
                    <p style={{ fontSize: "17px", color: "rgba(255, 255, 255, 0.59)", letterSpacing: "0.05em", margin: "0 0 4px 0" }}>CREATING ROBOTIC SOLUTIONS</p>
                    <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.59)", letterSpacing: "0.05em", margin: 0 }}>TO REAL WORLD PROBLEMS</p>
                </div>
            </div>

            {/* NEXT SECTIONS CONTAINER */}
            <div style={{
                marginTop: viewSection === "home" ? "100vh" : "0",
                position: "relative",
                zIndex: 3,
                opacity: scrollProgress > 0.5 ? (scrollProgress - 0.5) * 2 : 0,
                transition: "opacity 0.3s ease"
            }}>
                <WorksSection />
                
                {/* Additional sections can follow here */}
                <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <h2 className={orbitron.className} style={{ color: "rgba(255,255,255,0.1)", fontSize: "40px", letterSpacing: "0.4em" }}>COMING SOON</h2>
                </div>
            </div>
        </main>
    );
}