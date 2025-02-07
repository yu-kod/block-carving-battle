import * as PIXI from 'pixi.js';
import { initGame } from './game';
import { createShape } from './shape';
import { showClearMessage } from './ui';

async function startApp() {
  // PixiJSの初期化
  const app = new PIXI.Application();
  await app.init({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
  });
  document.body.appendChild(app.canvas);

  // お題の形を作成（上部に表示）
  const targetShape = createShape(app);

  // ゲームの初期化（グリッド、ブロック）
  initGame(app, targetShape, showClearMessage);
}

startApp();
