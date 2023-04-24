import { mapMutations, mapActions, mapState } from "vuex";

export default {
  methods: {
    ...mapMutations("navmodal", ["setArticleList", "setListName", "setReturn"]),
    ...mapActions("navmodal", ["preload"]),

    setupNavModal(title, results, returnPath) {
      var articles = [];
      results.forEach((result, i) => {
        result.doc_num = result.doc_num.replace("/", "!");
        articles.push(result.doc_num);
        if (i < 3) {
          this.preload(result.doc_num);
        }
      });
      this.setArticleList(articles);
      this.setListName(title);
      this.setReturn(returnPath);
    },
  },
};
