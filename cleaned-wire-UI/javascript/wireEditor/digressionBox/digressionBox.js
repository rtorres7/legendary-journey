import DigressionBoxUI from "./digressionBoxUi";
import DigressionBoxEditing from "./digressionBoxEditing";
import Plugin from "@ckeditor/ckeditor5-core/src/plugin";

export default class DigressionBox extends Plugin {
  static get requires() {
    return [DigressionBoxUI, DigressionBoxEditing];
  }
}
