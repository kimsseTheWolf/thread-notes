<script setup>
import { Flex, Avatar, Menu, MenuItem, Dropdown, Button } from 'ant-design-vue';
import { EllipsisOutlined } from '@ant-design/icons-vue';
import { UserOutlined } from '@ant-design/icons-vue';
import { onMounted, ref } from 'vue';
import TextEditor from './TextEditor.vue';
import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css'

const isInEdit = ref(false)

const message = defineModel("message", {
    type: String,
    default: "",
});

const props = defineProps({
    uuid: String
})

const emits = defineEmits(["onUpdateContent", "onDelete"])

function handleEditSave() {
    console.log("Saving edit")
    isInEdit.value = false
    emits("onUpdateContent", props.uuid, message.value)
}

onMounted(() => {
    const imgViewer = new Viewer(document.getElementById('message-content'), {
        toolbar: false,
        navbar: false,
        title: false,
    })
})

</script>
<template>
    <Dropdown :trigger="['contextmenu']">
        <template #overlay>
            <Menu>
                <MenuItem key="1" @click="isInEdit = true">Edit</MenuItem>
                <MenuItem key="2">Delete</MenuItem>
            </Menu>
        </template>
        <Flex gap="small" vertical class="bubble" :id="uuid">
            <Flex gap="small" align="center" justify="space-between">
                <Flex gap="small" align="center">
                    <Avatar>
                        <template #icon>
                            <UserOutlined />
                        </template>
                    </Avatar>
                    <b>You</b>
                    <div></div>
                </Flex>
                <Flex gap="small" justify="end" v-if="!isInEdit">
                    <Dropdown>
                        <template #overlay>
                            <Menu>
                                <MenuItem key="0" @click="isInEdit = true" >Edit</MenuItem>
                                <MenuItem key="1">Move Up</MenuItem>
                                <MenuItem key="2">Move Down</MenuItem>
                            </Menu>
                        </template>
                        <Button size="small">
                            <EllipsisOutlined/>
                        </Button>
                    </Dropdown>
                    <Button size="small" @click="emits('onDelete', props.uuid)">Delete</Button>
                </Flex>
            </Flex>
            <div v-html="message" v-if="!isInEdit" id="message-content"></div>
            <Flex gap="small" v-if="isInEdit">
                <TextEditor v-model="message"/>
                <Button type="primary" @click="handleEditSave">Save</Button>
            </Flex>
        </Flex>
    </Dropdown>
</template>
<style scoped>
.bubble {
    padding: 7px;
    border-radius: 7px;
}

.bubble:hover {
    background-color: rgba(0, 0, 0, 0.025);
}
</style>