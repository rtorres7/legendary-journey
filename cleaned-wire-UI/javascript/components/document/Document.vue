<template>
  <DocumentLayout
    :document="document"
    :loading="loading"
    :errored="errored"
    :authorized="authorized"
  >
    <template slot="socialToolbarOrPreviewDisclaimer">
      <SocialToolbar :document="document" />
    </template>
    <template slot="documentComments">
      <DocumentComments />
    </template>
    <template slot="sideBar">
      <DocumentSideBar :document="document" />
    </template>
  </DocumentLayout>
</template>

<script>
import DocumentComments from "../document/DocumentComments";
import DocumentLayout from "../document/DocumentLayout";
import DocumentSideBar from "../document/DocumentSideBar";
import SocialToolbar from "../document/SocialToolbar";
import axios from "axios";

export default {
  name: "Document",
  components: {
    DocumentComments,
    DocumentLayout,
    DocumentSideBar,
    SocialToolbar,
  },
  data() {
    return {
      document: {
        doc_num: "",
        id: "",
      },
      errored: false,
      authorized: true,
      loading: true,
      titleRegex: /^\([^)]*\)/,
    };
  },
  mounted() {
    this.loading = true;
    this.retrieveDocument();
    this.$bus.$on("reloadDocument", () => {
      this.retrieveDocument();
    });
  },
  destroyed() {
    this.$bus.$off("reloadDocument");
  },
  computed: {
    docNum() {
      return this.$route.params["docNum"];
    },
  },
  methods: {
    retrieveDocument() {
      axios
        .get("/documents/" + this.docNum + ".json", {
          params: this.$route.query,
        })
        .then((response) => {
          if (response.data.status == "403") {
            this.authorized = false;
            this.document = response.data.document;
          } else {
            this.authorized = true;
            this.errored = false;
            this.document = response.data;
          }
          document.title =
            response.headers["x-page-title"] != undefined
              ? response.headers["x-page-title"]
              : this.docNum;

          this.loading = false;

          this.$nextTick(() => {
            this.centerTearlines();
            WIRe.scopedPageSetup($("#document"));
            this.$bus.$emit("addSourceLinkEventHandlers");
          });
        })
        .catch((error) => {
          this.errored = true;
          this.loading = false;
        });
    },
    centerTearlines() {
      $(
        "p.bodyparagraph:contains('-- BEGIN TEARLINE --'), p.bodyparagraph:contains('-- BEGIN EMBEDDED TEARLINE --'), p.bodyparagraph:contains('-- END TEARLINE --'), p.bodyparagraph:contains('-- END EMBEDDED TEARLINE --')"
      ).addClass("text-center");
    },
  },
  watch: {
    $route() {
      if (this.docNum !== this.document.doc_num) {
        this.retrieveDocument();
      }
    },
  },
};
</script>
