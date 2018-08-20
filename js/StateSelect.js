class StateSelect extends PIXI.Container {
  constructor(onSelect) {
    super();

    this.onSelect = onSelect;

    const background = new Background();
    this.addChild(background);

    const message = new PIXI.Text('Select driver', new TextStyle(50));
    message.anchor.set(0.5);
    message.x = Main.WIDTH / 2;
    message.y = 100;
    this.addChild(message);

    const play = new PIXI.Text("Let's drive!", new TextStyle(50));
    play.anchor.set(0.5);
    play.x = Main.WIDTH / 2;
    play.y = Main.HEIGHT - 100;
    play.interactive = true;
    play.buttonMode = true;
    play.on('pointerdown', this.onPlayClick.bind(this));
    this.addChild(play);

    this.playerBeer = this.createPlayer('beer');
    this.playerBeer.position.x = Main.WIDTH / 4 + 50;

    this.playerJager = this.createPlayer('jager');
    this.playerJager.position.x = (Main.WIDTH / 4) * 3 - 50;

    this.selectPlayer('beer');
  }

  createPlayer(type) {
    const texture = PIXI.Texture.fromFrame(`${type}-drinker.png`);
    const player = new PIXI.Sprite(texture);
    player.anchor.set(0.5);
    player.interactive = true;
    player.buttonMode = true;
    player.on('pointerdown', () => this.selectPlayer(type));
    player.position.y = Main.HEIGHT / 2;
    this.addChild(player);
    return player;
  }

  selectPlayer(name) {
    this.selectedPlayer = name;

    if (name === 'jager') {
      this.playerJager.tint = 0xffff00;
      this.playerBeer.tint = 0xffffff;
    } else {
      this.playerJager.tint = 0xffffff;
      this.playerBeer.tint = 0xffff00;
    }
  }

  onPlayClick() {
    this.onSelect(this.selectedPlayer);
  }

  updateGameLoop() {}
}
