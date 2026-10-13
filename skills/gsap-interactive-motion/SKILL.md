---
name: gsap-interactive-motion
description: Elite GSAP 3 (GreenSock Animation Platform) motion system and interactive techniques for 60fps/120fps luxury web experiences. Covers Canvas 360° product turntables, GSAP Observer & Draggable, wrapped frame scrubbers, kinetic inertia physics, shortest-path angle interpolation, cinematic macro dolly-zoom, and zero-GC ticker optimization.
---

# GSAP 3 Interactive Motion & 360° Turntable Mastery

This skill provides the architectural principles, formulas, and production-tested patterns for building ultra-luxurious, butter-smooth 60fps/120fps interactive animations using **GreenSock Animation Platform (GSAP 3)**.

---

## 1. Core Architecture for 360° Canvas Product Turntable (AirPods / Luxury Boutique Pattern)

When rendering a 360° turntable on an HTML5 `<canvas>`:

### Rule 1: High Frame Density (72 Frames Standard)
- Standard: **72 frames = 5.0° per frame** across a 360° circle.
- 72 frames guarantees that the angular delta between adjacent frames is so small that human persistence of vision perceives continuous, fluid 3D motion without stepping or jumping.

### Rule 2: Single Opaque Frame Draw (No Alpha Ghosting)
- **Anti-pattern**: Blending two rotated 2D photos with `globalAlpha` creates double-silhouette ghosting and muddy transparent edges.
- **GSAP Best Practice**: Draw the single active integer frame crisply with `ctx.drawImage(images[frame], 0, 0)`.
- Use `gsap.utils.wrap(0, totalFrames, frame)` to loop continuously around 360°.

### Rule 3: Zero-GC Render Loop
- Never create new `gsap.to()` tweens inside high-frequency listeners (`mousemove`, `touchmove`, or tick loops).
- Maintain an animated proxy object `{ frame: 0 }` or `{ angle: 0 }`.
- Use `gsap.quickTo()` or exponential lerp physics in `gsap.ticker.add()` to smoothly glide the current angle towards the target angle.
- Only call `ctx.drawImage` when the frame index ACTUALLY changes (`if (frame !== lastFrame)`).

---

## 2. GSAP Observer & Drag Physics

Using `Observer.create()` from GSAP provides cross-device, unified touch/mouse handling with built-in velocity tracking and zero DOM event overhead:

```javascript
gsap.registerPlugin(Observer);

let targetAngle = 0;
let currentAngle = 0;
const totalFrames = 72;
const degreesPerFrame = 360 / totalFrames; // 5.0°

// High-performance pointer listener
Observer.create({
  target: canvas,
  type: "pointer,touch",
  dragMinimum: 2,
  onPress: () => {
    isDragging = true;
  },
  onDrag: (self) => {
    // Map horizontal movement directly to angle
    const deltaX = self.deltaX;
    targetAngle -= deltaX * 0.42; // Sensitivity
  },
  onRelease: (self) => {
    isDragging = false;
    // Kinetic momentum coasting
    const vx = self.velocityX; // Pixels per second
    if (Math.abs(vx) > 100) {
      targetAngle -= vx * 0.08;
    }
  }
});
```

---

## 3. Exponential Lerp in GSAP Ticker

```javascript
gsap.ticker.add((time, deltaTime) => {
  // 1. Auto-rotation progression
  if (isAutoRotate && !isDragging && !isZoomed) {
    targetAngle += 20 * (deltaTime / 1000);
  }

  // 2. Exponential physics damping
  const diff = targetAngle - currentAngle;
  if (Math.abs(diff) > 0.001) {
    currentAngle += diff * 0.25; // Reaches target in ~150ms smoothly
  }

  // 3. Continuous 360 wrap
  const wrappedAngle = gsap.utils.wrap(0, 360, currentAngle);
  const frameIndex = Math.round(wrappedAngle / degreesPerFrame) % totalFrames;

  // 4. Draw ONLY on index transition (Zero CPU waste!)
  if (frameIndex !== lastDrawnIndex && loadedImages[frameIndex]) {
    ctx.drawImage(loadedImages[frameIndex], 0, 0, 1024, 1024);
    lastDrawnIndex = frameIndex;
  }
});
```

---

## 4. Shortest-Path Angle Preset Interpolation

When transitioning between angles (e.g., jumping to `0°`, `90°`, `180°`, `270°`), calculate the shortest angular distance so the turntable never spins the long way around:

```javascript
function rotateToPreset(targetPreset) {
  const normCurrent = gsap.utils.wrap(0, 360, targetAngle);
  let delta = targetPreset - normCurrent;
  
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;

  gsap.to(state, {
    targetAngle: targetAngle + delta,
    duration: 0.85,
    ease: "power3.inOut"
  });
}
```

---

## 5. Cinematic Macro Dolly-Zoom

For interactive hotspots that inspect macro tailoring details (collar, snaps, embroidery crest):

```javascript
function zoomToDetail(hotspot) {
  // 1. Glide to the optimal angle for the detail
  rotateToPreset(hotspot.optimalAngle);

  // 2. Zoom viewport towards the detail coordinate
  gsap.to(stageElement, {
    scale: hotspot.zoomScale, // e.g. 2.4x
    transformOrigin: `${hotspot.x}% ${hotspot.y}%`,
    duration: 0.85,
    ease: "expo.out"
  });

  // 3. Reveal Haute Couture Placard with back bounce
  gsap.fromTo(placardElement, 
    { opacity: 0, scale: 0.9, y: 24 },
    { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: "back.out(1.5)", delay: 0.15 }
  );
}
```

---

## 6. Official Resources
- GSAP Docs: https://gsap.com/docs/v3/
- GSAP Observer: https://gsap.com/docs/v3/Plugins/Observer/
- GSAP Draggable: https://gsap.com/docs/v3/Plugins/Draggable/
- GSAP ScrollTrigger: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
