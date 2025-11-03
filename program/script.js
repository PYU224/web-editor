// エディタの初期化
let htmlEditor, cssEditor, jsEditor;
let currentTab = 'html';
let debounceTimer;
let consoleVisible = false;
let currentViewport = 'desktop';
let currentLayout = 'horizontal'; // horizontal or vertical
let enabledLibraries = {};

// 外部ライブラリの定義
const libraries = {
    'jquery': {
        type: 'js',
        url: 'https://code.jquery.com/jquery-3.7.1.min.js',
        name: 'jQuery 3.7.1'
    },
    'bootstrap-css': {
        type: 'css',
        url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css',
        name: 'Bootstrap CSS 5.3'
    },
    'bootstrap-js': {
        type: 'js',
        url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js',
        name: 'Bootstrap JS 5.3'
    },
    'tailwind': {
        type: 'css',
        url: 'https://cdn.tailwindcss.com',
        name: 'Tailwind CSS 3.4'
    },
    'vuejs': {
        type: 'js',
        url: 'https://unpkg.com/vue@3.4.21/dist/vue.global.js',
        name: 'Vue.js 3.4'
    },
    'axios': {
        type: 'js',
        url: 'https://cdn.jsdelivr.net/npm/axios@1.6.7/dist/axios.min.js',
        name: 'Axios 1.6'
    },
    'gsap': {
        type: 'js',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
        name: 'GSAP 3.12'
    },
    'fontawesome': {
        type: 'css',
        url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
        name: 'Font Awesome 6.5'
    }
};

// CodeMirrorエディタの作成
function initEditors() {
    const commonOptions = {
        lineNumbers: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 2,
        tabSize: 2,
        lineWrapping: true,
        extraKeys: {
            'Ctrl-/': 'toggleComment',
            'Cmd-/': 'toggleComment'
        }
    };

    htmlEditor = CodeMirror(document.getElementById('html-editor'), {
        ...commonOptions,
        mode: 'htmlmixed',
        value: localStorage.getItem('html') || '<h1>Hello World!</h1>\n<p>HTMLコードをここに記述</p>'
    });

    cssEditor = CodeMirror(document.getElementById('css-editor'), {
        ...commonOptions,
        mode: 'css',
        value: localStorage.getItem('css') || 'body {\n  font-family: Arial, sans-serif;\n  padding: 20px;\n}\n\nh1 {\n  color: #4CAF50;\n}'
    });

    jsEditor = CodeMirror(document.getElementById('js-editor'), {
        ...commonOptions,
        mode: 'javascript',
        value: localStorage.getItem('js') || '// JavaScriptコードをここに記述\nconsole.log("Hello from JavaScript!");'
    });

    // Emmetの有効化
    if (typeof emmetCodeMirror !== 'undefined') {
        emmetCodeMirror(htmlEditor);
        emmetCodeMirror(cssEditor);
        console.log('Emmet enabled for HTML and CSS editors');
    } else {
        console.warn('Emmet library not loaded');
    }

    // 変更時の自動実行（デバウンス付き）
    [htmlEditor, cssEditor, jsEditor].forEach(editor => {
        editor.on('change', () => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                runCode();
                saveToLocalStorage();
            }, 500);
        });
    });

    // ダークモードの適用
    applyDarkMode();
}

// タブ切り替え
function switchTab(tab) {
    currentTab = tab;
    
    // タブのアクティブ状態を更新
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    const targetTab = document.querySelector(`.tab[data-editor="${tab}"]`);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // エディタの表示切り替え
    document.querySelectorAll('.editor').forEach(e => e.classList.remove('active'));
    const targetEditor = document.getElementById(`${tab}-editor`);
    if (targetEditor) {
        targetEditor.classList.add('active');
    }
    
    // エディタのリフレッシュ（表示が崩れないように）
    setTimeout(() => {
        if (tab === 'html' && htmlEditor) {
            htmlEditor.refresh();
        } else if (tab === 'css' && cssEditor) {
            cssEditor.refresh();
        } else if (tab === 'js' && jsEditor) {
            jsEditor.refresh();
        }
    }, 10);
}

