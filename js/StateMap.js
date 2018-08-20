class StateMap extends PIXI.Container {
  constructor(app, playerType, onPlayAgain) {
    super();
    this.app = app;
    this.playerType = playerType;
    this.onPlayAgain = onPlayAgain;

    this.interactive = true;
    this.on('mousedown', this.shoot.bind(this));

    this.background = new Background();
    this.addChild(this.background);

    this.player = new Player(this.playerType);
    this.addChild(this.player);

    this.healthBar = new ProgressBar('Health', 0, 100);
    this.addChild(this.healthBar);

    this.alcoholBar = new ProgressBar('Alcohol', 0, 100);
    this.alcoholBar.position.y = this.healthBar.y - this.alcoholBar.height - 10;
    this.addChild(this.alcoholBar);

    this.score = new PIXI.Text('0', new TextStyle(50));
    this.score.position.x = 20;
    this.score.position.y = Main.HEIGHT - this.score.height - 20;
    this.addChild(this.score);

    this.bullets = [];
    this.enemies = [];

    this.addEnemy(5);

    this.canPlay = true;
  }

  addEnemy(speed) {
    const enemy = new Enemy(speed);
    this.enemies.push(enemy);
    this.addChild(enemy);
    this.enemyTimeout = setTimeout(() => {
      this.addEnemy(speed + 0.5);
    }, Math.max(100, 1000 - speed * 10));
  }

  shoot() {
    const bullet = new Bullet(
      this.player.position,
      this.player.rotation,
      this.player.alcohol,
      this.playerType
    );
    this.bullets.push(bullet);
    this.addChild(bullet);
  }

  rotateToPoint(mx, my, px, py) {
    const distX = mx - px;
    const distY = my - py;
    return Math.atan2(distY, distX);
  }

  getSpriteBounds(sprite) {
    const { x, y, width, height } = sprite.getBounds();
    return {
      xFrom: x,
      xTo: x + width,
      yFrom: y,
      yTo: y + height
    };
  }

  getHitPosition(r1, r2) {
    const bounds1 = this.getSpriteBounds(r1);
    const bounds2 = this.getSpriteBounds(r2);

    const x =
      bounds1.xTo > bounds2.xFrom && bounds1.xTo < bounds2.xTo
        ? bounds1.xTo
        : bounds2.xTo;
    const y =
      bounds1.yTo > bounds2.yFrom && bounds1.yTo < bounds2.yTo
        ? bounds1.yTo
        : bounds2.yTo;
    return { x, y };
  }

  isColliding(r1, r2) {
    const bounds1 = this.getSpriteBounds(r1);
    const bounds2 = this.getSpriteBounds(r2);

    const xColliding =
      (bounds1.xTo > bounds2.xFrom && bounds1.xTo < bounds2.xTo) ||
      (bounds2.xTo > bounds1.xFrom && bounds2.xTo < bounds1.xTo);
    const yColliding =
      (bounds1.yTo > bounds2.yFrom && bounds1.yTo < bounds2.yTo) ||
      (bounds2.yTo > bounds1.yFrom && bounds2.yTo < bounds1.yTo);
    return xColliding && yColliding;
  }

  gameOver(text) {
    this.endText = new EndText(text);
    this.endText.position.set(Main.WIDTH / 2, this.endText.height / 2 + 50);
    this.addChild(this.endText);

    this.playAgain = new PIXI.Text('Drive again', new TextStyle(50));
    this.playAgain.anchor.set(0.5);
    this.playAgain.x = Main.WIDTH / 2;
    this.playAgain.y = Main.HEIGHT - 150;
    this.playAgain.interactive = true;
    this.playAgain.buttonMode = true;
    this.playAgain.on('pointerdown', this.onPlayAgain);
    this.addChild(this.playAgain);

    this.canPlay = false;
    clearTimeout(this.enemyTimeout);
    this.removeAllListeners();
  }

  explode(r1, r2, onFrameChange, onComplete) {
    const { x, y } = this.getHitPosition(r1, r2);
    const explosion = new Explosion(onFrameChange, onComplete);
    explosion.position.x = x;
    explosion.position.y = y;
    this.addChild(explosion);
  }

  updateGameLoop() {
    if (!this.canPlay) {
      return;
    }

    this.player.rotation = this.rotateToPoint(
      this.app.renderer.plugins.interaction.mouse.global.x,
      this.app.renderer.plugins.interaction.mouse.global.y,
      this.player.position.x,
      this.player.position.y
    );

    for (let i = 0; i < this.bullets.length; i++) {
      const bullet = this.bullets[i];
      bullet.updateGameLoop();
      if (this.isColliding(bullet, this.player) && bullet.canKillPlayer) {
        this.explode(
          bullet,
          this.player,
          () => {
            bullet.alpha -= StateMap.EXPLOSION_FADE_OUT;
          },
          () => {
            this.removeChild(bullet);
          }
        );
        bullet.remove = true;
        this.player.increaseAlcohol();
      }
    }

    this.enemies.forEach(enemy => {
      enemy.updateGameLoop();
      for (let i = 0; i < this.bullets.length; i++) {
        const bullet = this.bullets[i];
        if (this.isColliding(bullet, enemy) && enemy.canBeKilled()) {
          this.explode(
            enemy,
            bullet,
            () => {
              enemy.alpha -= StateMap.EXPLOSION_FADE_OUT;
              bullet.alpha -= StateMap.EXPLOSION_FADE_OUT;
            },
            () => {
              this.removeChild(enemy);
              this.removeChild(bullet);
            }
          );
          enemy.remove = true;
          bullet.remove = true;
          this.player.increaseScore();
          break;
        }
      }
      if (this.isColliding(enemy, this.player)) {
        this.explode(
          enemy,
          this.player,
          () => {
            enemy.alpha -= StateMap.EXPLOSION_FADE_OUT;
          },
          () => {
            this.removeChild(enemy);
          }
        );
        enemy.remove = true;
        this.player.decreaseHealth();
      }
    });

    this.bullets = this.bullets.filter(bullet => !bullet.remove);
    this.enemies = this.enemies.filter(enemy => !enemy.remove);

    this.score.text = this.player.score;
    this.alcoholBar.updateGameLoop(this.player.alcohol);
    this.healthBar.updateGameLoop(this.player.health);

    if (this.player.alcohol >= 100) {
      this.gameOver(
        this.playerType === 'beer'
          ? 'Beer killed you.\nTry driving sober next time...'
          : 'Jäger killed you.\nTry driving sober next time...'
      );
    } else if (this.player.health <= 0) {
      this.gameOver('DUI ruined your career :(');
    } else if (this.player.score >= 250) {
      this.gameOver(
        this.playerType === 'beer'
          ? 'You finished your shift successfully!\nYou will be promoted to a pilot and die in a plane accident one week later.'
          : "You finished your shift successfully!\nYou will be selected as employee of the month and die from an envious colleague's knife one week later."
      );
    }
  }
}

StateMap.EXPLOSION_FADE_OUT = 0.2;
