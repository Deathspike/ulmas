import electron from 'electron';
import path from 'path';
import {Server} from '../server';
import {StreamForwarder} from './classes/StreamForwarder';
const isDebugging = electron.app.commandLine.hasSwitch('remote-debugging-port');
const stderrForwarder = StreamForwarder.create(process.stderr);
const stdoutForwarder = StreamForwarder.create(process.stdout);
let mainWindow: electron.BrowserWindow | undefined;

function createMenu() {
  if (process.platform !== 'darwin') return;
  const launch = {click: createWindow, label: 'Launch'};
  const quit: electron.MenuItemConstructorOptions = {role: 'quit'};
  const submenu: Array<electron.MenuItemConstructorOptions> = [launch, quit];
  const menu = electron.Menu.buildFromTemplate([{label: '', submenu}]);
  electron.Menu.setApplicationMenu(menu);
}

function createWindow() {
  if (!mainWindow) {
    mainWindow = new electron.BrowserWindow(createWindowOptions());
    mainWindow.removeMenu();
    mainWindow.on('ready-to-show', () => mainWindow?.show());
    mainWindow.loadURL(`http://localhost:${isDebugging ? 8080 : 6877}/`);
    mainWindow.webContents.on('before-input-event', onWebInputEvent);
    stderrForwarder.register(mainWindow.webContents);
    stdoutForwarder.register(mainWindow.webContents);
  } else if (mainWindow.isMinimized()) {
    mainWindow.restore();
    mainWindow.focus();
  } else {
    mainWindow.focus();
  }
}

function createWindowOptions(): electron.BrowserWindowConstructorOptions {
  return {
    width: 1280,
    height: 720,
    useContentSize: true,
    fullscreen: !isDebugging,
    icon: 'electron-icon.png',
    show: false,
    webPreferences: {
      backgroundThrottling: false,
      preload: path.join(__dirname, 'preload.js')
    }
  };
}

function onWebInputEvent(event: electron.Event, input: electron.Input) {
  switch (input.key) {
    case 'F11':
      mainWindow?.setFullScreen(!mainWindow.isFullScreen());
      event.preventDefault();
      break;
    case 'F12':
      mainWindow?.webContents.toggleDevTools();
      event.preventDefault();
      break;
  }
}

function onWebMessage(_: electron.IpcMainEvent, type: string) {
  switch (type) {
    case 'focus':
      if (mainWindow?.isFocused()) break;
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
  Server.createAsync().then(async server => {
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