// コード整形機能（Prettier）
function formatCode() {
    if (typeof prettier === 'undefined') {
        showToast('Prettierライブラリが読み込まれていません', 'error');
        return;
    }

    try {
        let formattedCode;
        const currentEditor = getCurrentEditor();
        const code = currentEditor.getValue();

        if (currentTab === 'html') {
            formattedCode = prettier.format(code, {
                parser: 'html',
                plugins: prettierPlugins,
                printWidth: 80,
                tabWidth: 2,
                useTabs: false,
                htmlWhitespaceSensitivity: 'css'
            });
        } else if (currentTab === 'css') {
            formattedCode = prettier.format(code, {
                parser: 'css',
                plugins: prettierPlugins,
                printWidth: 80,
                tabWidth: 2,
                useTabs: false
            });
        } else if (currentTab === 'js') {
            formattedCode = prettier.format(code, {
                parser: 'babel',
                plugins: prettierPlugins,
                printWidth: 80,
                tabWidth: 2,
                useTabs: false,
                semi: true,
                singleQuote: true
            });
        }

        if (formattedCode) {
            currentEditor.setValue(formattedCode);
            showToast(`${currentTab.toUpperCase()}コードを整形しました`, 'success');
        }
    } catch (error) {
        console.error('Format error:', error);
        showToast('コード整形に失敗しました: ' + error.message, 'error');
    }
}

// 現在のエディタを取得
function getCurrentEditor() {
    if (currentTab === 'html') return htmlEditor;
    if (currentTab === 'css') return cssEditor;
    if (currentTab === 'js') return jsEditor;
    return htmlEditor;
}

// レスポンシブプレビューモード切り替え
function setViewport(viewport) {
    currentViewport = viewport;
    const previewPanel = document.querySelector('.preview-panel');
    
    // すべてのビューポートクラスを削除
    previewPanel.classList.remove('desktop', 'tablet', 'mobile');
    
    // 新しいビューポートクラスを追加
    if (viewport !== 'desktop') {
        previewPanel.classList.add(viewport);
    }
    
    // ボタンのアクティブ状態を更新
    document.querySelectorAll('.btn-viewport').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.viewport === viewport) {
            btn.classList.add('active');
        }
    });
    
    // ビューポート名の取得
    const viewportNames = {
        'desktop': 'デスクトップ',
        'tablet': 'タブレット (768px)',
        'mobile': 'モバイル (375px)'
    };
    
    showToast(`プレビュー: ${viewportNames[viewport]}`, 'success');
    localStorage.setItem('viewport', viewport);
}

// レイアウト切り替え（横分割/縦分割）
function toggleLayout() {
    const container = document.querySelector('.container');
    
    if (currentLayout === 'horizontal') {
        container.classList.add('vertical');
        currentLayout = 'vertical';
        showToast('縦分割レイアウトに切り替えました', 'success');
    } else {
        container.classList.remove('vertical');
        currentLayout = 'horizontal';
        showToast('横分割レイアウトに切り替えました', 'success');
    }
    
    // エディタをリフレッシュ
    setTimeout(() => {
        htmlEditor.refresh();
        cssEditor.refresh();
        jsEditor.refresh();
    }, 100);
    
    localStorage.setItem('layout', currentLayout);
}

// 外部ライブラリの切り替え
function toggleLibrary(libId) {
    const checkbox = document.getElementById(`lib-${libId}`);
    enabledLibraries[libId] = checkbox.checked;
    
    // LocalStorageに保存
    localStorage.setItem('libraries', JSON.stringify(enabledLibraries));
    
    // コードを再実行して変更を反映
    runCode();
    
    const libName = libraries[libId].name;
    if (checkbox.checked) {
        showToast(`${libName} を有効にしました`, 'success');
    } else {
        showToast(`${libName} を無効にしました`, 'success');
    }
}

// SNS共有モーダルを開く
function openShare() {
    generateShareUrl();
    document.getElementById('shareModal').classList.add('show');
}

// 共有用URLを生成（簡素化版 - ページURLのみ）
function generateShareUrl() {
    const baseUrl = window.location.origin + window.location.pathname;
    document.getElementById('shareUrl').value = baseUrl;
}

// 共有URLをコピー
function copyShareUrl() {
    const shareUrlInput = document.getElementById('shareUrl');
    shareUrlInput.select();
    
    try {
        document.execCommand('copy');
        showToast('URLをコピーしました', 'success');
    } catch (err) {
        navigator.clipboard.writeText(shareUrlInput.value).then(() => {
            showToast('URLをコピーしました', 'success');
        }).catch(() => {
            showToast('コピーに失敗しました', 'error');
        });
    }
}

