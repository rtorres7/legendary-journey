<template>
  <div>
    <div
      v-if="loading"
      class="d-flex justify-content-center align-items-center loading-area"
    >
      <spinner />
    </div>
    <div class="standard-page-margin" v-else>
      <vanity-title title="Special Editions" />
      <div class="d-flex justify-content-end">
        <b-btn
          class="mt-4"
          variant="primary"
          title="Create"
          aria-label="Create Special Edition"
          @click="showCreateSpecialEditionModal"
          >Create</b-btn
        >
      </div>
      <SpecialEditionAddEditModal
        ref="createSpecialEditionModal"
        @specialEditionCreated="specialEditionCreated"
      />
      <b-row class="pr-6 pl-6">
        <SpecialEditionsByState
          :specialEditions="conceptsLinks.posted"
          state="Posted"
          class="pr-6"
        />
        <SpecialEditionsByState
          v-if="canManageSpecialEditions"
          :specialEditions="conceptsLinks.draft"
          state="Draft"
          class="pr-6"
        />
        <SpecialEditionsByState
          v-if="canManageSpecialEditions"
          :specialEditions="conceptsLinks.archived"
          state="Archived"
        />
      </b-row>
    </div>
  </div>
</template>

<script>
import SpecialEditionsByState from "./SpecialEditionsByState";
import SpecialEditionAddEditModal from "../specialEditions/SpecialEditionAddEditModal";
import Spinner from "@shared/Spinner";
import VanityTitle from "../vanity/VanityTitle";
import { mapGetters, mapState } from "vuex";

export default {
  name: "SpecialEditions",
  components: {
    SpecialEditionsByState,
    Spinner,
    VanityTitle,
    SpecialEditionAddEditModal,
  },
  computed: {
    ...mapState("concepts", ["conceptsLinks", "loading"]),
    ...mapGetters("user", ["canManageSpecialEditions"]),
  },
  mounted() {
    this.$store.dispatch("concepts/loadConceptsLinks", {
      caller: this,
    });
  },

  methods: {
    showCreateSpecialEditionModal() {
      this.$refs.createSpecialEditionModal.showModal = true;
      this.$emit("createSpecialEdition");
    },
    specialEditionCreated(specialEditionId) {
      this.$router.push({
        name: "specialEdition",
        params: { id: specialEditionId },
      });
    },
  },

  watch: {
    conceptsLinks() {
      this.$nextTick(() => {
        if (document.querySelector(".editionCol a")) {
          document.querySelector(".editionCol a").focus();
        }
      });
    },
  },
};
</script>
