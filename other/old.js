const canvas = document.getElementById('document');
const ctx = canvas.getContext('2d');

canvas.width = 1600;
canvas.height = 1600;

const paddingX = 100;
const paddingY = 150;
const fontsize = 16;
const lineHeight = fontsize * 2;

let cursorX = paddingX;
let cursorY = paddingY + lineHeight;
let textLines = [''];
let currentLine = 0;
let cursorPos = 0;
let selectionStart = 0;
let selectionEnd = 0;

ctx.font = `300 ${fontsize * 2}px Reddit Mono`;
ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--color');

let cursorVisible = true;

// toggleTheme();

function renderText() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    textLines.forEach((line, index) => {
        ctx.fillText(line, paddingX, paddingY + (index + 1) * lineHeight);
    });

    if (cursorVisible) {
        ctx.fillRect(cursorX, cursorY - lineHeight + 4, 2, lineHeight);
    }

    if (selectionStart !== selectionEnd) {
        const startX = paddingX + ctx.measureText(textLines[currentLine].slice(0, Math.min(selectionStart, selectionEnd))).width;
        const endX = paddingX + ctx.measureText(textLines[currentLine].slice(0, Math.max(selectionStart, selectionEnd))).width;
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--text-select');
        ctx.fillRect(startX, cursorY - lineHeight + 4, endX - startX, lineHeight);
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--color');
    }
}

function handleKeyPress(event) {
    const key = event.key;

    if (key === 'Enter') {
        textLines.splice(currentLine + 1, 0, '');
        currentLine++;
        cursorPos = 0;
        cursorX = paddingX;
        cursorY += lineHeight;
    } else if (key === 'Backspace') {
        if (cursorPos === 0 && currentLine > 0) {
            cursorY -= lineHeight;
            currentLine--;
            cursorPos = textLines[currentLine].length;
            cursorX = paddingX + ctx.measureText(textLines[currentLine]).width;
            textLines.splice(currentLine + 1, 1);
        } else if (cursorPos > 0) {
            const removedCharWidth = ctx.measureText(textLines[currentLine][cursorPos - 1]).width;
            textLines[currentLine] = textLines[currentLine].slice(0, cursorPos - 1) + textLines[currentLine].slice(cursorPos);
            cursorX -= removedCharWidth;
            cursorPos--;
        }
    } else if (key === 'ArrowLeft') {
        if (cursorPos > 0) {
            if (event.ctrlKey) {
                const words = textLines[currentLine].slice(0, cursorPos - 2).split(/\s+/);
                const lastWord = words[words.length - 1];
                cursorPos -= (lastWord.length + 1);
                cursorPos += lastWord.lastIndexOf(' ') + 0;
                cursorPos = Math.max(0, cursorPos);
                cursorX = paddingX + ctx.measureText(textLines[currentLine].slice(0, cursorPos)).width;
            } else {                
                cursorPos--;
                cursorX -= ctx.measureText(textLines[currentLine][cursorPos]).width;
            }
        } else if (currentLine > 0) {
            currentLine--;
            cursorPos = textLines[currentLine].length;
            cursorX = paddingX + ctx.measureText(textLines[currentLine]).width;
            cursorY -= lineHeight;
        }
    } else if (key === 'ArrowRight') {
        if (cursorPos < textLines[currentLine].length) {
            if (event.ctrlKey) {
                let textAfterCursor = textLines[currentLine].slice(cursorPos);
                
                while (textAfterCursor[0] === ' ') {
                    cursorPos++;
                    textAfterCursor = textLines[currentLine].slice(cursorPos);
                }
                
                const words = textAfterCursor.split(/\s+/);
                const firstWord = words[0];
                
                cursorPos += firstWord.length;
                
                cursorPos = Math.min(textLines[currentLine].length, cursorPos);
                cursorX = paddingX + ctx.measureText(textLines[currentLine].slice(0, cursorPos)).width;
            } else {
                cursorX += ctx.measureText(textLines[currentLine][cursorPos]).width;
                cursorPos++;
            }
        } else if (currentLine < textLines.length - 1) {
            currentLine++;
            cursorPos = 0;
            cursorX = paddingX;
            cursorY += lineHeight;
        }
    } else if (key === 'ArrowUp') {
        if (currentLine > 0) {
            currentLine--;
            cursorPos = Math.min(textLines[currentLine].length, cursorPos);
            cursorX = paddingX + ctx.measureText(textLines[currentLine].slice(0, cursorPos)).width;
            cursorY -= lineHeight;
        }
    } else if (key === 'ArrowDown') {
        if (currentLine < textLines.length - 1) {
            currentLine++;
            cursorPos = Math.min(textLines[currentLine].length, cursorPos);
            cursorX = paddingX + ctx.measureText(textLines[currentLine].slice(0, cursorPos)).width;
            cursorY += lineHeight;
        }
    } else if (key === 'Home') {
        cursorPos = 0;
        cursorX = paddingX;
    } else if (key === 'End') {
        cursorPos = textLines[currentLine].length;
        cursorX = paddingX + ctx.measureText(textLines[currentLine]).width;
    } else if (key === 'Control') {
        if (event.ctrlKey && key === 'ArrowLeft') {
            const words = textLines[currentLine].slice(0, cursorPos).split(/\s+/);
            cursorPos -= (words[words.length - 1].length + 1);
            cursorPos = Math.max(0, cursorPos);
            cursorX = paddingX + ctx.measureText(textLines[currentLine].slice(0, cursorPos)).width;
        } else if (event.ctrlKey && key === 'ArrowRight') {
            const words = textLines[currentLine].slice(cursorPos).split(/\s+/);
            cursorPos += (words[0].length + 1);
            cursorPos = Math.min(textLines[currentLine].length, cursorPos);
            cursorX = paddingX + ctx.measureText(textLines[currentLine].slice(0, cursorPos)).width;
        }
    } else if (event.ctrlKey) {

    } else if (key.length === 1) {
        event.preventDefault();
        if (!event.shiftKey) {
            const charWidth = ctx.measureText(key).width;
            textLines[currentLine] = textLines[currentLine].slice(0, cursorPos) + key + textLines[currentLine].slice(cursorPos);
            cursorX += charWidth;
            cursorPos++;
        }
    }

    if (event.shiftKey && key.length === 1) {
        event.preventDefault();
    } else if (event.shiftKey) {
        if (selectionStart === 0 && selectionEnd === 0) {
            selectionStart = cursorPos;
        }

        selectionEnd = cursorPos;
    } else {
        selectionStart = cursorPos;
        selectionEnd = cursorPos;
    }

    cursorVisible = true;
    renderText();
}

