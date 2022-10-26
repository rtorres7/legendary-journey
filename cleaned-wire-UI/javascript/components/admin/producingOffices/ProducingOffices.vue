<template>
  <div>
    <NotFound v-if="error" />
    <div class="mt-6 standard-page-margin" v-else>
      <div v-if="loading">
        <spinner />
      </div>
      <vanity-title v-else :title="`${producingOfficeLabel}`" />
      <b-row v-if="!loading" class="mt-4">
        <b-col cols="24" sm="11" lg="8" class="mr-6">
          <OfficeTree />
        </b-col>
        <b-col cols="24" sm="11" lg="10" class="mr-6">
          <OfficeDetails @officeUpdated="loadProducingOffices" />
          <OfficeDetailsModal
            v-if="selectedNode"
            @officeUpdated="loadProducingOffices"
          />
        </b-col>
        <b-col cols="24" sm="11" lg="5"
          ><CreateOffice @officeUpdated="loadProducingOffices"
        /></b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import CreateOffice from "./CreateOffice";
import OfficeTree from "./OfficeTree";
import OfficeDetails from "./OfficeDetails";
import OfficeDetailsModal from "./OfficeDetailsModal";
import NotFound from "@shared/errors/NotFound";
import Spinner from "@shared/Spinner";
import VanityTitle from "../../vanity/VanityTitle";
import { mapState } from "vuex";

export default {
  name: "ProducingOffices",
  components: {
    CreateOffice,
    OfficeDetails,
    OfficeDetailsModal,
    OfficeTree,
    NotFound,
    Spinner,
    VanityTitle,
  },
  mounted() {
    this.loadProducingOffices();
  },
  computed: {
    ...mapState("producingOffices", [
      "error",
      "loading",
      "producingOffices",
      "producingOfficeLabel",
      "selectedNode",
    ]),
  },
  methods: {
    loadProducingOffices() {
      this.$store.dispatch("producingOffices/loadOfficesOrDivisions", {
        caller: this,
      });
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .separator {
  border-bottom: 1px solid $alt-400;
}
</style>
