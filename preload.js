// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Dossier principal
  getUserFolder: () => ipcRenderer.invoke('get-user-folder'),
  listUserFiles: () => ipcRenderer.invoke('list-user-files'),

  // Dossier PUBS
  getPubsFolder: () => ipcRenderer.invoke('get-pubs-folder'),
  listPubsFiles: () => ipcRenderer.invoke('list-pubs-files'),

  // Dossier MATCH
  getMatchFolder: () => ipcRenderer.invoke('get-match-folder'),
  listMatchFiles: () => ipcRenderer.invoke('list-match-files')
});
