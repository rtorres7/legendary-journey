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
        alt="admin tools"
      />
      <span class="sr-only">Admin drop down</span>
    </template>
    <template v-for="adminLink in adminOptions">
      <b-dropdown-divider v-if="adminLink.name === 'divider'" />
      <b-dropdown-item
        v-else
        :key="adminLink.name"
        :to="adminLink.link"
        :data-usage="adminLink.dataUsage"
      >
        {{ adminLink.name }}
      </b-dropdown-item>
    </template>
  </b-nav-item-dropdown>
</template>

<script>
import axios from "axios";
import WireEdit from "./WireEdit";

export default {
  name: "Admin",
  components: { WireEdit },
  data() {
    return {
      loading: true,
      adminOptions: {},
    };
  },
  mounted() {
    axios.get("/admin_dropdowns").then((response) => {
      this.adminOptions = response.data.admin_dropdowns;
      this.loading = false;
    });
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
