"use client";

import { useState, useEffect, useRef } from "react";
import { Anton, Orbitron } from "next/font/google";
import SpaceBackground from "@/components/spaceBackground";
import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";
import DroneModel from "@/components/DroneModel";
import WorksSection from "@/components/WorksSection";
import GlobalFrame from "@/components/GlobalFrame";

const orbitron = Orbitron({ weight: ["400", "700"], subsets: ["latin"] });
const anton = Anton({ weight: "400", subsets: ["latin"] });

export default function Home() {
    const [loaded, setLoaded] = useState(false);
    const [viewSection, setViewSection] = useState<"home" | "works">("home");
    const [scrollAmount, setScrollAmount] = useState(0); // 0 to 1000
    const transitionActive = useRef(false);

    const scrollProgress = scrollAmount / 1000;

    // ── WHEEL HANDLER ───────────────────────────────────────────────
    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (transitionActive.current) return;

            const isMid = scrollAmount > 0 && scrollAmount < 1000;
            const isHomeStart = viewSection === "home" && scrollAmount === 0 && e.deltaY > 0;
            // Allow scrolling back from works regardless of native scroll position
            const isWorksBack = viewSection === "works" && scrollAmount === 1000 && e.deltaY < 0;

            if (isMid || isHomeStart || isWorksBack) {
                e.preventDefault();
                setScrollAmount(prev => {
                    const newVal = Math.max(0, Math.min(1000, prev + e.deltaY * 0.5));
                    if (newVal >= 990 && viewSection === "home") setViewSection("works");
                    if (newVal <= 10 && viewSection === "works") setViewSection("home");
                    return newVal;
                });
            }
        };

        window.addEventListener("wheel", handleWheel, { passive: false });
        return () => window.removeEventListener("wheel", handleWheel);
    }, [viewSection, scrollAmount]);

    // ── TOUCH HANDLER ───────────────────────────────────────────────
    const lastTouchY = useRef(0);
    useEffect(() => {
        const handleTouchStart = (e: TouchEvent) => { lastTouchY.current = e.touches[0].clientY; };
        const handleTouchMove = (e: TouchEvent) => {
            const touchY = e.touches[0].clientY;
            const deltaY = lastTouchY.current - touchY;

            const isMid = scrollAmount > 0 && scrollAmount < 1000;
            const isHomeStart = viewSection === "home" && scrollAmount === 0 && deltaY > 0;
            const isWorksBack = viewSection === "works" && scrollAmount === 1000 && deltaY < 0;

            if (isMid || isHomeStart || isWorksBack) {
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

    // ── NAVBAR NAVIGATION ───────────────────────────────────────────
    const navigateToSection = (section: string) => {
        if (transitionActive.current) return;
        transitionActive.current = true;

        const target = section === "Home" ? 0 : 1000;
        const start = scrollAmount;
        const startTime = performance.now();
        const duration = 1200;

        const animateNav = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const ease = progress < 0.5
                ? 16 * progress ** 5
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

    // Lock body scroll during the cinematic transition or while on home
    const isTransitioning = scrollAmount > 0 && scrollAmount < 1000;
    const lockBodyScroll = viewSection === "home" || isTransitioning;

    return (
        <main style={{
            position: "relative",
            width: "100%",
            minHeight: "100vh",
            overflowX: "hidden",
            overflowY: lockBodyScroll ? "hidden" : "auto",
            backgroundColor: "#000"
        }}>
            {!loaded && <Preloader onComplete={() => setLoaded(true)} />}

            <SpaceBackground />
            <GlobalFrame />
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
                opacity: Math.pow(Math.sin(scrollProgress * Math.PI), 2),
                transition: "opacity 0.1s linear"
            }} />

            {/* ── HERO SECTION ────────────────────────────────────────────
                Always position: fixed so it's immediately visible after preloader.
                It fades out as scrollProgress increases and is hidden on Works. */}
            <div style={{
                height: "100vh",
                width: "100%",
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 2,
                visibility: viewSection === "works" && scrollAmount >= 1000 ? "hidden" : "visible",
                opacity: 1 - scrollProgress * 2
            }}>
                {/* Giant background text - CUBOIC with scroll-driven letter drop */}
                <div style={{
                    position: "absolute",
                    top: "90px",
                    left: "50px",
                    right: "50px",
                    zIndex: 1,
                    opacity: loaded ? 1 : 0,
                    transition: "opacity 1s ease 0.5s",
                    pointerEvents: "none",
                }}>
                    <h1
                        className={orbitron.className}
                        style={{
                            fontSize: "20vw",
                            lineHeight: 0.85,
                            margin: 0,
                            textAlign: "center",
                            whiteSpace: "nowrap",
                            letterSpacing: "0.05em",
                            width: "100%",
                        }}
                    >
                        {(['C', 'U', 'B', 'O', 'I', 'C'] as const).map((letter, i) => {
                            // All letters drop simultaneously
                            const t = Math.max(0, Math.min(1, scrollProgress / 0.42));
                            // Ease-in-quint: slow start → fast drop (gravity feel)
                            const eased = t * t * t * t * t;
                            const translateY = eased * 130; // % of letter height
                            return (
                                <span
                                    key={i}
                                    style={{
                                        display: "inline-block",
                                        transform: `translateY(${translateY}%)`,
                                        background: "linear-gradient(to bottom, #ffffff, #da7c24ff)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                    }}
                                >
                                    {letter}
                                </span>
                            );
                        })}
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
                    <p className={orbitron.className} style={{ fontSize: "28px", color: "white", fontWeight: "bold", letterSpacing: "0.2em", margin: 0, background: "linear-gradient(to bottom, #ffffff, #f38702ff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                        THE FUTURE, DELIVERED
                    </p>
                </div>

                <div style={{
                    fontWeight: "bolder",
                    position: "absolute",
                    bottom: "335px",
                    right: "80px",
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

            {/* ── WORKS + NEXT SECTIONS ───────────────────────────────────
                No marginTop needed — hero is position:fixed so it doesn't
                affect document flow. Works content sits at Y=0 and is
                gated by opacity/pointerEvents. */}
            <div style={{
                position: "relative",
                zIndex: 3,
                opacity: scrollProgress > 0.5 ? (scrollProgress - 0.5) * 2 : 0,
                transition: "opacity 0.3s ease",
                pointerEvents: viewSection === "works" ? "auto" : "none",
            }}>
                <WorksSection />

                <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <h2 className={orbitron.className} style={{ color: "rgba(255,255,255,0.1)", fontSize: "40px", letterSpacing: "0.4em" }}>COMING SOON</h2>
                </div>
            </div>
        </main>
    );
}