// Twitterでシェア
function shareToTwitter() {
    const text = 'Web Code Editorでコーディング中！';
    const url = document.getElementById('shareUrl').value;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
}

// Facebookでシェア
function shareToFacebook() {
    const url = document.getElementById('shareUrl').value;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
}

// LINEでシェア
function shareToLine() {
    const text = 'Web Code Editorでコーディング中！';
    const url = document.getElementById('shareUrl').value;
    const lineUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(lineUrl, '_blank', 'width=550,height=420');
}

// HTMLコード内の未閉じタグを修正
function sanitizeHTML(html) {
    // 不完全なタグ（<で始まるが>で終わらない）を検出してエスケープ
    let sanitized = html;
    
    // 最後の完全なタグの位置を見つける
    const lastCompleteTagIndex = sanitized.lastIndexOf('>');
    
    // 最後の<の位置を見つける
    const lastOpenBracketIndex = sanitized.lastIndexOf('<');
    
    // もし最後の<が最後の>よりも後にある場合、不完全なタグがある
    if (lastOpenBracketIndex > lastCompleteTagIndex) {
        // 不完全な部分を取得
        const incompleteTag = sanitized.substring(lastOpenBracketIndex);
        // 完全な部分を取得
        const completePart = sanitized.substring(0, lastOpenBracketIndex);
        // 不完全なタグをHTMLエスケープ
        const escapedTag = incompleteTag
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
        // 結合
        sanitized = completePart + escapedTag;
    }
    
    // 危険なタグ（script, style, title等）の未閉じをチェックして修正
    const dangerousTags = ['script', 'style', 'title', 'textarea', 'iframe'];
    
    dangerousTags.forEach(tag => {
        // 開きタグの数をカウント
        const openTagRegex = new RegExp(`<${tag}[^>]*>`, 'gi');
        const closeTagRegex = new RegExp(`</${tag}>`, 'gi');
        
        const openMatches = sanitized.match(openTagRegex) || [];
        const closeMatches = sanitized.match(closeTagRegex) || [];
        
        // 開きタグの方が多い場合、不足分の閉じタグを追加
        const unclosedCount = openMatches.length - closeMatches.length;
        if (unclosedCount > 0) {
            for (let i = 0; i < unclosedCount; i++) {
                sanitized += `</${tag}>`;
            }
        }
    });
    
    return sanitized;
}

// コード実行
function runCode() {
    if (!htmlEditor || !cssEditor || !jsEditor) {
        return;
    }
    
    const html = htmlEditor.getValue();
    const css = cssEditor.getValue();
    const js = jsEditor.getValue();
    
    // HTMLコードを安全化（未閉じタグを修正）
    const sanitizedHTML = sanitizeHTML(html);
    
    // コンソールをクリア
    document.getElementById('console').innerHTML = '';
    
    // 外部ライブラリのタグを生成
    let libraryTags = '';
    for (const [libId, enabled] of Object.entries(enabledLibraries)) {
        if (enabled && libraries[libId]) {
            const lib = libraries[libId];
            if (lib.type === 'css') {
                libraryTags += `<link rel="stylesheet" href="${lib.url}">\n    `;
            } else if (lib.type === 'js') {
                libraryTags += `<script src="${lib.url}"></script>\n    `;
            }
        }
    }
    
    // 安全なHTML生成（ユーザーHTMLをコンテナで囲んで隔離）
    const content = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${libraryTags}
    <style>
        /* ユーザーコンテンツラッパーを透明化 */
        #user-content-wrapper {
            display: contents;
        }
        ${css}
    </style>
