import { mapState } from "vuex";
import { isEmpty } from "lodash";

export default {
  computed: {
    ...mapState("search", ["results"]),

    articleIds() {
      return this.results.flatMap((article) =>
        isEmpty(article.needed) ? [article.id] : []
      );
    },
  },

  props: ["form"],

  data() {
    return {
      allSelected: false,
      indeterminate: false,
    };
  },

  methods: {
    toggleAll(checked) {
      this.form.checked = checked ? this.articleIds : [];
    },
    numArticles() {
      return this.articleIds.length;
    },
  },

  watch: {
    form: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal.checked.length === 0) {
          this.indeterminate = false;
          this.allSelected = false;
        } else if (newVal.checked.length === this.articleIds.length) {
          this.indeterminate = false;
          this.allSelected = true;
        } else {
          this.indeterminate = true;
          this.allSelected = false;
        }
      },
    },
  },
};
