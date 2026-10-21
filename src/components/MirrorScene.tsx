'use client';
import { useEffect, useMemo, useRef, type ComponentRef, type MutableRefObject } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Environment, Lightformer, OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from 'motion/react';
import type { ConfiguratorState } from './ExperienceProvider';
import type { Shape } from '../lib/products';

export type CameraAction = 'left' | 'right' | 'in' | 'out' | 'front' | 'angle' | 'side' | 'reset';
export interface CameraController { action: (action: CameraAction) => void; zoom: (factor: number) => void }
export interface MirrorSceneProps { config: ConfiguratorState; room: boolean; active: boolean; visible: boolean; controller: MutableRefObject<CameraController | null>; onFailure: () => void; onReady: () => void; onInteract: () => void; onPower: () => void; quality: number }

function outline(width: number, height: number, shape: Shape, inset = 0) {
  const w = Math.max(.05, width - inset * 2), h = Math.max(.05, height - inset * 2);
  const result = new THREE.Shape();
  if (shape === 'oval' || shape === 'round') { result.absellipse(0, 0, w / 2, h / 2, 0, Math.PI * 2, false, 0); return result; }
  const r = shape === 'capsul' ? Math.min(w, h) / 2 : Math.min(.025, w / 4, h / 4);
  const x = -w / 2, y = -h / 2;
  result.moveTo(x + r, y); result.lineTo(x + w - r, y); result.quadraticCurveTo(x + w, y, x + w, y + r);
  result.lineTo(x + w, y + h - r); result.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  result.lineTo(x + r, y + h); result.quadraticCurveTo(x, y + h, x, y + h - r);
  result.lineTo(x, y + r); result.quadraticCurveTo(x, y, x + r, y); result.closePath();
  return result;
}
// Small deterministic material maps, generated locally; no external texture downloads.
function materialTexture(kind: 'plaster' | 'wood' | 'stone') {
  const size = 128, data = new Uint8Array(size * size * 4);
  let seed = 71;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const noise = (seed / 4294967296 - .5);
    const grain = kind === 'wood' ? Math.sin(y * .42 + Math.sin(x * .07) * 2) * 6 : kind === 'stone' ? Math.sin(x * .09 + y * .11 + Math.sin(y * .06) * 3) * 3 : 0;
    const value = Math.max(0, Math.min(255, 242 + noise * 4 + grain));
    const i = (y * size + x) * 4;
    data[i] = data[i + 1] = data[i + 2] = value; data[i + 3] = 255;
  }
  const texture = new THREE.DataTexture(data, size, size);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(kind === 'wood' ? 2 : 5, kind === 'wood' ? 2 : 5);
  texture.magFilter = THREE.LinearFilter; texture.needsUpdate = true;
  return texture;
}
const LED_COLORS = { hangat: '#ffb96b', natural: '#ffe5bd', putih: '#c5e3ff' };