</head>
<body>
<div id="user-content-wrapper">
${sanitizedHTML}
</div>
<!-- ユーザーコンテンツ終了 -->
<script>
// コンソールログのキャプチャ
(function() {
    try {
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        
        console.log = function(...args) {
            try {
                window.parent.postMessage({
                    type: 'console',
                    method: 'log',
                    args: args.map(arg => {
                        try {
                            return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
                        } catch(e) {
                            return String(arg);
                        }
                    })
                }, '*');
            } catch(e) {}
            originalLog.apply(console, args);
        };
        
        console.error = function(...args) {
            try {
                window.parent.postMessage({
                    type: 'console',
                    method: 'error',
                    args: args.map(arg => {
                        try {
                            return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
                        } catch(e) {
                            return String(arg);
                        }
                    })
                }, '*');
            } catch(e) {}
            originalError.apply(console, args);
        };
        
        console.warn = function(...args) {
            try {
                window.parent.postMessage({
                    type: 'console',
                    method: 'warn',
                    args: args.map(arg => {
                        try {
                            return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
                        } catch(e) {
                            return String(arg);
                        }
                    })
                }, '*');
            } catch(e) {}
            originalWarn.apply(console, args);
        };
        
        // エラーハンドリング
        window.addEventListener('error', function(e) {
            try {
                window.parent.postMessage({
                    type: 'console',
                    method: 'error',
                    args: [e.message + ' at line ' + e.lineno]
                }, '*');
            } catch(err) {}
        });
    } catch(e) {
        console.error('Failed to setup console capture:', e);
    }
})();

${js}
</script>
</body>
</html>`;
    
    const iframe = document.getElementById('preview');
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    iframe.src = url;
    
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// プレビュー更新
function refreshPreview() {
    runCode();
    showToast('プレビューを更新しました', 'success');
}

// コンソール表示切り替え
function toggleConsole() {
    consoleVisible = !consoleVisible;
    const consoleElement = document.getElementById('console');
    if (consoleVisible) {
        consoleElement.classList.add('show');
    } else {
        consoleElement.classList.remove('show');
    }
}

// コンソールメッセージの受信
window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'console') {
        addConsoleMessage(e.data.method, e.data.args);
    }
});

// コンソールメッセージの追加
function addConsoleMessage(method, args) {
    const consoleElement = document.getElementById('console');
    const entry = document.createElement('div');
    entry.className = `console-entry ${method}`;
    
    const message = args.join(' ');
    entry.textContent = `[${method.toUpperCase()}] ${message}`;
    
    consoleElement.appendChild(entry);
    consoleElement.scrollTop = consoleElement.scrollHeight;
}

// LocalStorageに保存
function saveToLocalStorage() {
    try {
        localStorage.setItem('html', htmlEditor.getValue());
        localStorage.setItem('css', cssEditor.getValue());
        localStorage.setItem('js', jsEditor.getValue());
    } catch (e) {
        console.error('Failed to save to localStorage:', e);
    }
}

// ダークモード切り替え
function toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDark);
    applyDarkMode();
}

// ダークモードをエディタに適用
function applyDarkMode() {
    const isDark = document.body.classList.contains('dark-mode');
    const theme = isDark ? 'monokai' : 'default';
    
    if (htmlEditor) htmlEditor.setOption('theme', theme);
    if (cssEditor) cssEditor.setOption('theme', theme);
    if (jsEditor) jsEditor.setOption('theme', theme);
    
    // トグルスイッチの状態を更新
    const toggle = document.getElementById('darkModeToggle');
    if (toggle) toggle.checked = isDark;
}

// フォントサイズ設定
function setFontSize(size) {
    const sizes = {
        'small': '12px',
        'medium': '14px',
        'large': '16px',
        'xlarge': '18px'
    };
    
    const fontSize = sizes[size] || sizes['medium'];
    
    [htmlEditor, cssEditor, jsEditor].forEach(editor => {
        if (editor) {
            const cm = editor.getWrapperElement();
            cm.style.fontSize = fontSize;
            editor.refresh();
        }
    });
    
    localStorage.setItem('fontSize', size);
    
    // ボタンのアクティブ状態を更新
    document.querySelectorAll('.btn-font-size').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = Array.from(document.querySelectorAll('.btn-font-size')).find(
        btn => btn.textContent.includes(
            size === 'small' ? '小' : 
            size === 'large' ? '大' : 
            size === 'xlarge' ? '特大' : '中'
        )
    );
    if (activeBtn) activeBtn.classList.add('active');
}

// トースト通知
function showToast(message, type = 'success') {
    // 既存のトーストを削除
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// モバイルメニューの開閉
function toggleMobileMenu() {
    const menu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileMenuOverlay');
    
    if (menu.classList.contains('show')) {
        menu.classList.remove('show');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
    } else {
        menu.classList.add('show');
        overlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

// モーダルを開く
function openTemplates() {
    document.getElementById('templateModal').classList.add('show');
}

function openExport() {
    document.getElementById('exportModal').classList.add('show');
}

function openSettings() {
    // ライブラリのチェックボックス状態を復元
    for (const [libId, enabled] of Object.entries(enabledLibraries)) {
        const checkbox = document.getElementById(`lib-${libId}`);
        if (checkbox) {
            checkbox.checked = enabled;
        }
    }
    document.getElementById('settingsModal').classList.add('show');
}

// モーダルを閉じる
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// テンプレート読み込み
function loadTemplate(templateName) {
    const templates = {
        blank: {
            html: '',
            css: '',
            js: ''
        },
        basic: {
            html: `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Page</title>
