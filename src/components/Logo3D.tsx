'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Logo3DProps {
    color?: number;
    size?: number;
    rotationSpeed?: number;
}

export default function Logo3D({ 
    color = 0xffffff, 
    size = 1.8,
    rotationSpeed = 0.12 // Increased for a more dynamic feel
}: Logo3DProps) {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;
        const mount = mountRef.current;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(35, mount.clientWidth / mount.clientHeight, 0.1, 100);
        camera.position.set(0, 0, 10);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        mount.appendChild(renderer.domElement);

    const logoGroup = new THREE.Group();
        scene.add(logoGroup);

        // ── MATERIAL: SHADELESS (No Lighting) ──────────────────
        const material = new THREE.MeshBasicMaterial({ 
            color: color,
            side: THREE.DoubleSide,
        });

        const sideMaterial = new THREE.MeshBasicMaterial({
            color: color, // Keep it pure white/constant color for a clean graphic look
        });

        // ── GEOMETRY: EXACT SILHOUETTE ────────────────────────
        const createLogoShape = () => {
            const s = new THREE.Shape();
            
            // Start at the bottom center of the circular base
            // (Coordinates are relative to center)
            s.moveTo(0, -0.8);
            
            // --- RIGHT SIDE ---
            // Circular base (right half)
            s.bezierCurveTo(0.45, -0.8, 0.75, -0.5, 0.75, -0.05);
            
            // Outward curve to the base of the horn
            s.bezierCurveTo(0.75, 0.2, 0.6, 0.45, 0.4, 0.6);
            
            // The secondary "branch" (hook) pointing outwards
            s.bezierCurveTo(0.8, 0.65, 1.1, 0.85, 1.25, 0.7); // Tip of hook
            s.bezierCurveTo(1.15, 0.95, 0.9, 1.15, 0.6, 1.0); // Curve back in
            
            // The main top "horn" tip
            s.bezierCurveTo(0.8, 1.4, 1.0, 1.9, 1.15, 2.4); // Very top tip
            s.bezierCurveTo(0.9, 2.1, 0.65, 1.6, 0.35, 1.1); // Inner edge of horn
            
            // The center "U" dip between horns
            s.bezierCurveTo(0.15, 0.85, 0.1, 0.75, 0, 0.75);
            
            // --- LEFT SIDE (Mirroring) ---
            // Inner edge of left horn
            s.bezierCurveTo(-0.1, 0.75, -0.15, 0.85, -0.35, 1.1);
            // Top tip of left horn
            s.bezierCurveTo(-0.65, 1.6, -0.9, 2.1, -1.15, 2.4);
            // Curve back down
            s.bezierCurveTo(-1.0, 1.9, -0.8, 1.4, -0.6, 1.0);
            
            // The secondary "branch" (hook) for the left side
            s.bezierCurveTo(-0.9, 1.15, -1.15, 0.95, -1.25, 0.7);
            s.bezierCurveTo(-1.1, 0.85, -0.8, 0.65, -0.4, 0.6);
            
            // Back to circle base junction
            s.bezierCurveTo(-0.6, 0.45, -0.75, 0.2, -0.75, -0.05);
            
            // Circular base (left half)
            s.bezierCurveTo(-0.75, -0.5, -0.45, -0.8, 0, -0.8);

            return s;
        };

        const shape = createLogoShape();
        
        const extrudeSettings = {
            depth: 0.25,
            bevelEnabled: true,
            bevelThickness: 0.02,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments: 3
        };

        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        geometry.center();
        
        const mesh = new THREE.Mesh(geometry, [material, sideMaterial]);
        logoGroup.add(mesh);

        logoGroup.scale.set(size, size, size);

        // ── ANIMATION ─────────────────────────────────────────
        let frameId: number;
        const animate = () => {
            frameId = requestAnimationFrame(animate);
            // Rotating at a "good speed" as requested
            logoGroup.rotation.y += rotationSpeed; 
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            if (!mount) return;
            camera.aspect = mount.clientWidth / mount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(mount.clientWidth, mount.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(frameId);
            window.removeEventListener('resize', handleResize);
            if (mount.contains(renderer.domElement)) {
                mount.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, [color, size, rotationSpeed]);

    return (
        <div ref={mountRef} style={{ width: '100%', height: '100%', pointerEvents: 'none' }} />
    );
}
