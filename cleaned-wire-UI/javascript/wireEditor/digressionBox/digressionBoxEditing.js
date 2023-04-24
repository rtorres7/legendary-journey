import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import {
  toWidget,
  toWidgetEditable,
} from "@ckeditor/ckeditor5-widget/src/utils";
import Widget from "@ckeditor/ckeditor5-widget/src/widget";

import InsertDigressionBoxCommand from "./insertDigressionBoxCommand";

export default class DigressionBoxEditing extends Plugin {
  static get requires() {
    return [Widget];
  }

  init() {
    this._defineSchema();
    this._defineConversion();
    this.editor.commands.add(
      "insertDigressionBox",
      new InsertDigressionBoxCommand(this.editor)
    );
  }

  _defineSchema() {
    const schema = this.editor.model.schema;

    schema.register("digressionBox", {
      allowWhere: "$block",
      isObject: true,
    });

    schema.register("digressionBoxContent", {
      allowIn: "digressionBox",
      allowContentOf: "$root",
      isLimit: true,
    });

    schema.addChildCheck((context, childDefinition) => {
      if (
        context.endsWith("digressionBoxContent") &&
        childDefinition.name === "digressionBox"
      ) {
        return false;
      }
    });
  }

  _defineConversion() {
    const conversion = this.editor.conversion;

    // digressionBox converters
    conversion.for("upcast").elementToElement({
      model: "digressionBox",
      view: {
        name: "section",
        classes: "digression",
      },
    });

    conversion.for("dataDowncast").elementToElement({
      model: "digressionBox",
      view: {
        name: "section",
        classes: "digression",
      },
    });

    conversion.for("editingDowncast").elementToElement({
      model: "digressionBox",
      view: (modelElement, { writer: viewWriter }) => {
        const section = viewWriter.createContainerElement("section", {
          class: "digression",
        });

        return toWidget(section, viewWriter, {
          label: "digression box widget",
        });
      },
    });

    // digressionBoxContent converters
    conversion.for("upcast").elementToElement({
      model: "digressionBoxContent",
      view: {
        name: "div",
        classes: "digression-content",
      },
    });

    conversion.for("dataDowncast").elementToElement({
      model: "digressionBoxContent",
      view: {
        name: "div",
        classes: "digression-content",
      },
    });

    conversion.for("editingDowncast").elementToElement({
      model: "digressionBoxContent",
      view: (modelElement, { writer: viewWriter }) => {
        const div = viewWriter.createEditableElement("div", {
          class: "digression-content",
        });

        return toWidgetEditable(div, viewWriter);
      },
    });

    // legacy conversion of old digression boxes
    conversion.for("upcast").add((dispatcher) => {
      dispatcher.on("element:div", this._upcastConverter);
    });
  }

  _upcastConverter(event, data, conversionApi) {
    const digressionDiv = data.viewItem;
    if (!digressionDiv.hasClass("digression")) {
      return;
    }

    // build element
    const modelElement = conversionApi.writer.createElement("digressionBox");
    const modelContent = conversionApi.writer.createElement(
      "digressionBoxContent"
    );
    conversionApi.writer.append(modelContent, modelElement);

    // attempt safe insert, abandon otherwise
    if (!conversionApi.safeInsert(modelElement, data.modelCursor)) {
      return;
    }

    // mark consumed by this converter
    conversionApi.consumable.consume(digressionDiv, { name: true });

    // get the content
    // const digressionContent = digressionDiv.getChild(0);
    const digressionContent = digressionDiv.getChildren();
    for (const node of [...digressionContent].reverse()) {
      // Let normal converters handle those
      conversionApi.convertChildren(node, modelContent);
    }

    // update with the results
    conversionApi.updateConversionResult(modelElement, data);
  }
}
