import * as PIXI from 'pixi.js';
import { initGame } from './game';
import { createShape } from './shape';

async function startApp() {
  // PixiJSの初期化
  const app = new PIXI.Application();
  await app.init({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
  });
  document.body.appendChild(app.canvas);

  let score = 0; // 🎯 スコア変数（0から始まる）
  let isFirstRound = true; // 🎯 最初のラウンドかどうか判定

  // 🎯 スコア表示テキスト（1回だけ作る）
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
    if (!isFirstRound && increaseScore) {
      score += 1; // 🎯 2回目以降のラウンドで正解ならスコアを増やす
    }
    isFirstRound = false; // 🎯 次のラウンドではスコアを増やすようにする

    scoreText.text = `スコア: ${score}`; // 🎯 スコア表示を更新

    app.stage.removeChildren(); // 🎯 画面をクリア
    app.stage.addChild(scoreText); // 🎯 スコア表示を維持

    const targetShape = createShape(app); // 🎯 新しいお題を生成
    initGame(app, targetShape, nextRound); // 🎯 次のラウンド開始
  }

  // 🎯 最初のラウンド開始（スコアを増やさずにスタート）
  nextRound(true);
}

startApp();
