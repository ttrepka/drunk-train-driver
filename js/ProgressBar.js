class ProgressBar extends PIXI.Container {
  constructor(text, min, max) {
    super();

    this.min = min;
    this.max = max;

    this.textElement = new PIXI.Text(text, new TextStyle(18));
    this.addChild(this.textElement);

    //Create the black background rectangle
    this.innerBar = new PIXI.Graphics();
    this.innerBar.beginFill(0xe00046);
    this.innerBar.drawRect(
      this.textElement.width + 20,
      (this.textElement.height - 8) / 2,
      ProgressBar.WIDTH,
      8
    );
    this.innerBar.endFill();

    //Create the front red rectangle
    this.outerBar = new PIXI.Graphics();
    this.outerBar.beginFill(0xffffff);
    this.outerBar.drawRect(
      this.textElement.width + 20,
      (this.textElement.height - 8) / 2,
      ProgressBar.WIDTH,
      8
    );
    this.outerBar.endFill();
    this.addChild(this.outerBar);

    this.position.x = Main.WIDTH - this.width - 20;
    this.position.y = Main.HEIGHT - this.height - 20;
  }

  updateGameLoop(value) {
    this.removeChild(this.innerBar);
    this.innerBar = new PIXI.Graphics();
    this.innerBar.beginFill(0xff3300);
    this.innerBar.drawRect(
      this.textElement.width + 20,
      (this.textElement.height - 8) / 2,
      (ProgressBar.WIDTH * Math.max(this.min, Math.min(this.max, value))) /
        this.max,
      8
    );
    this.innerBar.endFill();
    this.addChild(this.innerBar);
  }
}

ProgressBar.WIDTH = 90;
