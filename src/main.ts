import * as PIXI from 'pixi.js';

async function startApp() {
  const app = new PIXI.Application();
  await app.init({
    width: 800,
    height: 600,
    backgroundColor: 0x1099bb,
  });
  document.body.appendChild(app.canvas);

  // グリッド用のコンテナを作成
  const gridContainer = new PIXI.Container();
  app.stage.addChild(gridContainer);

  // グリッドの設定
  const rows = 10;
  const cols = 10;
  const blockSize = 50;
  const gap = 2; // ブロック間の隙間

  // 2次元グリッドの生成
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const block = new PIXI.Graphics();
      block.beginFill(0xff0000);
      block.drawRect(0, 0, blockSize, blockSize);
      block.endFill();

      // ブロックの配置座標計算
      block.x = col * (blockSize + gap);
      block.y = row * (blockSize + gap);

      // ブロックをインタラクティブにして、クリックで非表示にする
      block.interactive = true;
      block.buttonMode = true;
      block.on('pointerdown', () => {
        block.visible = false;
      });

      gridContainer.addChild(block);
    }
  }
}

startApp();




