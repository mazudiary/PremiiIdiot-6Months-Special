// --- CONFIGURATION ---
// Detect mobile and screen size for adaptive performance
const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth <= 768;
const isSmallScreen = window.innerWidth <= 480;
const isLandscape = window.innerWidth > window.innerHeight;

// Adaptive particle count based on device capability
let PARTICLE_COUNT;
if (isSmallScreen) {
  PARTICLE_COUNT = 5000; // Small phones
} else if (isMobile) {
  PARTICLE_COUNT = 8000; // Tablets and larger phones
} else {
  PARTICLE_COUNT = 15000; // Desktop
}

const PARTICLE_SIZE = isMobile ? 0.22 : 0.15;
const ANIMATION_SPEED = isMobile ? 0.06 : 0.08; // Slightly slower on mobile
const ROTATION_SPEED = isMobile ? 0.001 : 0.002;
const MORPH_SPEED = isMobile ? 0.06 : 0.08; // Shape morphing speed

// --- THREE.JS SETUP ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 30;

// Adjust camera for mobile screens
if (isMobile) {
  camera.position.z = isSmallScreen ? 35 : 32; // Pull back slightly on mobile
}

const renderer = new THREE.WebGLRenderer({
  antialias: !isSmallScreen, // Disable antialiasing on small screens for performance
  alpha: true,
  powerPreference: isMobile ? "low-power" : "high-performance",
});
renderer.setSize(window.innerWidth, window.innerHeight);
// Limit pixel ratio on mobile to improve performance
renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 2 : 3));
document.body.appendChild(renderer.domElement);

// --- PARTICLE SYSTEM ---
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(PARTICLE_COUNT * 3);
const colors = new Float32Array(PARTICLE_COUNT * 3);

// Initialize random positions
for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 50;
  colors[i] = 1.0;
}

geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({
  size: PARTICLE_SIZE,
  vertexColors: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
  transparent: true,
  opacity: 0.8,
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

// --- SHAPE GENERATORS ---
// Helper to linear interpolation
function lerp(start, end, amt) {
  return (1 - amt) * start + amt * end;
}

// Target positions buffer for morphing
const targetPositions = new Float32Array(PARTICLE_COUNT * 3);

function generateHeart() {
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const t = Math.random() * Math.PI * 2;
    const r = Math.random();
    // Heart formula - beating heart effect
    const pulse = 1 + Math.sin(Date.now() * 0.001) * 0.1;
    let x = 16 * Math.pow(Math.sin(t), 3) * pulse;
    let y =
      (13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t)) *
      pulse;
    let z = (Math.random() - 0.5) * 5; // Thickness

    // Scale down
    x *= 0.8 * r;
    y *= 0.8 * r;
    z *= r;

    targetPositions[i * 3] = x;
    targetPositions[i * 3 + 1] = y;
    targetPositions[i * 3 + 2] = z;
  }
}

function generateTwoHearts() {
  const halfParticles = Math.floor(PARTICLE_COUNT / 2);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const t = Math.random() * Math.PI * 2;
    const r = Math.random();

    // Heart formula
    let x = 16 * Math.pow(Math.sin(t), 3);
    let y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);
    let z = (Math.random() - 0.5) * 3;

    x *= 0.5 * r;
    y *= 0.5 * r;
    z *= r;

    // Split into two hearts side by side
    if (i < halfParticles) {
      x -= 10; // Left heart
    } else {
      x += 10; // Right heart
    }

    targetPositions[i * 3] = x;
    targetPositions[i * 3 + 1] = y;
    targetPositions[i * 3 + 2] = z;
  }
}

function generateInfinity() {
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const t = (i / PARTICLE_COUNT) * Math.PI * 4;
    const scale = 8;

    // Infinity symbol (lemniscate)
    const x = (scale * Math.cos(t)) / (1 + Math.pow(Math.sin(t), 2));
    const y =
      (scale * Math.sin(t) * Math.cos(t)) / (1 + Math.pow(Math.sin(t), 2));
    const z = (Math.random() - 0.5) * 2;

    targetPositions[i * 3] = x;
    targetPositions[i * 3 + 1] = y;
    targetPositions[i * 3 + 2] = z;
  }
}

