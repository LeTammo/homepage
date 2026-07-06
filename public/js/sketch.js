let p5Instance;

function initSketch() {
    if (p5Instance) {
        p5Instance.remove();
    }

    const sketch = (p) => {
        let particles = [];
        let numParticles = 360;
        let maxDistance = 70;
        let speedMultiplier = 0.2;
        let useColor = false;
        let basicColor = 100;

        let gridSize;
        let grid = {};
        let lineBuffer = [];

        const MIN_SCREEN = 320;
        const MAX_SCREEN = 1920;
        const MIN_PARTICLES = 100;
        const MAX_PARTICLES = 360;
        const MIN_MAXDIST = 40;
        const MAX_MAXDIST = 70;

        function computeScaledValues() {
            let w = p.constrain(p.windowWidth, MIN_SCREEN, MAX_SCREEN);
            let t = (w - MIN_SCREEN) / (MAX_SCREEN - MIN_SCREEN);
            t = p.constrain(t, 0, 1);

            let scaledNum = p.floor(p.lerp(MIN_PARTICLES, MAX_PARTICLES, t));
            let scaledMaxDist = p.lerp(MIN_MAXDIST, MAX_MAXDIST, t);

            return { scaledNum, scaledMaxDist };
        }

        p.setup = () => {
            p.frameRate(30);
            p.pixelDensity(1);

            let canvas = p.createCanvas(p.windowWidth, p.windowHeight, p.P2D);
            canvas.position(0, 0);
            canvas.style('z-index', '-1');
            canvas.style('position', 'fixed');
            canvas.attribute('data-protected', 'true');

            const { scaledNum, scaledMaxDist } = computeScaledValues();
            numParticles = scaledNum;
            maxDistance = scaledMaxDist;
            gridSize = maxDistance;

            for (let i = 0; i < numParticles; i++) {
                particles.push(new Particle(p, speedMultiplier, useColor, basicColor));
            }
        };

        p.draw = () => {
            p.clear();

            grid = {};
            for (let particle of particles) {
                particle.update(p);

                let gridX = p.floor(particle.x / gridSize);
                let gridY = p.floor(particle.y / gridSize);
                let key = `${gridX},${gridY}`;
                if (!grid[key]) grid[key] = [];
                grid[key].push(particle);
            }

            connectParticlesBatched(p, particles, grid, gridSize, maxDistance, useColor, basicColor, lineBuffer);

            p.noStroke();
            if (!useColor) {
                p.fill(basicColor);
                for (let particle of particles) {
                    if (particle.x >= -10 && particle.x <= p.width + 10 &&
                        particle.y >= -10 && particle.y <= p.height + 10) {
                        p.circle(particle.x, particle.y, particle.size);
                    }
                }
            } else {
                for (let particle of particles) {
                    if (particle.x >= -10 && particle.x <= p.width + 10 &&
                        particle.y >= -10 && particle.y <= p.height + 10) {
                        p.fill(particle.color);
                        p.circle(particle.x, particle.y, particle.size);
                    }
                }
            }
        };

        p.toggleColor = () => {
            useColor = !useColor;
            for (let particle of particles) {
                particle.color = useColor
                    ? p.color(p.random(255), p.random(255), p.random(255))
                    : p.color(basicColor);
            }
        };

        let accelerated = false;
        p.toggleSpeed = () => {
            const factor = accelerated ? 1 / 5 : 5;
            accelerated = !accelerated;
            speedMultiplier *= factor;
            for (let particle of particles) {
                particle.vx *= factor;
                particle.vy *= factor;
            }
        };

        p.windowResized = () => {
            p.resizeCanvas(p.windowWidth, p.windowHeight);

            const { scaledNum, scaledMaxDist } = computeScaledValues();

            maxDistance = scaledMaxDist;
            gridSize = maxDistance;

            if (scaledNum > particles.length) {
                for (let i = particles.length; i < scaledNum; i++) {
                    particles.push(new Particle(p, speedMultiplier, useColor, basicColor));
                }
            } else if (scaledNum < particles.length) {
                particles.length = scaledNum;
            }
            numParticles = scaledNum;
        };
    };

    p5Instance = new p5(sketch, document.getElementById('p5-bg'));
}

