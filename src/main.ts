import * as PIXI from 'pixi.js';
import { Game } from './game';
import { createShape } from './shape';

let gameInstance: Game | null = null;

async function startApp() {
    // PixiJSの初期化
    const app = new PIXI.Application();
    await app.init({
        width: 800,
        height: 600,
        backgroundColor: 0x1099bb,
    });
    document.body.appendChild(app.canvas);

    let score = 0;
    let roundInProgress = false;

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
        if (roundInProgress) return;
        roundInProgress = true;

        if (increaseScore) {
            score += 1;
        }

        scoreText.text = `スコア: ${score}`;
        app.stage.removeChildren();
        app.stage.addChild(scoreText);

        // 🎯 前回の Game インスタンスを削除してから新しいラウンドを開始
        if (gameInstance) {
            gameInstance.destroy();
            gameInstance = null;
        }

        const targetShape = createShape(app);
        gameInstance = new Game(app, targetShape, nextRound);

        roundInProgress = false;
    }

    // 🎯 キーイベントは `main.ts` で 1 回だけ設定する
    window.addEventListener('keydown', (event) => {
        if (gameInstance) {
            gameInstance.handleKeyDown(event);
        }
    });

    window.addEventListener('keyup', (event) => {
        if (gameInstance) {
            gameInstance.handleKeyUp(event);
        }
    });

    nextRound(true);
}

startApp();
