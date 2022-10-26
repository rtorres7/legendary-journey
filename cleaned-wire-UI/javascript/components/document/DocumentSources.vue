<template>
  <DocumentExpansionPanel
    panelId="sources"
    v-if="visible"
    expandPrefix="source"
    ref="sourceExpansionPanel"
  >
    <template slot="header"> Sources ({{ sources.length }}) </template>
    <template slot="content">
      <p class="text-bold text-italic" v-if="sources.length === 0">
        The source list for this item is unavailable in the {{ name }}, please
        contact the originating office for source information.
      </p>
      <ol class="document-source-list" v-else>
        <li
          class="separator pb-2"
          v-for="source in sources"
          :key="source.id"
          :id="`source-${source.position}`"
        >
          <span class="source_link" v-if="user.congress">{{
            source.to_source_line
          }}</span>
          <a
            v-else
            target="_new"
            class="source_link"
            :href="sourceLink(source)"
          >
            {{ source.to_source_line }}
          </a>
        </li>
      </ol>
    </template>
  </DocumentExpansionPanel>
</template>

<script>
import DocumentExpansionPanel from "../document/DocumentExpansionPanel";
import axios from "axios";
import { mapState } from "vuex";

export default {
  name: "DocumentSources",
  components: { DocumentExpansionPanel },
  data() {
    return {
      sources: [],
      loading: false,
      visible: false,
    };
  },
  props: {
    document: {
      type: Object,
      required: true,
    },
  },
  mounted() {
    this.retrieveSources();
    this.$bus.$on("addSourceLinkEventHandlers", () => {
      this.addSourceLinkEventHandlers();
    });
  },
  destroyed() {
    this.$bus.$off("addSourceLinkEventHandlers");
  },
  computed: {
    ...mapState("metadata", ["name"]),
    ...mapState("user", ["user"]),
    docNum() {
      return this.$route.params["docNum"] || this.document.doc_num;
    },
    docPath() {
      return "/documents/" + this.docNum;
    },
  },
  methods: {
    retrieveSources() {
      this.loading = true;
      axios
        .get(this.docPath + "/source_citations.json")
        .then((response) => {
          this.sources = response.data.source_citations;
          this.visible = response.data.visible;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
        });
    },
    sourceLink(source) {
      return source.source_document_id
        ? `/documents/${source.doc_num.replace("/", "!")}`
        : source.source_document_url;
    },
    addSourceLinkEventHandlers() {
      let thisComponent = this;

      // Display source superscript in html body to only _temp_6 users
      if (this.user.organization === "_temp_6" && !this.user.congress) {
        $(".source-reference, .source-reference *").css("display", "unset");
      }

      // remove any previous listeners
      $(".source-reference").off("click");

      $(".source-reference").on("click", function (e) {
        e.preventDefault();
        var target = $(e.target).closest("a"); //sometimes we find ourselves in a child <span>
        var href = target.attr("href");
        var sourceLocation = href.substr(href.lastIndexOf("#"));
        thisComponent.$router.push({
          hash: sourceLocation,
        });
        thisComponent.$refs.sourceExpansionPanel.updatePanelState();
        thisComponent.$nextTick(() => {
          if ($(sourceLocation).length === 0) {
            sourceLocation = "#sources .doc-details";
          }
          WIRe.scrollTop($(sourceLocation).offset().top + 50, 200);
          $(sourceLocation).effect("highlight", {}, 2000);
        });
      });

      $(".source-reference").on("keypress", function (e) {
        if (e.which === 32) {
          e.preventDefault();
          $(this).trigger("click");
        }
      });
    },
  },
  watch: {
    $route() {
      if (this.docNum !== this.document.doc_num) {
        this.retrieveSources();
      }
    },
  },
};
</script>

<style scoped lang="scss">
ol.document-source-list {
  padding-left: 20px;
  margin-left: 0px;
}
</style>
