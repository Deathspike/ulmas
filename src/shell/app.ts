import electron from 'electron';
import path from 'path';
import {Server} from '../server';
import {StreamForwarder} from './classes/StreamForwarder';
const stderrForwarder = StreamForwarder.create(process.stderr);
const stdoutForwarder = StreamForwarder.create(process.stdout);
let mainWindow: electron.BrowserWindow;

function createMenu() {
  if (process.platform !== 'darwin') return;
  const launch = {click: createWindow, label: 'Launch'};
  const menu = electron.Menu.buildFromTemplate([{label: '', submenu: [launch, {role: 'quit'}]}]);
  electron.Menu.setApplicationMenu(menu);
}

function createWindow() {
  if (!mainWindow) {
    const debugWindow = {width: 1280, height: 720, useContentSize: true};
    const isDebugging = electron.app.commandLine.hasSwitch('remote-debugging-port');
    const webPreferences = {backgroundThrottling: false, preload: path.join(__dirname, 'preload.js')};
    mainWindow = new electron.BrowserWindow({...debugWindow, fullscreen: !isDebugging, icon: 'electron-icon.png', show: false, webPreferences});
    mainWindow.removeMenu();
    mainWindow.on('ready-to-show', () => mainWindow.show());
    mainWindow.loadURL(`http://localhost:${isDebugging ? 8080 : 6877}/`);
    mainWindow.webContents.on('before-input-event', onWebBeforeInputEvent);
    stderrForwarder.register(mainWindow.webContents);
    stdoutForwarder.register(mainWindow.webContents);
  } else if (mainWindow.isMinimized()) {
    mainWindow.restore();
    mainWindow.focus();
  } else {
    mainWindow.focus();
  }
}

function onWebBeforeInputEvent(event: electron.Event, input: electron.Input) {
  switch (input.key) {
    case 'F11':
      mainWindow.setFullScreen(!mainWindow.isFullScreen());
      event.preventDefault();
      break;
    case 'F12':
      mainWindow.webContents.toggleDevTools();
      event.preventDefault();
      break;
  }
}

function onWebMessage(_: electron.IpcMainEvent, type: string) {
  switch (type) {
    case 'focus':
      if (mainWindow.isFocused()) break;
      mainWindow?.minimize();
      mainWindow?.focus();
      break;
  }
}

function onWindowClose() {
  if (process.platform !== 'darwin') electron.app.quit();
  stderrForwarder.unregister();
  stdoutForwarder.unregister();
}

function startApplication() {
  Server.createAsync().then(async (server) => {
    createMenu();
    createWindow();
    await server.runAsync();
  });
}

if (electron.app.requestSingleInstanceLock()) {
  electron.app.on('activate', createWindow);
  electron.app.on('ready', startApplication);
  electron.app.on('second-instance', createWindow);
  electron.app.on('window-all-closed', onWindowClose);
  electron.ipcMain.on('message', onWebMessage);
} else {
  electron.app.quit();
}
