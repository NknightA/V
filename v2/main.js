"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Native
const path_1 = require("path");
const url_1 = require("url");
// Packages
const { screen } = require('electron')

const electron_1 = require("electron");
const electron_is_dev_1 = __importDefault(require("electron-is-dev"));
const electron_next_1 = __importDefault(require("electron-next"));
// Prepare the renderer once the app is ready
electron_1.app.on('ready', async () => {

    var size = screen.getPrimaryDisplay().size;
    await (0, electron_next_1.default)('./renderer');
    const mainWindow = new electron_1.BrowserWindow({
        left: 0,
        top: 0,
        width:size.width,
        height: size.height,
        minWidth: size.width,
        minHeight: size.height,
        maxWidth: size.width,
        maxHeight: size.height,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: false,
            preload: (0, path_1.join)(__dirname, 'preload.js'),
        },
    });
    mainWindow.setMenu(null);
    const url = electron_is_dev_1.default
        ? 'http://localhost:8000/'
        : (0, url_1.format)({
            pathname: (0, path_1.join)(__dirname, './renderer/out/index.html'),
            protocol: 'file:',
            slashes: true,
        });
    mainWindow.loadURL(url);
});
// Quit the app once all windows are closed
electron_1.app.on('window-all-closed', electron_1.app.quit);
// listen the channel `message` and resend the received message to the renderer process
electron_1.ipcMain.on('message', (event, message) => {
    console.log(message);
    setTimeout(() => event.sender.send('message', 'hi from electron'), 500);
});
