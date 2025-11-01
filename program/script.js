// エディタの初期化
let htmlEditor, cssEditor, jsEditor;
let currentTab = 'html';
let debounceTimer;
let consoleVisible = false;

// CodeMirrorエディタの作成
function initEditors() {
    const commonOptions = {
        lineNumbers: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 2,
        tabSize: 2,
        lineWrapping: true,
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

// コード実行
function runCode() {
    if (!htmlEditor || !cssEditor || !jsEditor) {
        return;
    }
    
    const html = htmlEditor.getValue();
    const css = cssEditor.getValue();
    const js = jsEditor.getValue();
    
    // コンソールをクリア
    document.getElementById('console').innerHTML = '';
    
    // 安全なHTML生成（scriptタグをHTMLの後に配置）
    const content = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${css}</style>
</head>
<body>
${html}
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
        
        // エラーキャッチ
        window.onerror = function(msg, url, line, col, error) {
            try {
                window.parent.postMessage({
                    type: 'console',
                    method: 'error',
                    args: ['Error: ' + msg + (line ? ' (Line: ' + line + ')' : '')]
                }, '*');
            } catch(e) {}
            return false;
        };
        
        // Promise rejection のキャッチ
        window.addEventListener('unhandledrejection', function(event) {
            try {
                window.parent.postMessage({
                    type: 'console',
                    method: 'error',
                    args: ['Unhandled Promise Rejection: ' + (event.reason || 'Unknown error')]
                }, '*');
            } catch(e) {}
        });
    } catch(e) {
        console.error('Console capture failed:', e);
    }
})();

// ユーザーのJavaScriptコードを実行
(function() {
    try {
        ${js}
    } catch(error) {
        console.error('JavaScript execution error:', error.message);
    }
})();
<\/script>
</body>
</html>`;
    
    const preview = document.getElementById('preview');
    preview.srcdoc = content;
}

// コンソールメッセージの受信
window.addEventListener('message', function(event) {
    // 同一オリジンのメッセージのみ処理
    if (event.data && event.data.type === 'console') {
        addConsoleEntry(event.data.method, event.data.args);
    }
});

// コンソールエントリの追加
function addConsoleEntry(method, args) {
    const consoleDiv = document.getElementById('console');
    if (!consoleDiv) return;
    
    // クロスオリジンエラーをフィルタリング
    const message = args.join(' ');
    if (message.includes('cross-origin') || 
        message.includes('Blocked a frame') ||
        message.includes('Failed to read a named property')) {
        return; // これらのエラーは無視
    }
    
    const entry = document.createElement('div');
    entry.className = `console-entry ${method}`;
    entry.textContent = message;
    consoleDiv.appendChild(entry);
    consoleDiv.scrollTop = consoleDiv.scrollHeight;
    
    // エラーの場合、コンソールを自動表示
    if (!consoleVisible && method === 'error') {
        toggleConsole();
    }
}

// コンソールの表示/非表示
function toggleConsole() {
    const consoleDiv = document.getElementById('console');
    consoleVisible = !consoleVisible;
    if (consoleVisible) {
        consoleDiv.classList.add('show');
    } else {
        consoleDiv.classList.remove('show');
    }
}

// プレビューの更新
function refreshPreview() {
    runCode();
}

// ダークモード切り替え
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDark);
    applyDarkMode();
    showToast(isDark ? 'ダークモードON' : 'ダークモードOFF', 'success');
}

// ダークモードの適用
function applyDarkMode() {
    const isDark = document.body.classList.contains('dark-mode');
    const theme = isDark ? 'monokai' : 'default';
    
    if (htmlEditor) htmlEditor.setOption('theme', theme);
    if (cssEditor) cssEditor.setOption('theme', theme);
    if (jsEditor) jsEditor.setOption('theme', theme);
}

// フォントサイズ変更
function setFontSize(size) {
    const fontSizes = {
        small: 12,
        medium: 14,
        large: 16,
        xlarge: 18
    };
    
    const fontSize = fontSizes[size] || 14;
    
    // CodeMirrorのフォントサイズを変更
    const style = document.createElement('style');
    style.id = 'editor-font-size';
    
    // 既存のスタイルがあれば削除
    const existingStyle = document.getElementById('editor-font-size');
    if (existingStyle) {
        existingStyle.remove();
    }
    
    style.textContent = `.CodeMirror { font-size: ${fontSize}px !important; }`;
    document.head.appendChild(style);
    
    // エディタをリフレッシュして変更を反映
    if (htmlEditor) htmlEditor.refresh();
    if (cssEditor) cssEditor.refresh();
    if (jsEditor) jsEditor.refresh();
    
    // LocalStorageに保存
    localStorage.setItem('fontSize', size);
    
    // ボタンのアクティブ状態を更新
    document.querySelectorAll('.btn-font-size').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`.btn-font-size[onclick*="${size}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    // トースト通知
    const sizeNames = {
        small: '小',
        medium: '中',
        large: '大',
        xlarge: '特大'
    };
    showToast(`フォントサイズ: ${sizeNames[size]}`, 'success');
}

