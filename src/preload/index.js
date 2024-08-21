import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  getNotesList: async () => {
    return await ipcRenderer.invoke('get-notes-list')
  },
  createNewNote: async (note) => {
    return await ipcRenderer.invoke('create-new-note', note)
  },
  getNoteContent: async (noteUUID) => {
    return await ipcRenderer.invoke('get-note-content', noteUUID)
  },
  deleteNote: async (noteUUID) => {
    return await ipcRenderer.invoke('delete-note', noteUUID)
  },
  updateNote: async (noteUUID, noteContent) => {
    return await ipcRenderer.invoke('update-note', noteUUID, noteContent)
  },
  createFolder: async (folderName) => {
    return await ipcRenderer.invoke('create-folder', folderName)
  },
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
