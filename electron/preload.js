const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  platform: process.platform,
  saveDatabaseBackup: () => ipcRenderer.invoke("dialog:saveDatabase"),
});
