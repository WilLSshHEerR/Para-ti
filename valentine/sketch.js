const canvas = document.getElementById('canvasValentin');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const particleCount = 600;
let target = { x: canvas.width / 2, y: canvas.height / 2 };
let interacting = false;

function updateTarget(e) {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    target.x = clientX;
    target.y = clientY;
}

// Interaction listeners
const start = (e) => { interacting = true; updateTarget(e); };
const move = (e) => { updateTarget(e); };
const end = () => { /* remains interacting if we want the heart to stay there */ };

window.addEventListener('mousedown', start);
window.addEventListener('mousemove', move);
window.addEventListener('touchstart', (e) => { e.preventDefault(); start(e); }, { passive: false });
window.addEventListener('touchmove', (e) => { e.preventDefault(); move(e); }, { passive: false });

class Particle {
    constructor() {
        this.init();
    }

    init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 8;
        this.vy = (Math.random() - 0.5) * 8;
        this.size = Math.random() * 2 + 0.5;
        // Cosmic colors: stars, nebula pinks, and deep reds
        this.color = `hsla(${Math.random() * 50 + 330}, 85%, 70%, ${Math.random() * 0.5 + 0.3})`;
    }

    update() {
        // "Enjambre Caótico" (Chaotic Swarm) logic:
        // Each frame, the particle aims for a random point on the heart perimeter.
        // This creates a nebulous, alive, and cosmic "cloud" effect.

        let t = Math.random() * Math.PI * 2;
        let scale = Math.min(canvas.width, canvas.height) / 55; // Smaller and cohesive

        // Heart shape coordinates
        let heartX = target.x + (16 * Math.pow(Math.sin(t), 3)) * scale;
        let heartY = target.y - (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * scale;

        let dx = heartX - this.x;
        let dy = heartY - this.y;
        let dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);

        // Attraction force (Swarm behavior)
        this.vx += (dx / dist) * 0.25;
        this.vy += (dy / dist) * 0.25;

        // Space friction (allows for "swarming" orbit behavior)
        this.vx *= 0.94;
        this.vy *= 0.94;

        this.x += this.vx;
        this.y += this.vy;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

function setup() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function loop() {
    // Nebulous trail effect (Space-like)
    ctx.fillStyle = 'rgba(10, 10, 25, 0.15)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(loop);
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    setup();
});

setup();
loop();