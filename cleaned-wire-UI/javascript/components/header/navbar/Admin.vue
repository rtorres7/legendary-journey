<template>
  <b-nav-item-dropdown
    id="nav-admin"
    right
    v-if="!loading && adminOptions.length > 0"
  >
    <template slot="button-content">
      <img
        :src="require('@assets/wrench-icon.svg')"
        class="wrench-icon"
        alt=""
      />
      <span class="sr-only">Admin drop down</span>
    </template>
    <template v-for="(adminLink, idx) in adminOptions">
      <b-dropdown-header v-if="adminLink.name === 'header'" :key="idx">
        {{ adminLink.header }}</b-dropdown-header
      >
      <b-dropdown-divider
        v-else-if="adminLink.name === 'divider'"
        :key="`divider_${idx}`"
      />
      <b-dropdown-item
        v-else
        :key="adminLink.name"
        :to="adminLink.link"
        :data-usage="adminLink.dataUsage"
      >
        <span>&nbsp;&nbsp; </span>
        {{ adminLink.name }}
      </b-dropdown-item>
    </template>
  </b-nav-item-dropdown>
</template>

<script>
import axios from "axios";

export default {
  name: "Admin",
  data() {
    return {
      loading: true,
      adminOptions: {},
    };
  },
  mounted() {
    this.loadAdminOptions();
    this.$bus.$on("reloadAdminOptions", () => {
      this.loadAdminOptions();
    });
  },
  methods: {
    loadAdminOptions() {
      axios.get("/admin_dropdowns?time=" + this.$moment()).then((response) => {
        this.adminOptions = response.data.admin_dropdowns;
        this.loading = false;
      });
    },
  },
};
</script>

<style scoped lang="scss">
#nav-admin {
  font-size: 1.125rem;
}
.wrench-icon {
  height: 24px;
  width: 24px;
  margin-top: -4px;
}
</style>
