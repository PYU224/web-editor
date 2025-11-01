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
    <link rel="icon" href="./program/favicon.ico">
</head>
<body>
    <div class="header">
        <h1>🚀 Web Code Editor</h1>
        <div class="header-controls">
            <button class="btn btn-secondary" onclick="openTemplates()">📄 テンプレート</button>
            <button class="btn btn-secondary" onclick="toggleConsole()">🔍 コンソール</button>
            <button class="btn btn-secondary" onclick="openExport()">💾 エクスポート</button>
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
        <h3>GPL-3.0 License | Web Code Editor | Author: PYU224</h3>
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
            
            <button class="btn btn-secondary modal-close-btn" onclick="closeModal('settingsModal')">閉じる</button>
        </div>
    </div>

    <script src="./program/script.js"></script>
</body>
</html>