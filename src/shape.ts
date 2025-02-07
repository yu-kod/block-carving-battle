import * as PIXI from 'pixi.js';

export function createShape(app: PIXI.Application): boolean[][] {
    const shapeSize = 5; // 🎯 お題のサイズ（変更可能）
    const blockSize = 50;
    const gap = 2;
    const targetShape: boolean[][] = [];

    const shapeContainer = new PIXI.Container();
    app.stage.addChild(shapeContainer);

    for (let row = 0; row < shapeSize; row++) {
        targetShape[row] = [];
        for (let col = 0; col < shapeSize; col++) {
            targetShape[row][col] = Math.random() < 0.5; // ランダム生成
            if (targetShape[row][col]) {
                const shapeBlock = new PIXI.Graphics();
                shapeBlock.beginFill(0x00ff00);
                shapeBlock.drawRect(0, 0, blockSize, blockSize);
                shapeBlock.endFill();

                // 🎯 お題の形を中央に配置
                shapeBlock.x = (app.screen.width - shapeSize * (blockSize + gap)) / 2 + col * (blockSize + gap);
                shapeBlock.y = 30 + row * (blockSize + gap); // お題の位置を上部に

                shapeContainer.addChild(shapeBlock);
            }
        }
    }
    return targetShape;
}
