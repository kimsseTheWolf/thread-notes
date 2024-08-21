
const path = require('path')
const os = require('os')
const fs = require('fs')

export const DEFAULT_DATA_PATH = path.join(os.homedir(), 'threadNotesData')
export const DEFAULT_LIST_INDEX_PATH = path.join(DEFAULT_DATA_PATH, 'listIndex.json')
export const DEFAULT_NOTES_INDEX_PATH = path.join(DEFAULT_DATA_PATH, 'notesIndex.json')
export const DEFAULT_NOTES_FOLDER_PATH = path.join(DEFAULT_DATA_PATH, 'notes')
export const DEFAULT_SETTINGS_PATH = path.join(DEFAULT_DATA_PATH, 'settings.json')

export const DEFAULT_SETTINGS = {
    theme: 'light',
    lang: 'en_US'
}

export const DEFAULT_NOTE = {
    version: "1",
    title: 'Untitled Note',
    author: "",
    date: "",
    content: []
}

export function getContent(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

export function saveContent(filePath, content) {
    fs.writeFileSync(filePath, JSON.stringify(content))
}