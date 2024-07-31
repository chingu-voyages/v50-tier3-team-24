class StickyNoteTool {
  static get toolbox() {
    return {
      title: "Sticky Note",
      icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-74-54-60 31-80-70-77 51V79c0-19 15-34 34-34h178c19 0 34 15 34 34v123z"/></svg>',
    };
  }

  constructor({ data }) {
    this.data = data;
    this.wrapper = undefined;
  }

  render() {
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("sticky-note");
    this.wrapper.contentEditable = true;
    this.wrapper.innerHTML =
      this.data && this.data.content ? this.data.content : "";
    return this.wrapper;
  }

  save(blockContent) {
    return {
      content: blockContent.innerHTML,
    };
  }
}

export default StickyNoteTool;
