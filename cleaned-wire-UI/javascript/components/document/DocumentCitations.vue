<template>
  <div class="pt-8" v-if="visible">
    <h2 class="pri-800 separator py-4">Cited In</h2>
    <p v-if="user.congress || citations.length === 0">
      A list of products that cite this source is unavailable.
    </p>
    <p v-else>
      These are analytic products that have cited this piece as a source.
    </p>
    <ul class="list-group">
      <li v-for="citation in citations" :key="citation.id" class="py-4">
        <DocumentLink
          :document="citation.document"
          section="none"
          returnPath="/"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import DocumentLink from "../shared/DocumentLink/index";
import axios from "axios";
import { mapState } from "vuex";

export default {
  name: "DocumentCitations",
  components: { DocumentLink },
  data() {
    return {
      citations: [],
      loading: false,
      visible: false,
    };
  },
  mounted() {
    this.retrieveCitations();
  },
  computed: {
    ...mapState("user", ["user"]),
    docPath() {
      return "/documents/" + this.$route.params["docNum"];
    },
  },
  methods: {
    retrieveCitations() {
      this.loading = true;
      axios
        .get(this.docPath + "/citations.json")
        .then((response) => {
          this.citations = response.data.citations;
          this.visible = response.data.visible;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error.response);
          this.loading = false;
        });
    },
  },
  watch: {
    $route() {
      this.retrieveCitations();
    },
  },
};
</script>
