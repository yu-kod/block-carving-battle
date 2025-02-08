import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

let players = [];

wss.on('connection', (ws) => {
    console.log('🚀 プレイヤーが接続しました');

    if (players.length < 2) {
        players.push(ws);
    } else {
        ws.send(JSON.stringify({ type: 'error', message: 'プレイヤー数の上限に達しました' }));
        ws.close();
        return;
    }

    ws.on('message', (message) => {
    const data = JSON.parse(message);
    console.log(`📩 メッセージ受信: ${JSON.stringify(data)}`);

    if (data.type === "score_update") {
        console.log(`🎯 スコア更新: ${data.score}`);
    }

    players.forEach((player) => {
        if (player !== ws) {
            player.send(JSON.stringify(data));
        }
    });
});


    ws.on('close', () => {
        console.log('❌ プレイヤーが切断されました');
        players = players.filter((player) => player !== ws);
    });
});

console.log('✅ WebSocket サーバーが ws://localhost:8080 で起動しました');
