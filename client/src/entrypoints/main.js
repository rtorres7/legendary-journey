import { createApp } from "vue";
import SimpleTypeahead from "vue3-simple-typeahead";
import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import "vue3-carousel/dist/carousel.css";
import "@/content-styles.css";
import "@/index.css";
import * as CKEditor from "@ckeditor/ckeditor5-vue";
import { plugin as VueTippy } from "vue-tippy";
import "tippy.js/dist/tippy.css"; // optional for styling
import "tippy.js/animations/scale.css";

const componentFiles = import.meta.glob(
  "../domains/current/components/max-ui/*.vue",
  {
    eager: true,
  }
);

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

const setup = async () => {
  if (
    import.meta.env.MODE === "production" ||
    import.meta.env.MODE === "development"
  ) {
    const fetchedData = await fetch("/production.metadata.json");
    app.provide("metadata", await fetchedData.json());
  } else {
    const metadata = await import("@/shared/config/low.metadata.json");
    app.provide("metadata", metadata);
  }
  app
    .use(SimpleTypeahead)
    .use(store)
    .use(router)
    .use(CKEditor)
    .use(VueTippy, {
      defaultProps: { animation: "scale", arrow: false, theme: "pegasus" },
    })
    .mount("#app");
};

setup();