function generateCalendar() {
  // Create a grid representing 6 months calendar
  const months = 6;
  const daysPerMonth = 30;
  const particlesPerDay = Math.floor(PARTICLE_COUNT / (months * daysPerMonth));

  let idx = 0;
  for (let month = 0; month < months && idx < PARTICLE_COUNT; month++) {
    for (let day = 0; day < daysPerMonth && idx < PARTICLE_COUNT; day++) {
      for (let p = 0; p < particlesPerDay && idx < PARTICLE_COUNT; p++) {
        const x = (month - 2.5) * 8 + (Math.random() - 0.5) * 1.5;
        const y = (day - 15) * 0.8 + (Math.random() - 0.5) * 0.5;
        const z = (Math.random() - 0.5) * 2;

        targetPositions[idx * 3] = x;
        targetPositions[idx * 3 + 1] = y;
        targetPositions[idx * 3 + 2] = z;
        idx++;
      }
    }
  }
}

function generateBridge() {
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const t = i / PARTICLE_COUNT - 0.5;
    const x = t * 40;

    // Arc bridge connecting two sides
    const y = -15 * (1 - Math.pow(t * 2, 2)) + Math.random() * 2;
    const z = (Math.random() - 0.5) * 3;

    targetPositions[i * 3] = x;
    targetPositions[i * 3 + 1] = y;
    targetPositions[i * 3 + 2] = z;
  }
}

function generateIntertwinedHearts() {
  const halfParticles = Math.floor(PARTICLE_COUNT / 2);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const t = Math.random() * Math.PI * 2;
    const r = Math.random();

    // Heart formula
    let x = 16 * Math.pow(Math.sin(t), 3);
    let y =
      13 * Math.cos(t) -
      5 * Math.cos(2 * t) -
      2 * Math.cos(3 * t) -
      Math.cos(4 * t);
    let z = (Math.random() - 0.5) * 5;

    x *= 0.4 * r;
    y *= 0.4 * r;
    z *= r;

    // Rotate and position hearts to intertwine
    if (i < halfParticles) {
      const tempX = x;
      x = x * Math.cos(Math.PI / 4) - y * Math.sin(Math.PI / 4) - 5;
      y = tempX * Math.sin(Math.PI / 4) + y * Math.cos(Math.PI / 4);
    } else {
      const tempX = x;
      x = x * Math.cos(-Math.PI / 4) - y * Math.sin(-Math.PI / 4) + 5;
      y = tempX * Math.sin(-Math.PI / 4) + y * Math.cos(-Math.PI / 4);
    }

    targetPositions[i * 3] = x;
    targetPositions[i * 3 + 1] = y;
    targetPositions[i * 3 + 2] = z;
  }
}

function generateEnvelope() {
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Envelope shape
    const u = (Math.random() - 0.5) * 20;
    const v = (Math.random() - 0.5) * 14;

    let x = u;
    let y = v;
    let z = 0;

    // Create envelope flap
    if (Math.abs(u) < 10 && v > 0 && v < 7) {
      z = (7 - v) * 0.5;
    }

    // Add small heart in center
    if (Math.abs(u) < 3 && Math.abs(v) < 3) {
      const t = Math.atan2(v, u);
      const dist = Math.sqrt(u * u + v * v);
      z = Math.max(z, 5 - dist);
    }

    targetPositions[i * 3] = x;
    targetPositions[i * 3 + 1] = y;
    targetPositions[i * 3 + 2] = z + (Math.random() - 0.5) * 1;
  }
}

function generateRose() {
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;

    // Rose curve with multiple petals
    const k = 5;
    const r = Math.abs(Math.cos(k * theta)) * 12 + 2;

    const x = r * Math.sin(phi) * Math.cos(theta);
    const y = r * Math.sin(phi) * Math.sin(theta);
    const z = r * Math.cos(phi) * 0.3 - 5;

    targetPositions[i * 3] = x;
    targetPositions[i * 3 + 1] = y;
    targetPositions[i * 3 + 2] = z;
  }
}

