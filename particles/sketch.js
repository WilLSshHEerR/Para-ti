let font;
let particles = [];
let msgIndex = 0;
let phrases = ["TE ADORO", "MUGROSA", "LUNA"]; // La 3ra activará la luna
let interactionStarted = false;

function preload() {
  font = loadFont('https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/fonts/HTML-CSS/TeX/otf/MathJax_Main-Regular.otf');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  // 1200 partículas son suficientes para una luna bien definida
  for (let i = 0; i < 1200; i++) {
    particles.push(new Particle(random(width), random(height)));
  }
}

function draw() {
  clear(); // Limpiar el canvas para que se vea el fondo CSS
  // background(5, 10, 20); // Comentado para usar el fondo espacial CSS
  for (let p of particles) {
    p.update();
    p.show();
  }
}

function mousePressed() {
  interactionStarted = true;
  let pts = [];

  if (msgIndex < 2) {
    // LÓGICA PARA TEXTO ("TE ADORO" y "MUGROSA")
    let tSize = min(width / 7, 120);
    pts = font.textToPoints(phrases[msgIndex], 0, 0, tSize, { sampleFactor: 0.3 });

    let bounds = font.textBounds(phrases[msgIndex], 0, 0, tSize);
    let offsetX = width / 2 - bounds.w / 2;
    let offsetY = height / 2 + bounds.h / 2;

    for (let i = 0; i < particles.length; i++) {
      if (i < pts.length) {
        particles[i].setTarget(pts[i].x + offsetX, pts[i].y + offsetY, "TEXTO");
      } else {
        particles[i].setTarget(random(width), random(height), "ESTRELLA");
      }
    }
  } else {
    // LÓGICA PARA LA LUNA CRECIENTE
    let count = 0;
    let totalLunaParticles = 800;
    let radius = 150;

    while (count < totalLunaParticles) {
      // Generamos puntos aleatorios dentro de un círculo
      let angle = random(TWO_PI);
      let r = radius * sqrt(random());
      let x = r * cos(angle);
      let y = r * sin(angle);

      // Filtro matemático: Solo aceptamos el punto si NO está dentro del 
      // segundo círculo (el que "recorta" la luna)
      let cutX = x + 40; // Desplazamos el recorte a la derecha
      let cutY = y;
      let distToCut = dist(cutX, cutY, 0, 0);

      if (distToCut > radius * 0.9) {
        if (count < particles.length) {
          particles[count].setTarget(x + width / 2, y + height / 2, "LUNA");
          count++;
        }
      }
    }

    // Las partículas que sobran se quedan como estrellas de fondo
    for (let i = count; i < particles.length; i++) {
      particles[i].setTarget(random(width), random(height), "ESTRELLA");
    }
  }

  msgIndex = (msgIndex + 1) % phrases.length;
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.target = createVector(x, y);
    this.vel = createVector(random(-1, 1), random(-1, 1));
    this.acc = createVector(0, 0);
    this.maxSpeed = 10;
    this.maxForce = 0.8;
    this.size = random(1, 3);
    this.colorType = "ESTRELLA";
  }

  setTarget(x, y, type) {
    this.target = createVector(x, y);
    this.colorType = type;
  }

  update() {
    let steer = p5.Vector.sub(this.target, this.pos);
    let d = steer.mag();
    let speed = d < 100 ? map(d, 0, 100, 0, this.maxSpeed) : this.maxSpeed;
    steer.setMag(speed).sub(this.vel).limit(this.maxForce);
    this.acc.add(steer);
    this.pos.add(this.vel);
    this.vel.add(this.acc);
    this.acc.mult(0);
  }

  show() {
    if (this.colorType === "LUNA") {
      stroke(255, 253, 220); // Color crema/luna
      strokeWeight(this.size + 0.5);
    } else if (this.colorType === "TEXTO") {
      stroke(255, 150, 200); // Rosado
      strokeWeight(this.size);
    } else {
      stroke(255, 255, 255, 120); // Estrellas tenues
      strokeWeight(this.size);
    }
    point(this.pos.x, this.pos.y);
  }
}