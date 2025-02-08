import * as PIXI from 'pixi.js';
import { Network } from './network';

export class Game {
    private app: PIXI.Application;
    private network: Network;
    private onClear: (increaseScore: boolean) => void;
    private gridContainer: PIXI.Container;
    private blocks: PIXI.Graphics[][] = [];
    private targetShape: boolean[][];
    private selectedRow: number = 0;
    private selectedCol: number = 0;
    private mistakeMade: boolean = false;
    private remainingBlocks: number = 0;
    private playerScore: number = 0;

    constructor(app: PIXI.Application, serverUrl: string, targetShape: boolean[][], onClear: (increaseScore: boolean) => void, score: number) {
        this.app = app;
        this.network = new Network(serverUrl, this.handleNetworkMessage.bind(this));
        this.targetShape = targetShape;
        this.onClear = onClear;
        this.gridContainer = new PIXI.Container();
        this.app.stage.addChild(this.gridContainer);
        this.playerScore = score;
        this.countRemainingBlocks();
        this.initBlocks();
        this.highlightSelectedBlock();
    }

    private handleNetworkMessage(data: any) {
        if (data.type === "score_update" && typeof data.score === "number") {
            console.log(`Opponent's Score: ${data.score}`);
        }
    }

    public destroy() {
        this.app.stage.removeChild(this.gridContainer);
    }

    private countRemainingBlocks() {
        this.remainingBlocks = this.targetShape.flat().filter(cell => !cell).length;
    }

    private initBlocks() {
        const blockSize = 50, gap = 2, startY = 300;
        this.blocks = this.targetShape.map((row, rowIndex) => row.map((_, colIndex) => {
            const block = new PIXI.Graphics().beginFill(0xff0000).drawRect(0, 0, blockSize, blockSize).endFill();
            block.x = (this.app.screen.width - this.targetShape.length * (blockSize + gap)) / 2 + colIndex * (blockSize + gap);
            block.y = startY + rowIndex * (blockSize + gap);
            this.gridContainer.addChild(block);
            return block;
        }));
    }

    public handleKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case 'ArrowLeft': this.moveSelection(-1, 0); break;
            case 'ArrowRight': this.moveSelection(1, 0); break;
            case 'ArrowUp': this.moveSelection(0, -1); break;
            case 'ArrowDown': this.moveSelection(0, 1); break;
            case ' ': this.removeSelectedBlock(); break;
        }
    }

    private moveSelection(dx: number, dy: number) {
        const newRow = this.selectedRow + dy, newCol = this.selectedCol + dx;
        if (this.targetShape[newRow]?.[newCol] !== undefined) {
            this.selectedRow = newRow;
            this.selectedCol = newCol;
            this.highlightSelectedBlock();
        }
    }

    private highlightSelectedBlock() {
        this.blocks.flat().forEach(block => block.clear().beginFill(0xff0000).drawRect(0, 0, 50, 50).endFill());
        this.blocks[this.selectedRow][this.selectedCol].clear().beginFill(0xffff00).drawRect(0, 0, 50, 50).endFill();
    }

    private sendScoreUpdate() {
        this.network.send({ type: "score_update", score: this.playerScore });
    }

    private removeSelectedBlock() {
        if (!this.blocks[this.selectedRow][this.selectedCol].visible) return;
        this.blocks[this.selectedRow][this.selectedCol].visible = false;
        if (!this.targetShape[this.selectedRow][this.selectedCol]) {
            this.remainingBlocks--;
            if (this.remainingBlocks === 0) {
                this.playerScore++;
                this.onClear(true);
                this.sendScoreUpdate();
            }
        } else if (!this.mistakeMade) {
            this.mistakeMade = true;
            this.onClear(false);
        }
    }
}
