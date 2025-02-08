import * as PIXI from 'pixi.js';
import { Network } from './network';

export class Game {
    private app: PIXI.Application;
    private network: Network;
    private onClear: (increaseScore: boolean) => void;
    private gridContainer: PIXI.Container;
    private opponentGrid: PIXI.Container;
    private opponentScoreText: PIXI.Text;
    private blocks: PIXI.Graphics[][] = [];
    private targetShape: boolean[][];
    private selectedRow: number = 0;
    private selectedCol: number = 0;
    private isKeyDown: boolean = false;
    private mistakeMade: boolean = false;
    private remainingBlocks: number = 0;
    private playerScore: number = 0;
    private opponentScore: number = 0;

    constructor(app: PIXI.Application, serverUrl: string, targetShape: boolean[][], onClear: (increaseScore: boolean) => void) {
        this.app = app;
        this.network = new Network(serverUrl, this.handleNetworkMessage.bind(this));
        this.targetShape = targetShape;
        this.onClear = onClear;
        this.gridContainer = new PIXI.Container();
        this.opponentGrid = new PIXI.Container();

        this.opponentScoreText = new PIXI.Text(`相手のスコア: 0`, {
            fontFamily: 'Arial',
            fontSize: 24,
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
        } as any);
        this.opponentScoreText.x = this.app.screen.width - 200;
        this.opponentScoreText.y = 20;
        this.app.stage.addChild(this.opponentScoreText);

        this.app.stage.addChild(this.gridContainer);
        this.app.stage.addChild(this.opponentGrid);

        this.countRemainingBlocks();
        this.initBlocks();
        this.initOpponentBoard();
        this.highlightSelectedBlock();
    }

    private initOpponentBoard() {
        this.opponentGrid.x = this.app.screen.width / 2 + 100;
        this.opponentGrid.y = 300;
    }

    private handleNetworkMessage(data: any) {
        if (data.type === "block_update" && data.blocks) {
            this.updateOpponentBoard(data.blocks);
        } else {
            console.warn("⚠️ 不正なブロックデータを受信:", data);
        }
        if (data.type === "score_update" && typeof data.score === "number") {
            if (data.score >= 0) {
                this.opponentScore = data.score;
                this.opponentScoreText.text = `相手のスコア: ${this.opponentScore}`;
            } else {
                console.warn("⚠️ 不正なスコアデータを受信:", data);
            }
        }
    }

    private updateOpponentBoard(blocks: boolean[][] | undefined) {
    if (!blocks || !Array.isArray(blocks)) {
        console.warn("⚠️ 受信したブロックデータが不正です:", blocks);
        return;
    }

    this.opponentGrid.removeChildren();

    for (let row = 0; row < blocks.length; row++) {
        for (let col = 0; col < blocks[row].length; col++) {
            if (!blocks[row][col]) continue;

            const block = new PIXI.Graphics();
            block.beginFill(0x00ff00);
            block.drawRect(0, 0, 50, 50);
            block.endFill();

            block.x = col * 52;
            block.y = row * 52;
            this.opponentGrid.addChild(block);
        }
    }
}

    public destroy() {
        console.log("Game インスタンスを破棄");
        this.app.stage.removeChild(this.gridContainer);
        this.app.stage.removeChild(this.opponentGrid);
    }

    private countRemainingBlocks() {
        this.remainingBlocks = 0;
        for (let row = 0; row < this.targetShape.length; row++) {
            for (let col = 0; col < this.targetShape[row].length; col++) {
                if (!this.targetShape[row][col]) {
                    this.remainingBlocks++;
                }
            }
        }
    }

    private initBlocks() {
        const shapeSize = this.targetShape.length;
        const blockSize = 50;
        const gap = 2;
        const startY = 300;

        for (let row = 0; row < shapeSize; row++) {
            this.blocks[row] = [];
            for (let col = 0; col < shapeSize; col++) {
                const block = new PIXI.Graphics();
                block.beginFill(0xff0000);
                block.drawRect(0, 0, blockSize, blockSize);
                block.endFill();

                block.x = (this.app.screen.width - shapeSize * (blockSize + gap)) / 2 + col * (blockSize + gap);
                block.y = startY + row * (blockSize + gap);

                this.gridContainer.addChild(block);
                this.blocks[row][col] = block;
            }
        }
    }

    public handleKeyDown(event: KeyboardEvent) {
        console.log(`handleKeyDown 実行: ${event.key}`);

        if (event.key === 'ArrowLeft') this.moveSelection(-1, 0);
        if (event.key === 'ArrowRight') this.moveSelection(1, 0);
        if (event.key === 'ArrowUp') this.moveSelection(0, -1);
        if (event.key === 'ArrowDown') this.moveSelection(0, 1);
        if (event.key === ' ' && !this.isKeyDown) {
            this.removeSelectedBlock();
        }
    }

    public handleKeyUp(event: KeyboardEvent) {
        if (event.key === ' ') {
            this.isKeyDown = false;
        }
    }

    private moveSelection(dx: number, dy: number) {
        const newRow = this.selectedRow + dy;
        const newCol = this.selectedCol + dx;
        if (newRow >= 0 && newRow < this.targetShape.length && newCol >= 0 && newCol < this.targetShape.length) {
            this.selectedRow = newRow;
            this.selectedCol = newCol;
            this.highlightSelectedBlock();
        }
    }

    private highlightSelectedBlock() {
        for (let row of this.blocks) {
            for (let block of row) {
                block.clear();
                block.beginFill(0xff0000).drawRect(0, 0, 50, 50).endFill();
            }
        }
        this.blocks[this.selectedRow][this.selectedCol].clear();
        this.blocks[this.selectedRow][this.selectedCol].beginFill(0xffff00).drawRect(0, 0, 50, 50).endFill();
    }
    private sendScoreUpdate() {
        this.network.sendScoreUpdate(this.playerScore);
    }

    private removeSelectedBlock() {
    if (!this.blocks[this.selectedRow][this.selectedCol].visible) return;

    this.blocks[this.selectedRow][this.selectedCol].visible = false;
    this.isKeyDown = true;

    this.network.send({
        type: "block_update",
        row: this.selectedRow,
        col: this.selectedCol,
    });

    if (!this.targetShape[this.selectedRow][this.selectedCol]) {
        this.remainingBlocks--;

        if (this.remainingBlocks === 0) {
            this.playerScore += 1; // 🎯 スコア更新
            this.onClear(true);
            this.sendScoreUpdate(); // 🎯 すぐに送信
        }
    } else {
        if (!this.mistakeMade) {
            this.mistakeMade = true;
            this.onClear(false);
        }
    }
}
}