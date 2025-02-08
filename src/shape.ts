import * as PIXI from 'pixi.js';

export function createShape(app: PIXI.Application): boolean[][] {
    const shapeSize = 5; 
    const blockSize = 50;
    const gap = 2;
    const targetShape: boolean[][] = [];

    
    let existingShape = app.stage.getChildByName("shapeContainer");
    if (existingShape) {
        existingShape.destroy({ children: true });
    }

    const shapeContainer = new PIXI.Container();
    shapeContainer.name = "shapeContainer"; 
    app.stage.addChild(shapeContainer);

    for (let row = 0; row < shapeSize; row++) {
        targetShape[row] = [];
        for (let col = 0; col < shapeSize; col++) {
            targetShape[row][col] = Math.random() < 0.5; 
            if (targetShape[row][col]) {
                const shapeBlock = new PIXI.Graphics();
                shapeBlock.beginFill(0x00ff00);
                shapeBlock.drawRect(0, 0, blockSize, blockSize);
                shapeBlock.endFill();

                
                shapeBlock.x = (app.screen.width - shapeSize * (blockSize + gap)) / 2 + col * (blockSize + gap);
                shapeBlock.y = 30 + row * (blockSize + gap); 

                shapeContainer.addChild(shapeBlock);
            }
        }
    }
    return targetShape;
}