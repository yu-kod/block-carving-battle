export class Network {
    private socket: WebSocket;

    constructor(serverUrl: string, onMessage: (data: any) => void) {
        this.socket = new WebSocket(serverUrl);

        this.socket.onopen = () => {
            console.log("✅ WebSocket 接続成功");
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(`📩 受信データ: ${JSON.stringify(data)}`);
            onMessage(data);
        };

        this.socket.onclose = () => {
            console.log("❌ WebSocket 接続終了");
        };
    }

    send(data: any) {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        } else {
            console.error("⚠️ WebSocket がまだ接続されていません");
        }
    }

    sendScoreUpdate(score: number) {
        this.send({
            type: "score_update",
            score,
        });
    }
}

