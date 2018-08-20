class Enemy extends PIXI.Sprite {
  constructor(speed) {
    const isWaggon = Math.random() > 0.5;
    const texture = PIXI.Texture.fromFrame(
      isWaggon ? 'waggon.png' : 'train.png'
    );
    super(texture);
    const scale = isWaggon ? 0.5 : 0.4;
    this.scale.set(-scale, scale);
    this.anchor.set(0.5);
    this.speed = speed;
    this.created = Date.now();

    this.setStartPosition();
  }

  canBeKilled() {
    const now = Date.now();
    return now - this.created > 250;
  }

  setStartPosition() {
    this.rotation = Math.random() * Math.PI;
    const { x, y, width, height } = this.getBounds();
    this.position.x = Main.getRandomNumber(300, Main.WIDTH - width / 2);
    this.position.y = Main.getRandomNumber(
      height / 2,
      Main.HEIGHT - height / 2
    );
  }

  updateGameLoop() {
    this.position.x += Math.cos(this.rotation) * this.speed;
    this.position.y += Math.sin(this.rotation) * this.speed;
    const { x, y, width, height } = this.getBounds();

    if (x + width > Main.WIDTH || x < 0) {
      this.rotation = Math.PI - this.rotation;
      this.scale.x *= -1;
      this.scale.y *= -1;
    }
    if (y + height > Main.HEIGHT || y < 0) {
      this.rotation *= -1;
      this.scale.x *= -1;
      this.scale.y *= -1;
    }
  }
}
