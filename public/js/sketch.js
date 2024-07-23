let particles = [];
let numParticles = 330;
let maxDistance = 60;
let speedMultiplier = 0.2;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    canvas.style('z-index', '-1');
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
                stroke(255, alpha);
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
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    display() {
        noStroke();
        fill(255);
        ellipse(this.x, this.y, this.size, this.size);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
