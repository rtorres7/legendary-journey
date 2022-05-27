import Plugin from "@ckeditor/ckeditor5-core/src/plugin";

import { Model, createDropdown, addListToDropdown } from "ckeditor5/src/ui";
import { Collection } from "ckeditor5/src/utils";

import VisualEditing from "./visualEditing";
import axios from "wireAxios";

export default class VisualUI extends Plugin {
  static get requires() {
    return [VisualEditing];
  }

  init() {
    const editor = this.editor;
    const command = editor.commands.get("insertVisual");

    editor.ui.componentFactory.add("insertVisual", (locale) => {
      const dropdown = createDropdown(locale);

      this._setUpDropdown(dropdown, command);

      return dropdown;
    });
  }

  _setUpDropdown(dropdown, command) {
    const editor = this.editor;
    const t = editor.t;
    const button = dropdown.buttonView;

    dropdown.bind("isEnabled").to(command);

    const itemDefinitions = new Collection();

    getVisuals().then((response) => {
      const visualOptions = response.data.attachments;
      for (const visual of visualOptions) {
        const defn = {
          type: "button",
          model: new Model({
            commandParam: visual,
            label: getLabelText(visual),
            withText: true,
          }),
        };
        itemDefinitions.add(defn);
      }

      addListToDropdown(dropdown, itemDefinitions);
    });

    button.set({
      label: t("Visual"),
      withText: true,
      tooltip: true,
    });

    dropdown.on("execute", (evt) => {
      editor.execute("insertVisual", evt.source.commandParam);
    });
  }
}

function getLabelText(visualParams) {
  let labelText = visualParams.fileName;
  if (visualParams.caption) labelText = visualParams.caption;
  if (visualParams.title) labelText = visualParams.title;
  if (labelText.length > 50) labelText = labelText.slice(0, 50).trim() + "...";

  return labelText;
}

function getVisuals() {
  const url = window.location.pathname.replace(
    /edit$/,
    "attachments.json?selector=visuals"
  );
  return axios.get(url);
}
