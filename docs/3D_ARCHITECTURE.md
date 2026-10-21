# Product viewer

ProductViewer dynamically imports MirrorScene only after 3D or Dalam Ruang is requested. No per-card canvases. App Router static export remains supported with a client-only Canvas boundary. three + @react-three/fiber 9 + @react-three/drei are compatible with existing React 19. Geometry and camera code are isolated from business validation and analytics. Shared ExperienceProvider retains selected product/options across client navigation; camera state stays within the viewer.

Tier C generator: capsule and rounded rectangle outlines, oval and circle, extruded edge/back, reflective front, an LED ring and approximate touchscreen detail when selected. Entered dimensions are meters internally. Construction thickness, rear details and positioning are illustrative; never engineering claims. Leaf/Half Moon remain photographs.

Materials: PBR reflective metal-like mirror surface and restrained emissive LED. A local procedural environment using Lightformer provides reflections; no remote HDR dependency, no expensive dynamic planar reflection or full-scene bloom. Dalam Ruang adds a neutral wall, wood shelf and floor as a simulation. Switching studio/room preserves the Canvas and camera instead of reinitializing WebGL.

Interaction: OrbitControls drag after deliberate activation, dedicated keyboard-accessible rotation/zoom/reset/preset buttons, two-touch pinch zoom, Escape to finish, double-click reset. Wheel zoom is disabled to preserve page scrolling. Camera presets tween via refs/rAF without React frame updates and become immediate under reduced motion. Dimension changes preserve orientation and adjust framing. Feature/LED updates do not recreate Canvas; geometry is memoized and disposed when replaced.

Performance: demand rendering, never rendering when off-screen/hidden, DPR 1 on coarse/mobile and capped 1.5 desktop, conservative local lighting/environment map. A single canvas is mounted per visible page viewer. Event listeners and camera tween frames clean up on unmount; intentional Canvas disposal must not be mistaken for real context loss. Error boundary handles engine/renderer failures, and context loss explicitly returns a usable photograph/inquiry path.

Browser tests use Chromium software rendering. These results establish functional rendering and gesture behavior, not sustained FPS or thermal performance on physical phones. No GLB loader, CAD precision, AR, dimming claims, exact Kelvin specification, or verified full rear construction is claimed.