</head>
<body>
    <header>
        <h1>ようこそ</h1>
    </header>
    <main>
        <p>ここにコンテンツを追加してください。</p>
    </main>
    <footer>
        <p>&copy; 2024</p>
    </footer>
</body>
</html>`,
            css: `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: Arial, sans-serif;
    line-height: 1.6;
}

header {
    background: #333;
    color: #fff;
    padding: 1rem;
    text-align: center;
}

main {
    padding: 2rem;
}

footer {
    background: #333;
    color: #fff;
    text-align: center;
    padding: 1rem;
    position: fixed;
    bottom: 0;
    width: 100%;
}`,
            js: `console.log('ページが読み込まれました');`
        },
        flexbox: {
            html: `<div class="container">
    <div class="box">Box 1</div>
    <div class="box">Box 2</div>
    <div class="box">Box 3</div>
</div>`,
            css: `.container {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.box {
    width: 200px;
    height: 200px;
    background: white;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    font-weight: bold;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    transition: transform 0.3s;
}

.box:hover {
    transform: translateY(-10px);
}`,
            js: `console.log('Flexboxレイアウトのデモ');`
        },
        grid: {
            html: `<div class="grid-container">
    <div class="item">1</div>
    <div class="item">2</div>
    <div class="item">3</div>
    <div class="item">4</div>
    <div class="item">5</div>
    <div class="item">6</div>
</div>`,
            css: `body {
    margin: 0;
    padding: 20px;
    background: #f0f0f0;
}

.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
}

.item {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 40px;
    text-align: center;
    font-size: 32px;
    font-weight: bold;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    transition: transform 0.3s;
}

.item:hover {
    transform: scale(1.05);
}`,
            js: `console.log('CSS Gridレイアウトのデモ');`
        },
        animation: {
            html: `<div class="animation-container">
    <div class="circle"></div>
    <h1 class="title">CSSアニメーション</h1>
</div>`,
            css: `body {
    margin: 0;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.animation-container {
    text-align: center;
}

.circle {
    width: 100px;
    height: 100px;
    background: white;
    border-radius: 50%;
    margin: 0 auto 30px;
    animation: bounce 2s infinite;
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-30px); }
}

.title {
    color: white;
    font-size: 48px;
    animation: fadeIn 2s;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}`,
            js: `console.log('アニメーションが動作中');`
        },
        interactive: {
            html: `<div class="app">
    <h1>カウンター</h1>
    <div class="counter">
        <button id="decrease">-</button>
        <span id="count">0</span>
        <button id="increase">+</button>
    </div>
    <button id="reset">リセット</button>
</div>`,
            css: `body {
    margin: 0;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    font-family: Arial, sans-serif;
}

.app {
    background: white;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    text-align: center;
}

.counter {
    display: flex;
    gap: 20px;
    align-items: center;
    margin: 30px 0;
}

button {
    padding: 15px 30px;
    font-size: 24px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    background: #667eea;
    color: white;
    transition: background 0.3s;
}

button:hover {
    background: #764ba2;
}

#count {
    font-size: 48px;
    font-weight: bold;
    min-width: 100px;
}

#reset {
    margin-top: 20px;
    background: #f44336;
}

#reset:hover {
    background: #d32f2f;
}`,
            js: `let count = 0;
const countElement = document.getElementById('count');

document.getElementById('increase').addEventListener('click', () => {
    count++;
    countElement.textContent = count;
});

document.getElementById('decrease').addEventListener('click', () => {
    count--;
    countElement.textContent = count;
});

document.getElementById('reset').addEventListener('click', () => {
    count = 0;
    countElement.textContent = count;
});

