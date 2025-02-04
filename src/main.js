const vscode = require("vscode");
const config = require("./config.js");
const clipboard = require("./clipboard");
const getFullPath = require("./getFullPath.js");
const render = require("./render.js");

async function main(context) {
    if (vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.languageId == 'markdown') {
        config.init(context);
        const clipContent = await vscode.env.clipboard.readText(); // 提升速度, 有文字则不用判断是否为图片

        if (clipContent == "" && (await clipboard.isImage())) {
            try {
                pasteImage();
            } catch (e) {
                vscode.window.showInformationMessage(e);
            }
        } else {
            vscode.commands.executeCommand("editor.action.clipboardPasteAction")
        }
    } else {
        vscode.commands.executeCommand("editor.action.clipboardPasteAction")
    }
}

async function pasteImage() {
    const filePath = await getFullPath(config.confirmPattern);
    render(config.baseDir, filePath); // 先渲染出来
    await clipboard.saveImage(filePath);
}

module.exports = {
    main,
};
