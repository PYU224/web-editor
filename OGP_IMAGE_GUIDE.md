# 🎨 OGP画像作成ガイド

SNSでシェアされた際に表示されるOGP画像の作成方法を説明します。

## 📐 推奨仕様

- **サイズ**: 1200 x 630px（必須）
- **形式**: PNG, JPG
- **ファイルサイズ**: 1MB以下推奨
- **アスペクト比**: 1.91:1（Twitter, Facebook推奨）

## 🎨 デザインのポイント

### 1. 安全領域を意識する

一部のプラットフォームでは画像の端が切れる場合があります：
- 重要な情報は中央に配置
- 上下左右に50px程度のマージンを確保

### 2. テキストを読みやすく

- フォントサイズは大きめに（最小でも40px以上）
- 背景とのコントラストを確保
- 長い文章は避ける（1-2行まで）

### 3. ブランディング

- サイトのロゴを配置
- ブランドカラーを使用
- 一貫したデザインにする

## 🛠️ 作成ツール

### オンラインツール（無料）

1. **Canva**
   - URL: https://www.canva.com/
   - テンプレート: "Facebook Post" (1200x630px)
   - 特徴: 豊富なテンプレート、直感的な操作

2. **OGP画像シミュレータ**
   - URL: https://og-image-vercel.vercel.app/
   - 特徴: コードベースで画像を生成

3. **Figma**
   - URL: https://www.figma.com/
   - 特徴: プロフェッショナルなデザインツール

### デザインソフト

- Adobe Photoshop
- Adobe Illustrator
- GIMP（無料）
- Affinity Designer

## 📝 テンプレート例

### シンプルなテキスト中心

```
┌─────────────────────────────────────┐
│                                     │
│         🚀 Web Code Editor         │
│                                     │
│    HTML・CSS・JavaScriptを         │
│    リアルタイムでプレビュー         │
│                                     │
│         your-domain.com            │
│                                     │
└─────────────────────────────────────┘
```

### スクリーンショット + テキスト

```
┌─────────────────────────────────────┐
│  [エディタのスクリーンショット]    │
│                                     │
│  🚀 Web Code Editor                │
│  ブラウザで完結するコードエディタ  │
│                                     │
└─────────────────────────────────────┘
```

## 🎯 実装例

### HTMLベースで画像を生成する方法

```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            margin: 0;
            width: 1200px;
            height: 630px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: 'Arial', sans-serif;
        }
        .container {
            text-align: center;
            color: white;
        }
        h1 {
            font-size: 72px;
            margin: 0 0 20px 0;
        }
        p {
            font-size: 36px;
            margin: 0;
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Web Code Editor</h1>
        <p>HTML・CSS・JavaScriptを<br>リアルタイムでプレビュー</p>
    </div>
</body>
</html>
```

このHTMLをブラウザで開き、スクリーンショットを撮る（または印刷機能でPDF化）

### CSSで装飾を追加

```css
/* グラデーション背景 */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* シャドウ効果 */
text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);

/* ボーダー */
border: 8px solid rgba(255, 255, 255, 0.2);
border-radius: 20px;
```

## ✅ チェックリスト

画像を公開する前に確認：

- [ ] サイズが1200 x 630pxであること
- [ ] ファイルサイズが1MB以下であること
- [ ] テキストが読みやすいこと
- [ ] 重要な情報が中央に配置されていること
- [ ] ブランドカラーやロゴが含まれていること
- [ ] モバイルでも見やすいこと

## 🧪 テスト方法

### 1. ローカルでテスト

画像を保存して、`.env` ファイルで設定：

```env
OGP_IMAGE_URL=https://your-domain.com/ogp-image.png
```

### 2. プレビューツールで確認

- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

### 3. 実際にシェアしてテスト

- テスト用のSNSアカウントでシェア
- 各プラットフォームでの表示を確認

## 💡 Tips

### キャッシュをクリアする

SNSは画像をキャッシュするため、更新してもすぐに反映されない場合があります：

- Facebookの場合: Sharing Debuggerで「再度スクレイピング」
- Twitterの場合: 数時間待つか、URLにパラメータを追加（?v=2）

### 複数の画像を用意する

- ページごとに異なる画像を設定可能
- トップページ、ドキュメント、ブログ記事など

### ダークモード対応

- 背景色を考慮したデザイン
- 明るすぎない色を選択

## 📚 参考リソース

- [Facebook OGPガイド](https://developers.facebook.com/docs/sharing/webmasters/)
- [Twitter Cardガイド](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [OGP公式サイト](https://ogp.me/)
