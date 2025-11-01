# 🚀 Web Code Editor

シンプルで使いやすいブラウザベースのコードエディタ。HTML、CSS、JavaScriptをリアルタイムでプレビューしながら開発できます。

![Web Code Editor Screenshot](sample.png)

## ✨ 主な機能

- 📝 **3つのエディタタブ** - HTML、CSS、JavaScriptを切り替えて編集
- 👀 **リアルタイムプレビュー** - コードを書くと自動的に結果を表示
- 💾 **自動保存** - LocalStorageに自動保存、ページを閉じても安心
- 🖥️ **コンソール出力** - JavaScriptのログやエラーを確認
- 🌙 **ダークモード** - 目に優しいダークテーマ対応
- 📄 **テンプレート** - 空白、基本HTML、Flexbox、Grid、アニメーション、インタラクティブ
- 💾 **エクスポート機能**
  - HTMLファイルとしてダウンロード
  - CodePen/JSFiddle形式でコピー
  - ZIPファイル（HTML/CSS/JS分離）でダウンロード
- 📱 **レスポンシブ対応** - モバイル・タブレットでも快適に動作
- ⌨️ **キーボードショートカット**
  - `Ctrl/Cmd + S` - コードを保存
  - `Ctrl/Cmd + Enter` - コードを実行
- 🔧 **パネルリサイズ** - エディタとプレビューのサイズを自由に調整

## 🚀 使い方

1. リポジトリをクローン
```bash
git clone https://github.com/PYU224/web-code-editor.git
cd web-code-editor
```

2. Webサーバーで起動（例：ローカル環境でのPHP開発サーバ）
```bash
php -S localhost:8000
```

3. ブラウザで `http://localhost:8000` を開く

または、`index.php`を直接ブラウザで開くことも可能です。

## 🛠️ 技術スタック

- **CodeMirror 5.65.2** - コードエディタコンポーネント
- **JSZip 3.10.1** - ZIP形式エクスポート
- **Twemoji** - 絵文字表示
- **Vanilla JavaScript** - フレームワーク不使用

## 📦 ファイル構成

```
web-code-editor/
├── index.php          # メインHTMLファイル
├── program/
│   ├── design.css     # スタイルシート
│   ├── script.js      # メインJavaScript
│   └── favicon.ico    # ファビコン
├── README.md          # このファイル
└── CHANGELOG.md       # 変更履歴
```

## 🌐 ブラウザ対応

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## 📄 ライセンス

GPL-3.0 License

## 👤 作者

**PYU224**<br>
https://linksta.cc/@pyu224

## 🤝 貢献

Issue、Pull Requestを歓迎します！

## 🙏 謝辞

- [CodeMirror](https://codemirror.net/) - 素晴らしいエディタライブラリ
- [JSZip](https://stuk.github.io/jszip/) - ZIPファイル生成
- [Twemoji](https://twemoji.twitter.com/) - 絵文字アイコン