console.log('インタラクティブアプリが起動しました');`
        }
    };
    
    const template = templates[templateName];
    if (!template) {
        showToast('テンプレートが見つかりません', 'error');
        return;
    }
    
    closeModal('templateModal');
    
    // HTMLタブに切り替え
    switchTab('html');
    
    // エディタの値を設定（即座に反映）
    htmlEditor.setValue(template.html);
    cssEditor.setValue(template.css);
    jsEditor.setValue(template.js);
    
    // カーソルを先頭に移動
    htmlEditor.setCursor(0, 0);
    cssEditor.setCursor(0, 0);
    jsEditor.setCursor(0, 0);
    
    // エディタを強制的にリフレッシュ（表示を更新）
    setTimeout(() => {
        htmlEditor.refresh();
        cssEditor.refresh();
        jsEditor.refresh();
    }, 10);
    
    // コードを実行して保存
    setTimeout(() => {
        runCode();
        saveToLocalStorage();
    }, 100);
    
    // テンプレート名の表示用マップ
    const templateNames = {
        'blank': '空白',
        'basic': '基本HTML',
        'flexbox': 'Flexboxレイアウト',
        'grid': 'CSS Grid',
        'animation': 'CSSアニメーション',
        'interactive': 'インタラクティブ'
    };
    
    const displayName = templateNames[templateName] || templateName;
    showToast(`テンプレート「${displayName}」を読み込みました`, 'success');
    console.log('テンプレート「' + templateName + '」を読み込みました');
}

// HTMLファイルとしてエクスポート
function exportHTML() {
    const html = htmlEditor.getValue();
    const css = cssEditor.getValue();
    const js = jsEditor.getValue();
    
    // 外部ライブラリのタグを生成
    let libraryTags = '';
    for (const [libId, enabled] of Object.entries(enabledLibraries)) {
        if (enabled && libraries[libId]) {
            const lib = libraries[libId];
            if (lib.type === 'css') {
                libraryTags += `    <link rel="stylesheet" href="${lib.url}">\n`;
            } else if (lib.type === 'js') {
                libraryTags += `    <script src="${lib.url}"></script>\n`;
            }
        }
    }
    
    const content = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Web Page</title>
${libraryTags}    <style>
${css}
    </style>
</head>
<body>
${html}
    <script>
${js}
    </script>
</body>
</html>`;
    
    downloadFile('index.html', content);
    closeModal('exportModal');
    showToast('HTMLファイルをダウンロードしました', 'success');
}

// CodePen形式でコピー
function exportCodePen() {
    const data = {
        html: htmlEditor.getValue(),
        css: cssEditor.getValue(),
        js: jsEditor.getValue()
    };
    
    const jsonData = JSON.stringify(data);
    navigator.clipboard.writeText(jsonData).then(() => {
        closeModal('exportModal');
        showToast('CodePen形式でコピーしました', 'success');
    }).catch(() => {
        showToast('コピーに失敗しました', 'error');
    });
}

// JSFiddle形式でコピー
function exportJSFiddle() {
    const html = htmlEditor.getValue();
    const css = cssEditor.getValue();
    const js = jsEditor.getValue();
    
    const text = `HTML:\n${html}\n\nCSS:\n${css}\n\nJavaScript:\n${js}`;
    
    navigator.clipboard.writeText(text).then(() => {
        closeModal('exportModal');
        showToast('JSFiddle形式でコピーしました', 'success');
    }).catch(() => {
        showToast('コピーに失敗しました', 'error');
    });
}

// ZIPファイルとしてエクスポート（JSZip使用）
async function exportZip() {
    if (typeof JSZip === 'undefined') {
        showToast('JSZipライブラリが読み込まれていません', 'error');
        return;
    }
    
    try {
        const zip = new JSZip();
        
        // HTML/CSS/JSファイルを追加
        zip.file('index.html', htmlEditor.getValue());
        zip.file('style.css', cssEditor.getValue());
        zip.file('script.js', jsEditor.getValue());
        
        // READMEファイルを追加
        const readme = `# Web Code Editor Project

このZIPファイルには以下のファイルが含まれています：

- index.html - HTMLコード
- style.css - CSSスタイル
- script.js - JavaScriptコード

## 使用方法

1. ZIPファイルを展開
2. index.htmlをブラウザで開く
3. 必要に応じてファイルを編集

作成日時: ${new Date().toLocaleString('ja-JP')}
`;
        zip.file('README.md', readme);
        
        // ZIPファイルを生成してダウンロード
        const content = await zip.generateAsync({ type: 'blob' });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'web-project.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        closeModal('exportModal');
        showToast('ZIPファイルをダウンロードしました', 'success');
    } catch (error) {
        console.error('ZIP export error:', error);
        showToast('ZIPエクスポートに失敗しました', 'error');
    }
}

