<template>
  <ClientOnly>
    <div
      class="bg-gray-100 border border-gray-300 rounded p-5 min-h-[300px] my-5"
    >
      <div id="editorjs" class="bg-white rounded p-2.5 min-h-[250px]"></div>
    </div>
  </ClientOnly>
</template>
<script setup lang="ts">

import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import LinkTool from "@editorjs/link";
import List from "@editorjs/list";
import AnnoteMarker from "../utils/annote-marker/annote-marker";

import type { CustomEditorJs } from "types/custom-editorjs.ts/custom-editorjs";

interface EditorComponentProps {
  onEditorReady: (editor: CustomEditorJs) => void;
  readOnly?: boolean;
}

const props: EditorComponentProps = defineProps<EditorComponentProps>();
  const editor = new EditorJS({
    holder: 'editorjs',
    readOnly: Boolean(props.readOnly),
    tools: {
      header: {
        class: Header as any,
        inlineToolbar: true,
        config: {
          placeholder: 'Enter a header',
          defaultLevel: 1,
        },
      },  
      list: {
        class: List as any,
        inlineToolbar: true,
      },
      marker: { 
        class: AnnoteMarker as any, // This is our custom marker tool
        inlineToolbar: true,
        
      },
      linkTool: {
        class: LinkTool
      }
    },
  }); 
  editor.isReady.then(() => { 
    props.onEditorReady(editor);
  });
</script>