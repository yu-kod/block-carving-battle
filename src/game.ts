import * as PIXI from 'pixi.js';

export function initGame(
    app: PIXI.Application,
    targetShape: boolean[][],
    onClear: (increaseScore: boolean) => void // 🎯 スコアを増やすかのフラグを追加
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
                checkVictory(blocks, targetShape, onClear);
            });

            gridContainer.addChild(block);
            blocks[row][col] = block;
        }
    }
}

function checkVictory(
    blocks: PIXI.Graphics[][],
    targetShape: boolean[][],
    onClear: (increaseScore: boolean) => void
) {
    let cleared = true;
    let mistake = false; // 🎯 間違ったブロックを壊したかチェック

    for (let row = 0; row < targetShape.length; row++) {
        for (let col = 0; col < targetShape[row].length; col++) {
            const block = blocks[row][col];

            if (targetShape[row][col]) {
                if (!block.visible) {
                    mistake = true; // 🎯 残すべきブロックが壊された
                }
            } else {
                if (block.visible) {
                    cleared = false;
                }
            }
        }
    }

    if (mistake) {
        onClear(false); // 🎯 間違えたらスコアを増やさず次へ
    } else if (cleared) {
        onClear(true); // 🎯 正解ならスコアを増やす
    }
}
