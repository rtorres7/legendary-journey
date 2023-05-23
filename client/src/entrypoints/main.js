import { createApp } from "vue";
import SimpleTypeahead from "vue3-simple-typeahead";
import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";
import App from "../App.vue";
import router from "@/router";
import store from "@/store";
import "vue3-carousel/dist/carousel.css";
import "@/content-styles.css";
import "@/index.css";
import * as CKEditor from "@ckeditor/ckeditor5-vue";
import { plugin as VueTippy } from "vue-tippy";
import "tippy.js/dist/tippy.css"; // optional for styling
import "tippy.js/animations/scale.css";
import Markdown from "vue3-markdown-it";

const componentFiles = import.meta.glob("../components/max-ui/*.vue", {
  eager: true,
});

const app = createApp(App);

Object.entries(componentFiles).forEach(([path, m]) => {
  const componentName = upperFirst(
    camelCase(
      path
        .split("/")
        .pop()
        .replace(/\.\w+$/, "")
    )
  );
  app.component(componentName, m.default);
});

app
  .use(SimpleTypeahead)
  .use(store)
  .use(router)
  .use(CKEditor)
  .use(VueTippy, {
    defaultProps: { animation: "scale", arrow: false, theme: "pegasus" },
  })
  .use(Markdown)
  .mount("#app");
