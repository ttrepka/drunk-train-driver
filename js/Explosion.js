class Explosion extends PIXI.extras.AnimatedSprite {
  constructor(onFrameChange, onComplete) {
    const frames = Array.from(Array(16), (d, i) =>
      PIXI.Texture.fromFrame(`explosion-${Math.abs(15 - i)}.png`)
    );
    super(frames);

    this.anchor.set(0.5);
    this.scale.set(2);
    this.loop = false;
    this.animationSpeed = 0.3;
    this.play();

    this.onFrameChange = onFrameChange;

    this.onComplete = () => {
      onComplete();
      this.destroy();
    };
  }
}
