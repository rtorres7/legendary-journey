.
<template>
  <label v-if="label" :for="uuid" class="inline-flex text-sm font-medium"
    >{{ label }}
    <template v-if="required">
      <span class="sr-only">Required</span>
      <span class="pl-1 text-red-500">*</span>
    </template>
  </label>
  <div class="mt-1 w-[95%]">
    <ckeditor
      v-bind="$attrs"
      :id="uuid"
      :model-value="modelValue"
      :editor="editor"
      :config="config"
      @input="$emit('update:modelValue', $event)"
    ></ckeditor>
  </div>
</template>

<script>
import { ref } from "vue";
import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import EssentialsPlugin from "@ckeditor/ckeditor5-essentials/src/essentials";
import GeneralHtmlSupport from '@ckeditor/ckeditor5-html-support/src/generalhtmlsupport';
import BoldPlugin from "@ckeditor/ckeditor5-basic-styles/src/bold";
import ItalicPlugin from "@ckeditor/ckeditor5-basic-styles/src/italic";
import UnderlinePlugin from "@ckeditor/ckeditor5-basic-styles/src/underline";
import Strikethrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import Subscript from '@ckeditor/ckeditor5-basic-styles/src/subscript';
import Superscript from '@ckeditor/ckeditor5-basic-styles/src/superscript';
import Font from "@ckeditor/ckeditor5-font/src/font";
import LinkPlugin from "@ckeditor/ckeditor5-link/src/link";
import Heading from "@ckeditor/ckeditor5-heading/src/heading";
import ParagraphPlugin from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import Style from '@ckeditor/ckeditor5-style/src/style';
import DocumentListProperties from "@ckeditor/ckeditor5-list/src/documentlistproperties";
import Image from "@ckeditor/ckeditor5-image/src/image";
import ImageInsert from "@ckeditor/ckeditor5-image/src/imageinsert";
import ImageToolbar from "@ckeditor/ckeditor5-image/src/imagetoolbar";
import ImageCaption from "@ckeditor/ckeditor5-image/src/imagecaption";
import ImageStyle from "@ckeditor/ckeditor5-image/src/imagestyle";
import ImageResize from "@ckeditor/ckeditor5-image/src/imageresize";
import ImageLink from "@ckeditor/ckeditor5-link/src/linkimage";
import Indent from "@ckeditor/ckeditor5-indent/src/indent";
import IndentBlock from "@ckeditor/ckeditor5-indent/src/indentblock";
//import SimpleUploadAdapter from "@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter";
import uniqueID from "@/composables/uniqueID";

export default {
  props: {
    label: {
      type: String,
      default: "",
    },
    modelValue: {
      type: String,
      default: "",
    },
    required: {
      type: Boolean,
      default: false,
    },
    //Overrides the baseConfig
    customConfig: {
      type: Object,
      default: null,
    },
    //Expands the baseConfig. Ignored if customConfig exists.
    extraConfig: {
      type: Object,
      default: null,
    },
  },
  emits: ["update:modelValue"],
  setup(props) {
    const editor = ClassicEditor;
    const uuid = uniqueID().getID();

    const baseConfig = {
      plugins: [
        EssentialsPlugin,
        GeneralHtmlSupport,
        BoldPlugin,
        ItalicPlugin,
        UnderlinePlugin,
        Strikethrough,
        Subscript,
        Superscript,
        Font,
        LinkPlugin,
        Heading,
        ParagraphPlugin,
        Style,
        DocumentListProperties,
        Image,
        ImageInsert,
        ImageToolbar,
        ImageCaption,
        ImageStyle,
        ImageResize,
        ImageLink,
        Indent,
        IndentBlock,
      ],
      toolbar: {
        items: [
          "heading",
          "|",
          "style",
          "|",
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "subscript",
          "superscript",
          "|",
          "fontSize",
          "fontFamily",
          "fontColor",
          "|",
          "numberedList",
          "bulletedList",
          "|",
          "outdent",
          "indent",
          "|",
          "link",
          "|",
          "undo",
          "redo",
          "|",
        ],
      },
      // Not currently functional
      // list: {
      //   properties: {
      //     styles: true,
      //     startIndex: true,
      //     reversed: true,
      //   },
      // },
      style: {
        definitions: [
          {
            name: 'Info box',
            element: 'p',
            classes: [ 'info-box' ]
          },
        ]
      }
    };

    const config = ref(baseConfig);

    if (props.customConfig) {
      config.value = { ...props.customConfig };
    } else {
      if (props.extraConfig) {
        Object.keys(props.extraConfig).forEach((property) => {
          if (!config.value[property]) {
            config.value[property] = props.extraConfig[property];
          } else {
            switch (property) {
              case "plugins": {
                props.extraConfig[property].forEach((plugin) => {
                  config.value[property].push(plugin);
                });
                break;
              }
              case "toolbar": {
                Object.keys(props.extraConfig[property]).forEach(
                  (subProperty) => {
                    if (!config.value[property][subProperty]) {
                      config.value[property][subProperty] =
                        props.extraConfig[property][subProperty];
                    } else {
                      props.extraConfig[property][subProperty].forEach(
                        (option) => {
                          config.value[property][subProperty].push(option);
                        }
                      );
                    }
                  }
                );
              }
            }
          }
        });
      }
    }

    return {
      editor,
      config,
      uuid,
    };
  },
};
</script>
<style>
.ck-editor__editable_inline {
  height: 450px;
}
.ck.ck-content ul,
.ck.ck-content ul li {
  list-style-type: inherit;
}
.ck.ck-content ol,
.ck.ck-content ul {
  padding-left: 40px;
}
.ck.ck-content h2 {
  font-size: 1.5em;
}
.ck.ck-content h3 {
  font-size: 1.3em;
}
.ck.ck-content h4 {
  font-size: 1.1em;
}
.ck.ck-content p {
  font-size: 0.9em;
}
.ck.ck-content p.info-box {
  @apply shadow-md;
  background-color: white;
  padding: 1.2em 2em;
  margin: 1.5em;
}
.dark .ck.ck-content p.info-box {
  @apply bg-slate-800;
}
.energy .ck.ck-content p.info-box {
  @apply bg-zinc-800;
}
</style>
