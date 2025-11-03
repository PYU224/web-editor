<?php
/**
 * 設定ファイル
 * .envファイルから環境変数を読み込みます
 */

// .envファイルのパス
$envFile = './.env';

// .envファイルが存在しない場合は.env.exampleを使用
if (!file_exists($envFile)) {
    $envFile = './.env.example';
}

// .envファイルを読み込む関数
function loadEnv($filePath) {
    if (!file_exists($filePath)) {
        return [];
    }
    
    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    $env = [];
    
    foreach ($lines as $line) {
        // コメント行をスキップ
        if (strpos(trim($line), '#') === 0) {
            continue;
        }
        
        // KEY=VALUE の形式をパース
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);
            
            // クォートを削除
            $value = trim($value, '"\'');
            
            $env[$key] = $value;
        }
    }
    
    return $env;
}

// 環境変数を読み込み
$config = loadEnv($envFile);

// デフォルト値を設定
$config = array_merge([
    'SITE_URL' => 'https://example.com',
    'SITE_NAME' => 'Web Code Editor',
    'SITE_DESCRIPTION' => 'シンプルで使いやすいブラウザベースのコードエディタ',
    'OGP_IMAGE_URL' => 'https://example.com/program/ogp-image.png',
    'TWITTER_CARD' => 'summary_large_image',
    'AUTHOR_NAME' => 'PYU224',
    'AUTHOR_URL' => 'https://linksta.cc/@pyu224'
], $config);

// 設定値を取得する関数
function getConfig($key, $default = null) {
    global $config;
    return isset($config[$key]) ? $config[$key] : $default;
}
