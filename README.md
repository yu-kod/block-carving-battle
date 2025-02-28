# Block Carving Battle

Block Carving Battleは、ブラウザ上で動作するリアルタイムパズルゲームです。  
プレイヤーは、表示されたお題に合わせてグリッド上のブロックを掘り、形を再現して対戦やチャレンジを行います。

## 特徴

- **リアルタイムパズル:** 一定時間ごとにお題が追加され、プレイヤーは制限時間内にお題の形をブロックで再現する必要があります。
- **シングルプレイモード:** お題が溢れるとゲームオーバー。スコアやタイムアタックで挑戦可能。
- **マルチプレイモード:** お題をクリアすると相手のフィールドにお題が追加されるルールで、駆け引きが楽しめます。
- **軽快なブラウザ動作:** ViteとPixiJSを活用した高速な描画と操作性を実現。

## 技術スタック

- **フロントエンド:**
  - [PixiJS](https://pixijs.com/) - 高速な2D描画ライブラリ
  - [Vite](https://vitejs.dev/) - モダンなフロントエンドビルドツール
- **バックエンド（今後の拡張予定）:**
  - AWS（Lambda、API Gateway、DynamoDB など）

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 開発サーバーの起動

```bash
npm run dev
```

起動後、ブラウザで http://localhost:5173/ にアクセスするとプロトタイプが確認できます。

## プロジェクト構成例

```csharp
block-carving-battle/
├── public/               # 静的ファイル
├── src/                  # ソースコード
│   ├── main.ts           # エントリーポイント（PixiJSでの初期化処理など）
│   └── ...               # その他のコンポーネント・モジュール
├── LICENSE               # MITライセンスファイル
└── README.md             # このREADMEファイル
```

## ライセンス
このプロジェクトはMITライセンスのもとで提供されています。
詳細は [LICENSE](https://github.com/yu-kod/block-carving-battle/blob/main/LICENSE) ファイルをご覧ください。