function generateRingBox() {
  const boxSize = 12;
  const ringParticles = Math.floor(PARTICLE_COUNT * 0.3);

  // Ring
  for (let i = 0; i < ringParticles; i++) {
    const t = (i / ringParticles) * Math.PI * 2;
    const r = 4;
    const x = r * Math.cos(t);
    const y = r * Math.sin(t);
    const z = 5;

    targetPositions[i * 3] = x;
    targetPositions[i * 3 + 1] = y;
    targetPositions[i * 3 + 2] = z;
  }

  // Box
  for (let i = ringParticles; i < PARTICLE_COUNT; i++) {
    const face = Math.floor(Math.random() * 6);
    const u = (Math.random() - 0.5) * boxSize;
    const v = (Math.random() - 0.5) * boxSize;

    let x, y, z;
    switch (face) {
      case 0:
        x = boxSize / 2;
        y = u;
        z = v - 5;
        break;
      case 1:
        x = -boxSize / 2;
        y = u;
        z = v - 5;
        break;
      case 2:
        x = u;
        y = boxSize / 2;
        z = v - 5;
        break;
      case 3:
        x = u;
        y = -boxSize / 2;
        z = v - 5;
        break;
      case 4:
        x = u;
        y = v;
        z = boxSize / 2 - 5;
        break;
      case 5:
        x = u;
        y = v;
        z = -boxSize / 2 - 5;
        break;
    }

    targetPositions[i * 3] = x;
    targetPositions[i * 3 + 1] = y;
    targetPositions[i * 3 + 2] = z;
  }
}

function generateCountdown() {
  // Create circular countdown clock
  const clockRadius = 15;
  const numbersParticles = Math.floor(PARTICLE_COUNT * 0.4);

  // Clock circle
  for (let i = 0; i < numbersParticles; i++) {
    const t = (i / numbersParticles) * Math.PI * 2;
    const r = clockRadius + (Math.random() - 0.5) * 1;

    const x = r * Math.cos(t);
    const y = r * Math.sin(t);
    const z = (Math.random() - 0.5) * 1;

    targetPositions[i * 3] = x;
    targetPositions[i * 3 + 1] = y;
    targetPositions[i * 3 + 2] = z;
  }

  // Center heart representing countdown to reunion
  for (let i = numbersParticles; i < PARTICLE_COUNT; i++) {
    const t = Math.random() * Math.PI * 2;
    const r = Math.random();

    let x = 8 * Math.pow(Math.sin(t), 3);
    let y =
      6.5 * Math.cos(t) -
      2.5 * Math.cos(2 * t) -
      Math.cos(3 * t) -
      0.5 * Math.cos(4 * t);
    let z = (Math.random() - 0.5) * 2;

    x *= 0.6 * r;
    y *= 0.6 * r;

    targetPositions[i * 3] = x;
    targetPositions[i * 3 + 1] = y;
    targetPositions[i * 3 + 2] = z;
  }
}

