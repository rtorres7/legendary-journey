import { mapActions } from "vuex";

export default {
  methods: {
    ...mapActions("navmodal", ["preload"]),

    preloadResults(results) {
      results.slice(0, 3).forEach((doc) => {
        this.preload(doc.doc_num.replace("/", "!"));
      });
    },
  },
};
