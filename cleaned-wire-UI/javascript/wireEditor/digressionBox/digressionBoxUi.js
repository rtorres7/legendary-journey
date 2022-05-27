import Plugin from "@ckeditor/ckeditor5-core/src/plugin";

import ButtonIcon from "@ckeditor/ckeditor5-core/theme/icons/object-full-width.svg";
import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview";

export default class DigressionBoxUI extends Plugin {
  init() {
    const editor = this.editor;
    const t = editor.t;

    editor.ui.componentFactory.add("insertDigressionBox", (locale) => {
      const command = editor.commands.get("insertDigressionBox");
      const buttonView = new ButtonView(locale);

      buttonView.set({
        label: "Digression Box",
        withText: true,
        tooltip: true,
      });

      buttonView.bind("isOn", "isEnabled").to(command, "value", "isEnabled");
      this.listenTo(buttonView, "execute", () =>
        editor.execute("insertDigressionBox")
      );

      return buttonView;
    });
  }
}