function generateLILI() {
  // Create "LILI" text with particles - properly showing all letters
  const letterSpacing = 12;
  const letterHeight = 18;
  const letterWidth = 10;
  const particlesPerLetter = Math.floor(PARTICLE_COUNT / 4);

  let idx = 0;

  // Letter L (1st) - Left position
  for (let i = 0; i < particlesPerLetter && idx < PARTICLE_COUNT; i++) {
    const t = i / particlesPerLetter;
    let x = -letterSpacing * 1.5;
    let y = 0;

    if (t < 0.6) {
      // Vertical line (60% of particles)
      y = (t / 0.6) * letterHeight - letterHeight / 2;
      x += (Math.random() - 0.5) * 0.8;
    } else {
      // Horizontal bottom (40% of particles)
      y = letterHeight / 2 - Math.random() * 0.5;
      x += ((t - 0.6) / 0.4) * letterWidth;
    }

    const z = (Math.random() - 0.5) * 2;
    targetPositions[idx * 3] = x;
    targetPositions[idx * 3 + 1] = y;
    targetPositions[idx * 3 + 2] = z;
    idx++;
  }

  // Letter I (1st)
  for (let i = 0; i < particlesPerLetter && idx < PARTICLE_COUNT; i++) {
    const t = i / particlesPerLetter;
    const x = -letterSpacing * 0.5 + (Math.random() - 0.5) * 0.8;
    const y = t * letterHeight - letterHeight / 2;
    const z = (Math.random() - 0.5) * 2;

    targetPositions[idx * 3] = x;
    targetPositions[idx * 3 + 1] = y;
    targetPositions[idx * 3 + 2] = z;
    idx++;
  }

  // Letter L (2nd)
  for (let i = 0; i < particlesPerLetter && idx < PARTICLE_COUNT; i++) {
    const t = i / particlesPerLetter;
    let x = letterSpacing * 0.5;
    let y = 0;

    if (t < 0.6) {
      // Vertical line (60% of particles)
      y = (t / 0.6) * letterHeight - letterHeight / 2;
      x += (Math.random() - 0.5) * 0.8;
    } else {
      // Horizontal bottom (40% of particles)
      y = letterHeight / 2 - Math.random() * 0.5;
      x += ((t - 0.6) / 0.4) * letterWidth;
    }

    const z = (Math.random() - 0.5) * 2;
    targetPositions[idx * 3] = x;
    targetPositions[idx * 3 + 1] = y;
    targetPositions[idx * 3 + 2] = z;
    idx++;
  }

  // Letter I (2nd)
  for (let i = 0; i < particlesPerLetter && idx < PARTICLE_COUNT; i++) {
    const t = i / particlesPerLetter;
    const x = letterSpacing * 1.5 + (Math.random() - 0.5) * 0.8;
    const y = t * letterHeight - letterHeight / 2;
    const z = (Math.random() - 0.5) * 2;

    targetPositions[idx * 3] = x;
    targetPositions[idx * 3 + 1] = y;
    targetPositions[idx * 3 + 2] = z;
    idx++;
  }

  // Fill remaining particles around the text with sparkles/heart shape
  for (; idx < PARTICLE_COUNT; idx++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 25 + Math.random() * 8;

    // Create heart-shaped sparkle border
    const t = angle;
    const heartR = radius * (0.8 + 0.2 * (Math.sin(t) * 0.5 + 0.5));

    targetPositions[idx * 3] = Math.cos(angle) * heartR * 0.7;
    targetPositions[idx * 3 + 1] = Math.sin(angle) * heartR;
    targetPositions[idx * 3 + 2] = (Math.random() - 0.5) * 4;
  }
}

// Initial shape - Show LILI when waiting
generateLILI();
let currentShape = "lili";

// --- ANIMATION LOOP VARS ---
let globalScale = 1.0;
let targetScale = 1.0;
let baseColor = new THREE.Color(0xff1493); // Start with deep pink (romantic)

function animate() {
  requestAnimationFrame(animate);

  // 1. Morph positions
  const positionsAttribute = particles.geometry.attributes.position;
  const currentPos = positionsAttribute.array;

  // Smoothly move particles to target shape
  for (let i = 0; i < PARTICLE_COUNT * 3; i++) {
    currentPos[i] += (targetPositions[i] - currentPos[i]) * MORPH_SPEED;
  }
  positionsAttribute.needsUpdate = true;

  // 2. Apply Scale (Breathing effect + Hand control)
  // We do this by scaling the mesh object
  globalScale = lerp(globalScale, targetScale, 0.1);
  particles.scale.set(globalScale, globalScale, globalScale);

  // 3. Rotation for visual flair
  particles.rotation.y += ROTATION_SPEED;

  // 4. Update Color
  particles.material.color.lerp(baseColor, 0.1);

  renderer.render(scene, camera);
}
animate();

// --- UI TOGGLE FOR MOBILE ---
function toggleUI() {
  const ui = document.getElementById("ui");
  ui.classList.toggle("minimized");
}

