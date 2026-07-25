// 預設程式碼範例
const codeTemplates = {
  python: 'import sys\n\n# 讀取輸入資料\ninput_data = sys.stdin.read().strip()\nif input_data:\n    print(f"Hello, {input_data}!")\nelse:\n    print("Hello, World!")',
  cpp: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string input;\n    if (cin >> input) {\n        cout << "Hello, " << input << "!" << endl;\n    } else {\n        cout << "Hello, World!" << endl;\n    }\n    return 0;\n}',
  javascript: 'const fs = require("fs");\nconst input = fs.readFileSync(0, "utf-8").trim();\nif (input) {\n    console.log(`Hello, ${input}!`);\n} else {\n    console.log("Hello, World!");\n}',
  java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNext()) {\n            System.out.println("Hello, " + scanner.next() + "!");\n        } else {\n            System.out.println("Hello, World!");\n        }\n    }\n}'
};

let editor;

// 初始化 Monaco Editor
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.38.0/min/vs' }});
require(['vs/editor/editor.main'], function() {
  editor = monaco.editor.create(document.getElementById('editor'), {const codeTemplates = {
  python: 'import sys\n\ninput_data = sys.stdin.read().strip()\nif input_data:\n    print(f"Hello, {input_data}!")\nelse:\n    print("Hello, World!")',
  cpp: '#include <iostream>\n#include <string>\nusing namespace std;\n\nint main() {\n    string input;\n    if (cin >> input) {\n        cout << "Hello, " << input << "!" << endl;\n    } else {\n        cout << "Hello, World!" << endl;\n    }\n    return 0;\n}',
  javascript: 'const fs = require("fs");\nconst input = fs.readFileSync(0, "utf-8").trim();\nif (input) {\n    console.log(`Hello, ${input}!`);\n} else {\n    console.log("Hello, World!");\n}',
  java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scanner = new Scanner(System.in);\n        if (scanner.hasNext()) {\n            System.out.println("Hello, " + scanner.next() + "!");\n        } else {\n            System.out.println("Hello, World!");\n        }\n    }\n}'
};

let editor;

require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.38.0/min/vs' }});
require(['vs/editor/editor.main'], function() {
  editor = monaco.editor.create(document.getElementById('editor'), {
    value: codeTemplates.python,
    language: 'python',
    theme: 'vs-dark',
    automaticLayout: true
  });
});

document.getElementById('language').addEventListener('change', (e) => {
  const lang = e.target.value;
  if (editor) {
    const monacoLang = lang === 'cpp' ? 'cpp' : lang;
    monaco.editor.setModelLanguage(editor.getModel(), monacoLang);
    editor.setValue(codeTemplates[lang] || '');
  }
});

document.getElementById('fileInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    editor.setValue(event.target.result);
  };
  reader.readAsText(file);
});

document.getElementById('runBtn').addEventListener('click', async () => {
  const code = editor.getValue();
  const input = document.getElementById('input').value;
  const lang = document.getElementById('language').value;
  const outputTextarea = document.getElementById('output');

  outputTextarea.value = "⏳ 程式碼執行中，請稍候...";

  try {
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: lang,
        version: "*",
        files: [{ content: code }],
        stdin: input
      })
    });

    const data = await response.json();

    if (data.run) {
      let resultText = data.run.output;
      if (data.run.stderr && !resultText.includes(data.run.stderr)) {
        resultText += "\n[Error Output]:\n" + data.run.stderr;
      }
      outputTextarea.value = resultText || "(程式執行完畢，無輸出內容)";
    } else {
      outputTextarea.value = "❌ 執行失敗：" + (data.message || JSON.stringify(data));
    }
  } catch (err) {
    outputTextarea.value = "⚠️ 連線異常：" + err.message;
  }
});
    value: codeTemplates.python,
    language: 'python',
    theme: 'vs-dark',
    automaticLayout: true
  });
});

// 切換語言時變更編輯器內容與語法突顯
document.getElementById('language').addEventListener('change', (e) => {
  const lang = e.target.value;
  if (editor) {
    const monacoLang = lang === 'cpp' ? 'cpp' : lang;
    monaco.editor.setModelLanguage(editor.getModel(), monacoLang);
    editor.setValue(codeTemplates[lang] || '');
  }
});

// 上傳檔案讀取文字內容
document.getElementById('fileInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    editor.setValue(event.target.result);
  };
  reader.readAsText(file);
});

// 呼叫 Piston API 執行程式碼
document.getElementById('runBtn').addEventListener('click', async () => {
  const code = editor.getValue();
  const input = document.getElementById('input').value;
  const lang = document.getElementById('language').value;
  const outputTextarea = document.getElementById('output');

  outputTextarea.value = "⏳ 程式碼執行中，請稍候...";

  try {
    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: lang,
        version: "*",
        files: [{ content: code }],
        stdin: input
      })
    });

    const data = await response.json();

    if (data.run) {
      // 組合 stdout 與 stderr（若有編譯錯誤或執行期錯誤）
      let resultText = data.run.output;
      if (data.run.stderr && !resultText.includes(data.run.stderr)) {
        resultText += "\n[Error Output]:\n" + data.run.stderr;
      }
      outputTextarea.value = resultText || "(程式執行完畢，無輸出內容)";
    } else {
      outputTextarea.value = "❌ 執行失敗：" + (data.message || JSON.stringify(data));
    }
  } catch (err) {
    outputTextarea.value = "⚠️ 連線異常：" + err.message;
  }
});
