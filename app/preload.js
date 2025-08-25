// preload.js
const { contextBridge, ipcRenderer } = require('electron');
const { readdir } = require('fs').promises;
const path = require('path');

console.log('preload loaded');

contextBridge.exposeInMainWorld('electronAPI', {
  getUserFolder: async () => {
    // retourne un chemin sur le système, côté main
    return path.join(require('os').homedir(), 'Videos');
  },
  listUserFiles: async (folder) => {
    try {
      return await readdir(folder);
    } catch {
      return [];
    }
  }
});
