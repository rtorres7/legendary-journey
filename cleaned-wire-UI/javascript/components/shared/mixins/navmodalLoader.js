import { mapMutations, mapActions, mapState } from "vuex";

export default {
  methods: {
    ...mapMutations("navmodal", ["setProductList", "setListName", "setReturn"]),
    ...mapActions("navmodal", ["preload"]),

    setupNavModal(title, results, returnPath) {
      var products = [];
      results.forEach((result, i) => {
        result.doc_num = result.doc_num.replace("/", "!");
        products.push(result.doc_num);
        if (i < 3) {
          this.preload(result.doc_num);
        }
      });
      this.setProductList(products);
      this.setListName(title);
      this.setReturn(returnPath);
    },
  },
};
