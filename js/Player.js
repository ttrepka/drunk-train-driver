class Player extends PIXI.Sprite {
  constructor(type) {
    const texture = PIXI.Texture.fromFrame(`${type}-drinker.png`);
    super(texture);
    this.anchor.set(0.5);
    this.position.set(this.width / 2 + 75, this.height / 2 + 75);

    this.health = 100;
    this.alcohol = 0;
    this.score = 0;
  }

  decreaseHealth() {
    this.health -= 20;
  }

  increaseAlcohol() {
    this.alcohol += 8;
  }

  increaseScore() {
    this.score += 10;
  }
}
