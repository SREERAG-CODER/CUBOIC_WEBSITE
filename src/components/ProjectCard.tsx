'use client';

import { useState } from 'react';
import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({
    weight: ['400', '700', '800'],
    subsets: ['latin'],
});

interface Spec {
    label: string;
    value: string;
}

interface Project {
    id: string;
    codename: string;
    tagline: string;
    category: string;
    status: string;
    year: string;
    description: string;
    specs: Spec[];
    tags: string[];
}

export default function ProjectCard({ project }: { project: Project }) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position: 'relative',
                width: hovered ? '100%' : '320px',
                height: hovered ? '380px' : '64px',
                maxWidth: '1300px',
                margin: '0', 
                transition: 'all 0.8s cubic-bezier(0.19, 1, 0.22, 1)',
                // No overflow:hidden here to allow the glowing border to "breathe"
                background: 'transparent',
                borderRadius: '8px',
            }}
        >
            {/* ── 1. STATIC EXPANDING BORDER ── */}
            <style jsx>{`
                @keyframes scan {
                    0% { left: -5%; opacity: 0; }
                    25% { opacity: 1; }
                    75% { opacity: 1; }
                    100% { left: 105%; opacity: 0; }
                }
            `}</style>
            
            {/* Border Layer: Expands with parent, provides the 1px stroke effect */}
            <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '8px',
                background: hovered ? 'rgba(255, 140, 0, 0.4)' : 'rgba(255, 255, 255, 0.12)',
                zIndex: 0,
                transition: 'all 0.5s ease',
            }} />

            {/* ── 2. INNER MASK (The Card Surface) ── */}
            <div style={{
                position: 'absolute',
                inset: '1px',
                background: hovered ? 'rgba(5, 5, 20, 0.98)' : '#0a0a14',
                borderRadius: '7px',
                zIndex: 1,
                padding: '24px 32px',
                display: 'flex',
                flexDirection: 'column',
                transition: 'background 0.5s ease',
                overflow: 'hidden', // Contain content and scan line
            }}>
                {/* ── 3. LAZER SCAN LINE (Moves L to R on expand) ── */}
                {hovered && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        width: '4px',
                        background: 'linear-gradient(to bottom, transparent, #ffae00, #ffffff, #ffae00, transparent)',
                        boxShadow: '0 0 30px 4px rgba(255, 165, 0, 0.9)',
                        zIndex: 20,
                        animation: 'scan 0.85s cubic-bezier(0.19, 1, 0.22, 1) forwards',
                        pointerEvents: 'none',
                    }} />
                )}

                {/* Index Number */}
                <span style={{
                    position: 'absolute',
                    top: '12px',
                    right: '18px',
                    fontFamily: 'monospace',
                    fontSize: '10px',
                    color: hovered ? 'rgba(255,165,0,0.6)' : 'rgba(255,255,255,0.15)',
                    letterSpacing: '0.2em',
                    transition: 'color 0.4s ease',
                    zIndex: 5,
                }}>
                    {project.id}
                </span>

                {/* ── COMPACT HEADER (Always Visible) ── */}
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px',
                    marginBottom: hovered ? '24px' : '0',
                    transition: 'margin 0.5s ease',
                    height: '24px', // Fixed height for alignment
                }}>
                    <h3 className={orbitron.className} style={{
                        fontSize: hovered ? '24px' : '18px',
                        fontWeight: 800,
                        color: 'white',
                        margin: 0,
                        letterSpacing: '0.08em',
                        transition: 'font-size 0.5s ease',
                    }}>
                        {project.codename}
                    </h3>
                    
                    {/* Compact Tag (Category) */}
                    <span style={{
                        fontFamily: 'monospace',
                        fontSize: '9px',
                        color: hovered ? 'rgba(255,165,0,1)' : 'rgba(255,255,255,0.4)',
                        border: hovered ? '1px solid rgba(255,140,0,0.5)' : '1px solid rgba(255,255,255,0.1)',
                        padding: '2px 8px',
                        letterSpacing: '0.15em',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.5s ease',
                    }}>
                        {project.category.split(' ')[0]}
                    </span>

                    {/* Status Dot */}
                    <span style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: project.status === 'DEPLOYED' ? '#50ff78' : '#aaa',
                        boxShadow: project.status === 'DEPLOYED' ? '0 0 8px #50ff78' : 'none',
                    }} />
                </div>

                {/* ── EXPANDED CONTENT (Opacity Transition) ── */}
                <div style={{
                    opacity: hovered ? 1 : 0,
                    transform: hovered ? 'translateY(0)' : 'translateY(10px)',
                    transition: hovered ? 'opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s' : 'opacity 0.2s ease, transform 0.2s ease',
                    pointerEvents: hovered ? 'auto' : 'none',
                    marginTop: '4px',
                }}>
                    {/* Divider */}
                    <div style={{ 
                        height: '1px', 
                        background: 'linear-gradient(to right, rgba(255,165,0,0.4), transparent)', 
                        marginBottom: '24px' 
                    }} />

                    {/* Description */}
                    <p style={{
                        fontSize: '14px',
                        lineHeight: '1.7',
                        color: 'rgba(255,255,255,0.8)',
                        margin: '0 0 28px 0',
                        maxWidth: '95%',
                    }}>
                        {project.description}
                    </p>

                    {/* Specs Grid */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(2, 1fr)', 
                        gap: '24px',
                        marginBottom: '32px'
                    }}>
                        {project.specs.map(s => (
                            <div key={s.label} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <span style={{ fontFamily: 'monospace', fontSize: '9px', color: 'rgba(255,165,0,0.7)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                                    {s.label}
                                </span>
                                <span style={{ fontFamily: 'monospace', fontSize: '13px', color: 'white', letterSpacing: '0.05em' }}>
                                    {s.value}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {project.tags.map(tag => (
                            <span key={tag} style={{
                                fontSize: '10px',
                                color: 'rgba(255,255,255,0.5)',
                                background: 'rgba(255,255,255,0.06)',
                                padding: '5px 12px',
                                fontFamily: 'monospace',
                                border: '1px solid rgba(255,255,255,0.05)',
                                borderRadius: '2px',
                            }}>
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Glass Highlight */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '40%',
                background: 'linear-gradient(to bottom, rgba(255,255,255,0.03), transparent)',
                pointerEvents: 'none',
                zIndex: 2,
            }} />
        </div>
    );
}