function ensureSketch() {
    if (typeof p5 !== 'undefined' && !p5Instance && document.getElementById('p5-bg')) {
        initSketch();
    }
}

function toggleColor() {
    if (p5Instance) p5Instance.toggleColor();
}

function toggleSpeed() {
    if (p5Instance) p5Instance.toggleSpeed();
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
    ensureSketch();
}

function connectParticlesBatched(p, particles, grid, gridSize, maxDistance, useColor, basicColor, lineBuffer) {
    lineBuffer.length = 0;
    let checked = new Set();

    for (let particle of particles) {
        if (particle.x < -maxDistance || particle.x > p.width + maxDistance ||
            particle.y < -maxDistance || particle.y > p.height + maxDistance) {
            continue;
        }

        let gridX = p.floor(particle.x / gridSize);
        let gridY = p.floor(particle.y / gridSize);

        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                let key = `${gridX + dx},${gridY + dy}`;
                let neighbors = grid[key];

                if (neighbors) {
                    for (let other of neighbors) {
                        if (particle === other) continue;

                        let pairKey = particle.id < other.id ?
                            `${particle.id}-${other.id}` :
                            `${other.id}-${particle.id}`;

                        if (checked.has(pairKey)) continue;
                        checked.add(pairKey);

                        let dx = particle.x - other.x;
                        let dy = particle.y - other.y;
                        let dSq = dx * dx + dy * dy;
                        let maxDistSq = maxDistance * maxDistance;

                        if (dSq < maxDistSq) {
                            let d = p.sqrt(dSq);
                            let alpha = p.map(d, 0, maxDistance, 255, 0);

                            if (useColor) {
                                let color1 = particle.color;
                                let color2 = other.color;
                                let r = p.lerp(p.red(color1), p.red(color2), 0.5);
                                let g = p.lerp(p.green(color1), p.green(color2), 0.5);
                                let b = p.lerp(p.blue(color1), p.blue(color2), 0.5);
                                lineBuffer.push({
                                    x1: particle.x, y1: particle.y,
                                    x2: other.x, y2: other.y,
                                    r: r, g: g, b: b, a: alpha
                                });
                            } else {
                                lineBuffer.push({
                                    x1: particle.x, y1: particle.y,
                                    x2: other.x, y2: other.y,
                                    a: alpha
                                });
                            }
                        }
                    }
                }
            }
        }
    }

    if (lineBuffer.length > 0) {
        if (!useColor) {
            p.stroke(basicColor, 0);
            for (let lineData of lineBuffer) {
                p.stroke(basicColor, lineData.a);
                p.line(lineData.x1, lineData.y1, lineData.x2, lineData.y2);
            }
        } else {
            for (let lineData of lineBuffer) {
                p.stroke(lineData.r, lineData.g, lineData.b, lineData.a);
                p.line(lineData.x1, lineData.y1, lineData.x2, lineData.y2);
            }
        }
    }
}

class Particle {
    static nextId = 0;
    constructor(p, speedMultiplier, useColor, basicColor) {
        this.id = Particle.nextId++;
        this.x = p.random(p.width || window.innerWidth);
        this.y = p.random(p.height || window.innerHeight);
        this.vx = p.random(-1, 1) * speedMultiplier;
        this.vy = p.random(-1, 1) * speedMultiplier;
        this.size = 3;
        this.color = useColor ? p.color(p.random(255), p.random(255), p.random(255)) : p.color(basicColor);
    }

    update(p) {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > p.width) this.vx *= -1;
        if (this.y < 0 || this.y > p.height) this.vy *= -1;
    }
}

document.addEventListener('astro:page-load', ensureSketch);