import axios from "axios";
import { mapMutations } from "vuex";

export default {
  methods: {
    cancel() {
      this.$bus.$emit("close-form");
    },

    makeRequest(params) {
      axios({
        method: "post",
        _temp_1: "/my_wire/folder_tag_documents.json",
        data: params,
        config: {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      })
        .then(() => {
          this.cancel();
        })
        .catch((e) => {
          this.cancel();
          throw new Error("Something went wrong during bulk action");
        });
    },
  },
};
