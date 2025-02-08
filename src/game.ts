import * as PIXI from 'pixi.js';

export class Game {
    private app: PIXI.Application;
    private targetShape: boolean[][];
    private onClear: (increaseScore: boolean) => void;
    private gridContainer: PIXI.Container;
    private blocks: PIXI.Graphics[][] = [];
    private selectedRow: number = 0;
    private selectedCol: number = 0;
    private isKeyDown: boolean = false;
    private mistakeMade: boolean = false;
    private remainingBlocks: number = 0;

    constructor(app: PIXI.Application, targetShape: boolean[][], onClear: (increaseScore: boolean) => void) {
        this.app = app;
        this.targetShape = targetShape;
        this.onClear = onClear;
        this.gridContainer = new PIXI.Container();
        this.gridContainer.name = 'gridContainer';
        this.app.stage.addChild(this.gridContainer);
        this.countRemainingBlocks();
        this.initBlocks();
        this.highlightSelectedBlock();

        console.log("🔍 正解のブロックパターン:");
        console.table(this.targetShape);
    }

    public destroy() {
        console.log("🛠 Game インスタンスを破棄");
        this.app.stage.removeChild(this.gridContainer);
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
        console.log(`🛠 handleKeyDown 実行: ${event.key}`);

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

    private removeSelectedBlock() {
        if (!this.blocks[this.selectedRow][this.selectedCol].visible) return;

        console.log(`🛠 removeSelectedBlock() 実行: (${this.selectedRow}, ${this.selectedCol})`);

        this.blocks[this.selectedRow][this.selectedCol].visible = false;
        this.isKeyDown = true;

        if (!this.targetShape[this.selectedRow][this.selectedCol]) {
            this.remainingBlocks--;
            console.log(`✅ 正しいブロックを削除: (${this.selectedRow}, ${this.selectedCol}) 残り: ${this.remainingBlocks}`);

            if (this.remainingBlocks === 0) {
                console.log("🏆 すべてのブロックを正しく削除！クリア！");
                this.onClear(true);
            }
        } else {
            if (!this.mistakeMade) {
                this.mistakeMade = true;
                console.log(`❌ ミス！ (${this.selectedRow}, ${this.selectedCol}) のブロックを誤って削除しました`);
                this.onClear(false);
            }
        }
    }
}
