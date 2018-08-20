class EndText extends PIXI.Text {
  constructor(text, score) {
    super(text, new TextStyle(45, { align: 'center' }));
    this.anchor.set(0.5);
  }
}
