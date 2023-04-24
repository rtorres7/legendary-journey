<template>
  <div class="d-flex flex-column">
    <div v-if="loading && !preloaded">
      <spinner />
    </div>
    <div
      v-if="(!loading || preloaded) && !errored"
      class="standard-page-margin w-100"
      :id="id ? id : 'railsView'"
      v-html="html"
    ></div>
    <component
      v-else-if="errored"
      :is="errorView"
      :errorResponse="errorResponse"
      class="flex-grow-1"
    ></component>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import Forbidden from "@shared/errors/Forbidden";
import NotFound from "@shared/errors/NotFound";
import NotAcceptable from "@shared/errors/NotAcceptable";
import RequestTimeout from "@shared/errors/RequestTimeout";
import InternalServer from "@shared/errors/InternalServer";
import BadGateway from "@shared/errors/BadGateway";
import ServiceUnavailable from "@shared/errors/ServiceUnavailable";
import DisplayRailsError from "@shared/DisplayRailsError";
import Spinner from "./shared/Spinner";

export default {
  name: "RailsView",
  components: { Spinner },
  props: {
    docNum: {
      default: null,
    },
    path: {
      default: null,
    },
  },

  data() {
    return {
      id: null,
      html: "",
      preloaded: false,
      loading: true,
      errored: false,
      errorResponse: "",
    };
  },

  computed: {
    ...mapState("navmodal", ["preload"]),

    errorView() {
      switch (this.errored) {
        case 403:
          return Forbidden;
        case 404:
          return NotFound;
        case 406:
          return NotAcceptable;
        case 408:
          return RequestTimeout;
        case 500:
          return InternalServer;
        case 502:
          return BadGateway;
        case 503:
          return ServiceUnavailable;

        default:
          return DisplayRailsError;
      }
    },
  },

  mounted() {
    this.refreshOrPreload();
  },

  methods: {
    cachebustedPath() {
      return this.$route.fullPath.includes("?")
        ? this.$route.fullPath + "&cachebuster=true"
        : this.$route.fullPath + "?cachebuster=true";
    },

    refreshPage() {
      this.id = null;
      this.loading = true;
      this.$Progress.start();
      this.errored = null;
      this.errorResponse = "";
      var p = this.$route.fullPath;
      axios
        .get(this.cachebustedPath(), {
          headers: {
            "X-AJAX-PARTIAL": "document",
            Accept: "text/html,application/xhtml+xml,application/xml",
          },
        })
        .then((response) => {
          this.id = response.headers["x-page-id"]
            ? response.headers["x-page-id"]
            : "railsView";
          document.title = response.headers["x-page-title"] || "";
          this.html = response.data;
          this.$Progress.finish();
          this.loading = false;
        })
        .catch((e) => {
          this.$Progress.finish();
          this.loading = false;
          this.errored = e.response.status;
          this.errorResponse = e.response.data;
        });
    },

    refreshOrPreload() {
      if (this.docNum && Object.keys(this.preload).includes(this.docNum)) {
        this.preloaded = true;
        this.html = this.preload[this.docNum];
        this.refreshPage();
      } else {
        this.preloaded = false;
        this.refreshPage();
      }
    },
  },

  watch: {
    // When going from one non-vue page to another we need to make sure that the page updates.
    // To do that we will watch the route, and when it changes call our refresh page method to update our view
    $route() {
      this.refreshOrPreload();
    },

    html() {
      const id = "#" + this.id;
      var that = this; // store reference to Vue context for use in callbacks

      setTimeout(function () {
        let html = $(id).html();
        $(id).html(html);

        $("#edit_wire_document #actions :submit").on("click", function (event) {
          event.preventDefault();
          that.$Progress.start();

          globalThis.documentEditor.updateSourceElement();

          let formData = new FormData($("form#edit_wire_document").get(0));
          formData.append("commit", event.target.value);

          axios({
            method: "post",
            _temp_1: that.$route.fullPath.split("/edit")[0],
            data: formData,
          }).then((response) => {
            that.$Progress.finish();
            this.loading = false;
            that.html = "";
            that.id = response.headers["x-page-id"]
              ? response.headers["x-page-id"]
              : "railsView";
            document.title = response.headers["x-page-title"];
            // CKEDITOR.instances["document_html_body"].destroy();
            that.html = response.data;
          });
        });
      }, 0);
    },
  },
};
</script>

<style scoped lang="scss">
.loading-area {
  min-height: 80vh;
}
</style>
