<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Web Code Editor</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/monokai.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/theme/default.min.css">
    <link rel="stylesheet" href="./program/design.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/codemirror.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/htmlmixed/htmlmixed.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/css/css.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/javascript/javascript.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.2/mode/xml/xml.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@twemoji/api@latest/dist/twemoji.min.js" crossorigin="anonymous"></script>
    
    <!-- Emmet for CodeMirror -->
    <script src="https://cdn.jsdelivr.net/npm/emmet-codemirror@1.2.4/dist/emmet.min.js"></script>
    
    <!-- Prettier for code formatting -->
    <script src="https://cdn.jsdelivr.net/npm/prettier@2.8.8/standalone.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prettier@2.8.8/parser-html.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prettier@2.8.8/parser-postcss.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/prettier@2.8.8/parser-babel.js"></script>
    
    <link rel="icon" href="./program/favicon.ico">
</head>
<body>
    <div class="header">
        <h1>🚀 Web Code Editor</h1>
        <div class="header-controls">
            <button class="btn btn-secondary" onclick="openTemplates()">📄 テンプレート</button>
            <button class="btn btn-secondary" onclick="formatCode()">✨ 整形</button>
            <button class="btn btn-secondary" onclick="toggleConsole()">🔍 コンソール</button>
            <button class="btn btn-secondary" onclick="openExport()">💾 エクスポート</button>
            <button class="btn btn-secondary" onclick="openShare()">🔗 共有</button>
            <button class="btn btn-secondary" onclick="openSettings()">⚙️ 設定</button>
            <button class="btn" onclick="runCode()">▶️ 実行</button>
        </div>
    </div>

    <div class="container">
        <div class="editor-panel">
            <div class="tabs">
                <button class="tab active" data-editor="html" onclick="switchTab('html')">HTML</button>
                <button class="tab" data-editor="css" onclick="switchTab('css')">CSS</button>
                <button class="tab" data-editor="js" onclick="switchTab('js')">JavaScript</button>
            </div>
            <div class="editor-container">
                <div id="html-editor" class="editor active"></div>
                <div id="css-editor" class="editor"></div>
                <div id="js-editor" class="editor"></div>
            </div>
        </div>

        <div class="resizer" id="resizer"></div>

        <div class="preview-panel">
            <div class="preview-header">
                <h2><span class="status-indicator"></span>プレビュー</h2>
                <button class="btn btn-secondary" onclick="refreshPreview()">🔄 更新</button>
            </div>
            <iframe id="preview" sandbox="allow-scripts allow-modals"></iframe>
            <div id="console" class="console"></div>
        </div>
    </div>

    <footer class="footer">
        <h3>MIT License | Web Code Editor | Author: PYU224 | <a href="https://github.com/PYU224/web-editor" target="_blank" rel="noopener"><img src="./program/github.png"> Github</a></h3>
    </footer>

    <div id="templateModal" class="modal">
        <div class="modal-content">
            <h3>テンプレートを選択</h3>
            <div class="template-grid">
                <div class="template-card" onclick="loadTemplate('blank')">
                    <h4>空白</h4>
                    <p>ゼロから始める</p>
                </div>
                <div class="template-card" onclick="loadTemplate('basic')">
                    <h4>基本HTML</h4>
                    <p>基本的なHTML構造</p>
                </div>
                <div class="template-card" onclick="loadTemplate('flexbox')">
                    <h4>Flexboxレイアウト</h4>
                    <p>Flexboxの基本</p>
                </div>
                <div class="template-card" onclick="loadTemplate('grid')">
                    <h4>CSS Grid</h4>
                    <p>グリッドレイアウト</p>
                </div>
                <div class="template-card" onclick="loadTemplate('animation')">
                    <h4>CSSアニメーション</h4>
                    <p>アニメーション例</p>
                </div>
                <div class="template-card" onclick="loadTemplate('interactive')">
                    <h4>インタラクティブ</h4>
                    <p>JavaScript付き</p>
                </div>
            </div>
            <button class="btn modal-close-btn" onclick="closeModal('templateModal')">閉じる</button>
        </div>
    </div>

    <div id="exportModal" class="modal">
        <div class="modal-content">
            <h3>エクスポート</h3>
            <div class="export-options">
                <button class="btn export-btn" onclick="exportHTML()">📄 HTMLファイルとしてダウンロード</button>
                <button class="btn export-btn" onclick="exportCodePen()">🖊️ CodePen形式でコピー</button>
                <button class="btn export-btn" onclick="exportJSFiddle()">🎻 JSFiddle形式でコピー</button>
                <button class="btn export-btn" onclick="exportZip()">📦 ZIPファイル（HTML/CSS/JS分離）</button>
            </div>
            <button class="btn btn-secondary modal-close-btn" onclick="closeModal('exportModal')">閉じる</button>
        </div>
    </div>

    <div id="shareModal" class="modal">
        <div class="modal-content">
            <h3>🔗 SNS共有</h3>
            <p class="share-description">このエディタを気に入ったら、ぜひSNSで共有してください！</p>
            <div class="share-buttons">
                <button class="btn share-btn twitter-btn" onclick="shareToTwitter()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    Xでシェア
                </button>
                <button class="btn share-btn facebook-btn" onclick="shareToFacebook()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebookでシェア
                </button>
                <button class="btn share-btn line-btn" onclick="shareToLine()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                    </svg>
                    LINEでシェア
                </button>
            </div>
            <div class="share-url-section">
                <label>共有用URL:</label>
                <div class="url-input-group">
                    <input type="text" id="shareUrl" class="share-url-input" readonly>
                    <button class="btn btn-secondary" onclick="copyShareUrl()">📋 コピー</button>
                </div>
                <p class="share-note">※ エディタのページURLを共有します</p>
            </div>
            <button class="btn btn-secondary modal-close-btn" onclick="closeModal('shareModal')">閉じる</button>
        </div>
    </div>

    <div id="settingsModal" class="modal">
        <div class="modal-content">
            <h3>⚙️ 設定</h3>
            
            <div class="settings-section">
                <h4>🌙 テーマ</h4>
                <div class="setting-item">
                    <label class="switch">
                        <input type="checkbox" id="darkModeToggle" onchange="toggleDarkMode()">
                        <span class="slider"></span>
                    </label>
                    <span class="setting-label">ダークモード</span>
                </div>
            </div>
            
            <div class="settings-section">
                <h4>🔤 フォントサイズ</h4>
                <div class="font-size-options">
                    <button class="btn btn-font-size" onclick="setFontSize('small')">小</button>
                    <button class="btn btn-font-size active" onclick="setFontSize('medium')">中</button>
                    <button class="btn btn-font-size" onclick="setFontSize('large')">大</button>
                    <button class="btn btn-font-size" onclick="setFontSize('xlarge')">特大</button>
                </div>
                <p class="setting-description">エディタの文字サイズを変更できます</p>
            </div>
            
            <div class="settings-section">
                <h4>✨ Emmet</h4>
                <div class="setting-item">
                    <span class="setting-label">Emmet省略記法が有効です</span>
                </div>
                <p class="setting-description">HTML/CSSエディタでTabキーを押すと展開されます<br>例: <b>html:5, ul>li*3, .container</b></p>
            </div>
            
            <button class="btn btn-secondary modal-close-btn" onclick="closeModal('settingsModal')">閉じる</button>
        </div>
    </div>

    <script src="./program/script.js"></script>
</body>
</html>