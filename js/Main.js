class Main {
  constructor() {
    this.app = new PIXI.Application({
      width: Main.WIDTH,
      height: Main.HEIGHT,
      antialias: true,
      transparent: false,
      resolution: 1
    });

    document.body.appendChild(this.app.view);

    this.loadingText = new PIXI.Text('Loading...', new TextStyle(50));
    this.loadingText.anchor.set(0.5);
    this.loadingText.position.x = Main.WIDTH / 2;
    this.loadingText.position.y = Main.HEIGHT / 2;
    this.app.stage.addChild(this.loadingText);

    this.loadAssets();
  }

  loadAssets() {
    PIXI.loader.add('images/game.json').load(this.onInit.bind(this));
  }

  onInit() {
    this.app.stage.removeChild(this.loadingText);

    this.states = {
      selectPlayer: new StateSelect(player => {
        this.states.map = new StateMap(
          this.app,
          player,
          () => this.setState('selectPlayer'),
          () => {
            this.states.gameOver = new GameOver(message);
            this.app.stage.addChild(this.states.gameOver);
            this.setState('gameOver');
          }
        );
        this.app.stage.addChild(this.states.map);
        this.setState('map');
      })
    };
    this.app.stage.addChild(this.states.selectPlayer);
    this.setState('selectPlayer');
    this.app.ticker.add(this.gameLoop.bind(this));
  }

  setState(state) {
    Object.values(this.states).forEach(state => {
      state.visible = false;
    });

    this.states[state].visible = true;
    this.state = state;
  }

  gameLoop() {
    this.states[this.state].updateGameLoop();
  }
}

Main.WIDTH = 800;
Main.HEIGHT = 600;

Main.getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
