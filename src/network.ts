export class Network {
    private socket: WebSocket;

    constructor(serverUrl: string, onMessage: (data: any) => void) {
        this.socket = new WebSocket(serverUrl);

        this.socket.onopen = () => {
            console.log("✅ WebSocket 接続成功");
            this.send({ type: "join_lobby" }); // 🎯 サーバーに「ロビー参加」メッセージを送信
        };

        this.socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(`📩 受信データ: ${JSON.stringify(data)}`);
            onMessage(data);
        };

        this.socket.onerror = (error) => {
            console.error("⚠️ WebSocket エラー:", error);
        };

        this.socket.onclose = () => {
            console.log("❌ WebSocket 接続終了");
        };
    }

    send(data: any) {
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
            console.log(`📤 送信データ: ${JSON.stringify(data)}`);
        } else {
            console.error("⚠️ WebSocket が未接続です。送信に失敗しました。");
        }
    }
}


