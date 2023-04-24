/* eslint no-console: 0 */
import Vue from "vue";
import BootstrapVue from "bootstrap-vue";

Vue.use(BootstrapVue);

import router from "../router";
import store from "../store";
import { sync } from "vuex-router-sync";

sync(store, router);

Vue.use(store);

import moment from "moment-timezone";
import VueMoment from "vue-moment";
Vue.use(VueMoment, { moment });

import DocumentPreviewModal from "../components/document/DocumentPreviewModal.vue";

$("#document-preview-btn").on("click", function (e) {
  const el = document.body.appendChild(document.createElement("app"));
  const app = new Vue({
    el,
    router,
    store,
    render: (h) => h(DocumentPreviewModal),
  });
});
