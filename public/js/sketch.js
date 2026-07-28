let canvas, ctx;
let animationFrame = null;
let particles = [];
let grid = {};
let gridSize;
let maxDistance = 70;
let speedMultiplier = 0.2;
let useColor = false;
let basicColor = 100;
let accelerated = false;
let lastFrameTime = 0;
let nextParticleId = 0;
let initialized = false;

const MIN_SCREEN = 320;
const MAX_SCREEN = 1920;
const MIN_PARTICLES = 100;
const MAX_PARTICLES = 360;
const MIN_MAXDIST = 40;
const MAX_MAXDIST = 70;
const FRAME_INTERVAL = 1000 / 30;
const isTouch = window.matchMedia('(pointer: coarse)').matches;
const TOUCH_PARTICLE_FACTOR = 0.5;

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function lerp(a, b, t) {
    return a + (b - a) * t;
}

function computeScaledValues() {
    const w = clamp(window.innerWidth, MIN_SCREEN, MAX_SCREEN);
    const t = clamp((w - MIN_SCREEN) / (MAX_SCREEN - MIN_SCREEN), 0, 1);
    let scaledNum = Math.floor(lerp(MIN_PARTICLES, MAX_PARTICLES, t));
    if (isTouch) scaledNum = Math.round(scaledNum * TOUCH_PARTICLE_FACTOR);
    const scaledMaxDist = lerp(MIN_MAXDIST, MAX_MAXDIST, t);
    return { scaledNum, scaledMaxDist };
}

class Particle {
    constructor(id) {
        this.id = id;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() * 2 - 1) * speedMultiplier;
        this.vy = (Math.random() * 2 - 1) * speedMultiplier;
        this.size = 3;
        this.applyColor();
    }

    applyColor() {
        if (useColor) {
            this.r = Math.random() * 255 | 0;
            this.g = Math.random() * 255 | 0;
            this.b = Math.random() * 255 | 0;
        } else {
            this.r = this.g = this.b = basicColor;
        }
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
}

function connectParticles() {
    const checked = new Set();
    const maxDistSq = maxDistance * maxDistance;

    for (const particle of particles) {
        if (particle.x < -maxDistance || particle.x > canvas.width + maxDistance ||
            particle.y < -maxDistance || particle.y > canvas.height + maxDistance) {
            continue;
        }

        const gx = Math.floor(particle.x / gridSize);
        const gy = Math.floor(particle.y / gridSize);

        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const neighbors = grid[`${gx + dx},${gy + dy}`];
                if (!neighbors) continue;

                for (const other of neighbors) {
                    if (particle === other) continue;

                    const pairKey = particle.id < other.id
                        ? `${particle.id}-${other.id}`
                        : `${other.id}-${particle.id}`;
                    if (checked.has(pairKey)) continue;
                    checked.add(pairKey);

                    const ddx = particle.x - other.x;
                    const ddy = particle.y - other.y;
                    const dSq = ddx * ddx + ddy * ddy;
                    if (dSq >= maxDistSq) continue;

                    const alpha = clamp(1 - Math.sqrt(dSq) / maxDistance, 0, 1);
                    const r = (particle.r + other.r) / 2;
                    const g = (particle.g + other.g) / 2;
                    const b = (particle.b + other.b) / 2;

                    ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.stroke();
                }
            }
        }
    }
}

function draw(timestamp) {
    animationFrame = requestAnimationFrame(draw);
    if (timestamp - lastFrameTime < FRAME_INTERVAL) return;
    lastFrameTime = timestamp;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    grid = {};
    for (const particle of particles) {
        particle.update();
        const key = `${Math.floor(particle.x / gridSize)},${Math.floor(particle.y / gridSize)}`;
        (grid[key] || (grid[key] = [])).push(particle);
    }

    connectParticles();

    for (const particle of particles) {
        if (particle.x >= -10 && particle.x <= canvas.width + 10 &&
            particle.y >= -10 && particle.y <= canvas.height + 10) {
            ctx.fillStyle = `rgb(${particle.r},${particle.g},${particle.b})`;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const { scaledNum, scaledMaxDist } = computeScaledValues();
    maxDistance = scaledMaxDist;
    gridSize = maxDistance;

    if (scaledNum > particles.length) {
        for (let i = particles.length; i < scaledNum; i++) {
            particles.push(new Particle(nextParticleId++));
        }
    } else if (scaledNum < particles.length) {
        particles.length = scaledNum;
    }
}

function initSketch() {
    const container = document.getElementById('p5-bg');
    if (!container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.zIndex = '-1';
    canvas.setAttribute('data-protected', 'true');
    container.appendChild(canvas);

    ctx = canvas.getContext('2d');
    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            if (animationFrame) cancelAnimationFrame(animationFrame);
            animationFrame = null;
        } else if (!animationFrame) {
            lastFrameTime = 0;
            animationFrame = requestAnimationFrame(draw);
        }
    });

    if (!document.hidden) {
        animationFrame = requestAnimationFrame(draw);
    }

    initialized = true;
}

function ensureSketch() {
    if (!initialized && document.getElementById('p5-bg')) {
        initSketch();
    }
}

// used by the toggleColor button at the footer of the page
function toggleColor() {
    useColor = !useColor;
    for (const particle of particles) particle.applyColor();
}

// used by the toggleSpeed button at the footer of the page
function toggleSpeed() {
    const factor = accelerated ? 1 / 5 : 5;
    accelerated = !accelerated;
    speedMultiplier *= factor;
    for (const particle of particles) {
        particle.vx *= factor;
        particle.vy *= factor;
    }
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    ensureSketch();
}

document.addEventListener('astro:page-load', ensureSketch);
