import * as PIXI from 'pixi.js';

export function showClearMessage(app: PIXI.Application) {
    const style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 36,
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
    });

    const victoryText = new PIXI.Text('🎉 クリア！', style);
    victoryText.x = app.screen.width / 2 - victoryText.width / 2;
    victoryText.y = 500;
    app.stage.addChild(victoryText);
}