// Request fullscreen on mobile for better experience
if (isMobile) {
  setTimeout(() => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen().catch(() => {});
    }
  }, 1000);
}

// Battery and connection awareness for mobile
if (isMobile && navigator.getBattery) {
  navigator.getBattery().then((battery) => {
    // Reduce quality if battery is low
    if (battery.level < 0.2) {
      console.log("Low battery detected, reducing performance mode");
      material.opacity = 0.6;
    }
  });
}

// Network awareness
if (isMobile && "connection" in navigator) {
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;
  if (
    (connection && connection.effectiveType === "slow-2g") ||
    connection.effectiveType === "2g"
  ) {
    console.log("Slow connection detected");
  }
}

// --- MEDIAPIPE HANDS SETUP ---
const videoElement = document.getElementById("input_video");
const statusText = document.getElementById("status");

function onResults(results) {
  document.getElementById("loading").style.display = "none";

  if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
    // Count total fingers from all detected hands
    let totalFingersUp = 0;

    for (
      let handIndex = 0;
      handIndex < results.multiHandLandmarks.length;
      handIndex++
    ) {
      const hand = results.multiHandLandmarks[handIndex];
      const handedness = results.multiHandedness[handIndex].label;

      let fingersUp = 0;
      // Thumb (check x distance for simplicity in 2D or relative to palm)
      if (hand[4].x < hand[3].x && handedness === "Right") fingersUp++;
      if (hand[4].x > hand[3].x && handedness === "Left") fingersUp++;

      // Other fingers (check Y, if Tip is above PIP)
      if (hand[8].y < hand[6].y) fingersUp++;
      if (hand[12].y < hand[10].y) fingersUp++;
      if (hand[16].y < hand[14].y) fingersUp++;
      if (hand[20].y < hand[18].y) fingersUp++;

      totalFingersUp += fingersUp;
    }

    // Use first hand for other interactions
    const hand = results.multiHandLandmarks[0];

    // --- 1. DETECT GESTURES FOR SHAPE SWITCHING ---
    if (totalFingersUp === 1 && currentShape !== "heart") {
      currentShape = "heart";
      generateHeart();
      statusText.innerText = `💗 My heart beats for you`;
    } else if (totalFingersUp === 2 && currentShape !== "twohearts") {
      currentShape = "twohearts";
      generateTwoHearts();
      statusText.innerText = `💕 Two hearts, one love`;
    } else if (totalFingersUp === 3 && currentShape !== "infinity") {
      currentShape = "infinity";
      generateInfinity();
      statusText.innerText = `♾️ Forever and always`;
    } else if (totalFingersUp === 4 && currentShape !== "calendar") {
      currentShape = "calendar";
      generateCalendar();
      statusText.innerText = `📅 6 months of love and counting`;
    } else if (totalFingersUp === 5 && currentShape !== "bridge") {
      currentShape = "bridge";
      generateBridge();
      statusText.innerText = `🌉 Distance means nothing to us`;
    } else if (totalFingersUp === 6 && currentShape !== "intertwined") {
      currentShape = "intertwined";
      generateIntertwinedHearts();
      statusText.innerText = `💞 Our souls are connected`;
    } else if (totalFingersUp === 7 && currentShape !== "envelope") {
      currentShape = "envelope";
      generateEnvelope();
      statusText.innerText = `💌 Every message brings us closer`;
    } else if (totalFingersUp === 8 && currentShape !== "rose") {
      currentShape = "rose";
      generateRose();
      statusText.innerText = `🌹 A rose across the miles`;
    } else if (totalFingersUp === 9 && currentShape !== "ring") {
      currentShape = "ring";
      generateRingBox();
      statusText.innerText = `💍 A promise to keep`;
    } else if (totalFingersUp >= 10 && currentShape !== "countdown") {
      currentShape = "countdown";
      generateCountdown();
      statusText.innerText = `⏰ Counting every moment until we're together`;
    }

    // --- 2. DETECT HAND EXPANSION (PINCH/OPEN) ---
    // Distance between Thumb Tip (4) and Index Tip (8)
    const x1 = hand[4].x;
    const y1 = hand[4].y;
    const x2 = hand[8].x;
    const y2 = hand[8].y;
    const distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    // Map distance (approx 0.05 to 0.3) to Scale (0.5 to 2.0)
    // Or use Palm center to finger average for "Openness"
    // Let's use simple Index-Thumb distance for fine control
    let newScale = 0.5 + distance * 5;
    if (newScale > 3.0) newScale = 3.0; // clamp
    targetScale = newScale;

    // --- 3. DETECT HAND POSITION FOR COLOR ---
    // X coordinate (0.0 to 1.0). Invert X because camera is mirrored usually
    const handX = 1.0 - hand[9].x; // 9 is middle finger knuckle (center of hand)

    // Map X to Hue (0 to 360)
    const hue = handX;
    baseColor.setHSL(hue, 1.0, 0.5);
  } else {
    // Show LILI when no hand detected
    if (currentShape !== "lili") {
      currentShape = "lili";
      generateLILI();
      statusText.innerText = "💖 LILI - Show your hand to see magic!";
    }
    // Slowly return to neutral state if no hand
    targetScale = 1.0;
  }
}

