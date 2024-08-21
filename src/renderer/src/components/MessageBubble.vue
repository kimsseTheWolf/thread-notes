<script setup>
import { Flex, Avatar, Menu, MenuItem, Dropdown, Button } from 'ant-design-vue';
import { UserOutlined } from '@ant-design/icons-vue';
import { ref } from 'vue';
import TextEditor from './TextEditor.vue';

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
                </Flex>
                <Flex gap="small" justify="end" v-if="!isInEdit">
                    <Button @click="isInEdit = true" size="small">Edit</Button>
                    <Button size="small" @click="emits('onDelete', props.uuid)">Delete</Button>
                </Flex>
            </Flex>
            <div v-html="message" v-if="!isInEdit"></div>
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