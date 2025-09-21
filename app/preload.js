// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // --- UserFiles ---
  getUserFolder: () => ipcRenderer.invoke('get-user-folder'),
  listUserFiles: () => ipcRenderer.invoke('list-user-files'),
  getPubsFolder: () => ipcRenderer.invoke('get-pubs-folder'),
  listPubsFiles: () => ipcRenderer.invoke('list-pubs-files'),
  getMatchFolder: () => ipcRenderer.invoke('get-match-folder'),
  listMatchFiles: () => ipcRenderer.invoke('list-match-files'),

  // --- Window ---
  setFullscreen: (windowName, fullscreen) =>
    ipcRenderer.invoke('set-fullscreen', windowName, fullscreen),
  moveWindowToDisplay: (windowName, displayIndex) =>
    ipcRenderer.invoke('move-window-to-display', windowName, displayIndex),
});
