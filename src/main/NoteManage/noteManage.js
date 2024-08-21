
import {DEFAULT_NOTES_INDEX_PATH, DEFAULT_NOTES_FOLDER_PATH, getContent, saveContent, DEFAULT_NOTE} from "../data"
import {v4 as uuidv4} from 'uuid'
import path from "path"
import fs from "fs"

export function createNote(noteTitle) {
    try {
        // create note uuid
        const newNoteUUID = uuidv4()

        // create an index in the note index file
        let index = getContent(DEFAULT_NOTES_INDEX_PATH)
        index[newNoteUUID] = noteTitle
        saveContent(DEFAULT_NOTES_INDEX_PATH, index)

        // create a new file for the note itself
        let content = {...DEFAULT_NOTE}
        content.title = noteTitle
        content.date = new Date().toISOString()
        saveContent(path.join(DEFAULT_NOTES_FOLDER_PATH, newNoteUUID + '.json'), content)

        console.log('Note Created:', newNoteUUID)
        return [true, newNoteUUID]
    }
    catch (e) {
        // report issue
        console.error(e)
        return [false, null]
    }
}

export function deleteNote(noteUUID) {
    try {
        // delete note file
        fs.unlinkSync(path.join(DEFAULT_NOTES_FOLDER_PATH, noteUUID + '.json'))

        // delete note from index
        let index = getContent(DEFAULT_NOTES_INDEX_PATH)
        delete index[noteUUID]
        saveContent(DEFAULT_NOTES_INDEX_PATH, index)

        console.log('Note Deleted:', noteUUID)
        return true
    }
    catch (e) {
        // report issue
        console.error(e)
        return false
    }
}

export function updateNote(noteUUID, noteContent) {
    try {
        // update note file
        saveContent(path.join(DEFAULT_NOTES_FOLDER_PATH, noteUUID + '.json'), noteContent)

        console.log('Note Updated:', noteUUID)
        return true
    }
    catch (e) {
        // report issue
        console.error(e)
        return false
    }
}

export function updateNoteName(noteUUID, noteName) {
    try {
        // update note index
        let index = getContent(DEFAULT_NOTES_INDEX_PATH)
        index[noteUUID] = noteName
        saveContent(DEFAULT_NOTES_INDEX_PATH, index)

        console.log('Note Name Updated:', noteUUID)
        return true
    }
    catch (e) {
        // report issue
        console.error(e)
        return false
    }
}

export function getFullList() {
    try {
        return getContent(DEFAULT_NOTES_INDEX_PATH)
    }
    catch (e) {
        // report issue
        console.error(e)
        return null
    }
}

export function getNoteContent(noteUUID) {
    try {
        return getContent(path.join(DEFAULT_NOTES_FOLDER_PATH, noteUUID + '.json'))
    }
    catch (e) {
        // report issue
        console.error(e)
        return null
    }
}

export function createFolder(folderName) {
    let index = getContent(DEFAULT_NOTES_INDEX_PATH)

    // check if the folder already exists
    if (folderName in Object.keys(index)) {
        return false
    }

    // create a new folder
    index[folderName] = []
    saveContent(DEFAULT_NOTES_INDEX_PATH, index)
    return true
}

export function deleteFolder(folderName) {
    let index = getContent(DEFAULT_NOTES_INDEX_PATH)

    // check if the folder exists
    if (!(folderName in Object.keys(index))) {
        return false
    }

    // delete the folder
    delete index[folderName]
    saveContent(DEFAULT_NOTES_INDEX_PATH, index)
    return true
}

export function renameFolder(oldFolderName, newFolderName) {
    let index = getContent(DEFAULT_NOTES_INDEX_PATH)

    // check if the old folder exists
    if (!(oldFolderName in Object.keys(index))) {
        return false
    }

    // check if the new folder already exists
    if (newFolderName in Object.keys(index)) {
        return false
    }

    // rename the folder
    index[newFolderName] = index[oldFolderName]
    delete index[oldFolderName]
    saveContent(DEFAULT_NOTES_INDEX_PATH, index)
    return true
}

export function addNoteToFolder(noteUUID, folderName) {
    let index = getContent(DEFAULT_NOTES_INDEX_PATH)

    // check if the folder exists
    if (!(folderName in Object.keys(index))) {
        return false
    }

    // add the note to the folder
    index[folderName].push(noteUUID)
    saveContent(DEFAULT_NOTES_INDEX_PATH, index)
    return true
}

export function removeNoteFromFolder(noteUUID, folderName) {
    let index = getContent(DEFAULT_NOTES_INDEX_PATH)

    // check if the folder exists
    if (!(folderName in Object.keys(index))) {
        return false
    }

    // remove the note from the folder
    index[folderName] = index[folderName].filter(uuid => uuid !== noteUUID)
    saveContent(DEFAULT_NOTES_INDEX_PATH, index)
    return true
}