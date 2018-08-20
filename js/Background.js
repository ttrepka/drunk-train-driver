class Background extends PIXI.extras.TilingSprite {
  constructor(width, height) {
    const texture = PIXI.Texture.fromFrame('tracks.jpg');
    super(texture, Main.WIDTH, Main.HEIGHT);
    this.tint = 0x999999;
  }
}
