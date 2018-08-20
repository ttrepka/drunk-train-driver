class TextStyle extends PIXI.TextStyle {
  constructor(fontSize = 18, other = {}) {
    super({
      fontFamily: 'Avenir, Helvetica, Arial, sans-serif',
      fontSize,
      fill: 0xffffff,
      stroke: 0x000000,
      strokeThickness: 2,
      dropShadow: true,
      dropShadowColor: 0x000000,
      dropShadowBlur: 10,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 3,
      wordWrap: true,
      wordWrapWidth: 750,
      ...other
    });
  }
}
