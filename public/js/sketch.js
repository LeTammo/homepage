let particles = [];
let numParticles = 330;
let maxDistance = 70;
let speedMultiplier = 0.2;
let useColor = false;
let basicColor = 100;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style('z-index', '-1');
    canvas.style('position', 'fixed');
    canvas.attribute('data-protected', 'true');
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }
}

function draw() {
    clear();
    for (let particle of particles) {
        particle.update();
        particle.display();
    }
    connectParticles();
}

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            let d = dist(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
            if (d < maxDistance) {
                let alpha = map(d, 0, maxDistance, 255, 0);
                if (useColor) {
                    let color1 = particles[i].color;
                    let color2 = particles[j].color;
                    let r = lerp(red(color1), red(color2), 0.5);
                    let g = lerp(green(color1), green(color2), 0.5);
                    let b = lerp(blue(color1), blue(color2), 0.5);
                    stroke(r, g, b, alpha);
                } else {
                    stroke(basicColor, alpha);
                }
                line(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
            }
        }
    }
}

class Particle {
    constructor() {
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

    display() {
        noStroke();
        fill(this.color);
        ellipse(this.x, this.y, this.size, this.size);
    }
}

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