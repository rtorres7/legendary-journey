//TODO: Everytime this file changes, make sure to copy it to /packs/main.js as well in order to guarantee a smooth build with Shakapacker.
import { createApp } from "vue";
import SimpleTypeahead from "vue3-simple-typeahead";
import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "vue3-carousel/dist/carousel.css";
import "./content-styles.css";
import "./index.css";
import * as CKEditor from "@ckeditor/ckeditor5-vue";
import { plugin as VueTippy } from "vue-tippy";
import "tippy.js/dist/tippy.css"; // optional for styling
import "tippy.js/animations/scale.css";
import Markdown from "vue3-markdown-it";
import VueCookies from "vue-cookies";

const requireComponent = require.context(
  "./components/max-ui",
  false,
  /Max[A-Z]\w+\.(vue|js)$/
);

const app = createApp(App);

requireComponent.keys().forEach((fileName) => {
  const componentConfig = requireComponent(fileName);

  const componentName = upperFirst(
    camelCase(fileName.replace(/^\.\/(.*)\.\w+$/, "$1"))
  );

  app.component(componentName, componentConfig.default || componentConfig);
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
  .use(VueCookies)
  .mount("#app");
