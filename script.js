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
  { x: 0, y: 370, width: 800, height: 30 },
  { x: 200, y: 300, width: 100, height: 10 },
  { x: 400, y: 240, width: 100, height: 10 }
];

// Detectar teclas presionadas
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function update() {
  player.dx = 0;

  // Movimiento horizontal
  if (keys["ArrowLeft"]) player.dx = -player.speed;
  if (keys["ArrowRight"]) player.dx = player.speed;

  // Salto
  if (keys[" "] && player.grounded) {
    player.dy = player.jumpPower;
    player.grounded = false;
  }

  // Aplicar gravedad
  player.dy += player.gravity;

  // Mover horizontalmente
  player.x += player.dx;

  // Mover verticalmente
  player.y += player.dy;

  // Colisión con plataformas
  player.grounded = false;
  for (let plat of platforms) {
    let isColliding =
      player.x < plat.x + plat.width &&
      player.x + player.width > plat.x &&
      player.y + player.height <= plat.y + player.dy &&
      player.y + player.height + player.dy >= plat.y;

    if (isColliding) {
      player.dy = 0;
      player.y = plat.y - player.height;
      player.grounded = true;
    }
  }

  // Evitar que salga del canvas
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width)
    player.x = canvas.width - player.width;

  // Reiniciar si cae
  if (player.y > canvas.height) {
    player.x = 50;
    player.y = 300;
    player.dy = 0;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fondo
  ctx.fillStyle = "#333";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Plataformas
  ctx.fillStyle = "#888";
  platforms.forEach(p => ctx.fillRect(p.x, p.y, p.width, p.height));

  // Jugador
  ctx.fillStyle = "#0f0";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
