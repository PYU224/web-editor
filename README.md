# 🚀 Web Code Editor

シンプルで使いやすいブラウザベースのコードエディタ。HTML、CSS、JavaScriptをリアルタイムでプレビューしながら開発できます。

![Web Code Editor Screenshot](sample.png)

## ✨ 主な機能

- 📝 **3つのエディタタブ** - HTML、CSS、JavaScriptを切り替えて編集
- 👀 **リアルタイムプレビュー** - コードを書くと自動的に結果を表示
- ✨ **Emmet対応** - HTML/CSSの省略記法でコーディングを高速化
  - 例: `html:5`, `ul>li*3`, `.container` など
- 🎨 **コード整形機能** - Prettierでワンクリック整形
- 🔗 **SNS共有** - Twitter、Facebook、LINEでコードを簡単にシェア
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
  - `Ctrl/Cmd + Shift + F` - コードを整形
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

## 🎯 新機能の使い方

### Emmet省略記法
HTML/CSSエディタで省略記法を入力後、**Tabキー**を押すと展開されます。

```
html:5 → HTML5のテンプレート
ul>li*3 → <ul><li></li><li></li><li></li></ul>
.container → <div class="container"></div>
div.header>h1+nav → <div class="header"><h1></h1><nav></nav></div>
```

### コード整形
1. 整形したいコードのタブを選択（HTML/CSS/JS）
2. 「✨ 整形」ボタンをクリック
3. または `Ctrl/Cmd + Shift + F` を押す

### SNS共有
1. 「🔗 共有」ボタンをクリック
2. Twitter、Facebook、LINEから選択してシェア
3. または共有URLをコピーして自由に配布

## 🛠️ 技術スタック

- **CodeMirror 5.65.2** - コードエディタコンポーネント
- **emmet-codemirror 1.2.4** - Emmet省略記法サポート
- **Prettier 2.8.8** - コード整形エンジン
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

MIT License

## 👤 作者

**PYU224**<br>
https://linksta.cc/@pyu224

## 🤝 貢献

Issue、Pull Requestを歓迎します！

## 🙏 謝辞

- [CodeMirror](https://codemirror.net/) - 素晴らしいエディタライブラリ
- [Emmet](https://emmet.io/) - 高速コーディングツール
- [Prettier](https://prettier.io/) - コード整形ツール
- [JSZip](https://stuk.github.io/jszip/) - ZIPファイル生成
- [Twemoji](https://twemoji.twitter.com/) - 絵文字アイコン
