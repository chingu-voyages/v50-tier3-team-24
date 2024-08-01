// Importing the below import statement in a vue file will crash the app, and I won't be able to access types.
// This type is a wrapper around the EditorJS class. We can import this interface and have access to all the EditorJs types
import EditorJS from "@editorjs/editorjs";
export interface CustomEditorJs extends EditorJS {}
