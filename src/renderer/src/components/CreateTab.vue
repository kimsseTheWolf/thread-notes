<script setup>
import {Flex, Button, Input, Card, message} from 'ant-design-vue'
import { computed, ref } from 'vue';

const props = defineProps({
    addType: "note" || "folder"
})

const emits = defineEmits(['on-close', 'on-submit'])

const placeholder = computed(() => {
    return `New ${props.addType} name...`
})

const name = ref("")

async function handleCreate() {
    if (props.addType === "note") {
        const result = await window.api.createNewNote(name.value)
        if (result[0]) {
            message.success("Note created successfully!")
            emits('on-submit')
        }
        else {
            message.error("Failed to create note!")
        }
    } 
    else {
        const result = await window.api.createNewFolder(name.value)
        if (result[0]) {
            message.success("Folder created successfully!")
        }
        else {
            message.error("Failed to create note!")
        }
    }
}
</script>
<template>
    <Card size="small" class="add-card">
        <Flex vertical gap="small">
            <Input :placeholder="placeholder" v-model:value="name"></Input>
            <Flex gap="small">
                <Button type="primary" size="small" @click="handleCreate">Create</Button>
                <Button size="small" @click="emits('on-close')">Cancel</Button>
            </Flex>
        </Flex>
    </Card>
</template>
<style scoped>
.add-card {
    margin-right: 7px;
}
</style>