// LocalStorageに保存
function saveToLocalStorage() {
    localStorage.setItem('html', htmlEditor.getValue());
    localStorage.setItem('css', cssEditor.getValue());
    localStorage.setItem('js', jsEditor.getValue());
}

// トースト通知を表示
function showToast(message, type = 'success') {
    // 既存のトーストがあれば削除
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // 新しいトーストを作成
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // アニメーション表示
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // 2秒後に非表示
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 2000);
}

// テンプレートモーダルを開く
function openTemplates() {
    document.getElementById('templateModal').classList.add('show');
}

// エクスポートモーダルを開く
function openExport() {
    document.getElementById('exportModal').classList.add('show');
}

// 設定モーダルを開く
function openSettings() {
    // ダークモードの状態を反映
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
        darkModeToggle.checked = document.body.classList.contains('dark-mode');
    }
    
    // 現在のフォントサイズを反映
    const currentSize = localStorage.getItem('fontSize') || 'medium';
    document.querySelectorAll('.btn-font-size').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.querySelector(`.btn-font-size[onclick*="${currentSize}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
    
    document.getElementById('settingsModal').classList.add('show');
}

// モーダルを閉じる
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// テンプレートの定義
const templates = {
    blank: {
        html: '',
        css: '',
        js: ''
    },
    basic: {
        html: `<!DOCTYPE html>
<div class="container">
  <h1>見出し</h1>
  <p>段落テキスト</p>
  <button>ボタン</button>
</div>`,
        css: `.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #333;
}

button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}`,
        js: `document.querySelector('button').addEventListener('click', function() {
  alert('ボタンがクリックされました！');
});`
    },
    flexbox: {
        html: `<div class="flex-container">
  <div class="flex-item">1</div>
  <div class="flex-item">2</div>
  <div class="flex-item">3</div>
</div>`,
        css: `.flex-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 200px;
  background-color: #f0f0f0;
  gap: 20px;
  padding: 20px;
}

.flex-item {
  width: 100px;
  height: 100px;
  background-color: #4CAF50;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  border-radius: 8px;
}`,
        js: ''
    },
    grid: {
        html: `<div class="grid-container">
  <div class="grid-item">1</div>
  <div class="grid-item">2</div>
  <div class="grid-item">3</div>
  <div class="grid-item">4</div>
  <div class="grid-item">5</div>
  <div class="grid-item">6</div>
</div>`,
        css: `.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 20px;
}

.grid-item {
  background-color: #2196F3;
  color: white;
  padding: 40px;
  text-align: center;
  font-size: 24px;
  border-radius: 8px;
}`,
        js: ''
    },
    animation: {
        html: `<div class="animated-box">
  ホバーしてみて！
</div>`,
        css: `.animated-box {
  width: 200px;
  height: 200px;
  background: linear-gradient(45deg, #4CAF50, #2196F3);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  border-radius: 10px;
  margin: 50px auto;
  transition: all 0.3s ease;
  cursor: pointer;
}

.animated-box:hover {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.animated-box {
  animation: pulse 2s infinite;
}`,
        js: ''
    },
    interactive: {
        html: `<div class="counter">
  <h2>カウンター: <span id="count">0</span></h2>
  <button id="increment">+</button>
  <button id="decrement">-</button>
  <button id="reset">リセット</button>
</div>`,
        css: `.counter {
  text-align: center;
  padding: 50px;
  font-family: Arial, sans-serif;
}

button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
  background-color: #4CAF50;
  color: white;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}

#count {
  color: #2196F3;
  font-weight: bold;
}`,
        js: `let count = 0;
const countElement = document.getElementById('count');

document.getElementById('increment').addEventListener('click', () => {
  count++;
  countElement.textContent = count;
});

document.getElementById('decrement').addEventListener('click', () => {
  count--;
  countElement.textContent = count;
});

document.getElementById('reset').addEventListener('click', () => {
  count = 0;
  countElement.textContent = count;
});`
    }
};

// テンプレート読み込み
function loadTemplate(templateName) {
    if (!htmlEditor || !cssEditor || !jsEditor) {
        console.error('エディタが初期化されていません');
        showToast('エディタの初期化に失敗しました', 'error');
        return;
    }
    
    const template = templates[templateName];
    if (!template) {
        console.error('テンプレートが見つかりません:', templateName);
        showToast('テンプレートが見つかりません', 'error');
        return;
    }
    
    // モーダルを閉じる
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
    
    const content = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Web Page</title>
    <style>
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
    
    let isResizing = false;
    
    resizer.addEventListener('mousedown', function(e) {
        isResizing = true;
        document.body.style.cursor = 'col-resize';
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isResizing) return;
        
        const containerRect = container.getBoundingClientRect();
        const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
        
        if (newWidth > 20 && newWidth < 80) {
            editorPanel.style.flex = `0 0 ${newWidth}%`;
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
    
    // 初回実行（少し遅延させてエディタが完全に準備されるのを待つ）
    setTimeout(() => {
        runCode();
        console.log('Editor initialized successfully');
    }, 300);
});

// キーボードショートカット
document.addEventListener('keydown', function(e) {
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
});