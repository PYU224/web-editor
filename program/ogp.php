<?php
/**
 * OGP（Open Graph Protocol）メタタグ
 * SNSでシェアされた際の表示を最適化します
 */

// 設定を読み込み
require_once './program/config.php';

// 現在のページURL（動的に取得）
$currentUrl = getConfig('SITE_URL');
if (isset($_SERVER['REQUEST_URI'])) {
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $currentUrl = $protocol . '://' . $host . $_SERVER['REQUEST_URI'];
}

// OGP設定
$ogp = [
    'title' => getConfig('SITE_NAME'),
    'description' => getConfig('SITE_DESCRIPTION'),
    'url' => $currentUrl,
    'image' => getConfig('OGP_IMAGE_URL'),
    'type' => 'website',
    'site_name' => getConfig('SITE_NAME'),
    'locale' => 'ja_JP'
];

// Twitter Card設定
$twitter = [
    'card' => getConfig('TWITTER_CARD'),
    'title' => getConfig('SITE_NAME'),
    'description' => getConfig('SITE_DESCRIPTION'),
    'image' => getConfig('OGP_IMAGE_URL')
];
?>
    <!-- Primary Meta Tags -->
    <meta name="title" content="<?php echo htmlspecialchars($ogp['title'], ENT_QUOTES, 'UTF-8'); ?>">
    <meta name="description" content="<?php echo htmlspecialchars($ogp['description'], ENT_QUOTES, 'UTF-8'); ?>">
    <meta name="author" content="<?php echo htmlspecialchars(getConfig('AUTHOR_NAME'), ENT_QUOTES, 'UTF-8'); ?>">
    <meta name="keywords" content="コードエディタ, HTML, CSS, JavaScript, オンラインエディタ, Web開発, プログラミング">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="<?php echo htmlspecialchars($ogp['type'], ENT_QUOTES, 'UTF-8'); ?>">
    <meta property="og:url" content="<?php echo htmlspecialchars($ogp['url'], ENT_QUOTES, 'UTF-8'); ?>">
    <meta property="og:title" content="<?php echo htmlspecialchars($ogp['title'], ENT_QUOTES, 'UTF-8'); ?>">
    <meta property="og:description" content="<?php echo htmlspecialchars($ogp['description'], ENT_QUOTES, 'UTF-8'); ?>">
    <meta property="og:image" content="<?php echo htmlspecialchars($ogp['image'], ENT_QUOTES, 'UTF-8'); ?>">
    <meta property="og:site_name" content="<?php echo htmlspecialchars($ogp['site_name'], ENT_QUOTES, 'UTF-8'); ?>">
    <meta property="og:locale" content="<?php echo htmlspecialchars($ogp['locale'], ENT_QUOTES, 'UTF-8'); ?>">
    
    <!-- Twitter -->
    <meta property="twitter:card" content="<?php echo htmlspecialchars($twitter['card'], ENT_QUOTES, 'UTF-8'); ?>">
    <meta property="twitter:url" content="<?php echo htmlspecialchars($ogp['url'], ENT_QUOTES, 'UTF-8'); ?>">
    <meta property="twitter:title" content="<?php echo htmlspecialchars($twitter['title'], ENT_QUOTES, 'UTF-8'); ?>">
    <meta property="twitter:description" content="<?php echo htmlspecialchars($twitter['description'], ENT_QUOTES, 'UTF-8'); ?>">
    <meta property="twitter:image" content="<?php echo htmlspecialchars($twitter['image'], ENT_QUOTES, 'UTF-8'); ?>">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="<?php echo htmlspecialchars($ogp['url'], ENT_QUOTES, 'UTF-8'); ?>">