function toggleCursor() {
    cursorVisible = !cursorVisible;
    renderText();
}

renderText();

window.addEventListener('keydown', handleKeyPress);

setInterval(toggleCursor, 500);

function toggleTheme(override) {
    if (override === 'true') {
        document.body.classList.add('dark');
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--color');
    } else {
        document.body.classList.toggle('dark');
        ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--color');
    }
    renderText();
}

function openModal(data) {
    const modalOuter = document.querySelector(".modal-outer");
    const modalInner = document.querySelector(".modal");
    const bodyInner = document.querySelector(".body-inner");

    if (data) {
        document.querySelector(".modal-inner").innerHTML = `
        <span class="modal-header">${data.title}</span>
        <span class="modal-body">${data.body}</span>
        `;
        document.querySelector(".modal-options").innerHTML = `
        <button class="modal-button" onclick="closeModal()">Close</button>
        `;
    }
    modalOuter.style.visibility = "visible";
    modalOuter.classList.add("open");
    bodyInner.classList.add("fade");
}

function closeModal() {
    const modalOuter = document.querySelector(".modal-outer");
    const modalInner = document.querySelector(".modal");
    const bodyInner = document.querySelector(".body-inner");

    bodyInner.classList.remove("fade");
    modalOuter.classList.remove("open");

    setTimeout(() => {
        modalOuter.style.visibility = "hidden";
        modalInner.classList.remove("small");
        document.querySelector(".modal-inner").innerHTML = ``;
        document.querySelector(".modal-options").innerHTML = ``;
    }, 500);
}

function aboutModal() {
    const modalOuter = document.querySelector(".modal-outer");
    const modalInner = document.querySelector(".modal");
    const bodyInner = document.querySelector(".body-inner");

    modalInner.classList.add("small");
    document.querySelector(".modal-inner").innerHTML = `
    <span class="modal-header">About Scribe</span>
    <span class="modal-body">Beta version</span>
    `;
    document.querySelector(".modal-options").innerHTML = `
     <button class="modal-button" onclick="closeModal()">Close</button>
    `;
    modalInner.classList.add("small");
    modalOuter.style.visibility = "visible";
    modalOuter.classList.add("open");
    bodyInner.classList.add("fade");
}