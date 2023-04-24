import DocumentLink from "../../shared/DocumentLink/index";

export default {
  props: {
    article: {},
    hero: {},
    preloadDoc: {
      default: false,
    },
    feature: {
      default: true,
    },
    returnPath: {},
    section: {},
    siteEnhancement: {
      default: false,
    },
  },

  components: {
    DocumentLink,
  },

  data() {
    return {
      truncateLength: 250,
    };
  },

  computed: {
    truncatedSummary() {
      if (this.article.summary.length >= this.truncateLength) {
        return this.article.summary.substring(0, this.truncateLength) + "...";
      } else {
        return this.article.summary;
      }
    },
  },
  methods: {
    clickCard(e) {
      if (this.$refs.documentLink) {
        this.$refs.documentLink.visitDoc(e.ctrlKey);
      }
    },
  },
};
