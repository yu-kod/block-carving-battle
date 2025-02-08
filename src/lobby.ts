import * as PIXI from 'pixi.js';
import { Network } from './network';

export class Lobby {
    private app: PIXI.Application;
    private network: Network;
    private onMatchFound: (serverUrl: string) => void;
    private statusText: PIXI.Text;

    constructor(app: PIXI.Application, serverUrl: string, onMatchFound: (serverUrl: string) => void) {
        this.app = app;
        this.network = new Network(serverUrl, this.handleNetworkMessage.bind(this));
        this.onMatchFound = onMatchFound;
        this.createLobbyUI();
    }

    private createLobbyUI() {
        this.app.stage.removeChildren();

        const title = new PIXI.Text("マッチング中...", {
            fontFamily: "Arial",
            fontSize: 36,
            fill: "#ffffff",
            stroke: "#000000",
            strokeThickness: 4,
        } as any);
        title.x = this.app.screen.width / 2 - title.width / 2;
        title.y = 200;
        this.app.stage.addChild(title);

        this.statusText = new PIXI.Text("対戦相手を探しています...", {
            fontFamily: "Arial",
            fontSize: 24,
            fill: "#ffffff",
            align: "center",
        });
        this.statusText.x = this.app.screen.width / 2 - this.statusText.width / 2;
        this.statusText.y = 300;
        this.app.stage.addChild(this.statusText);

        this.network.send({ type: "join_lobby" });
    }

    private handleNetworkMessage(data: any) {
        if (data.type === "match_found") {
            console.log("🎯 マッチング完了！サーバーURL:", data.serverUrl);

            this.statusText.text = "対戦相手が見つかりました！ゲーム開始...";

            setTimeout(() => {
                this.onMatchFound(data.serverUrl);
            }, 2000);
        } else {
            console.warn("⚠️ 予期しないメッセージ:", data);
        }
    }

}
