import * as PIXI from 'pixi.js';

export function updateScore(app: PIXI.Application, score: number): PIXI.Text {
    const style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 24,
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
    } as any);

    const scoreText = new PIXI.Text(`スコア: ${score}`, style);
    scoreText.x = 20;
    scoreText.y = 20;

    app.stage.addChild(scoreText);
    return scoreText;
}

