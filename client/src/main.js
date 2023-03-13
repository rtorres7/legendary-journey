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

const componentFiles = import.meta.glob("./components/base/*.vue", {
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

app.use(SimpleTypeahead).use(store).use(router).use(CKEditor).mount("#app");
