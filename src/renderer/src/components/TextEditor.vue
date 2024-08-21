<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3';
import { ref, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { defineProps, defineEmits } from 'vue';
import { Flex,  Button, Menu, MenuItem, Dropdown } from 'ant-design-vue';
import { BoldOutlined, ItalicOutlined, UnderlineOutlined, UnorderedListOutlined, HddOutlined, LinkOutlined, FontSizeOutlined } from '@ant-design/icons-vue';
import StarterKit from '@tiptap/starter-kit';
import Bold from "@tiptap/extension-bold";
import Paragraph from '@tiptap/extension-paragraph';
import Highlight from '@tiptap/extension-highlight';
import Text from '@tiptap/extension-text';
import Document from '@tiptap/extension-document';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import BulletList from '@tiptap/extension-bullet-list';
import ListItem from '@tiptap/extension-list-item';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Heading from '@tiptap/extension-heading';
import Image from '@tiptap/extension-image';


const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  limitHeight: {
    type: Number,
    default: 0,
  }
});

const realLimitHeight = computed(() => {
    return props.limitHeight > 0 ? `${props.limitHeight}px` : "none";
});

const realOverFlowY = computed(() => {
    return props.limitHeight > 0 ? "auto" : "none";
});

const showOpBtns = ref(false);

const emit = defineEmits(['update:modelValue', 'onSend']);

const editor = useEditor({
    extensions: [
        Document,
        Bold,
        Paragraph.configure({
            HTMLAttributes: {
                class: "custom-p"
            }
        }),
        Highlight.configure({
            multicolor: true
        }),
        Text,
        Italic,
        Underline,
        BulletList,
        ListItem,
        TaskList,
        TaskItem,
        Heading,
        Image.configure({
            HTMLAttributes: {
                class: "custom-img"
            }
        })
    ],
    content: props.modelValue,
    onUpdate: ({ editor }) => {
        emit('update:modelValue', editor.getHTML());
    },
    editorProps: {
        handlePaste(view, event) {
            const items = (event.clipboardData || event.originalEvent.clipboardData).items;
            for (const item of items) {
                if (item.type.indexOf('image') === 0) {
                    const file = item.getAsFile();
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const img = new window.Image();
                        img.src = e.target.result;
                        img.onload = () => {
                            const node = view.state.schema.nodes.image.create({
                                src: e.target.result,
                            });
                            const transaction = view.state.tr.replaceSelectionWith(node);
                            view.dispatch(transaction);
                        };
                    };
                    reader.readAsDataURL(file);
                    return true
                }
            }
            return false
        }
    }
});

watch(
  () => props.modelValue,
  (value) => {
    if (editor.value && editor.value.getHTML() !== value) {
      editor.value.commands.setContent(value, false);
    }
  }
);

onMounted(() => {
    showOpBtns.value = true;

    // send event manager
    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.key === 'Enter') {
            emit('onSend', editor.value.getHTML());
            editor.value.commands.setContent('');
            console.log("Message sent");
        }
    });
})
</script>
<template>
    <Flex vertical gap="small" style="flex: auto;">
        <Flex gap="small" v-if="showOpBtns">
            <Button shape="circle" @click="editor.chain().focus().toggleBold().run()" :type="editor.isActive('bold') ? 'primary' : 'default'">
                <BoldOutlined />
            </Button>
            <Button shape="circle" @click="editor.chain().focus().toggleItalic().run()" :type="editor.isActive('italic') ? 'primary' : 'default'">
                <ItalicOutlined />
            </Button>
            <Button shape="circle" @click="editor.chain().focus().toggleUnderline().run()" :type="editor.isActive('underline') ? 'primary' : 'default'">
                <UnderlineOutlined />
            </Button>
            <Button shape="circle" @click="editor.chain().focus().toggleBulletList().run()" :type="editor.isActive('bulletList') ? 'primary' : 'default'">
                <UnorderedListOutlined />
            </Button>
            <Dropdown>
                <Button shape="circle">
                    <FontSizeOutlined />
                </Button>
                <template #overlay>
                    <Menu>
                        <MenuItem key="1" @click="editor.chain().focus().toggleHeading({level: 1}).run()">Heading 1</MenuItem>
                        <MenuItem key="2" @click="editor.chain().focus().toggleHeading({level: 2}).run()">Heading 2</MenuItem>
                        <MenuItem key="3" @click="editor.chain().focus().toggleHeading({level: 3}).run()">Heading 3</MenuItem>
                    </Menu>
                </template>
            </Dropdown>
        </Flex>
        <EditorContent :editor="editor" class="custom-editor"/>
    </Flex>
</template>
<style scoped>
.custom-editor {
    border: 1px solid #dcdcdc;
    border-radius: 8px;
    padding: 5px;
    min-height: auto;
    max-height: v-bind(realLimitHeight);
    overflow-y: v-bind(realOverFlowY);
    font-family: Arial, sans-serif;
    font-size: 14px;
    line-height: 1.5;
    background-color: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    outline: none;
    flex: 1;
}

.custom-editor:focus {
    outline: none;
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

/* Basic editor styles */
.tiptap {

    outline: none;
    :first-child {
        margin-top: 0;
    }

    /* List styles */
    ul,
    ol {
        padding: 0 1rem;
        margin: 1.25rem 1rem 1.25rem 0.4rem;

        li p {
            margin-top: 0.25em;
            margin-bottom: 0.25em;
        }
    }

    /* Heading styles */
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        line-height: 1.1;
        margin-top: 2.5rem;
        text-wrap: pretty;
    }

    h1,
    h2 {
        margin-top: 3.5rem;
        margin-bottom: 1.5rem;
    }

    h1 {
        font-size: 1.4rem;
    }

    h2 {
        font-size: 1.2rem;
    }

    h3 {
        font-size: 1.1rem;
    }

    h4,
    h5,
    h6 {
        font-size: 1rem;
    }

    /* Code and preformatted text styles */
    code {
        background-color: var(--purple-light);
        border-radius: 0.4rem;
        color: var(--black);
        font-size: 0.85rem;
        padding: 0.25em 0.3em;
    }

    pre {
        background: var(--black);
        border-radius: 0.5rem;
        color: var(--white);
        font-family: 'JetBrainsMono', monospace;
        margin: 1.5rem 0;
        padding: 0.75rem 1rem;

        code {
            background: none;
            color: inherit;
            font-size: 0.8rem;
            padding: 0;
        }
    }

    blockquote {
        border-left: 3px solid var(--gray-3);
        margin: 1.5rem 0;
        padding-left: 1rem;
    }

    hr {
        border: none;
        border-top: 1px solid var(--gray-2);
        margin: 2rem 0;
    }
}

.tiptap:focus {
    outline: none;
}
</style>
<style>
.ProseMirror-focused {
    outline: none;
}
.custom-p {
    margin: 0;
    padding: 0;
}
.custom-img {
    width: 30%;
}
</style>