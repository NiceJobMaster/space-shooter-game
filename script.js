let canvas,
  context,
  playerX,
  playerY,
  playerDimension,
  playerSpeed,
  enemyList,
  enemyDimension,
  enemySpeed,
  shotList,
  shotDimension,
  shotSpeed,
  enemyKilled,
  showEndGame;

window.onload = () => {
  canvas = document.getElementById("game");
  context = canvas.getContext("2d");

  setInitialValues();

  canvas.addEventListener("mousedown", handleMouseClick);
  document.addEventListener("keydown", keyPush);

  const framePerSecond = 30;
  setInterval(update, 1000 / framePerSecond);
  setInterval(spawnEnemy, 2000);
};

const setInitialValues = () => {
  playerX = 90;
  playerY = canvas.height / 2;
  playerDimension = 30;
  playerSpeed = 15;
  enemyList = [];
  enemyDimension = 25;
  enemySpeed = 5;
  shotList = [];
  shotDimension = 4;
  shotSpeed = 7;
  enemyKilled = 0;
  showEndGame = false;
};

const update = () => {
  draw();
};

const spawnEnemy = () => {
  const position = {
    x: canvas.width,
    y: Math.random() * (canvas.height - enemyDimension / 2),
  };
  if (position.y < enemyDimension / 2) {
    position.y = enemyDimension / 2;
  }
  enemyList.push(position);
};

const colorRect = (x, y, width, height, color) => {
  context.fillStyle = color;
  context.fillRect(x, y, width, height);
};

const draw = () => {
  colorRect(0, 0, canvas.width, canvas.height, "black");

  if (showEndGame) {
    context.fillStyle = "white";
    const textClick = "Click to continue";
    context.fillText(
      textClick,
      canvas.width / 2 - context.measureText(textClick).width / 2,
      canvas.height / 2 + 100
    );
    const textEnemyKilled = "Enemy killed: " + enemyKilled;
    context.fillText(
      textEnemyKilled,
      canvas.width / 2 - context.measureText(textEnemyKilled).width / 2,
      canvas.height / 2 - 100
    );
    return;
  }

  colorRect(
    playerX - playerDimension / 2,
    playerY - playerDimension / 2,
    playerDimension,
    playerDimension,
    "white"
  );

  for (let s = 0; s < shotList.length; s++) {
    shotList[s].x += shotSpeed;

    colorRect(
      shotList[s].x - shotDimension / 2,
      shotList[s].y - shotDimension / 2,
      shotDimension,
      shotDimension,
      "green"
    );

    for (let e = enemyList.length - 1; e >= 0; e--) {
      const distanceX = Math.abs(enemyList[e].x - shotList[s].x);
      const distanceY = Math.abs(enemyList[e].y - shotList[s].y);
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      if (distance < (shotDimension + enemyDimension) / 2) {
        enemyList.splice(e, 1);
        enemyKilled++;
      }
    }
  }

  for (let e = 0; e < enemyList.length; e++) {
    enemyList[e].x -= enemySpeed;
    colorRect(
      enemyList[e].x - enemyDimension / 2,
      enemyList[e].y - enemyDimension / 2,
      enemyDimension,
      enemyDimension,
      "red"
    );

    if (enemyList[e].x <= 0) {
      showEndGame = true;
      break;
    }

    const distanceX = Math.abs(enemyList[e].x - playerX);
    const distanceY = Math.abs(enemyList[e].y - playerY);
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < (playerDimension + enemyDimension) / 2) {
      showEndGame = true;
      break;
    }
  }
};

const handleMouseClick = () => {
  if (showEndGame) {
    setInitialValues();
  }
};

const keyPush = (e) => {
  switch (e.keyCode) {
    case 32:
      shotList.push({ x: playerX, y: playerY });
      break;
    case 37:
      if (playerX <= playerDimension / 2) {
        break;
      }
      playerX -= playerSpeed;
      break;
    case 38:
      if (playerY <= playerDimension / 2) {
        break;
      }
      playerY -= playerSpeed;
      break;
    case 39:
      if (playerX >= canvas.width - playerDimension / 2) {
        break;
      }
      playerX += playerSpeed;
      break;
    case 40:
      if (playerY >= canvas.height - playerDimension / 2) {
        break;
      }
      playerY += playerSpeed;
      break;
  }
};
