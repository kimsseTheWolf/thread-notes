<script setup>
import { ref, watch, onMounted, computed, onUpdated, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
    Layout,
    LayoutHeader,
    LayoutContent,
    LayoutFooter,
    PageHeader,
    Tag,
    Button,
    message,
    Drawer,
    Flex,
    Input
} from "ant-design-vue"

import { EllipsisOutlined, ArrowRightOutlined, SaveOutlined } from '@ant-design/icons-vue';

import { createMessage } from "../messageCreator"

import TextEditor from '../components/TextEditor.vue';

import MessageBubble from '../components/MessageBubble.vue';

const route = useRoute();

const noteId = ref("");

const noteContent = ref({})

const inputBoxContent = ref("")

const displayedNoteTitle = computed(() => {
    if (noteContent.value.title === "") {
        return "Untitled Note";
    }
    return noteContent.value.title;
});

const haveUnsavedChanges = ref(false);

const isOpenDetailDrawer = ref(false)

const contentRef = ref(null);

async function loadNoteContent(uuid) {
    let result = await window.api.getNoteContent(uuid);
    if (result === null) {
        console.error("Failed to fetch note content for", uuid);
        message.error("Failed to fetch note content for " + uuid);
        return;
    }
    noteContent.value = result;
    console.log("Loaded note content for", uuid);
}

function scrollToBottom() {
    console.log("Scrolling to bottom");
    console.log(contentRef.value);
    let c = document.getElementsByClassName("c-note-content-box")[0];
    c.scrollTop = c.scrollHeight;
}

// initialize the note id on first launch
onMounted(async () => {
    noteId.value = route.params.uuid;
    console.log("Note ID initialized to", noteId.value);
    loadNoteContent(noteId.value);
    await nextTick();
    scrollToBottom();

    // listen ctrl+s for save
    const handleKeyDown = (event) => {
        if (event.ctrlKey && event.key === "s") {
            event.preventDefault();
            handleOnSave();
        }
    };
    window.addEventListener("keydown", handleKeyDown);
});

onUpdated( async ()=>{
    await nextTick();
    scrollToBottom();
})

// always watch the route change to handle autosave and changing
watch(() => route.params.uuid, (newId, oldID) => {
    // Autosave current note
    handleOnSave();
    // update to new ID
    noteId.value = newId;
    console.log("Note ID changed to", newId);
    loadNoteContent(newId);
    nextTick().then(() => {
        scrollToBottom();
    });
});

function handleOnSend(message) {
    noteContent.value["content"].push(createMessage("__localuser__", message));
    haveUnsavedChanges.value = true;
    nextTick().then(() => {
        scrollToBottom();
    });
}

async function handleOnSave() {
    let result = await window.api.updateNote(JSON.parse(JSON.stringify(noteId.value)), JSON.parse(JSON.stringify(noteContent.value)));
    if (result === false) {
        message.error("Failed to save note content!");
        return;
    }
    haveUnsavedChanges.value = false;
}

function updateMessage(uuid, newMessage) {
    console.log("Updating message")
    let index = noteContent.value["content"].findIndex((element) => element["uuid"] === uuid);
    if (index === -1) {
        console.error("Failed to find message with uuid", uuid);
        return;
    }
    noteContent.value["content"][index]["message"] = newMessage;
    console.log(noteContent.value)
    haveUnsavedChanges.value = true;
}

function deleteMessage(uuid) {
    console.log("Deleting message with uuid", uuid)
    let index = noteContent.value["content"].findIndex((element) => element["uuid"] === uuid);
    if (index === -1) {
        console.error("Failed to find message with uuid", uuid);
        return;
    }
    noteContent.value["content"].splice(index, 1);
    haveUnsavedChanges.value = true;
}
</script>
<template>
    <Layout>
        <LayoutHeader class="custom-header">
            <PageHeader :title="displayedNoteTitle" sub-title="Last updated: 2024-08-12 16:21">
                <template #tags>
                    <Tag color="warning" v-if="haveUnsavedChanges">Unsaved Changes</Tag>
                    <Tag color="success" v-else>Changes Saved</Tag>
                </template>
                <template #extra>
                    <Button shape="circle">
                        <SaveOutlined />
                    </Button>
                    <Button shape="circle" @click="isOpenDetailDrawer = true">
                        <EllipsisOutlined />
                    </Button>
                    <Button type="primary" shape="circle">
                        <ArrowRightOutlined />
                    </Button>
                </template>
            </PageHeader>
        </LayoutHeader>
        <LayoutContent style="overflow-x: hidden; overflow-y: scroll; padding: 10px;" ref="contentRef" class="c-note-content-box">
            <Flex vertical gap="small">
                <Flex justify="center">
                    <Tag>This is the start of your thread note. Type in notes just like messages.</Tag>
                </Flex>
                <MessageBubble v-for="message in noteContent['content']" :message="message['message']" :uuid="message['uuid']" @onUpdateContent="updateMessage" @onDelete="deleteMessage"/>
            </Flex>
        </LayoutContent>
        <LayoutFooter class="custom-footer">
            <Flex gap=small>
                <TextEditor v-model:modelValue="inputBoxContent" @onSend="handleOnSend" :limitHeight="150"/>
                <Button type="primary" :disabled="inputBoxContent.length === 0" @click="handleOnSend(inputBoxContent)">Send</Button>
            </Flex>
        </LayoutFooter>

        <Drawer v-model:open="isOpenDetailDrawer" title="Details">
            <Flex vertical gap="small">
                <div><b>Document Title (Different from file name)</b></div>
                <Input v-model:value="noteContent['title']" placeholder="Document Title"/>
                <div><b>Owner</b></div>
                <div>{{ noteContent['author'] === '' ? 'Unknown Author' : noteContent['author'] }}</div>
                <div><b>Date Created</b></div>
                <div>{{ noteContent['date'] }}</div>
                <div><b>Document Format Version</b></div>
                <div>{{ noteContent['version'] }}</div>
            </Flex>
        </Drawer>
    </Layout>
</template>
<style scoped>
.custom-header {
    padding: 0;
    background-color: #f5f5f5;
    height: fit-content
}

.custom-footer {
    padding: 10px;
}

.c-editor {
    max-height: 150px;
    overflow-y: auto;
}
</style>