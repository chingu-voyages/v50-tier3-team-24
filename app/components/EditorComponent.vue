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
        const Marker = (await import("@editorjs/marker")).default;

        this.editor = new EditorJS({
          holder: "editorjs",
          tools: {
            header: {
              class: Header,
              inlineToolbar: true,
            },
            list: List,
            marker: {
              class: Marker,
              inlineToolbar: true,
            },
          },
          inlineToolbar: true,
          data: {
            blocks: [
              {
                type: "header",
                data: {
                  text: "Welcome to Editor.js",
                  level: 2,
                },
              },
              {
                type: "paragraph",
                data: {
                  text: "This is an example of initial content for the editor.",
                },
              },
              {
                type: "list",
                data: {
                  style: "unordered",
                  items: ["First item", "Second item", "Third item"],
                },
              },
            ],
          },
          onReady: () => {
            console.log("Editor.js is ready to work!");
            console.log("Inline toolbar:", this.editor.inlineToolbar);
          },
        });
        console.log("Editor initialized:", this.editor);
      }
    },
  },
};
</script>
