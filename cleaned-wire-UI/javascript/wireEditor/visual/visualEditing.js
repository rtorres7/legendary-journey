import Plugin from "@ckeditor/ckeditor5-core/src/plugin";

import {
  toWidget,
  toWidgetEditable,
} from "@ckeditor/ckeditor5-widget/src/utils";
import Widget from "@ckeditor/ckeditor5-widget/src/widget";

import InsertVisualCommand from "./insertVisualCommand";
import UpdateVisualCommand from "./updateVisualCommand";
export default class VisualEditing extends Plugin {
  static get requires() {
    return [Widget];
  }

  init() {
    this._defineSchema();
    this._defineConversion();
    this.editor.commands.add(
      "insertVisual",
      new InsertVisualCommand(this.editor)
    );
    this.editor.commands.add(
      "updateVisual",
      new UpdateVisualCommand(this.editor)
    );
  }

  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.register("visual", {
      allowWhere: "$block",
      isObject: true,
      allowAttributes: [
        "linkTarget",
        "mediaType",
        "title",
        "caption",
        "classification",
        "height",
        "width",
        "inlineHeight",
        "inlineWidth",
        "overlay",
        "margin",
        "autoPlay",
        "alignment",
        "aspectRatio",
        "id",
        "path",
        "__style",
        "hideTitle",
      ],
    });

    schema.register("visualPortionMark", {
      allowIn: "visual",
      allowChildren: "$text",
      isLimit: true,
    });

    schema.register("visualTitle", {
      allowIn: "visual",
      allowChildren: "$text",
      isLimit: true,
    });

    schema.register("visualThumbnail", {
      allowIn: "visual",
      isLimit: true,
      isObject: true,
      isContent: true,
      allowAttributes: ["alt", "src", "__style"],
    });

    schema.register("visualCaption", {
      allowIn: "visual",
      allowChildren: "$text",
      isLimit: true,
    });

    // CKEditor natually wans to apply the href attribute of an <a> tag to any
    // contained text nodes. We don't want that inside visuals because it would lead to nested
    // links and improper HTML structure
    schema.addAttributeCheck((context, attributeName) => {
      if (
        attributeName == "linkHref" &&
        (context.endsWith("visualPortionMark $text") ||
          context.endsWith("visualTitle $text") ||
          context.endsWith("visualCaption $text"))
      ) {
        return false;
      }
    });
  }

  _defineConversion() {
    const conversion = this.editor.conversion;

    conversion.elementToElement({
      model: "visualPortionMark",
      view: {
        name: "span",
        classes: "portionmark",
      },
    });

    conversion.elementToElement({
      model: "visualTitle",
      view: {
        name: "span",
        classes: "title",
      },
    });

    conversion.elementToElement({
      model: "visualThumbnail",
      view: {
        name: "img",
      },
    });

    conversion.attributeToAttribute({
      model: {
        name: "visualThumbnail",
        key: "src",
      },
      view: "src",
    });

    // .attributeToAttribute(...) expects an object for downcasting,
    // so it can individually handle CSS rules. The upcasting
    // .attributeToAttribute(...) doesn't create an object. Handle
    // everything as strings to avoid this conundrum
    conversion.for("upcast").attributeToAttribute({
      model: {
        key: "__style",
      },
      view: "style",
    });

    conversion.for("downcast").add((dispatcher) => {
      const downcastStyles = (evt, data, conversionApi) => {
        const viewElement = conversionApi.mapper.toViewElement(data.item);
        conversionApi.writer.setAttribute(
          "style",
          data.attributeNewValue,
          viewElement
        );
      };

      dispatcher.on("attribute:__style:visual", downcastStyles);
      dispatcher.on("attribute:__style:visualThumbnail", downcastStyles);
    });

    conversion.elementToElement({
      model: "visualCaption",
      view: {
        name: "span",
        classes: "caption",
      },
    });

    // when upcasting a visual, ensure you grab the path attributes
    conversion.for("upcast").elementToElement({
      view: {
        name: "a",
        classes: /inline-media/,
      },
      model: (viewElement, { writer }) => {
        const attrs = {
          path: viewElement.getAttribute("href"),
        };
        attrs.hideTitle = viewElement.hasClass("hide-title");

        return writer.createElement("visual", attrs);
      },
    });

    conversion.for("dataDowncast").elementToElement({
      model: "visual",
      view: (modelElement, { writer: viewWriter }) => {
        const attrs = {
          class: "inline-media",
          target: "_blank",
        };

        if (
          modelElement.hasAttribute("hideTitle") &&
          modelElement.getAttribute("hideTitle")
        ) {
          attrs.class = "inline-media hide-title";
        }

        return viewWriter.createContainerElement("a", attrs);
      },
    });

    conversion.for("editingDowncast").elementToElement({
      model: "visual",
      view: (modelElement, { writer: viewWriter }) => {
        const attrs = { class: "inline-media" };

        if (
          modelElement.hasAttribute("hideTitle") &&
          modelElement.getAttribute("hideTitle")
        ) {
          attrs.class = "inline-media hide-title";
        }

        return toWidget(
          viewWriter.createContainerElement("div", attrs),
          viewWriter,
          {
            label: "visual widget",
          }
        );
      },
    });

    conversion.attributeToAttribute({
      model: {
        key: "style",
      },
      view: "style",
    });

    // TODO make this a path attribute in the editing downcast so that linkTarget.js doesn't pick it up?
    conversion.attributeToAttribute({
      model: {
        name: "visual",
        key: "path",
      },
      view: "href",
    });

    conversion.attributeToAttribute({
      model: {
        name: "visual",
        key: "linkTarget",
      },
      view: "data-link-target",
    });
    conversion.attributeToAttribute({
      model: {
        name: "visual",
        key: "mediaType",
      },
      view: "data-media-type",
    });
    conversion.attributeToAttribute({
      model: {
        name: "visual",
        key: "height",
      },
      view: "data-height",
    });
    conversion.attributeToAttribute({
      model: {
        name: "visual",
        key: "width",
      },
      view: "data-width",
    });
    conversion.attributeToAttribute({
      model: {
        name: "visual",
        key: "inlineHeight",
      },
      view: "data-inline-height",
    });
    conversion.attributeToAttribute({
      model: {
        name: "visual",
        key: "overlay",
      },
      view: "data-overlay",
    });
    conversion.attributeToAttribute({
      model: {
        name: "visual",
        key: "margin",
      },
      view: "data-margin",
    });
    conversion.attributeToAttribute({
      model: {
        name: "visual",
        key: "autoPlay",
      },
      view: "data-auto-launch",
    });
    conversion.attributeToAttribute({
      model: {
        name: "visual",
        key: "alignment",
      },
      view: "data-alignment",
    });
    conversion.attributeToAttribute({
      model: {
        name: "visual",
        key: "aspectRatio",
      },
      view: "data-aspect-ratio",
    });
    conversion.attributeToAttribute({
      model: {
        name: "visual",
        key: "id",
      },
      view: "data-id",
    });
  }
}
