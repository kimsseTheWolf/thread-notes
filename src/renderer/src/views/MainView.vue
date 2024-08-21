<script setup>
import {Layout, LayoutSider, LayoutContent, Flex, Button, Dropdown, Menu, MenuItem, Empty, MenuDivider, message, Input, Modal} from 'ant-design-vue'
import {SearchOutlined, BookOutlined, FolderOpenOutlined, PlusCircleOutlined, EllipsisOutlined, SettingOutlined, InfoCircleOutlined} from '@ant-design/icons-vue'
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import CreateTab from '../components/CreateTab.vue';

const router = useRouter()

const notesItemList = ref({})

const folderItemList = ref([
    
])

const selectedNote = ref([])

const currAddType = ref("note")
const addTabVisible = ref(false)

const renameVisible = ref(false)
const oldName = ref("")

const isNoteView = ref(true)

const showEmptyListOccupier = computed(() => Object.keys(notesItemList.value).length === 0)

function handleAddNote() {
    currAddType.value = "note"
    addTabVisible.value = true
}

function handleAddFolder() {
    currAddType.value = "folder"
    addTabVisible.value = true
}

function handleAddTabClose() {
    addTabVisible.value = false
}

function handleAddTabSubmit() {
    addTabVisible.value = false
    refreshNoteList()
}

async function refreshNoteList() {
    let result = await window.api.getNotesList()
    if (result === null) {
        message.error("Failed to fetch notes list!")
        return
    }
    console.log(result)
    notesItemList.value = result
}

function gotoNote(uuid) {
    router.push('/note/'+uuid + "/inapp")
    console.log("Going to note", uuid)
}

function handleOnRename() {
    renameVisible.value = true
    oldName.value = notesItemList.value[selectedNote.value[0]]
}

function handleOnRenameCancle() {
    renameVisible.value = false
    notesItemList.value[selectedNote.value[0]] = oldName.value
}

function handleOnDelete() {
    Modal.confirm({
        title: 'Delete Note',
        content: 'Are you sure you want to delete this note? You cannot undo this action.',
        onOk() {
            window.api.deleteNote(selectedNote.value[0]).then((result)=>{
                if (result) {
                    message.success("Note deleted!")
                    // refresh
                    refreshNoteList()
                    selectedNote.value = []
                    return
                }
                message.error("Unable to delete note")
                refreshNoteList()
            })
        },
        onCancel() {
            console.log('Cancel');
        },
    });
}


onMounted(() => {
    refreshNoteList()
})

// watch change of selection to close rename item
watch(() => selectedNote.value, (newVal, oldVal) => {
    renameVisible.value = false
})
</script>
<template>
    <Layout>
        <LayoutSider theme="light" :width="300">
            <Flex vertical gap="middle" style="padding: 7px; padding-right: 0; height: 100%;">
                <Flex gap="small">
                    <img src="../assets/LogoFull.svg" height="50px"/>
                </Flex>
                <Flex gap="small">
                    <Dropdown>
                        <Button shape="circle" type="primary">
                            <template #icon>
                                <PlusCircleOutlined/>
                            </template>
                        </Button>
                        <template #overlay>
                            <Menu>
                                <MenuItem key="1" @click="handleAddNote">
                                    <template #icon>
                                        <BookOutlined />
                                    </template>
                                    New Note
                                </MenuItem>
                                <MenuItem key="2" @click="handleAddFolder">
                                    New Folder
                                    <template #icon>
                                        <FolderOpenOutlined/>
                                    </template>
                                </MenuItem>
                            </Menu>
                        </template>
                    </Dropdown>
                    <Button shape="circle" @click="isNoteView = !isNoteView">
                        <template #icon>
                            <BookOutlined v-if="isNoteView"/>
                            <FolderOpenOutlined v-else/>
                        </template>
                    </Button>
                    <Button shape="circle">
                        <template #icon>
                            <SearchOutlined />
                        </template>
                    </Button>
                    <Dropdown>
                        <Button shape="circle">
                            <template #icon>
                                <EllipsisOutlined />
                            </template>
                        </Button>
                        <template #overlay>
                            <Menu>
                                <!-- Items appear after note selection -->
                                <MenuItem key="0" v-if="selectedNote.length !== 0" @click="handleOnRename">
                                    Rename
                                </MenuItem>
                                <MenuItem key="1" v-if="selectedNote.length !== 0" @click="handleOnDelete">
                                    Delete
                                </MenuItem>
                                <MenuDivider v-if="selectedNote.length !== 0"/>
                                <!-- Global options -->
                                <MenuItem key="2">
                                    <template #icon>
                                        <SettingOutlined />
                                    </template>
                                    Settings
                                </MenuItem>
                                <MenuItem key="3">
                                    <template #icon>
                                        <InfoCircleOutlined />
                                    </template>
                                    About
                                </MenuItem>
                            </Menu>
                        </template>
                    </Dropdown>
                </Flex>
                <CreateTab :addType="currAddType" v-if="addTabVisible" @on-close="handleAddTabClose" @on-submit="handleAddTabSubmit"/>
                <Empty description="No Thread notes" v-if="showEmptyListOccupier"/>
                <Menu mode="inline" theme="light" v-if="isNoteView" v-model:selectedKeys="selectedNote">
                    <MenuItem v-for="(title, uuid) in notesItemList" :key="uuid" @click="gotoNote(uuid)">
                        <template v-if="!(renameVisible === true && selectedNote[0] === uuid)">
                            {{title}}
                        </template>
                        <Flex gap="small" v-if="renameVisible === true && selectedNote[0] === uuid">
                            <Input v-model:value="notesItemList[uuid]" size="small"/>
                            <Button type="primary" size="small">Save</Button>
                            <Button size="small" @click="handleOnRenameCancle">Cancel</Button>
                        </Flex>
                    </MenuItem>
                </Menu> 
            </Flex>
        </LayoutSider>
        <LayoutContent>
            <RouterView/>
        </LayoutContent>
    </Layout>
</template>
<style scoped>
.ant-layout {
    height: 100%;
}
.ant-layout-sider {
    height: 100%;
    overflow-y: auto;
}
.ant-layout-content {
    height: 100%;
    overflow-y: auto;
}
</style>