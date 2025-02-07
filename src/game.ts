import * as PIXI from 'pixi.js';

export function initGame(
    app: PIXI.Application,
    targetShape: boolean[][],
    onClear: (app: PIXI.Application) => void // 🎯 app を引数に追加
) {
    const shapeSize = targetShape.length; // 🎯 お題と同じサイズのグリッドを生成
    const blockSize = 50;
    const gap = 2;
    const startY = 300; // お題の下に配置

    const gridContainer = new PIXI.Container();
    app.stage.addChild(gridContainer);

    const blocks: PIXI.Graphics[][] = [];
    for (let row = 0; row < shapeSize; row++) {
        blocks[row] = [];
        for (let col = 0; col < shapeSize; col++) {
            const block = new PIXI.Graphics();
            block.beginFill(0xff0000);
            block.drawRect(0, 0, blockSize, blockSize);
            block.endFill();

            // 🎯 プレイヤーのブロックを中央配置
            block.x = (app.screen.width - shapeSize * (blockSize + gap)) / 2 + col * (blockSize + gap);
            block.y = startY + row * (blockSize + gap);

            // クリックで削除
            block.interactive = true;
            (block as any).buttonMode = true;
            block.on('pointerdown', () => {
                block.visible = false;
                checkVictory(blocks, targetShape, () => onClear(app)); // 🎯 app を渡す
            });

            gridContainer.addChild(block);
            blocks[row][col] = block;
        }
    }
}

// 🎯 追加: 勝利判定関数
function checkVictory(
    blocks: PIXI.Graphics[][],
    targetShape: boolean[][],
    onClear: () => void
) {
    let cleared = true;

    for (let row = 0; row < targetShape.length; row++) {
        for (let col = 0; col < targetShape[row].length; col++) {
            const block = blocks[row][col];

            if (targetShape[row][col]) {
                if (!block.visible) {
                    cleared = false;
                }
            } else {
                if (block.visible) {
                    cleared = false;
                }
            }
        }
    }

    if (cleared) {
        onClear(); // 🎯 app を引数に渡して呼び出す
    }
}
