'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function DroneModel() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const mount = mountRef.current;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0.6, 5.5);
    camera.lookAt(0, 0, 0);

    // ── MATERIALS ──────────────────────────────────────────────
    const hull     = new THREE.MeshStandardMaterial({ color: 0x141420, metalness: 0.92, roughness: 0.18 });
    const hullDark = new THREE.MeshStandardMaterial({ color: 0x0a0a14, metalness: 0.95, roughness: 0.12 });
    const hullMid  = new THREE.MeshStandardMaterial({ color: 0x1e1e30, metalness: 0.88, roughness: 0.22 });
    const chrome   = new THREE.MeshStandardMaterial({ color: 0x334466, metalness: 0.98, roughness: 0.08 });
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x0d0d1e, metalness: 0.9,  roughness: 0.3  });
    const legMat   = new THREE.MeshStandardMaterial({ color: 0x1a1a28, metalness: 0.92, roughness: 0.2  });
    const jointMat = new THREE.MeshStandardMaterial({ color: 0x2a3050, metalness: 0.98, roughness: 0.08 });
    const ventMat  = new THREE.MeshStandardMaterial({ color: 0x080810, metalness: 0.8,  roughness: 0.5  });
    const glowBlue = new THREE.MeshStandardMaterial({ color: 0x2255ff, emissive: 0x1133cc, emissiveIntensity: 3,   roughness: 0.4 });
    const glowCyan = new THREE.MeshStandardMaterial({ color: 0x00ddff, emissive: 0x0088cc, emissiveIntensity: 4,   roughness: 0.3 });
    const glowRed  = new THREE.MeshStandardMaterial({ color: 0xff2200, emissive: 0xcc1100, emissiveIntensity: 3,   roughness: 0.4 });
    const glowAmber= new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xcc6600, emissiveIntensity: 2.5, roughness: 0.4 });
    const eyeLens  = new THREE.MeshStandardMaterial({ color: 0x88ccff, emissive: 0x3388ff, emissiveIntensity: 5,   roughness: 0.05, metalness: 0.1 });
    const eyeHi    = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xaaddff, emissiveIntensity: 6,   roughness: 0.0  });

    const drone = new THREE.Group();
    scene.add(drone);

    // ── HELPERS ───────────────────────────────────────────────
    type Parent = THREE.Group | THREE.Object3D;
    const add = (geo: THREE.BufferGeometry, mat: THREE.Material, p: Parent,
      x=0,y=0,z=0, rx=0,ry=0,rz=0, sx=1,sy=1,sz=1) => {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(x,y,z); m.rotation.set(rx,ry,rz); m.scale.set(sx,sy,sz);
      m.castShadow = true; m.receiveShadow = true; p.add(m); return m;
    };
    const S  = (r:number,w=64,h=64) => new THREE.SphereGeometry(r,w,h);
    const B  = (w:number,h:number,d:number) => new THREE.BoxGeometry(w,h,d);
    const C  = (rt:number,rb:number,h:number,s=16) => new THREE.CylinderGeometry(rt,rb,h,s);
    const T  = (r:number,t:number,rs=8,ts=48) => new THREE.TorusGeometry(r,t,rs,ts);
    const Cn = (r:number,h:number,s=8) => new THREE.ConeGeometry(r,h,s);

    // ─────────────────────────────────────────────────────────
    // 1. MAIN BODY
    // ─────────────────────────────────────────────────────────
    add(S(1.0,80,80), hull, drone);
    add(S(0.92,32,32), hullDark, drone);

    // Equatorial band
    add(T(0.98,0.028,12,80), hullDark, drone, 0,0,0, Math.PI/2);
    add(T(0.96,0.012,8,60),  chrome,   drone, 0,0,0, Math.PI/2);

    // Latitude rings
    for (const y of [0.42,-0.42]) {
      const r = Math.sqrt(1-y*y)*0.98;
      add(T(r,0.018,8,60),     hullDark, drone, 0,y,0, Math.PI/2);
      add(T(r*0.96,0.008,6,40),chrome,   drone, 0,y,0, Math.PI/2);
    }
    for (const y of [0.72,-0.72]) {
      const r = Math.sqrt(1-y*y)*0.98;
      add(T(r,0.014,6,40), hullDark, drone, 0,y,0, Math.PI/2);
    }

    // Surface panels
    const panelDefs = [
      {lat:55,lon:30},{lat:55,lon:150},{lat:55,lon:270},
      {lat:30,lon:0}, {lat:30,lon:90}, {lat:30,lon:180},{lat:30,lon:270},
      {lat:70,lon:90},{lat:70,lon:210},
      {lat:15,lon:45},{lat:15,lon:135},{lat:15,lon:225},{lat:15,lon:315},
      {lat:55,lon:60},{lat:55,lon:180},{lat:20,lon:60}, {lat:20,lon:300},
    ];
    panelDefs.forEach(({lat,lon}) => {
      const phi  = (90-lat)*Math.PI/180;
      const theta = lon*Math.PI/180;
      const r = 1.005;
      const px = r*Math.sin(phi)*Math.cos(theta);
      const py = r*Math.cos(phi);
      const pz = r*Math.sin(phi)*Math.sin(theta);
      const pg = new THREE.Group();
      pg.position.set(px,py,pz); pg.lookAt(0,0,0); pg.rotateY(Math.PI);
      add(B(0.22,0.13,0.018), panelMat, pg);
      add(B(0.16,0.08,0.010), hullDark,  pg, 0,0,0.005);
      [[-0.08,0.04],[0.08,0.04],[-0.08,-0.04],[0.08,-0.04]].forEach(([bx,by]) =>
        add(S(0.008,6,6), chrome, pg, bx,by,0.012));
      // small inner glow strip on some panels
      if (lat > 40) add(B(0.1,0.008,0.004), glowBlue, pg, 0,0,0.012);
      drone.add(pg);
    });

    // Vents
    const addVent = (cx:number,cy:number,cz:number,ry:number) => {
      const vg = new THREE.Group();
      vg.position.set(cx,cy,cz); vg.rotation.y = ry;
      add(B(0.20,0.14,0.015), panelMat, vg, 0,0,-0.005);
      for (let i=-2;i<=2;i++) {
        add(B(0.18,0.012,0.04), ventMat,  vg, 0,i*0.022,0);
        add(B(0.16,0.006,0.01), hullDark, vg, 0,i*0.022,0.018);
      }
      drone.add(vg);
    };
    addVent(0.95,0,0.22,0); addVent(-0.95,0,0.22,Math.PI);
    addVent(0.95,0,-0.22,0.1); addVent(-0.95,0,-0.22,Math.PI-0.1);
    addVent(0.3,0.92,0.3,0.5); addVent(-0.3,0.92,0.3,-0.5);

    // Sensor bumps
    [[0.3,0.95,0],[-0.3,0.95,0],[0,0.95,0.3],[0,0.95,-0.3],
     [0.5,0.85,0.3],[-0.5,0.85,0.3]].forEach(([x,y,z]) => {
      add(S(0.04,10,10), chrome,    drone, x,y,z);
      add(S(0.02,8,8),   glowCyan,  drone, x,y,z);
    });

    // ─────────────────────────────────────────────────────────
    // 2. EYE / SCANNER
    // ─────────────────────────────────────────────────────────
    const eye = new THREE.Group();
    drone.add(eye);

    add(C(0.48,0.50,0.08,48), hullDark, eye, 0,0,1.00, Math.PI/2);
    add(C(0.46,0.46,0.06,48), panelMat, eye, 0,0,1.01, Math.PI/2);
    add(T(0.48,0.025,12,60), chrome,   eye, 0,0,0.96);
    add(T(0.44,0.012,8,48),  hullDark, eye, 0,0,0.97);

    // Iris rings
    const irisR = [0.38,0.30,0.22,0.14,0.07];
    irisR.forEach((r,i) => {
      add(T(r,0.018-i*0.002,8,40), i%2===0?hullDark:panelMat, eye, 0,0,0.98+i*0.004);
      if (i<4) for (let b=0;b<8;b++) {
        const ba=(b/8)*Math.PI*2, br=(r+irisR[i+1])/2;
        add(S(0.006,4,4), chrome, eye, Math.cos(ba)*br,Math.sin(ba)*br,0.985);
      }
    });

    // Iris blades
    for (let b=0;b<8;b++) {
      const ba=(b/8)*Math.PI*2;
      const bg = new THREE.Group();
      bg.position.set(Math.cos(ba)*0.16,Math.sin(ba)*0.16,0.99);
      bg.rotation.z = ba+Math.PI/2;
      add(B(0.11,0.035,0.007), hullMid, bg);
      eye.add(bg);
    }

    // Lens
    add(S(0.10,32,32), eyeLens, eye, 0,0,1.0);
    add(S(0.04,16,16), eyeHi,   eye, 0.028,0.028,1.09);
    add(T(0.07,0.008,6,32), glowBlue, eye, 0,0,1.01);
    add(T(0.04,0.005,6,24), glowCyan, eye, 0,0,1.02);

    // Micro-antennae around eye housing
    for (let a=0;a<6;a++) {
      const angle=(a/6)*Math.PI*2;
      const ag = new THREE.Group();
      ag.position.set(Math.cos(angle)*0.46,Math.sin(angle)*0.46,0.92);
      ag.rotation.z = angle;
      add(C(0.008,0.008,0.05,6), chrome,    ag, 0,0.03,0);
      add(S(0.014,6,6),          glowAmber, ag, 0,0.06,0);
      eye.add(ag);
    }

    // ─────────────────────────────────────────────────────────
    // 3. TOP CROWN
    // ─────────────────────────────────────────────────────────
    const top = new THREE.Group();
    drone.add(top);

    add(T(0.35,0.032,10,48), hullDark, top, 0,0.96,0, Math.PI/2);
    add(T(0.33,0.012,6,36),  chrome,   top, 0,0.97,0, Math.PI/2);

    // Central emitter tower
    add(C(0.06,0.08,0.12,12), hullDark, top, 0,1.03,0);
    add(C(0.04,0.04,0.05,10), panelMat, top, 0,1.08,0);
    add(C(0.025,0.025,0.03,8),chrome,   top, 0,1.12,0);
    add(S(0.038,10,10), glowCyan, top, 0,1.14,0);
    add(T(0.06,0.008,6,24), glowBlue, top, 0,1.06,0, Math.PI/2);
    add(T(0.04,0.006,6,20), glowCyan, top, 0,1.11,0, Math.PI/2);

    // 4 tall antennae
    for (let a=0;a<4;a++) {
      const angle=(a/4)*Math.PI*2;
      const r=0.32;
      const ag = new THREE.Group();
      ag.position.set(Math.cos(angle)*r, 0.96, Math.sin(angle)*r);
      add(C(0.022,0.025,0.05,8), chrome,  ag, 0,0,0);
      add(C(0.007,0.016,0.22,6), legMat,  ag, 0,0.14,0);
      add(C(0.018,0.018,0.02,6), chrome,  ag, 0,0.25,0);
      add(C(0.004,0.010,0.14,5), legMat,  ag, 0,0.34,0);
      add(S(0.012,6,6), a%2===0?glowBlue:glowRed, ag, 0,0.42,0);
      add(B(0.07,0.008,0.008), chrome, ag, 0,0.26,0);
      add(B(0.008,0.008,0.07), chrome, ag, 0,0.26,0);
      // Extra detail strut
      add(C(0.005,0.005,0.10,5), legMat, ag, 0.03,0.18,0, 0,0,0.3);
      top.add(ag);
    }

    // 8 sensor nubs
    for (let a=0;a<8;a++) {
      const angle=(a/8)*Math.PI*2, r=0.46;
      add(C(0.012,0.016,0.04,6), chrome, top,
        Math.cos(angle)*r,0.91,Math.sin(angle)*r);
      add(S(0.014,6,6), a%3===0?glowAmber:glowBlue, top,
        Math.cos(angle)*r,0.945,Math.sin(angle)*r);
    }

    // ─────────────────────────────────────────────────────────
    // 4. BOTTOM MODULE
    // ─────────────────────────────────────────────────────────
    const bot = new THREE.Group();
    drone.add(bot);

    add(C(0.38,0.36,0.06,8), hullDark, bot, 0,-0.96,0);
    add(T(0.38,0.018,8,40),  chrome,   bot, 0,-0.94,0, Math.PI/2);
    add(C(0.28,0.28,0.04,8), panelMat, bot, 0,-0.99,0);
    add(C(0.18,0.18,0.04,8), hullDark, bot, 0,-1.02,0);
    add(C(0.08,0.08,0.05,8), panelMat, bot, 0,-1.05,0);
    add(S(0.055,10,10), glowBlue, bot, 0,-1.08,0);
    add(T(0.07,0.008,6,24), glowCyan, bot, 0,-1.06,0, Math.PI/2);

    // Bottom radial vents
    for (let a=0;a<6;a++) {
      const angle=(a/6)*Math.PI*2, r=0.24;
      const vg=new THREE.Group();
      vg.position.set(Math.cos(angle)*r,-0.97,Math.sin(angle)*r);
      vg.rotation.y=angle;
      add(B(0.08,0.008,0.022),ventMat,vg,0,0,0);
      add(B(0.08,0.008,0.022),ventMat,vg,0,0.015,0);
      add(B(0.08,0.008,0.022),ventMat,vg,0,-0.015,0);
      bot.add(vg);
    }

    // ─────────────────────────────────────────────────────────
    // 5. LEGS (4 legs, highly detailed)
    // ─────────────────────────────────────────────────────────
    const makeLeg = (angleDeg:number, side:number) => {
      const angle = angleDeg*Math.PI/180;
      const root = new THREE.Group();
      drone.add(root);
      root.position.set(Math.cos(angle)*0.9, -0.08, Math.sin(angle)*0.9);
      root.rotation.y = angle;

      // Shoulder
      add(S(0.075,12,12), jointMat, root);
      add(T(0.075,0.012,6,20), chrome, root, 0,0,0, 0,0,Math.PI/2);
      add(C(0.04,0.04,0.06,8), chrome, root, 0,0,0, 0,0,Math.PI/2);

      // Upper arm
      const ua = new THREE.Group();
      ua.position.set(0.1,0,0); ua.rotation.z=-0.2*side;
      root.add(ua);

      add(C(0.038,0.028,0.55,10), legMat, ua, 0.3,0,0, 0,0,Math.PI/2);
      for (let s=0;s<5;s++) add(T(0.036,0.006,6,16),chrome,ua,0.06+s*0.115,0,0,0,0,Math.PI/2);
      // Rails
      add(B(0.50,0.01,0.01), hullDark, ua, 0.3, 0.04,0);
      add(B(0.50,0.01,0.01), hullDark, ua, 0.3,-0.04,0);
      // Piston
      add(C(0.012,0.012,0.32,6), chrome,  ua, 0.20,0.055,0, 0,0,Math.PI/2);
      add(C(0.008,0.008,0.18,6), legMat,  ua, 0.38,0.055,0, 0,0,Math.PI/2);
      // Wiring
      add(C(0.008,0.008,0.40,5), panelMat,ua, 0.28,-0.05,0.03, 0,0,Math.PI/2);
      // Side panel
      add(B(0.22,0.06,0.015), panelMat, ua, 0.22,0,-0.038);
      add(B(0.18,0.04,0.008), hullDark,  ua, 0.22,0,-0.040);
      // Panel bolts
      [0.14,0.30].forEach(bx=>
        [[-0.05,-0.042],[0.05,-0.042]].forEach(([by,bz])=>
          add(S(0.005,4,4),chrome,ua,bx,by,bz)));

      // Elbow
      const elbow = new THREE.Group();
      elbow.position.set(0.58,0,0); ua.add(elbow);
      add(S(0.065,10,10), jointMat, elbow);
      add(T(0.065,0.010,6,18), chrome, elbow, 0,0,0, Math.PI/2);
      add(T(0.065,0.010,6,18), chrome, elbow, 0,0,0, 0,0,Math.PI/2);
      add(B(0.06,0.09,0.015), panelMat, elbow, 0,0, 0.065);
      add(B(0.06,0.09,0.015), panelMat, elbow, 0,0,-0.065);

      // Lower arm
      const la = new THREE.Group();
      la.position.set(0.58,0,0); ua.add(la);
      la.rotation.z=-0.7*side; la.rotation.x=0.15;

      add(C(0.028,0.018,0.48,8), legMat, la, 0.22,-0.12,0, 0,0,Math.PI/2-0.5);
      for (let s=0;s<4;s++)
        add(T(0.026,0.005,6,14),chrome,la,0.04+s*0.1,-0.04-s*0.04,0,0,0,Math.PI/2-0.5);
      add(C(0.009,0.009,0.28,5), chrome,  la, 0.16,-0.13,0.025, 0,0,Math.PI/2-0.6);
      add(C(0.008,0.008,0.40,5), panelMat,la, 0.20,-0.10,-0.028, 0,0,Math.PI/2-0.5);

      // Knee guard plates
      add(B(0.07,0.05,0.012), panelMat, la, 0.01,-0.01, 0.03);
      add(B(0.07,0.05,0.012), panelMat, la, 0.01,-0.01,-0.03);

      // Wrist
      const wrist = new THREE.Group();
      wrist.position.set(0.40,-0.30,0); la.add(wrist);
      add(S(0.048,8,8), jointMat, wrist);
      add(T(0.048,0.008,6,16), chrome, wrist, 0,0,0, Math.PI/2);

      // Claw
      const claw = new THREE.Group();
      claw.position.set(0.40,-0.30,0); la.add(claw);
      add(C(0.025,0.020,0.08,8), panelMat, claw);

      [-0.055,0,0.055].forEach((off) => {
        const finger = new THREE.Group();
        finger.position.set(0,-0.06,off);
        finger.rotation.z=-0.3*side; finger.rotation.x=off*2;
        add(C(0.014,0.010,0.12,6), legMat, finger, 0,-0.07,0);
        add(T(0.013,0.005,5,12), chrome,   finger, 0,-0.01,0, Math.PI/2);
        add(C(0.010,0.007,0.10,5), legMat, finger, 0,-0.19,0);
        add(T(0.010,0.004,5,10), chrome,   finger, 0,-0.14,0, Math.PI/2);
        add(Cn(0.009,0.08,5), hullDark, finger, 0,-0.30,0);
        add(S(0.007,5,5), chrome, finger, 0,-0.27,0);
        claw.add(finger);
      });

      return root;
    };

    makeLeg(-42, 1); makeLeg(-138, 1);
    makeLeg(42, -1); makeLeg(138, -1);

    // ─────────────────────────────────────────────────────────
    // 6. WEAPON PODS
    // ─────────────────────────────────────────────────────────
    [-1,1].forEach(side => {
      const pg = new THREE.Group();
      pg.position.set(side*1.0,0.15,-0.08); pg.rotation.z=side*0.15;
      drone.add(pg);

      add(C(0.08,0.06,0.35,10), hullDark, pg, 0,0,0, 0,0,Math.PI/2);
      add(C(0.06,0.05,0.30,10), panelMat, pg, side*-0.02,0,0, 0,0,Math.PI/2);
      add(S(0.07,10,10), hullDark, pg, side*-0.18,0,0);
      add(C(0.022,0.020,0.22,8), chrome,   pg, side*0.26,0,0, 0,0,Math.PI/2);
      add(C(0.018,0.018,0.08,6), panelMat, pg, side*0.34,0,0, 0,0,Math.PI/2);
      [0.20,0.28,0.36].forEach(bx=>
        add(T(0.022,0.004,5,12),chrome,pg,side*bx,0,0,0,0,Math.PI/2));
      add(S(0.018,8,8), glowRed, pg, side*0.40,0,0);
      // Fins
      add(B(0.15,0.06,0.008), panelMat, pg, side*0.02, 0.08,0);
      add(B(0.15,0.06,0.008), panelMat, pg, side*0.02,-0.08,0);
      // Detail
      add(B(0.06,0.04,0.012), hullDark, pg, side*0.0,0.0,0.065);
      add(T(0.06,0.006,5,16), chrome, pg, side*0.0,0.0,0, 0,Math.PI/2,0);
    });

    // ─────────────────────────────────────────────────────────
    // 7. REAR THRUSTER ARRAY
    // ─────────────────────────────────────────────────────────
    const thr = new THREE.Group();
    thr.position.set(0,-0.1,-0.95); drone.add(thr);

    add(C(0.18,0.22,0.12,12), hullDark, thr, 0,0,0, Math.PI/2);
    add(C(0.14,0.18,0.10,10), panelMat, thr, 0,0,-0.01, Math.PI/2);
    add(T(0.20,0.018,8,36), chrome, thr, 0,0,0.06, Math.PI/2);

    [-0.12,0,0.12].forEach(xOff => {
      add(C(0.045,0.055,0.08,10), hullDark, thr, xOff,0,-0.06, Math.PI/2);
      add(C(0.032,0.032,0.04,8),  panelMat, thr, xOff,0,-0.09, Math.PI/2);
      add(C(0.038,0.038,0.015,8), chrome,   thr, xOff,0,-0.10, Math.PI/2);
      add(S(0.028,8,8), glowBlue, thr, xOff,0,-0.105);
      add(T(0.04,0.005,5,16), glowCyan, thr, xOff,0,-0.095, Math.PI/2);
    });
    // Cross bracing
    add(B(0.32,0.012,0.012), chrome, thr, 0,0.06,0);
    add(B(0.32,0.012,0.012), chrome, thr, 0,-0.06,0);
    add(B(0.012,0.12,0.012), chrome, thr, 0.12,0,0);
    add(B(0.012,0.12,0.012), chrome, thr,-0.12,0,0);

    // ─────────────────────────────────────────────────────────
    // 8. LIGHTS
    // ─────────────────────────────────────────────────────────
    const keyL = new THREE.DirectionalLight(0xc8d8ff,5);
    keyL.position.set(4,6,4); keyL.castShadow=true;
    keyL.shadow.mapSize.set(2048,2048); scene.add(keyL);
    const fillL = new THREE.DirectionalLight(0xffe8cc,2);
    fillL.position.set(-5,2,-3); scene.add(fillL);
    const rimL = new THREE.DirectionalLight(0x3355ff,4);
    rimL.position.set(0,-3,-5); scene.add(rimL);
    const topL = new THREE.DirectionalLight(0x88aaff,2);
    topL.position.set(0,8,0); scene.add(topL);
    scene.add(new THREE.AmbientLight(0x0a0a22,3));

    const eyePL = new THREE.PointLight(0x3388ff,10,4);
    eyePL.position.set(0,0,1.5); scene.add(eyePL);
    const thrPL = new THREE.PointLight(0x2244ff,6,2);
    thrPL.position.set(0,-0.1,-1.2); scene.add(thrPL);
    const wL = new THREE.PointLight(0xff2200,3,1.5);
    wL.position.set(1.4,0.15,-0.08); scene.add(wL);
    const wR = new THREE.PointLight(0xff2200,3,1.5);
    wR.position.set(-1.4,0.15,-0.08); scene.add(wR);
    const topPL = new THREE.PointLight(0x00ddff,4,2);
    topPL.position.set(0,1.8,0); scene.add(topPL);

    // ─────────────────────────────────────────────────────────
    // 9. ANIMATION
    // ─────────────────────────────────────────────────────────
    let targetRotY=0, targetRotX=0, currentRotY=0, currentRotX=0;
    const onMM = (e:MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      targetRotY = ((e.clientX-rect.left)/rect.width-0.5)*1.0;
      targetRotX = -((e.clientY-rect.top)/rect.height-0.5)*0.45;
    };
    window.addEventListener('mousemove', onMM);

    let frameId:number, t=0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      t += 0.008;

      drone.position.y = Math.sin(t*0.7)*0.07;
      drone.rotation.z = Math.sin(t*0.5)*0.03;
      currentRotY += (targetRotY + t*0.12 - currentRotY)*0.04;
      currentRotX += (targetRotX - currentRotX)*0.04;
      drone.rotation.y = currentRotY;
      drone.rotation.x = currentRotX;

      // Eye pulse
      const ep = 0.5+0.5*Math.sin(t*2.8);
      eyePL.intensity = 8+ep*6;
      eyeLens.emissiveIntensity = 4+ep*3;
      glowCyan.emissiveIntensity = 3+ep*2;
      topPL.intensity = 3+ep*2;

      // Thruster flicker
      thrPL.intensity = 5+Math.sin(t*6.0)*1.5;
      glowBlue.emissiveIntensity = 2.5+Math.sin(t*5.5)*0.8;

      // Weapon pulse
      const wp = 0.5+0.5*Math.sin(t*1.5+Math.PI);
      wL.intensity = 2+wp*3; wR.intensity = 2+wp*3;
      glowRed.emissiveIntensity = 2+wp*2;

      // Amber blink
      glowAmber.emissiveIntensity = t%2<0.1?5:(t%3<0.05?6:1.5);

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth/mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', onMM);
      window.removeEventListener('resize', onResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} style={{ width:'100%', height:'100%', position:'absolute', inset:0 }} />
  );
}
