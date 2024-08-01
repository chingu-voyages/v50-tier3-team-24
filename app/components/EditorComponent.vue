<template>
  <ClientOnly>
    <div
      class="flex bg-gray-100 border border-gray-300 rounded p-5 min-h-[300px] my-5"
    >
      <div id="editorjs" class="bg-white rounded p-2.5 min-h-[250px]"></div>
      <div class="flex flex-wrap">
        <div v-for="note in stickyNotes" :key="note.id">
          <StickyNote
            v-model="note.text"
            :color="note.color"
            :pinNumber="note.id"
          />
        </div>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import LinkTool from "@editorjs/link";
import List from "@editorjs/list";
import { ref } from "vue";
import StickyNote from "../components/StickyNote.vue";
import AnnoteMarker from "../utils/annote-marker/annote-marker";

import type { CustomEditorJs } from "types/custom-editorjs.ts/custom-editorjs";

interface EditorComponentProps {
  onEditorReady: (editor: CustomEditorJs) => void;
  readOnly?: boolean;
}

const props = defineProps<EditorComponentProps>();
const stickyNotes = ref<Array<{ id: number; text: string; color: string }>>([]);

const editor = new EditorJS({
  holder: "editorjs",
  readOnly: Boolean(props.readOnly),
  tools: {
    header: {
      class: Header as any,
      inlineToolbar: true,
      config: {
        placeholder: "Enter a header",
        defaultLevel: 1,
      },
    },
    list: {
      class: List as any,
      inlineToolbar: true,
    },
    marker: {
      class: AnnoteMarker as any,
      inlineToolbar: true,
      config: {
        onMarkerInserted: (data: any) => {
          stickyNotes.value.push({
            id: data.id,
            text: "",
            color: data.color,
          });
        },
        onMarkerDeleted: (data: any) => {
          const index = stickyNotes.value.findIndex(
            (note) => note.id === data.id
          );
          if (index !== -1) {
            stickyNotes.value.splice(index, 1);
          }
        },
      },
    },
    linkTool: {
      class: LinkTool,
    },
  },
});

editor.isReady.then(() => {
  props.onEditorReady(editor);
});
</script>
