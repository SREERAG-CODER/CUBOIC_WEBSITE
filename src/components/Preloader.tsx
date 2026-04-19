"use client";

import { useEffect, useState, useRef } from "react";

const BOOT_LINES = [
    "CUBOIC NAV-OS v4.2.1 — COLD START INITIATED",
    "► POWER CORE ONLINE...................[OK]",
    "► MEMORY BANKS 65536KB...............[OK]",
    "► NAVIGATION MATRIX LOADING..........[OK]",
    "► GYROSCOPE CALIBRATING..............[OK]",
    "► STAR MAP DATABASE...................[SYNC]",
    "► DEEP SPACE COMM ARRAY..............[ACTIVE]",
    "► LIFE SUPPORT SYSTEMS...............[NOMINAL]",
    "► THRUSTER BANKS.....................[STANDBY]",
    "► HULL INTEGRITY CHECK...............[100%]",
    "► ENCRYPTION KEY.....................[VERIFIED]",
    "► PROXIMITY SENSORS..................[ONLINE]",
    "► ALL SYSTEMS NOMINAL",
    "█ CUBOIC NAVIGATION SYSTEM — READY FOR LAUNCH",
];

const RING_TEXT =
    "PERFORMANCE·OPTIMIZATION · A/B·TESTING · CMS·INTEGRATION · APP·DESIGN · ANIMATION · PROJECT·STRATEGY · USABILITY·TESTING · UI · FRONT-END · BACK-END · INFORMATION·ARCHITECTURE · VISUAL·DESIGN · INTEGRATIONS · FRONT·2ND · BRAND·IDENTITY · CROSS·PLATFORM · UX·RESEARCH · GRAPHIC·DESIGN · INTERACTIVE·EXPERIENCE · ";

const COMPANY = "CUBOIC";

interface PreloaderProps {
    onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animRef = useRef<number>(0);
    const startTimeRef = useRef<number>(0);
    const [done, setDone] = useState(false);
    const [visibleLines, setVisibleLines] = useState<number[]>([]);
    const [bootStarted, setBootStarted] = useState(false);
    const [metrics, setMetrics] = useState({ cpu: 0, mem: 0, net: "SCAN", pwr: "SURGE" });

    // Start boot sequence after flicker
    useEffect(() => {
        const timer = setTimeout(() => setBootStarted(true), 700);
        return () => clearTimeout(timer);
    }, []);

    // Print boot lines one by one
    useEffect(() => {
        if (!bootStarted) return;
        BOOT_LINES.forEach((_, i) => {
            setTimeout(() => {
                setVisibleLines((prev) => [...prev, i]);
                setMetrics({
                    cpu: Math.min((i + 1) * 7, 87),
                    mem: Math.min((i + 1) * 4, 58),
                    net: i > 5 ? "LINKED" : "SCAN",
                    pwr: i > 2 ? "STABLE" : "SURGE",
                });
            }, i * 320);
        });
    }, [bootStarted]);

    // Canvas HUD animation
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d")!;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        startTimeRef.current = performance.now();

        const stars = Array.from({ length: 280 }, () => ({
            x: Math.random(),
            y: Math.random(),
            r: Math.random() * 1.2 + 0.2,
            o: Math.random() * 0.5 + 0.2,
        }));

        const draw = (now: number) => {
            const t = (now - startTimeRef.current) / 1000;
            const W = canvas.width;
            const H = canvas.height;
            const cx = W / 2;
            const cy = H / 2;

            ctx.clearRect(0, 0, W, H);
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, W, H);

