import * as PIXI from 'pixi.js';
import { Game } from './game';
import { createShape } from './shape';

let gameInstance: Game | null = null;
let score = 0; 
let roundInProgress = false;

async function startApp() {
    
    const app = new PIXI.Application();
    await app.init({
        width: 800,
        height: 600,
        backgroundColor: 0x1099bb,
    });
    document.body.appendChild(app.canvas);

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
            scoreText.text = `スコア: ${score}`;
        }

        app.stage.removeChildren();
        app.stage.addChild(scoreText);

        
        if (gameInstance) {
            gameInstance.destroy();
            gameInstance = null;
        }

        const targetShape = createShape(app);
        const serverUrl = "ws://localhost:8080"; // ローカル WebSocket サーバーの URL
        gameInstance = new Game(app, serverUrl, targetShape, nextRound);

        roundInProgress = false;
    }

    
    nextRound(false);

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
}

startApp();