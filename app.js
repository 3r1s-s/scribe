const editor = ace.edit("document");
const filename = document.getElementById("fileName");
filename.value = "";

editor.session.setMode("ace/mode/plain_text");

editor.setOptions({
    fontFamily: "Reddit Mono, monospace",
    fontSize: "14px",
    showLineNumbers: false,
    tabSize: 4,
    useSoftTabs: true,
    wrap: true,
    showGutter: false,
    highlightActiveLine: false,
    highlightSelectedWord: false,
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: false
});

editor.session.on('changeSelection', function() {
    editor.renderer.updateFull();
});

const menu = {
    copy() {
        const selectedText = editor.getSelectedText();
        navigator.clipboard.writeText(selectedText).then(() => {
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        }).finally(() => {
            editor.focus();
        });
    },
    paste() {
        navigator.clipboard.readText().then(text => {
            editor.insert(text);
        }).catch(err => {
            console.error('Failed to read clipboard contents: ', err);
        }).finally(() => {
            editor.focus();
        });
    },
    cut() {
        const selectedText = editor.getSelectedText();
        navigator.clipboard.writeText(selectedText).then(() => {
            editor.session.replace(editor.getSelectionRange(), '');
        }).catch(err => {
            console.error('Failed to cut text: ', err);
        }).finally(() => {
            editor.focus();
        });
    },
    undo() {
        editor.undo();
        editor.focus();
    },
    redo() {
        editor.redo();
        editor.focus();
    },
    save() {
        const blob = new Blob([editor.getValue()], {type: 'text/plain'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename.value ? `${filename.value}.txt` : 'untitled.txt';
        a.click();
        window.URL.revokeObjectURL(url);
        editor.focus();
    },
    saveAs: async function() {
        try {
            const fileHandle = await window.showSaveFilePicker({
                suggestedName: filename.value ? `${filename.value}.txt` : 'untitled.txt',
                types: [{
                    description: 'Text Files',
                    accept: {'text/plain': ['.txt']}
                }]
            });
            const writableStream = await fileHandle.createWritable();
            await writableStream.write(editor.getValue());
            await writableStream.close();
            editor.focus();
        } catch (err) {
            openModal({
                small: true,
                title: "Unsupported Browser",
                body: "Save as is not supported in your browser.",
            });
        }
    },
    new() {
        editor.setValue('');
        editor.focus();
        filename.value = '';
    },
    load() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.txt,.md,.markdown,.mdown,.mdwn,.mkdn,.mkd,.mdt,.txt,.text';
        input.addEventListener('change', () => {
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                filename.value = file.name;
                editor.setValue(reader.result);
                editor.focus();
            };
            reader.readAsText(file);
        });
        input.click();
    },
    print() {
        const printWindow = window.open('', '_blank');
        printWindow.document.open();
        printWindow.document.write(`
            <html>
            <head>
                <title>${filename.value || 'untitled'}</title>
                <style>
                    body { font-family: 'Reddit Mono', monospace; }
                    pre { white-space: pre-wrap; word-wrap: break-word; }
                </style>
            </head>
            <body>
                <pre>${editor.getValue()}</pre>
            </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    },
};