            // Stars
            stars.forEach((s) => {
                ctx.beginPath();
                ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${s.o})`;
                ctx.fill();
            });

            // Scanlines
            for (let y = 0; y < H; y += 4) {
                ctx.fillStyle = "rgba(0,0,0,0.07)";
                ctx.fillRect(0, y, W, 1);
            }

            const TOTAL = 9.0;
            const p = Math.min(t / TOTAL, 1);

            const phase = (a: number, b: number) =>
                Math.max(0, Math.min(1, (t - a) / (b - a)));
            const ease = (x: number) =>
                x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;

            // Fade out at end
            const fadeOut = t > 7.5 ? 1 - (t - 7.5) / 1.2 : 1;
            ctx.globalAlpha = Math.max(0, fadeOut);

            const maxR = Math.min(W, H) * 0.38;
            const expandP = ease(phase(0.6, 2.6));

            // Crosshair lines
            ctx.save();
            ctx.strokeStyle = `rgba(255,255,255,${0.18 * expandP})`;
            ctx.lineWidth = 0.7;
            [0, 90, 180, 270].forEach((angle) => {
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate((angle * Math.PI) / 180);
                ctx.beginPath();
                ctx.moveTo(0, -maxR * 0.18 * expandP);
                ctx.lineTo(0, -maxR * 1.28 * expandP);
                ctx.stroke();
                ctx.restore();
            });
            ctx.restore();

            // Concentric rings
            const rings = [
                { r: maxR * 1.0, dashLen: 6, gapLen: 4, rot: t * 0.08, width: 0.7, opacity: 0.22 },
                { r: maxR * 0.82, dashLen: 0, gapLen: 0, rot: -t * 0.12, width: 0.6, opacity: 0.28 },
                { r: maxR * 0.60, dashLen: 8, gapLen: 6, rot: t * 0.18, width: 0.6, opacity: 0.20 },
                { r: maxR * 0.38, dashLen: 0, gapLen: 0, rot: 0, width: 0.8, opacity: 0.35 },
                { r: maxR * 0.20, dashLen: 4, gapLen: 4, rot: -t * 0.30, width: 0.5, opacity: 0.20 },
            ];

            rings.forEach(({ r, dashLen, gapLen, rot, width, opacity }, i) => {
                const rScale = ease(Math.max(0, Math.min(1, (t - 0.6 - i * 0.12) / 1.5)));
                if (rScale <= 0) return;
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(rot);
                ctx.beginPath();
                ctx.arc(0, 0, r * rScale, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255,255,255,${opacity * rScale})`;
                ctx.lineWidth = width;
                if (dashLen > 0) ctx.setLineDash([dashLen, gapLen]);
                else ctx.setLineDash([]);
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.restore();
            });

            // Tick marks on outer ring
            const outerR = maxR * expandP;
            if (outerR > 20) {
                ctx.save();
                ctx.translate(cx, cy);
                for (let i = 0; i < 72; i++) {
                    const angle = (i / 72) * Math.PI * 2 + t * 0.08;
                    const isMajor = i % 9 === 0;
                    ctx.save();
                    ctx.rotate(angle);
                    ctx.beginPath();
                    ctx.moveTo(0, -outerR);
                    ctx.lineTo(0, -outerR - (isMajor ? 14 : 6) * expandP);
                    ctx.strokeStyle = `rgba(255,255,255,${(isMajor ? 0.35 : 0.15) * expandP})`;
                    ctx.lineWidth = isMajor ? 0.8 : 0.5;
                    ctx.stroke();
                    ctx.restore();
                }
                ctx.restore();
            }

            // Rotating ring text
            const textPhase = phase(1.4, 3.2);
            if (textPhase > 0 && expandP > 0.3) {
                ctx.save();
                ctx.globalAlpha = Math.max(0, fadeOut) * textPhase * expandP;
                ctx.translate(cx, cy);
                ctx.rotate(t * 0.06);
                ctx.font = `${Math.max(7, W * 0.007)}px 'Courier New', monospace`;
                ctx.fillStyle = "rgba(255,255,255,0.35)";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                const fullText = RING_TEXT.repeat(3);
                for (let i = 0; i < fullText.length; i++) {
                    const angle = (i / fullText.length) * Math.PI * 2;
                    const r2 = maxR * 0.94 * expandP;
                    ctx.save();
                    ctx.rotate(angle);
                    ctx.translate(0, -r2);
                    ctx.rotate(Math.PI / 2);
                    ctx.fillText(fullText[i], 0, 0);
                    ctx.restore();
                }
                ctx.restore();
                ctx.globalAlpha = Math.max(0, fadeOut);
            }

            // Inner arc segments
            const arcPhase = ease(phase(1.0, 2.8));
            if (arcPhase > 0) {
                [
                    { r: maxR * 0.74, start: 0.10, end: 0.38, dir: 1 },
                    { r: maxR * 0.74, start: 0.60, end: 0.88, dir: 1 },
                    { r: maxR * 0.52, start: 0.05, end: 0.45, dir: -1 },
                    { r: maxR * 0.52, start: 0.55, end: 0.95, dir: -1 },
                ].forEach(({ r, start, end, dir }) => {
                    ctx.save();
                    ctx.translate(cx, cy);
                    ctx.rotate(dir * t * 0.15);
                    ctx.beginPath();
                    ctx.arc(
                        0, 0, r * expandP,
                        start * Math.PI * 2,
                        (start + (end - start) * arcPhase) * Math.PI * 2
                    );
                    ctx.strokeStyle = `rgba(255,255,255,${0.25 * arcPhase * expandP})`;
                    ctx.lineWidth = 1.2;
                    ctx.stroke();
                    ctx.restore();
                });
            }

            // Centre: company name typing
            const typeP = phase(2.2, 5.2);
            const charsToShow = Math.floor(typeP * COMPANY.length);
            const displayText = COMPANY.slice(0, charsToShow);

            if (charsToShow > 0) {
                const fontSize = Math.max(18, W * 0.028);
                ctx.save();
                ctx.font = `bold ${fontSize}px 'Courier New', monospace`;
                ctx.fillStyle = `rgba(255,255,255,${Math.min(1, typeP * 3)})`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(displayText, cx, cy);
                if (charsToShow < COMPANY.length) {
                    const textW = ctx.measureText(displayText).width;
                    if (Math.sin(t * 8) > 0) {
                        ctx.fillStyle = "rgba(255,255,255,0.8)";
                        ctx.fillRect(cx + textW / 2 + 4, cy - fontSize * 0.5, 2, fontSize);
                    }
                }
                ctx.restore();
            }

            // Centre dot
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx, cy, 2.5 * expandP, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255,255,255,${0.6 * expandP})`;
            ctx.fill();
            ctx.restore();

            // HUD corner text
            const hudP = phase(0.4, 1.4);
            if (hudP > 0) {
                ctx.save();
                ctx.globalAlpha = Math.max(0, fadeOut) * hudP;
                ctx.font = `${Math.max(8, W * 0.0072)}px 'Courier New', monospace`;
                ctx.fillStyle = "rgba(255,255,255,0.3)";
                ctx.textAlign = "left";
                ctx.fillText("SYS: CUBOIC NAV-OS v4.2.1", W * 0.03, H * 0.05);
                ctx.fillText(`INIT: ${Math.min(100, Math.floor(p * 108))}%`, W * 0.03, H * 0.05 + 16);
                ctx.textAlign = "right";
                const now2 = new Date();
                ctx.fillText(
                    `${now2.getHours().toString().padStart(2, "0")}:${now2.getMinutes().toString().padStart(2, "0")}:${now2.getSeconds().toString().padStart(2, "0")}`,
                    W * 0.97, H * 0.05
                );
                ctx.fillText("SEC: ALPHA-7  |  ID: CBQ-001", W * 0.97, H * 0.05 + 16);
                ctx.restore();
                ctx.globalAlpha = Math.max(0, fadeOut);
            }

            // Bottom progress bar
            const progressP = phase(0.8, 7.0);
            if (progressP > 0) {
                ctx.save();
                ctx.globalAlpha = Math.max(0, fadeOut) * Math.min(1, progressP * 3);
                const barW = W * 0.35;
                const barX = cx - barW / 2;
                const barY = cy + maxR * 1.2;
                ctx.fillStyle = "rgba(255,255,255,0.08)";
                ctx.fillRect(barX, barY, barW, 1);
                ctx.fillStyle = "rgba(255,255,255,0.55)";
                ctx.fillRect(barX, barY, barW * Math.min(1, progressP), 1);
                ctx.font = `${Math.max(7, W * 0.007)}px 'Courier New', monospace`;
                ctx.fillStyle = "rgba(255,255,255,0.25)";
                ctx.textAlign = "center";
                ctx.fillText(
                    `LOADING SYSTEMS — ${Math.min(100, Math.floor(progressP * 100))}%`,
                    cx, barY + 14
                );
                ctx.restore();
                ctx.globalAlpha = Math.max(0, fadeOut);
            }

            if (t >= TOTAL) {
                ctx.globalAlpha = 1;
                setDone(true);
                return;
            }

            animRef.current = requestAnimationFrame(draw);
        };

        animRef.current = requestAnimationFrame(draw);
        return () => {
            cancelAnimationFrame(animRef.current);
            window.removeEventListener("resize", resize);
        };
    }, []);

    useEffect(() => {
        if (done) onComplete();
    }, [done]);

    if (done) return null;

    const maxVisible = visibleLines.length > 0 ? Math.max(...visibleLines) : -1;

    return (
        <div style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "#000", overflow: "hidden",
        }}>
            {/* Canvas HUD */}
            <canvas
                ref={canvasRef}
                style={{ display: "block", width: "100%", height: "100%" }}
            />

            {/* Boot log — bottom left */}
            <div style={{
                position: "absolute",
                bottom: "72px",
                left: "48px",
                zIndex: 10,
                pointerEvents: "none",
            }}>
                {BOOT_LINES.map((line, i) => (
                    <div key={i} style={{
                        fontSize: "9px",
                        letterSpacing: "0.1em",
                        lineHeight: "1.9",
                        fontFamily: "'Courier New', monospace",
                        color: i === BOOT_LINES.length - 1
                            ? "rgba(255,255,255,0.85)"
                            : "rgba(255,255,255,0.35)",
                        fontWeight: i === BOOT_LINES.length - 1 ? "bold" : "normal",
                        opacity: visibleLines.includes(i) ? 1 : 0,
                        transform: visibleLines.includes(i) ? "translateX(0)" : "translateX(-6px)",
                        transition: "opacity 0.15s ease, transform 0.15s ease",
                        whiteSpace: "nowrap",
                    }}>
                        {line}
                        {i === maxVisible && i !== BOOT_LINES.length - 1 && (
                            <span style={{ animation: "blink 0.6s step-end infinite" }}>█</span>
                        )}
                    </div>
                ))}
            </div>

            {/* Metrics — bottom right */}
            <div style={{
                position: "absolute",
                bottom: "72px",
                right: "48px",
                zIndex: 10,
                pointerEvents: "none",
                display: "grid",
                gridTemplateColumns: "repeat(2, 64px)",
                gap: "10px 24px",
                textAlign: "right",
            }}>
                {[
                    { label: "CPU", val: `${metrics.cpu}%` },
                    { label: "MEM", val: `${metrics.mem}%` },
                    { label: "NET", val: metrics.net },
                    { label: "PWR", val: metrics.pwr },
                ].map(({ label, val }) => (
                    <div key={label} style={{ fontFamily: "'Courier New', monospace" }}>
                        <div style={{
                            fontSize: "8px",
                            letterSpacing: "0.14em",
                            color: "rgba(255,255,255,0.2)",
                            marginBottom: "2px",
                        }}>
                            {label}
                        </div>
                        <div style={{
                            fontSize: "9px",
                            letterSpacing: "0.1em",
                            color: "rgba(255,255,255,0.55)",
                        }}>
                            {val}
                        </div>
                    </div>
                ))}
            </div>

            {/* System status dots — bottom center */}
            <div style={{
                position: "absolute",
                bottom: "32px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 10,
                pointerEvents: "none",
                display: "flex",
                gap: "24px",
                alignItems: "center",
            }}>
                {["NAV", "COMM", "LIFE", "PROP", "ENC"].map((sys, i) => (
                    <div key={sys} style={{
                        display: "flex", alignItems: "center", gap: "6px",
                        fontFamily: "'Courier New', monospace",
                    }}>
                        <div style={{
                            width: 4, height: 4, borderRadius: "50%",
                            background: visibleLines.length > i * 2
                                ? "rgba(255,255,255,0.75)"
                                : "rgba(255,255,255,0.12)",
                            boxShadow: visibleLines.length > i * 2
                                ? "0 0 5px rgba(255,255,255,0.4)"
                                : "none",
                            transition: "all 0.4s ease",
                        }} />
                        <span style={{
                            fontSize: "8px",
                            letterSpacing: "0.14em",
                            color: visibleLines.length > i * 2
                                ? "rgba(255,255,255,0.4)"
                                : "rgba(255,255,255,0.15)",
                            transition: "color 0.4s ease",
                        }}>
                            {sys}
                        </span>
                    </div>
                ))}
            </div>

            <style>{`
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
      `}</style>
        </div>
    );
}
