// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getUserFolder: () => ipcRenderer.invoke('get-user-folder'),
  listUserFiles: () => ipcRenderer.invoke('list-user-files')
});
