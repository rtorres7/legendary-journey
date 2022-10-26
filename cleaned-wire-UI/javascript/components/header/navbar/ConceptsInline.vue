<template>
  <div>
    <b-dropdown-header v-if="header"> Special Editions </b-dropdown-header>
    <div class="d-flex pb-3 concepts-scroll-container">
      <div v-if="!loading && atLeastOneSE">
        <Concept
          v-for="(se_link, ind) in conceptsLinks.posted"
          :key="'posted_ind' + ind"
          :concept="se_link"
        >
        </Concept>
      </div>
      <div v-else-if="loading">
        <spinner />
      </div>
      <div v-else class="p-5">No Special Editions available at the moment</div>
      <!-- TODO: make own component for admin? -->
      <div
        v-if="canManageSpecialEditions"
        class="mr-5 ml-5 border-left concepts-admin"
      >
        <div class="admin-only-header">
          <div class="heading-stylized font-size-4 ml-6 mt-5">
            <div class="d-flex justify-content-end">
              Admin Only
              <b-button
                size="sm"
                @click="showCreateSpecialEditionModal"
                variant="primary"
                class="ml-auto"
                aria-label="Create Special Edition"
              >
                Create
              </b-button>
            </div>
          </div>
        </div>
        <div class="ml-6 mt-3 mb-2 understated-title-text">Draft</div>
        <Concept
          v-for="(se_link, ind) in conceptsLinks.draft"
          :key="'draft_ind' + ind"
          :concept="se_link"
          :showIcon="false"
        >
        </Concept>

        <div class="ml-6 mt-6 mb-2 understated-title-text">Archived</div>
        <Concept
          v-for="(se_link, ind) in conceptsLinks.archived"
          :key="'archived_ind' + ind"
          :concept="se_link"
          :showIcon="false"
        >
        </Concept>
      </div>
    </div>
    <SpecialEditionAddEditModal
      ref="createSpecialEditionModal"
      @specialEditionCreated="specialEditionCreated"
    />
  </div>
</template>

<script>
import Concept from "./Concept";
import SpecialEditionAddEditModal from "../../specialEditions/SpecialEditionAddEditModal";
import Spinner from "../../shared/Spinner";
import { mapGetters, mapState } from "vuex";

export default {
  name: "Concepts",
  components: { Spinner, Concept, SpecialEditionAddEditModal },
  props: {
    header: {
      default: true,
    },
  },

  computed: {
    ...mapGetters("user", ["canManageSpecialEditions"]),
    ...mapState("concepts", ["conceptsLinks", "loading"]),

    atLeastOneSE() {
      if (this.loading) {
        return false;
      }
      var totalLength = 0;
      Object.keys(this.conceptsLinks).forEach((concept) => {
        totalLength += this.conceptsLinks[concept].length;
      });
      if (totalLength > 0) {
        return true;
      }
      return false;
    },
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
};
</script>

<style scoped lang="scss">
.admin-only-header {
  position: relative;
  a.btn {
    position: absolute;
    top: -5px;
    right: -5px;
    &:hover {
      color: $text-light !important;
    }
  }
}
.concepts-admin {
  min-width: 250px;
}
.concepts-scroll-container {
  max-height: 725px;
  overflow-y: auto;
  width: 100%;
}
</style>