// ファイルダウンロード
function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// リサイザー機能
function initResizer() {
    const resizer = document.getElementById('resizer');
    const container = document.querySelector('.container');
    const editorPanel = document.querySelector('.editor-panel');
    const previewPanel = document.querySelector('.preview-panel');
    
    let isResizing = false;
    
    resizer.addEventListener('mousedown', function(e) {
        isResizing = true;
        if (currentLayout === 'horizontal') {
            document.body.style.cursor = 'col-resize';
        } else {
            document.body.style.cursor = 'row-resize';
        }
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isResizing) return;
        
        const containerRect = container.getBoundingClientRect();
        
        if (currentLayout === 'horizontal') {
            const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
            
            if (newWidth > 20 && newWidth < 80) {
                editorPanel.style.flex = `0 0 ${newWidth}%`;
            }
        } else {
            const newHeight = ((e.clientY - containerRect.top) / containerRect.height) * 100;
            
            if (newHeight > 20 && newHeight < 80) {
                editorPanel.style.flex = `0 0 ${newHeight}%`;
            }
        }
    });
    
    document.addEventListener('mouseup', function() {
        isResizing = false;
        document.body.style.cursor = 'default';
    });
}

// モーダルの外側クリックで閉じる
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
});

// 初期化
window.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Web Code Editor...');
    
    // Twemojiの初期化（絵文字をSVG画像に変換）
    if (typeof twemoji !== 'undefined') {
        twemoji.parse(document.body);
    }
    
    // JSZipの確認
    if (typeof JSZip === 'undefined') {
        console.warn('JSZip library not loaded. ZIP export will not work.');
    }
    
    // Prettierの確認
    if (typeof prettier === 'undefined') {
        console.warn('Prettier library not loaded. Code formatting will not work.');
    }
    
    // Emmetの確認
    if (typeof emmetCodeMirror === 'undefined') {
        console.warn('Emmet library not loaded. Emmet shortcuts will not work.');
    }
    
    // 外部ライブラリの設定を復元
    const savedLibraries = localStorage.getItem('libraries');
    if (savedLibraries) {
        try {
            enabledLibraries = JSON.parse(savedLibraries);
        } catch (e) {
            console.error('Failed to parse saved libraries:', e);
            enabledLibraries = {};
        }
    }
    
    // エディタの初期化
    initEditors();
    
    // リサイザーの初期化
    initResizer();
    
    // ダークモードの復元
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        applyDarkMode();
    }
    
    // フォントサイズの復元
    const savedFontSize = localStorage.getItem('fontSize') || 'medium';
    setFontSize(savedFontSize);
    
    // ビューポートの復元
    const savedViewport = localStorage.getItem('viewport') || 'desktop';
    setViewport(savedViewport);
    
    // レイアウトの復元
    const savedLayout = localStorage.getItem('layout') || 'horizontal';
    if (savedLayout === 'vertical') {
        document.querySelector('.container').classList.add('vertical');
        currentLayout = 'vertical';
    }
    
    // 初回実行（少し遅延させてエディタが完全に準備されるのを待つ）
    setTimeout(() => {
        runCode();
        console.log('Editor initialized successfully');
    }, 300);
});

// キーボードショートカット
document.addEventListener('keydown', function(e) {
    // ESCキーでモバイルメニューを閉じる
    if (e.key === 'Escape') {
        const menu = document.getElementById('mobileMenu');
        if (menu && menu.classList.contains('show')) {
            toggleMobileMenu();
            return;
        }
    }
    
    // Ctrl/Cmd + S で保存
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveToLocalStorage();
        showToast('コードを保存しました', 'success');
    }
    
    // Ctrl/Cmd + Enter で実行
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runCode();
        showToast('コードを実行しました', 'success');
    }
    
    // Ctrl/Cmd + Shift + F でコード整形
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        formatCode();
    }
    
    // Ctrl/Cmd + F で検索（CodeMirrorのデフォルト機能）
    // Ctrl/Cmd + / でコメントアウト（CodeMirrorのデフォルト機能）
});