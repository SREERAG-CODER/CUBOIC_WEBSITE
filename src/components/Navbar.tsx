"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";

const NAV_LINKS = ["Home", "Works", "Awards", "Team", "Prices", "Contacts"];

interface LocationData {
    city: string;
    lat: string;
    lng: string;
}

function toDegreesMinutesSeconds(decimal: number, isLat: boolean): string {
    const abs = Math.abs(decimal);
    const deg = Math.floor(abs);
    const minFull = (abs - deg) * 60;
    const min = Math.floor(minFull);
    const sec = ((minFull - min) * 60).toFixed(4);
    const dir = isLat ? (decimal >= 0 ? "N" : "S") : (decimal >= 0 ? "E" : "W");
    return `${deg}° ${min}′ ${sec}″ ${dir}`;
}

export default function Navbar({ onNavigate, activeSection = "Home" }: { onNavigate?: (section: string) => void, activeSection?: string }) {
    const [time, setTime] = useState("");
    const [location, setLocation] = useState<LocationData>({
        city: "LOCATING...",
        lat: "...",
        lng: "...",
    });

    // Clock
    useEffect(() => {
        const update = () => {
            const now = new Date();
            const h = now.getHours().toString().padStart(2, "0");
            const m = now.getMinutes().toString().padStart(2, "0");
            const s = now.getSeconds().toString().padStart(2, "0");
            const h12 = now.getHours() % 12 || 12;
            const ampm = now.getHours() >= 12 ? "PM" : "AM";
            const m12 = now.getMinutes().toString().padStart(2, "0");
            setTime(`${h}:${m}:${s} (${h12}:${m12} ${ampm})`);
        };
        update();
        const id = setInterval(update, 1000);
        return () => clearInterval(id);
    }, []);

    // Geolocation + reverse geocoding
    useEffect(() => {
        if (!navigator.geolocation) {
            setLocation({ city: "UNAVAILABLE", lat: "N/A", lng: "N/A" });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                const latStr = toDegreesMinutesSeconds(latitude, true);
                const lngStr = toDegreesMinutesSeconds(longitude, false);

                // Reverse geocode using open-meteo's free geocoding (no API key needed)
                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                    );
                    const data = await res.json();
                    const city =
                        data.address?.city ||
                        data.address?.town ||
                        data.address?.village ||
                        data.address?.county ||
                        "UNKNOWN";

                    setLocation({
                        city: city.toUpperCase(),
                        lat: latStr,
                        lng: lngStr,
                    });
                } catch {
                    setLocation({
                        city: "UNKNOWN",
                        lat: latStr,
                        lng: lngStr,
                    });
                }
            },
            () => {
                setLocation({ city: "ACCESS DENIED", lat: "N/A", lng: "N/A" });
            },
            { enableHighAccuracy: true }
        );
    }, []);

    return (
        <>
            <div style={{
                position: "fixed",
                bottom: "15px", left: "15px", right: "15px",
                height: "1px",
                background: "rgba(255,255,255,0.1)",
                zIndex: 50,
            }} />

            <nav style={{
                position: "fixed",
                top: "4px", left: "15px", right: "15px",
                zIndex: 600, // Above GlobalFrame
                borderBottom: "1px solid rgba(255,255,255,0.1)",
            }}>
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto 1fr",
                    alignItems: "center",
                    padding: "0 32px",
                    height: "54px",
                }}>

                    {/* Left: auto location */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                        <span style={monoStyle}>
                            {location.city} &nbsp; {location.lat}
                        </span>
                        <span style={monoStyle}>
                            {location.lng}
                        </span>
                    </div>

                    {/* Center: nav */}
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <svg width="80" height="24" viewBox="0 0 80 24" fill="none">
                            <line x1="0" y1="12" x2="68" y2="12" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
                            <line x1="68" y1="12" x2="80" y2="2" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
                        </svg>

                        <div style={{ display: "flex", gap: "32px", padding: "0 4px" }}>
                            {NAV_LINKS.map((link) => (
                                <a 
                                    key={link} 
                                    href="#" 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onNavigate?.(link);
                                    }}
                                    style={{
                                        color: link === activeSection ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.45)",
                                        textShadow: link === activeSection ? "0 0 10px rgba(255,255,255,0.4)" : "none",
                                        textDecoration: "none",
                                        fontSize: "13.5px",
                                        letterSpacing: "0.03em",
                                        fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
                                        fontWeight: 400,
                                        transition: "color 0.2s, text-shadow 0.2s",
                                    }}
                                >
                                    {link}
                                </a>
                            ))}
                        </div>

                        <svg width="80" height="24" viewBox="0 0 80 24" fill="none">
                            <line x1="80" y1="12" x2="12" y2="12" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
                            <line x1="12" y1="12" x2="0" y2="2" stroke="rgba(255,255,255,0.25)" strokeWidth="0.8" />
                        </svg>
                    </div>

                    {/* Right: clock */}
                    <div style={{
                        textAlign: "right",
                        fontSize: "11px",
                        color: "rgba(255,255,255,0.35)",
                        letterSpacing: "0.08em",
                        fontFamily: "'Courier New', monospace",
                    }}>
                        Local time: {time}
                    </div>

                </div>
            </nav>
        </>
    );
}

const monoStyle: CSSProperties = {
    fontSize: "10px",
    color: "rgba(255,255,255,0.35)",
    letterSpacing: "0.12em",
    fontFamily: "'Courier New', monospace",
    textTransform: "uppercase",
};