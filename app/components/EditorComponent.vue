<template>
  <div
    class="bg-gray-100 border border-gray-300 rounded p-5 min-h-[300px] my-5"
  >
    <div id="editorjs" class="bg-white rounded p-2.5 min-h-[250px]"></div>
  </div>
</template>

<script>
export default {
  name: "EditorComponent",
  data() {
    return {
      editor: null,
    };
  },
  mounted() {
    this.initEditor();
  },
  beforeDestroy() {
    if (this.editor) {
      this.editor.destroy();
    }
  },
  methods: {
    async initEditor() {
      if (process) {
        const EditorJS = (await import("@editorjs/editorjs")).default;
        const Header = (await import("@editorjs/header")).default;
        const List = (await import("@editorjs/list")).default;
        const Paragraph = (await import("@editorjs/paragraph")).default;

        this.editor = new EditorJS({
          holder: "editorjs",
          tools: {
            header: Header,
            list: List,
            paragraph: Paragraph,
          },
          data: {
            // You can provide initial data here
          },
        });
      }
    },
  },
};
</script>
