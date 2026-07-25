const languageIds = {
  python: 71,
  cpp: 54,
  javascript: 63,
  java: 62
};

let editor;

require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.38.0/min/vs' }});
require(['vs/editor/editor.main'], function() {
  editor = monaco.editor.create(document.getElementById('editor'), {
    value: '',
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
    editor.setValue('');
  }
});

document.getElementById('codeFileInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    editor.setValue(event.target.result);
  };
  reader.readAsText(file);
});

document.getElementById('inputFileInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    document.getElementById('input').value = event.target.result;
  };
  reader.readAsText(file);
});

document.getElementById('runBtn').addEventListener('click', async () => {
  const code = editor.getValue();
  const input = document.getElementById('input').value;
  const lang = document.getElementById('language').value;
  const outputTextarea = document.getElementById('output');

  outputTextarea.value = "程式碼執行中...";

  try {
    const response = await fetch('https://ce.judge0.com/submissions?wait=true', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source_code: code,
        language_id: languageIds[lang],
        stdin: input
      })
    });

    const data = await response.json();

    if (data.stdout !== undefined || data.stderr !== undefined || data.compile_output !== undefined) {
      let resultText = "";
      if (data.stdout) resultText += data.stdout;
      if (data.stderr) resultText += (resultText ? "\n" : "") + "[Runtime Error]:\n" + data.stderr;
      if (data.compile_output) resultText += (resultText ? "\n" : "") + "[Compile Error]:\n" + data.compile_output;
      
      outputTextarea.value = resultText || "(無輸出內容)";
    } else {
      outputTextarea.value = "執行失敗：" + (data.message || JSON.stringify(data));
    }
  } catch (err) {
    outputTextarea.value = "連線異常：" + err.message;
  }
});
