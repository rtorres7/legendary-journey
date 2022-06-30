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
      <div v-if="canAdmin" class="mr-5 ml-5 border-left concepts-admin">
        <div class="admin-only-header">
          <div class="heading-stylized font-size-4 ml-6 mt-5">Admin Only</div>
          <b-button
            size="sm"
            to="/special_editions/new"
            variant="outline-dark"
            @click.native="$emit('createSpecialEdition')"
            class="ml-auto"
          >
            Create
          </b-button>
        </div>
        <div class="ml-6 mt-3 mb-2 understated-title-text">Draft</div>
        <Concept
          v-for="(se_link, ind) in conceptsLinks.draft"
          :key="'draft_ind' + ind"
          :concept="se_link"
        >
        </Concept>

        <div class="ml-6 mt-6 mb-2 understated-title-text">Archived</div>
        <Concept
          v-for="(se_link, ind) in conceptsLinks.archived"
          :key="'archived_ind' + ind"
          :concept="se_link"
        >
        </Concept>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";
import Concept from "./concepts/Concept.vue";
import Spinner from "../../shared/Spinner";

export default {
  name: "Concepts",
  components: { Spinner, Concept },
  props: {
    header: {
      default: true,
    },
  },
  data() {
    return {
      canAdmin: false,
    };
  },
  computed: {
    ...mapState("concepts", ["conceptsLinks", "loading"]),
    ...mapState("user", ["admin"]),

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
    this.fetchAdmin();
    this.$store.dispatch("concepts/loadConceptsLinks", {
      caller: this,
    });
  },
  methods: {
    fetchAdmin() {
      axios
        .get(
          "/my_wire/permitted_to?permissions=manage&category=special_editions"
        )
        .then((response) => {
          this.canAdmin = response.data.allowed || false;
        })
        .catch((response) => {
          this.canAdmin = false;
        });
      this.canAdmin = false;
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
