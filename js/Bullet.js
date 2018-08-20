class Bullet extends PIXI.Sprite {
  constructor(position, rotation, alcohol, type) {
    const texture = PIXI.Texture.fromFrame(`${type}.png`);
    super(texture);
    this.scale.set(type === 'beer' ? 0.25 : 0.35);
    this.anchor.set(0.5);
    this.setStartPosition(position, rotation, alcohol);
    this.canKillPlayer = false;
  }

  setStartPosition(position, rotation, alcohol) {
    const { x, y } = position;
    const alcoholRotation =
      rotation + (Math.random() * alcohol * Math.PI) / 100;

    this.position.x = x + Math.cos(alcoholRotation) * 50;
    this.position.y = y + Math.sin(alcoholRotation) * 50;
    this.rotation = alcoholRotation;
  }

  updateGameLoop(bounds, player) {
    this.position.x += Math.cos(this.rotation) * Bullet.SPEED;
    this.position.y += Math.sin(this.rotation) * Bullet.SPEED;
    const { x, y, width, height } = this.getBounds();

    if (x + width > Main.WIDTH || x < 0) {
      this.rotation = Math.PI - this.rotation;
      this.scale.x *= -1;
      this.scale.y *= -1;
      this.canKillPlayer = true;
    }
    if (y + height > Main.HEIGHT || y < 0) {
      this.rotation *= -1;
      this.canKillPlayer = true;
    }
  }
}

Bullet.SPEED = 5;
