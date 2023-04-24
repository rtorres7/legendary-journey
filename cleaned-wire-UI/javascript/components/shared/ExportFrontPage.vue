<template v-if="name">
  <b-dd-item-button size="sm" @click="exportEdition" data-usage="export-zip">
    <img :src="require('@assets/save.svg')" class="mr-2" />
    {{ exportText }}
  </b-dd-item-button>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";

export default {
  name: "ExportFrontPage",
  methods: {
    exportEdition() {
      axios.get("/wires/" + this.date + "/export.zip").then((response) => {
        if (response.status === 204) {
          this.$router.push({ path: "/exports" });
        }
      });
    },
  },

  computed: {
    ...mapState("articles", ["daily_wire"]),
    ...mapState("metadata", ["name"]),
    exportText() {
      const edition = this.name == "WIRe" ? "WIRe" : "edition";
      return "Export this " + edition;
    },
    date() {
      return this.$route.params.date
        ? this.$route.params.date
        : moment(this.daily_wire.publication_date, "YYYY/MM/DD").format(
            "YYYY-MM-DD"
          );
    },
  },
};
</script>

<style scoped lang="scss">
img {
  height: 16px;
  width: 16px;
}
</style>
