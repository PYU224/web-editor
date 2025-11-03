# 🚀 デプロイガイド

Web Code Editorを本番環境にデプロイする手順を説明します。

## 📋 事前準備

### 必要なもの
- PHPが動作するWebサーバー（Apache、Nginx等）
- PHP 7.4以上
- ドメイン（任意）
- OGP用の画像ファイル（1200x630px推奨）

## 🔧 デプロイ手順

### 1. ファイルのアップロード

サーバーにファイルをアップロードします：

```bash
# FTPまたはSCPでアップロード
scp -r web-code-editor/* user@your-server.com:/var/www/html/
```

または、Gitを使用：

```bash
cd /var/www/html/
git clone https://github.com/PYU224/web-code-editor.git
cd web-code-editor
```

### 2. 環境変数の設定

`.env` ファイルを作成して設定：

```bash
# .env.exampleをコピー
cp .env.example .env

# エディタで編集
nano .env
```

`.env` の設定例：

```env
# 本番環境のURL（末尾のスラッシュなし）
SITE_URL=https://your-domain.com

# サイト名
SITE_NAME=Web Code Editor

# サイトの説明（SNSで表示される）
SITE_DESCRIPTION=シンプルで使いやすいブラウザベースのコードエディタ。HTML、CSS、JavaScriptをリアルタイムでプレビューしながら開発できます。

# OGP画像の絶対URL
OGP_IMAGE_URL=https://your-domain.com/program/ogp-image.png

# Twitter Cardの種類
TWITTER_CARD=summary_large_image

# 作者情報
AUTHOR_NAME=Your Name
AUTHOR_URL=https://your-website.com
```

### 3. OGP画像の準備

OGP画像を用意してサーバーにアップロード：

- **推奨サイズ**: 1200x630px
- **形式**: PNG, JPG
- **配置場所**: ドキュメントルートまたは任意のパス
- **URL**: `.env` の `OGP_IMAGE_URL` に絶対URLを設定

```bash
# 例：画像をアップロード
scp ogp-image.png user@your-server.com:/var/www/html/
```

### 4. ファイルパーミッションの設定

```bash
# 読み取り権限を設定
chmod 644 index.php config.php ogp.php
chmod 644 program/*.css program/*.js

# .envファイルは外部から読めないように
chmod 600 .env

# ディレクトリの権限
chmod 755 . program
```

### 5. Webサーバーの設定

#### Apache (.htaccess)

```apache
# index.phpをデフォルトページに
DirectoryIndex index.php

# .envファイルへのアクセスを拒否
<Files .env>
    Order allow,deny
    Deny from all
</Files>

# セキュリティヘッダー
Header set X-Content-Type-Options "nosniff"
Header set X-Frame-Options "SAMEORIGIN"
Header set X-XSS-Protection "1; mode=block"
```

#### Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html/web-code-editor;
    index index.php;

    # .envファイルへのアクセスを拒否
    location ~ /\.env {
        deny all;
    }

    # PHPの処理
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }

    # セキュリティヘッダー
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### 6. SSL証明書の設定（推奨）

Let's Encryptを使用した無料SSL証明書の取得：

```bash
# Certbotをインストール
sudo apt-get install certbot python3-certbot-apache

# 証明書を取得（Apache）
sudo certbot --apache -d your-domain.com

# または（Nginx）
sudo certbot --nginx -d your-domain.com
```

## ✅ デプロイ後の確認

### 1. 動作確認

ブラウザでアクセスして動作を確認：
- https://your-domain.com

### 2. OGPの確認

以下のツールでOGPタグが正しく設定されているか確認：
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [OGP確認ツール](https://rakko.tools/tools/9/)

### 3. セキュリティチェック

- [ ] `.env` ファイルが外部からアクセスできないことを確認
- [ ] HTTPSが有効になっていることを確認
- [ ] セキュリティヘッダーが設定されていることを確認

```bash
# .envへのアクセステスト（403エラーが返ればOK）
curl https://your-domain.com/.env

# ヘッダーの確認
curl -I https://your-domain.com
```

## 🔄 更新手順

アプリケーションを更新する場合：

```bash
# Gitで更新
cd /var/www/html/web-code-editor
git pull origin main

# または手動でファイルを更新
scp -r program/* user@your-server.com:/var/www/html/web-code-editor/program/

# .envファイルは上書きしないように注意！
```

## 🐛 トラブルシューティング

### PHPエラーが表示される

```bash
# PHPのエラーログを確認
sudo tail -f /var/log/apache2/error.log
# または
sudo tail -f /var/log/nginx/error.log
```

### OGP画像が表示されない

1. 画像のURLが絶対パスになっているか確認
2. 画像が外部からアクセスできるか確認
3. 画像のサイズが推奨サイズ（1200x630px）になっているか確認

### .envが読み込まれない

1. ファイルパスが正しいか確認（`config.php`）
2. `.env` ファイルが存在するか確認
3. ファイルパーミッションを確認（600または644）

## 📞 サポート

問題が解決しない場合は、GitHubのIssueで質問してください：
https://github.com/PYU224/web-editor/issues
