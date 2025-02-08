import * as PIXI from 'pixi.js';

export class Menu {
    private app: PIXI.Application;
    private onSelectMode: (mode: 'single' | 'multi') => void;

    constructor(app: PIXI.Application, onSelectMode: (mode: 'single' | 'multi') => void) {
        this.app = app;
        this.onSelectMode = onSelectMode;
        this.createMenu();
    }

    private createMenu() {
        const container = new PIXI.Container();

        const title = new PIXI.Text("Block Carving Battle", {
            fontFamily: "Arial",
            fontSize: 36,
            fill: "#ffffff",
            stroke: "#000000",
            strokeThickness: 4,
        } as any);
        title.x = this.app.screen.width / 2 - title.width / 2;
        title.y = 100;
        container.addChild(title);

        const singlePlayerButton = this.createButton("シングルプレイ", this.app.screen.width / 2, 250, () => {
            this.onSelectMode("single");
        });

        const multiPlayerButton = this.createButton("マルチプレイ", this.app.screen.width / 2, 350, () => {
            this.onSelectMode("multi");
        });

        container.addChild(singlePlayerButton);
        container.addChild(multiPlayerButton);

        this.app.stage.addChild(container);
    }

    private createButton(text: string, x: number, y: number, onClick: () => void): PIXI.Container {
        const button = new PIXI.Container();
        const bg = new PIXI.Graphics();
        bg.beginFill(0x007bff);
        bg.drawRoundedRect(0, 0, 200, 50, 10);
        bg.endFill();

        const buttonText = new PIXI.Text(text, {
            fontFamily: "Arial",
            fontSize: 24,
            fill: "#ffffff",
            align: "center",
        });

        buttonText.x = (200 - buttonText.width) / 2;
        buttonText.y = (50 - buttonText.height) / 2;

        button.addChild(bg);
        button.addChild(buttonText);
        button.x = x - 100;
        button.y = y;

        button.interactive = true;
        button.buttonMode = true;
        button.on("pointerdown", onClick);

        return button;
    }
}