// Alpha falloff follows the mirror outline, so the light fades continuously
// instead of stacking visible, hard-edged enlarged silhouettes.
function glowTexture(width: number, height: number, shape: Shape, front: boolean) {
  const size = 256, padding = .16;
  const data = new Uint8Array(size * size * 4);
  const w = width - (front ? .065 : 0), h = height - (front ? .065 : 0);
  const radius = shape === 'capsul' ? Math.min(w, h) / 2 : .025;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const px = Math.abs(((x + .5) / size - .5) * (width + padding * 2));
    const py = Math.abs(((y + .5) / size - .5) * (height + padding * 2));
    const qx = px - w / 2 + radius, qy = py - h / 2 + radius;
    const distance = shape === 'round' || shape === 'oval'
      ? (Math.hypot(px / (w / 2), py / (h / 2)) - 1) * Math.min(w, h) / 2
      : Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - radius;
    const alpha = front ? Math.exp(-Math.abs(distance) / .014) * .28 : Math.exp(-Math.max(0, distance) / .045) * .8;
    const i = (y * size + x) * 4;
    data[i] = data[i + 1] = data[i + 2] = 255; data[i + 3] = Math.round(alpha * 255);
  }
  const texture = new THREE.DataTexture(data, size, size);
  texture.magFilter = texture.minFilter = THREE.LinearFilter; texture.needsUpdate = true;
  return texture;
}
function Mirror({ config, onPower }: { config: ConfiguratorState; onPower: () => void }) {
  const width = Math.min(200, Math.max(30, Number(config.width) || 60)) / 100;
  const height = config.shape === 'round' ? width : Math.min(200, Math.max(30, Number(config.height) || 80)) / 100;
  // Real dimensions are entered by the visitor. All construction details are Tier C approximations.
  const geometry = useMemo(() => {
    const ledShape = outline(width, height, config.shape, .025);
    ledShape.holes.push(new THREE.Path(outline(width, height, config.shape, .04).getPoints(64)));
    return {
      body: new THREE.ExtrudeGeometry(outline(width, height, config.shape), { depth: .008, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: .002, bevelThickness: .0015, curveSegments: 48 }),
      face: new THREE.ShapeGeometry(outline(width, height, config.shape, .003), 48),
      led: new THREE.ShapeGeometry(ledShape, 48),
    };
  }, [width, height, config.shape]);
  useEffect(() => () => { Object.values(geometry).forEach(g => g.dispose()); }, [geometry]);
  const glow = useMemo(() => ({ back: glowTexture(width, height, config.shape, false), front: glowTexture(width, height, config.shape, true) }), [width, height, config.shape]);
  useEffect(() => () => Object.values(glow).forEach(texture => texture.dispose()), [glow]);
  const light = LED_COLORS[config.color];
  return <group>
    {config.power && <mesh position={[0, 0, -.08]}><planeGeometry args={[width + .32, height + .32]}/><meshBasicMaterial map={glow.back} color={light} transparent depthWrite={false} toneMapped={false}/></mesh>}
    <mesh geometry={geometry.body}><meshStandardMaterial color="#8a9b94" metalness={.7} roughness={.19}/></mesh>
    <mesh geometry={geometry.face} position={[0, 0, .011]}><meshPhysicalMaterial color="#edf3f8" metalness={1} roughness={.035} envMapIntensity={1} clearcoat={1}/></mesh>
    <mesh geometry={geometry.led} position={[0, 0, .012]}><meshBasicMaterial color={config.power ? light : '#a8b4c1'} toneMapped={false}/></mesh>
    {config.power && <mesh position={[0, 0, .013]}><planeGeometry args={[width + .32, height + .32]}/><meshBasicMaterial map={glow.front} color={light} transparent depthWrite={false} toneMapped={false}/></mesh>}
    {config.control === 'touchscreen' && <group position={[0, -height / 2 + Math.min(.095, height * .2), .016]} onClick={event => { event.stopPropagation(); onPower(); }}>
      <mesh><circleGeometry args={[.035, 32]}/><meshBasicMaterial color="#253254" transparent opacity={.55} depthWrite={false}/></mesh>
      <Line points={Array.from({ length: 35 }, (_, i) => { const angle = (.23 + i / 34 * 1.54) * Math.PI; return [Math.sin(angle) * .018, Math.cos(angle) * .018, .002] as [number, number, number]; })} color={config.power ? '#eff8ff' : '#b5c3d3'} lineWidth={1.7}/>
      <Line points={[[0, .023, .002], [0, .004, .002]]} color={config.power ? '#eff8ff' : '#b5c3d3'} lineWidth={1.7}/>
    </group>}
    {config.power && <pointLight position={[0, 0, -.04]} color={light} intensity={.12} distance={2.5} decay={2}/>}
  </group>;
}
function Scene({ config, room, active, controller, onReady, onInteract, onPower, onFailure }: MirrorSceneProps) {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const { camera, invalidate, gl, size } = useThree();
  const textures = useMemo(() => ({ plaster: materialTexture('plaster'), wood: materialTexture('wood'), stone: materialTexture('stone') }), []);
  useEffect(() => () => Object.values(textures).forEach(texture => texture.dispose()), [textures]);
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('webglcontextlost', onFailure);
    return () => canvas.removeEventListener('webglcontextlost', onFailure);
  }, [gl, onFailure]);
  const span = Math.max(Math.min(2, Math.max(.3, Number(config.width) / 100 || .6)), config.shape === 'round' ? 0 : Math.min(2, Math.max(.3, Number(config.height) / 100 || .8)));
  const mirrorWidth = Math.min(2, Math.max(.3, Number(config.width) / 100 || .6));
  const mirrorHeight = config.shape === 'round' ? mirrorWidth : Math.min(2, Math.max(.3, Number(config.height) / 100 || .8));
  const distance = Math.max(mirrorHeight, mirrorWidth / (size.width / size.height)) / (2 * Math.tan(THREE.MathUtils.degToRad(39 / 2)) * (room ? .65 : .74));
  const initialDistance = useRef(2.2);
  const transitionFrame = useRef(0);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    const zoom = (factor: number) => {
      const offset = camera.position.clone();
      const next = Math.min(7, Math.max(.65, offset.length() * factor));
      camera.position.copy(offset.setLength(next)); controls.current?.update(); invalidate();
    };
    controller.current = { zoom, action: action => {
      if (action === 'in' || action === 'out') { zoom(action === 'in' ? .85 : 1.18); return; }
      if (action === 'left' || action === 'right') { controls.current?.setAzimuthalAngle((controls.current?.getAzimuthalAngle() ?? 0) + (action === 'left' ? -.25 : .25)); }
      else {
        cancelAnimationFrame(transitionFrame.current);
        const angle = action === 'side' ? 1.35 : action === 'angle' ? .55 : 0;
        const target = new THREE.Vector3(Math.sin(angle) * initialDistance.current, action === 'angle' ? .12 : 0, Math.cos(angle) * initialDistance.current);
        const start = camera.position.clone(), began = performance.now();
        const step = (now: number) => { const t = reducedMotion ? 1 : Math.min(1, (now - began) / 380); camera.position.lerpVectors(start, target, 1 - Math.pow(1 - t, 3)); controls.current?.target.set(0, 0, 0); controls.current?.update(); invalidate(); if (t < 1) transitionFrame.current = requestAnimationFrame(step); };
        transitionFrame.current = requestAnimationFrame(step);
      }
      controls.current?.update(); invalidate();
    }};
    onReady();
    return () => { controller.current = null; cancelAnimationFrame(transitionFrame.current); };
  }, [camera, controller, invalidate, onReady, reducedMotion]);
  useEffect(() => {
    const factor = distance / initialDistance.current;
    camera.position.multiplyScalar(factor); initialDistance.current = distance; controls.current?.update(); invalidate();
  }, [distance, camera, invalidate]);
  return <>
    <color attach="background" args={['#9baec3']}/>
    <ambientLight intensity={.5}/><directionalLight position={[-3, 4, 4]} intensity={1.5} color="#f4f5ff"/>
    <Environment resolution={256} frames={1}>
      <mesh><sphereGeometry args={[12, 24, 16]}/><meshBasicMaterial color="#a1b1c5" side={THREE.BackSide}/></mesh>
      <mesh position={[0, 0, 4]}><planeGeometry args={[9, 6]}/><meshBasicMaterial color="#aebed0" side={THREE.DoubleSide}/></mesh>
      <mesh position={[-.65, .6, 3.9]}><planeGeometry args={[1.8, 2.8]}/><meshBasicMaterial color="#eaf3ff" side={THREE.DoubleSide}/></mesh>
      <Lightformer form="rect" intensity={2} position={[-1.8, 1.2, 3.8]} scale={[1, 2, 1]}/>
      {[-1.5, -.65, .2].map(x => <mesh key={x} position={[x, .6, 3.7]}><boxGeometry args={[.035, 2.8, .05]}/><meshBasicMaterial color="#60738b"/></mesh>)}
      <mesh position={[-.65, .6, 3.7]}><boxGeometry args={[1.8, .035, .05]}/><meshBasicMaterial color="#60738b"/></mesh>
      <mesh position={[1.2, -.7, 3]}><boxGeometry args={[1.8, .5, .7]}/><meshBasicMaterial color="#34485f"/></mesh>
      <mesh position={[1.2, -.32, 3.25]}><boxGeometry args={[1.8, .55, .2]}/><meshBasicMaterial color="#465d75"/></mesh>
      <mesh position={[-.6, -.8, 2.7]}><cylinderGeometry args={[.35, .35, .05, 24]}/><meshBasicMaterial color="#ad8f72"/></mesh>
      <Lightformer form="rect" intensity={1} position={[1, 2, 2]} scale={[3, .3, 1]}/>
    </Environment>
    <Mirror config={config} onPower={onPower}/>
    <mesh position={[0, 0, -.09]}><planeGeometry args={[8, 8]}/><meshStandardMaterial color={room ? '#74879e' : '#8c9fb6'} map={textures.plaster} bumpMap={textures.plaster} bumpScale={.002} roughness={.92}/></mesh>
    {room && <group>
      <mesh position={[0, -mirrorHeight / 2 - .18, .08]}><boxGeometry args={[Math.max(1.05, span * 1.3), .07, .38]}/><meshStandardMaterial color="#b6a18a" map={textures.wood} bumpMap={textures.wood} bumpScale={.006} roughness={.55}/></mesh>
      <mesh position={[0, -mirrorHeight / 2 - .26, 1]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[10, 10]}/><meshStandardMaterial color="#c6ccd3" map={textures.stone} roughness={.45}/></mesh>
      {Array.from({ length: 10 }, (_, i) => <mesh key={i} position={[mirrorWidth / 2 + .3 + i * .055, 0, -.06]}><boxGeometry args={[.025, 4, .05]}/><meshStandardMaterial color="#263c55" roughness={.65}/></mesh>)}
    </group>}
    <OrbitControls ref={controls} enabled={active} enablePan={false} enableZoom={false} enableDamping={false} minPolarAngle={.35} maxPolarAngle={Math.PI - .35} onStart={onInteract}/>
  </>;
}
export default function MirrorScene(props: MirrorSceneProps) {
  return <Canvas frameloop={props.visible ? 'demand' : 'never'} dpr={props.quality} camera={{ position: [0, 0, 2.2], fov: 39, near: .01, far: 25 }} gl={{ antialias: props.quality > 1, powerPreference: 'low-power' }} onDoubleClick={() => props.controller.current?.action('reset')} aria-label={`Visualisasi 3D cermin ${props.config.shape}`}>
    <Scene {...props}/>
  </Canvas>;
}
