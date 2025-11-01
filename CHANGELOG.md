# Changelog

このプロジェクトの変更履歴を記録します。

フォーマットは [Keep a Changelog](https://keepachangelog.com/ja/1.0.0/) に準拠し、
バージョン管理は [Semantic Versioning](https://semver.org/lang/ja/) に従います。

## [1.0.0] - 2025-10-30

### 追加
- 🎉 初回リリース
- HTML/CSS/JavaScriptの3つのエディタタブ
- CodeMirrorベースのシンタックスハイライト
- リアルタイムプレビュー機能（デバウンス付き自動実行）
- LocalStorageへの自動保存機能
- コンソール出力のキャプチャとエラー表示
- ダークモード切り替え（Monokaiテーマ）
- 6種類のテンプレート
  - 空白
  - 基本HTML
  - Flexboxレイアウト
  - CSS Grid
  - CSSアニメーション
  - インタラクティブ（JavaScript）
- 4種類のエクスポート機能
  - HTMLファイルダウンロード
  - CodePen形式コピー
  - JSFiddle形式コピー
  - ZIPファイルダウンロード（HTML/CSS/JS分離）
- パネルリサイズ機能（エディタ/プレビュー幅調整）
- レスポンシブデザイン（モバイル・タブレット対応）
- キーボードショートカット
  - `Ctrl/Cmd + S` - 保存
  - `Ctrl/Cmd + Enter` - 実行
- トースト通知システム
- Twemojiによる絵文字表示

### セキュリティ
- iframeのサンドボックス機能を実装
- クロスオリジンエラーのフィルタリング

---

## リリースタイプについて

- **Added** - 新機能
- **Changed** - 既存機能の変更
- **Deprecated** - 非推奨となった機能
- **Removed** - 削除された機能
- **Fixed** - バグ修正
- **Security** - セキュリティ関連の修正
