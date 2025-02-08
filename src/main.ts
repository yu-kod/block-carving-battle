import * as PIXI from 'pixi.js';
import { Menu } from './menu';
import { Game } from './game';
import { Lobby } from './lobby';
import { createShape } from './shape';

let app: PIXI.Application;
let gameInstance: Game | null = null;
let score = 0;
let mode: 'single' | 'multi' | null = null;

async function startApp() {
  app = new PIXI.Application();
  await app.init({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
  });
  document.body.appendChild(app.canvas);

  const menu = new Menu(app, selectMode);
}

function selectMode(selectedMode: 'single' | 'multi') {
  mode = selectedMode;
  app.stage.removeChildren();

  if (mode === "single") {
    startGame("single", "");
  } else if (mode === "multi") {
    const serverUrl = "ws://localhost:8080";
    console.log("🛠 ロビーに移動: サーバーURL =", serverUrl);

    new Lobby(app, serverUrl, (matchServerUrl) => {
      console.log("🎯 対戦相手が見つかりました！ゲーム開始");
      startGame("multi", matchServerUrl);
    });
  }
}


function startGame(mode: 'single' | 'multi', serverUrl: string) {
  const scoreText = new PIXI.Text(`スコア: ${score}`, {
    fontFamily: 'Arial',
    fontSize: 24,
    fill: '#ffffff',
    stroke: '#000000',
    strokeThickness: 4,
  } as any);
  scoreText.x = 20;
  scoreText.y = 20;
  app.stage.addChild(scoreText);

  function nextRound(increaseScore: boolean) {
    if (increaseScore) {
      score += 1;
      scoreText.text = `スコア: ${score}`;
    }

    app.stage.removeChildren();
    app.stage.addChild(scoreText);

    if (gameInstance) {
      gameInstance.destroy();
      gameInstance = null;
    }

    const targetShape = createShape(app);
    gameInstance = new Game(app, serverUrl, targetShape, nextRound, score);
  }

  // 🎯 キーイベントは `main.ts` で 1 回だけ設定する
  window.addEventListener('keydown', (event) => {
    if (gameInstance) {
      gameInstance.handleKeyDown(event);
    }
  });

  nextRound(false);
}

startApp();
