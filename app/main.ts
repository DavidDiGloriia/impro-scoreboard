import { app, BrowserWindow, screen } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

let controlWindow: BrowserWindow | null = null;
let projectionWindow: BrowserWindow | null = null;

const args = process.argv.slice(1);
const serve = args.some(val => val === '--serve');

// Empêche plusieurs instances d'Electron
if (!app.requestSingleInstanceLock()) {
  app.quit();
}

app.on('second-instance', () => {
  if (controlWindow) {
    if (controlWindow.isMinimized()) controlWindow.restore();
    controlWindow.focus();
  }
});

function destroyWindows() {
  if (controlWindow) {
    controlWindow.close();
    controlWindow = null;
  }
  if (projectionWindow) {
    projectionWindow.close();
    projectionWindow = null;
  }
}

function createWindows() {
  if (controlWindow || projectionWindow) return;

  const displays = screen.getAllDisplays();
  const externalDisplay = displays.find((d) => d.bounds.x !== 0 || d.bounds.y !== 0);
  const projectionBounds = externalDisplay?.bounds || displays[0].bounds;

  // Fenêtre de contrôle
  controlWindow = new BrowserWindow({
    x: 100,
    y: 100,
    width: 1000,
    height: 800,
    fullscreen: false,
    fullscreenable: true,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: serve,
      contextIsolation: false,
      webSecurity: !serve
    },
  });

  // Fenêtre de projection
  projectionWindow = new BrowserWindow({
    x: projectionBounds.x + 100,
    y: projectionBounds.y + 100,
    width: 1000,
    height: 800,
    fullscreen: false,
    fullscreenable: true,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: serve,
      contextIsolation: false,
      webSecurity: !serve
    },
  });

  if (serve) {
    import('electron-debug').then(debug => {
      debug.default({ isEnabled: true, showDevTools: true });
    });

    // Charge Angular en mode dev
    controlWindow.loadURL('http://localhost:4200/control');
    projectionWindow.loadURL('http://localhost:4200/projection');
  } else {
    let pathIndex = './index.html';
    if (fs.existsSync(path.join(__dirname, '../dist/index.html'))) {
      pathIndex = '../dist/index.html';
    }

    const basePath = path.join(__dirname, pathIndex);
    const baseUrl = `file://${path.resolve(basePath).replace(/\\/g, '/')}`;

    controlWindow.loadURL(`${baseUrl}#/control`);
    projectionWindow.loadURL(`${baseUrl}#/projection`);
  }

  controlWindow.on('closed', () => (controlWindow = null));
  projectionWindow.on('closed', () => (projectionWindow = null));
}

// Sécurité : créer les fenêtres une seule fois
let windowsCreated = false;
function createWindowsOnce() {
  if (windowsCreated) return;
  windowsCreated = true;
  createWindows();
}

app.on('ready', () => {
  destroyWindows();
  setTimeout(createWindowsOnce, 400);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (!controlWindow && !projectionWindow) {
    createWindowsOnce();
  }
});
