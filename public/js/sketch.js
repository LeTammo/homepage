let particles = [];
let numParticles = 360;
let maxDistance = 70;
let speedMultiplier = 0.2;
let useColor = false;
let basicColor = 100;

let gridSize;
let grid = {};
let lineBuffer = [];

function setup() {
    frameRate(30);
    pixelDensity(1);

    let canvas = createCanvas(windowWidth, windowHeight, P2D);
    canvas.position(0, 0);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    canvas.attribute('data-protected', 'true');

    gridSize = maxDistance;

    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }
}

function draw() {
    clear();

    grid = {};
    for (let particle of particles) {
        particle.update();

        let gridX = floor(particle.x / gridSize);
        let gridY = floor(particle.y / gridSize);
        let key = `${gridX},${gridY}`;
        if (!grid[key]) grid[key] = [];
        grid[key].push(particle);
    }

    connectParticlesBatched();

    noStroke();
    if (!useColor) {
        fill(basicColor);
        for (let particle of particles) {
            if (particle.x >= -10 && particle.x <= width + 10 &&
                particle.y >= -10 && particle.y <= height + 10) {
                circle(particle.x, particle.y, particle.size);
            }
        }
    } else {
        for (let particle of particles) {
            if (particle.x >= -10 && particle.x <= width + 10 &&
                particle.y >= -10 && particle.y <= height + 10) {
                fill(particle.color);
                circle(particle.x, particle.y, particle.size);
            }
        }
    }
}

function connectParticlesBatched() {
    lineBuffer.length = 0;
    let checked = new Set();

    for (let particle of particles) {
        if (particle.x < -maxDistance || particle.x > width + maxDistance ||
            particle.y < -maxDistance || particle.y > height + maxDistance) {
            continue;
        }

        let gridX = floor(particle.x / gridSize);
        let gridY = floor(particle.y / gridSize);

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
                            let d = sqrt(dSq);
                            let alpha = map(d, 0, maxDistance, 255, 0);

                            if (useColor) {
                                let color1 = particle.color;
                                let color2 = other.color;
                                let r = lerp(red(color1), red(color2), 0.5);
                                let g = lerp(green(color1), green(color2), 0.5);
                                let b = lerp(blue(color1), blue(color2), 0.5);
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
            stroke(basicColor, 0);
            for (let lineData of lineBuffer) {
                stroke(basicColor, lineData.a);
                line(lineData.x1, lineData.y1, lineData.x2, lineData.y2);
            }
        } else {
            for (let lineData of lineBuffer) {
                stroke(lineData.r, lineData.g, lineData.b, lineData.a);
                line(lineData.x1, lineData.y1, lineData.x2, lineData.y2);
            }
        }
    }
}

class Particle {
    constructor() {
        this.id = Particle.nextId++;
        this.x = random(width);
        this.y = random(height);
        this.vx = random(-1, 1) * speedMultiplier;
        this.vy = random(-1, 1) * speedMultiplier;
        this.size = 3;
        this.color = useColor ? color(random(255), random(255), random(255)) : color(basicColor);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }
}

Particle.nextId = 0;

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function toggleColor() {
    useColor = !useColor;
    for (let particle of particles) {
        particle.color = useColor ? color(random(255), random(255), random(255)) : color(basicColor);
    }
}

function toggleSpeed() {
    speedMultiplier = speedMultiplier === 0.2 ? 0.9 : 0.2;
    for (let particle of particles) {
        particle.vx = random(-1, 1) * speedMultiplier;
        particle.vy = random(-1, 1) * speedMultiplier;
    }
}