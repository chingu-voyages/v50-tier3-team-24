<template>
  <ClientOnly>
    <div id="editorjs" class="bg-white rounded p-2.5 min-h-[250px]" v-click-outside="handleEditorLostFocus"></div>
  </ClientOnly>
</template>

<script setup lang="ts">
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import LinkTool from "@editorjs/link";
import List from "@editorjs/list";
import AnnoteMarker from "../utils/annote-marker/annote-marker";

import type { CustomEditorJs } from "~/types/custom-editorjs.ts/custom-editorjs";
import type { AnnoteOnMarkerInsertedData, AnnotteOnMarkerDeletedData } from "../utils/annote-marker/definitions/types";

interface EditorComponentProps {
  onEditorReady: (editor: CustomEditorJs) => void;
  readOnly?: boolean;
  onMarkerInserted?: (markerData: AnnoteOnMarkerInsertedData) => void;
  onMarkerDeleted?: (markerData: AnnotteOnMarkerDeletedData) => void;
  onLostFocus?: () => void;
  placeholder?: string;
}

const props = defineProps<EditorComponentProps>();

const editor = new EditorJS({
  holder: "editorjs",
  readOnly: Boolean(props.readOnly),
  placeholder: props.placeholder || "Or start writing here...",
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
        onMarkerInserted: (markerData: AnnoteOnMarkerInsertedData) => {
          props.onMarkerInserted?.(markerData);
        },
        onMarkerDeleted: (markerData: AnnotteOnMarkerDeletedData) => {
          props.onMarkerDeleted?.(markerData);
        }
      },
    },
    linkTool: {
      class: LinkTool,
    },
  },
});

function handleEditorLostFocus () {
  // Note: This is using the v-click-outside directive to detect when the editor loses focus
  props.onLostFocus && props.onLostFocus();
}

editor.isReady.then(() => {
  props.onEditorReady(editor);
});
</script>
