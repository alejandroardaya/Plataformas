const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player = {
  x: 50,
  y: 300,
  width: 30,
  height: 30,
  dx: 0,
  dy: 0,
  speed: 3,
  jumpPower: -10,
  gravity: 0.5,
  grounded: false
};

const keys = {};
const platforms = [
  { x: 0, y: 350, width: 800, height: 50 },
  { x: 200, y: 280, width: 100, height: 10 },
  { x: 400, y: 220, width: 100, height: 10 },
];

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function update() {
  // Movimiento horizontal
  player.dx = 0;
  if (keys["ArrowLeft"]) player.dx = -player.speed;
  if (keys["ArrowRight"]) player.dx = player.speed;

  // Salto
  if (keys[" "] && player.grounded) {
    player.dy = player.jumpPower;
    player.grounded = false;
  }

  // Gravedad
  player.dy += player.gravity;

  // Aplicar movimiento
  player.x += player.dx;
  player.y += player.dy;

  // Colisión con plataformas
  player.grounded = false;
  for (let plat of platforms) {
    if (
      player.x < plat.x + plat.width &&
      player.x + player.width > plat.x &&
      player.y + player.height < plat.y + player.dy &&
      player.y + player.height + player.dy >= plat.y
    ) {
      player.dy = 0;
      player.y = plat.y - player.height;
      player.grounded = true;
    }
  }

  // Fuera del canvas = reiniciar
  if (player.y > canvas.height) {
    player.x = 50;
    player.y = 300;
    player.dy = 0;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar plataformas
  ctx.fillStyle = "#555";
  platforms.forEach(p => {
    ctx.fillRect(p.x, p.y, p.width, p.height);
  });

  // Dibujar jugador
  ctx.fillStyle = "#0f0";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
