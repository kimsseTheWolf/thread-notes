
// preboot.js includes methods for setup before app is launched
import {DEFAULT_DATA_PATH, DEFAULT_NOTES_FOLDER_PATH, DEFAULT_LIST_INDEX_PATH, DEFAULT_SETTINGS, DEFAULT_SETTINGS_PATH, DEFAULT_NOTES_INDEX_PATH} from "../data"
import fs from 'fs'

export function preboot() {
    // check if data path exists
    if (!fs.existsSync(DEFAULT_DATA_PATH)) {
        fs.mkdirSync(DEFAULT_DATA_PATH)

        // create notes folder
        fs.mkdirSync(DEFAULT_NOTES_FOLDER_PATH)

        // create list index file
        fs.writeFileSync(DEFAULT_LIST_INDEX_PATH, '{}')

        // create notes index file
        fs.writeFileSync(DEFAULT_NOTES_INDEX_PATH, '{}')

        // create settings file
        fs.writeFileSync(DEFAULT_SETTINGS_PATH, JSON.stringify(DEFAULT_SETTINGS))
        console.log('App Initialized')
    }
    else {
        console.log('App Already Initialized. Proceeding...')
    }
}