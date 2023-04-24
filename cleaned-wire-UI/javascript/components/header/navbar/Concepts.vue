<template>
  <b-nav-item-dropdown ref="dropdown" text="Special Editions" id="nav_concepts">
    <ConceptsInline :header="false" @createSpecialEdition="closeDropdown" />
  </b-nav-item-dropdown>
</template>

<script>
import { mapState } from "vuex";
import ConceptsInline from "./ConceptsInline";

export default {
  name: "Concepts",
  components: { ConceptsInline },
  methods: {
    closeDropdown() {
      this.$refs.dropdown.hide(true);
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
  }
}
.concepts-admin {
  min-width: 250px;
}
</style>
