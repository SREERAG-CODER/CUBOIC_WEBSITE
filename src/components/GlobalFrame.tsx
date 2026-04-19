"use client";

import React, { CSSProperties } from "react";

const INSET = 15;
const LINE_COLOR = "rgba(255, 255, 255, 0.1)";
const GLOW_COLOR = "rgba(0, 163, 255, 0.25)";

export default function GlobalFrame() {
    const TOP_MARKER_Y = 42; // Navbar bottom (58) - INSET (15) = 43
    const BOTTOM_MARKER_Y = -14;

    return (
        <div
            id="global-frame"
            style={{
                position: "fixed",
                inset: `${INSET}px`,
                pointerEvents: "none",
                zIndex: 500,
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* CORNERS (+) - CSS Drawn for pixel perfection */}
            <CornerMarker v="top" h="left" y={TOP_MARKER_Y} />
            <CornerMarker v="top" h="right" y={TOP_MARKER_Y} />
            <CornerMarker v="bottom" h="left" y={BOTTOM_MARKER_Y} />
            <CornerMarker v="bottom" h="right" y={BOTTOM_MARKER_Y} />

            {/* VERTICAL SIDE LINES (Passing through markers) */}
            <div style={{
                ...lineStyle("left"),
                top: `-${INSET}px`,
                height: `calc(100% + ${INSET}px + 12px)`
            }} />
            <div style={{
                ...lineStyle("right"),
                top: `-${INSET}px`,
                height: `calc(100% + ${INSET}px + 12px)`
            }} />

            {/* BOTTOM LINE (Overshooting) */}
            <div style={{
                ...lineStyle("bottom"),
                left: "-12px",
                right: "-12px",
                width: "auto"
            }} />

            {/* TOP LINE segments (Aligned with TOP_MARKER_Y) */}
            <div style={{ ...lineStyle("top"), top: `${TOP_MARKER_Y}px`, width: "128px", left: "-12px" }} />
            <div style={{ ...lineStyle("top"), top: `${TOP_MARKER_Y}px`, width: "128px", right: "-12px" }} />
        </div>
    );
}

function CornerMarker({ v, h, y }: { v: "top" | "bottom", h: "left" | "right", y?: number }) {
    const pos = {
        [v]: y !== undefined ? `${y}px` : 0,
        [h]: h === "right" ? "-15px" : 0 // Micro-adjust for 1px line width
    };

    return (
        <div style={{
            position: "absolute",
            ...pos,
            width: "15px",
            height: "15px",
            transform: "translate(-50%, -50%)",
            zIndex: 510,
        }}>
            {/* Horizontal part of + */}
            <div style={{
                position: "absolute",
                top: "7px",
                left: 0,
                width: "15px",
                height: "1px",
                backgroundColor: "rgba(255, 255, 255, 0.45)",
                filter: `drop-shadow(0 0 5px ${GLOW_COLOR})`,
            }} />
            {/* Vertical part of + */}
            <div style={{
                position: "absolute",
                left: "7px",
                top: 0,
                width: "1px",
                height: "15px",
                backgroundColor: "rgba(255, 255, 255, 0.45)",
                filter: `drop-shadow(0 0 5px ${GLOW_COLOR})`,
            }} />
        </div>
    );
}

function lineStyle(side: "top" | "bottom" | "left" | "right"): CSSProperties {
    const isHorizontal = side === "top" || side === "bottom";
    return {
        position: "absolute",
        [side]: 0,
        backgroundColor: LINE_COLOR,
        filter: `drop-shadow(0 0 4px ${GLOW_COLOR})`,
        width: isHorizontal ? "100%" : "1px",
        height: isHorizontal ? "1px" : "100%",
        pointerEvents: "none",
    };
}
