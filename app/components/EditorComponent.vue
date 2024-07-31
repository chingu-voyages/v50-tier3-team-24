<template>
  <div
    class="flex bg-gray-100 border border-gray-300 rounded p-5 min-h-[300px] my-5"
  >
    <div id="editorjs" class="w-2/3 bg-white rounded p-2.5 min-h-[250px]"></div>
    <div
      id="sticky-notes"
      class="w-1/3 bg-white rounded p-2.5 min-h-[250px] ml-4"
    ></div>
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
        const StickyNoteTool = (await import("./StickyNoteTool")).default;

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
            stickyNote: StickyNoteTool,
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

        this.stickyEditor = new EditorJS({
          holder: "sticky-notes",
          tools: {
            stickyNote: StickyNoteTool,
          },
          // ... other configurations
        });
        console.log("Editor initialized:", this.editor);
      }
    },
  },
};
</script>

<style>
.sticky-note {
  background-color: #feff9c;
  border-radius: 5px;
  padding: 10px;
  margin: 10px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