const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  },
});

hands.setOptions({
  maxNumHands: 2, // Detect 2 hands for 6-10 finger gestures
  modelComplexity: isMobile ? 0 : 1, // Lighter model on mobile
  minDetectionConfidence: isMobile ? 0.6 : 0.7,
  minTrackingConfidence: isMobile ? 0.6 : 0.7,
});

hands.onResults(onResults);

// Adaptive camera resolution for mobile
const cameraWidth = isMobile ? (isSmallScreen ? 320 : 480) : 640;
const cameraHeight = isMobile ? (isSmallScreen ? 240 : 360) : 480;

const cameraUtils = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: cameraWidth,
  height: cameraHeight,
});
cameraUtils.start();

// Resize and orientation change handler
function handleResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", handleResize);
window.addEventListener("orientationchange", () => {
  setTimeout(handleResize, 100); // Small delay for orientation to settle
});

// Prevent default touch behaviors on mobile
if (isMobile) {
  document.addEventListener(
    "touchstart",
    (e) => {
      if (e.target.id !== "toggle-ui") {
        e.preventDefault();
      }
    },
    { passive: false }
  );

  document.addEventListener(
    "touchmove",
    (e) => {
      e.preventDefault();
    },
    { passive: false }
  );

  document.addEventListener("gesturestart", (e) => {
    e.preventDefault();
  });
}

// Performance monitoring and adaptive quality for mobile
if (isMobile) {
  let frameCount = 0;
  let lastTime = performance.now();
  let lowFpsCount = 0;

  setInterval(() => {
    const currentTime = performance.now();
    const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
    frameCount = 0;
    lastTime = currentTime;

    // Auto-adjust quality if FPS drops too low
    if (fps < 20) {
      lowFpsCount++;
      if (lowFpsCount > 3) {
        // Consistent low FPS
        console.log("Low FPS detected, reducing quality");
        material.opacity = Math.max(0.5, material.opacity - 0.1);
        lowFpsCount = 0;
      }
    } else {
      lowFpsCount = 0;
    }
  }, 2000);

  setInterval(() => frameCount++, 16);

  // Pause rendering when page is not visible
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      console.log("Page hidden, pausing camera");
      cameraUtils.stop();
    } else {
      console.log("Page visible, resuming camera");
      cameraUtils.start();
    }
  });
}

// Wake Lock API to prevent screen from dimming during use
if (isMobile && "wakeLock" in navigator) {
  let wakeLock = null;

  const requestWakeLock = async () => {
    try {
      wakeLock = await navigator.wakeLock.request("screen");
      console.log("Wake Lock active");

      wakeLock.addEventListener("release", () => {
        console.log("Wake Lock released");
      });
    } catch (err) {
      console.log("Wake Lock error:", err);
    }
  };

  requestWakeLock();

  // Re-acquire wake lock when page becomes visible
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && wakeLock !== null) {
      requestWakeLock();
    }
  });
}
