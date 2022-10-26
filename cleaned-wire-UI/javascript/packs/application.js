import "babel-polyfill";

import Vue from "vue";
import axios from "../wireAxios";

import Notifications from "vue-notification";
Vue.use(Notifications);

import VueAnnouncer from "vue-announcer";
Vue.use(VueAnnouncer);

import WireNotificationPlugin from "../plugins/wireNotification";
Vue.use(WireNotificationPlugin);

Vue.use(require("vue-shortkey"), {
  prevent: [".ck-editor__editable", "input", "textarea"],
});

import "core-js/fn/array/flat-map";

Vue.config.performance = true;
Vue.config.errorHandler = function (err, vm, info) {
  Vue.$wireNotification({
    group: "main",
    title: "Error: Something went wrong",
    duration: 10000,
    text:
      'Please consider <a href="javascript:window.location.href=window.location.href" aria-label="Refresh page">refreshing the page</a>.<br>If the problem persists please <a href="/feedback">contact us</a>.',
    type: "error",
  });
  axios
    .post("/client_side_error", {
      message: "vue error: " + err.toString(),
      _temp_1: window.location.href,
    })
    .catch(function (error) {
      console.error(
        "Error trying to report a client side error from Vue.config.errorHandler",
        error
      );
    });
  return false;
};

window.addEventListener("unhandledrejection", function (event) {
  axios
    .post("/client_side_error", {
      message: "unhandled error/rejection: " + event.toString(),
    })
    .catch(function (error) {
      console.error(
        "Error trying to report a client side error from unhandledrejection",
        error
      );
    });
});

window.onerror = function (msg, _temp_1, line, col, error) {
  console.log("Error detected in JS");
};

Vue.prototype.$bus = new Vue({});

import "../plugins/bootstrap";

Vue.use(require("vue-cookies"));

import moment from "moment-timezone";
import VueMoment from "vue-moment";
Vue.use(VueMoment, { moment });

Vue.use(require("vue-scrollto"));

import VueHotkey from "v-hotkey";
Vue.use(VueHotkey);

import { VueMasonryPlugin } from "vue-masonry";
Vue.use(VueMasonryPlugin);

import VueFlatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
Vue.use(VueFlatPickr);

import "vue-multiselect/dist/vue-multiselect.min.css";

import "tree-component/dist/tree.min.css";

import router from "../router";

router.beforeEach((to, from, next) => {
  // See `wireNotification.js` for discussion on local vue
  const localVue = new Vue();
  let announcement = to.name;
  const toMetadata = to.metadata;
  const toMeta = to.meta;

  if (toMeta && toMeta.title && toMeta.title(to)) {
    announcement = toMeta.title(to);
  }
  if (toMetadata && toMetadata.announce) {
    announcement = toMetadata.announce;
  }
  if (!announcement) {
    announcement = to.path;
  }
  localVue.$announcer.set(`Navigated to ${announcement} page`);
  next();
});

router.afterEach((to, from) => {
  Vue.nextTick(() => {
    const toPath = to.path;
    const toMeta = to.meta;
    const toQuery = to.query;
    let matomoTitle = "";
    if (toMeta && toMeta.title) {
      if (toMeta.title(to) == "rails") {
        // Matomo calls
        // because of low classification level in matomo, setting a generic title
        if (toPath.match(/leadership_profiles/)) {
          matomoTitle = "Leadership Profiles";
        } else if (toPath.match(/special_editions/)) {
          matomoTitle = "Special Editions";
        } else if (toPath.match(/documents/)) {
          trackPageView("WIRe Document", toPath);
        } else {
          matomoTitle = "WIRe";
        }
      } else {
        matomoTitle = document.title = toMeta.title(to);
      }
    } else {
      matomoTitle = document.title = store.state.metadata.siteDefaultTitle;
    }

    // Since there are 2 calls to this method for each user request,
    // other than calls to Rails View have only one call
    // query is empty in one of the 2 calls and in Rails View call
    // not empty in case of saved search
    // this filter helps to call matomo only once
    // This double call (at least in the case of navigating to Issues) is caused
    // by the call to this.$router.replace in updateCriteria method in vanityPage.js
    // The custom _temp_1 is logged in matomo below page title for each request
    if (_.isEmpty(toQuery) && matomoTitle.length > 0) {
      trackPageView(matomoTitle, toPath);
    } else {
      if (toQuery["id"] !== undefined && toQuery["view"] == "list") {
        // Only comes here when search or saved search is called,
        // saved search has an ID and normal search has view value set
        trackPageView("Search", toPath);
      }
    }
  });
});

function trackPageView(documentTitle, toPath) {
  if (window._paq !== undefined) {
    // Matomo calls
    window._paq.push(["setCustomUrl", toPath]);
    window._paq.push(["setDocumentTitle", documentTitle]);
    // When we update `window._paq` with a `trackPageView` value, the matomo call
    // is finally executed
    window._paq.push(["trackPageView"]);
  }
}

import store from "../store";

import { sync } from "vuex-router-sync";
sync(store, router);

Vue.use(store);
Vue.prototype.$http = axios;

store.dispatch("firstLoad");

import VueTypeaheadBootstrap from "vue-typeahead-bootstrap";
Vue.component("vue-typeahead-bootstrap", VueTypeaheadBootstrap);

import VueMarkdown from "vue-markdown";
Vue.component("vue-markdown", VueMarkdown);

Vue.prototype.$eventBus = new Vue();

import VueProgressBar from "vue-progressbar";
Vue.use(VueProgressBar, {
  color: "#fff",
  failedColor: "red",
  height: "2px",
});

import App from "../App.vue";

WIRe.vue = Vue; // make Vue available to rails erbs and jquery
WIRe.vue_event_bus = Vue.prototype.$bus;

axios.defaults.headers.common["X-CSRF-Token"] = document
  .querySelector("meta[name='csrf-token']")
  .getAttribute("content");

document.addEventListener("DOMContentLoaded", () => {
  const el = document.body.appendChild(document.createElement("header"));
  const app = new Vue({
    el,
    router,
    store,
    render: (h) => h(App),
  });
});
