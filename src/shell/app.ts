import * as electron from 'electron';
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
    const isDebugging = electron.app.commandLine.hasSwitch('remote-debugging-port');
    mainWindow = new electron.BrowserWindow({fullscreen: !isDebugging, icon: 'electron-icon.png', show: false});
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
  if (input.key !== 'F12') return;
  mainWindow.webContents.toggleDevTools();
  event.preventDefault();
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
} else {
  electron.app.quit();
}
