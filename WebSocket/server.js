import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

let waitingPlayer = null;

wss.on('connection', (ws) => {
    console.log('🚀 プレイヤーが接続しました');

    ws.on('message', (message) => {
        console.log(`📩 メッセージ受信: ${message}`); // 🎯 受信データのログを追加

        try {
            const data = JSON.parse(message);

            if (data.type === "join_lobby") {
                console.log("🛠 クライアントがロビーに参加しました");

                if (waitingPlayer) {
                    console.log("🎯 マッチング成功！");
                    ws.send(JSON.stringify({ type: "match_found", serverUrl: "ws://localhost:8080", opponentId: 1 }));
                    waitingPlayer.send(JSON.stringify({ type: "match_found", serverUrl: "ws://localhost:8080", opponentId: 2 }));
                    waitingPlayer = null;
                } else {
                    waitingPlayer = ws;
                    console.log("⏳ プレイヤーがロビーに待機中...");
                }
            } else if (data.type === "score_update") {
                console.log("スコア:", data.score);
            }
        } catch (error) {
            console.error("⚠️ メッセージ解析エラー:", error);
        }
    });

    ws.on('error', (error) => {
        console.error("⚠️ WebSocket サーバーエラー:", error);
    });

    ws.on('close', () => {
        console.log('❌ プレイヤーが切断されました');
        if (waitingPlayer === ws) {
            waitingPlayer = null;
        }
    });
});

console.log('✅ WebSocket サーバーが ws://localhost:8080 で起動しました');
