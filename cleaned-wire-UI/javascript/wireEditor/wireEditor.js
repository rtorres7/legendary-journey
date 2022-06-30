import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import EssentialsPlugin from "@ckeditor/ckeditor5-essentials/src/essentials";
import AutoformatPlugin from "@ckeditor/ckeditor5-autoformat/src/autoformat";
import BoldPlugin from "@ckeditor/ckeditor5-basic-styles/src/bold";
import ItalicPlugin from "@ckeditor/ckeditor5-basic-styles/src/italic";
import FontColorPlugin from "@ckeditor/ckeditor5-font/src/fontcolor";
import FontFamilyPlugin from "@ckeditor/ckeditor5-font/src/fontfamily";
import FontSizePlugin from "@ckeditor/ckeditor5-font/src/fontsize";
import LinkPlugin from "@ckeditor/ckeditor5-link/src/link";
import ListPlugin from "@ckeditor/ckeditor5-list/src/list";
import ParagraphPlugin from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import RemoveFormatPlugin from "@ckeditor/ckeditor5-remove-format/src/removeformat";
import SourceEditing from "@ckeditor/ckeditor5-source-editing/src/sourceediting";
import SpecialCharactersPlugin from "@ckeditor/ckeditor5-special-characters/src/specialcharacters";
// Combines the arrows, currency, latin, mathematical and text special character plugins
import SpecialCharactersEssentials from "@ckeditor/ckeditor5-special-characters/src/specialcharactersessentials";

import Plugin from "@ckeditor/ckeditor5-core/src/plugin";

import DigressionBox from "./digressionBox/digressionBox";
import Visual from "./visual/visual";

export default class WireEditor extends ClassicEditor {}

WireEditor.builtinPlugins = [
  EssentialsPlugin,
  AutoformatPlugin,
  BoldPlugin,
  ItalicPlugin,
  DigressionBox,
  FontColorPlugin,
  FontFamilyPlugin,
  FontSizePlugin,
  LinkPlugin,
  ListPlugin,
  ParagraphPlugin,
  RemoveFormatPlugin,
  SourceEditing,
  SpecialCharactersPlugin,
  SpecialCharactersEssentials,
  Visual,
];

WireEditor.defaultConfig = {
  language: "en",
  toolbar: {
    items: [
      "undo",
      "redo",
      "removeFormat",
      "|",
      "bold",
      "italic",
      "fontFamily",
      "fontSize",
      "fontColor",
      "|",
      "insertDigressionBox",
      "insertVisual",
      "bulletedList",
      "link",
      "specialCharacters",
      "|",
      "sourceEditing",
    ],
  },
  link: {
    decorators: {
      addSourceReferences: {
        mode: "automatic",
        callback: (url) => url.startsWith("#source-"),
        classes: "source-reference",
      },
    },
  },
  fontColor: {
    colors: [
      {
        color: "hsl(0, 0%, 0%)",
        label: "Black",
      },
      {
        color: "hsl(208, 7%, 45%)",
        label: "Caption grey",
      },
    ],
    // Remove the "Document Colors" section.
    documentColors: 0,
  },
  fontFamily: {
    options: ["Noto Serif", "Roboto"],
  },
  fontSize: {
    options: [13, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72],
  },
};
