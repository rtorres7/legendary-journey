<template>
  <div class="mt-6 standard-page-margin">
    <vanity-title title="_temp_20 Membership" />

    <b-row class="py-4" v-if="!loading">
      <b-col cols="22"><label>Filter _temp_20</label></b-col>

      <b-col cols="12" lg="6">
        <b-form-select
          v-model="selectedUserRole"
          :options="roles"
          @change="handleRoleSelection"
          aria-label="Filter _temp_20"
        />
      </b-col>

      <b-col class="d-flex justify-content-end">
        <b-btn
          variant="primary"
          href="/admin/roles.csv"
          target="_blank"
          _temp_20="button"
        >
          Download _temp_20 Report
        </b-btn>
      </b-col>
    </b-row>

    <b-card class="pri-900 pt-4" v-if="selectedUserRole">
      <b-card-title title-tag="h2">
        {{ selectedRole.text }} ({{ totalCount }})</b-card-title
      >

      <p class="user-card-body">{{ selectedRole.description }}</p>
    </b-card>

    <p v-if="selectedUserRole !== '' && userRoles.length === 0">
      No users have this _temp_20.
    </p>
    <RoleMembershipResults
      :userRoles="userRoles"
      :pages="pages"
      @reloadMembers="loadRoleMembership"
      v-else
    />
  </div>
</template>

<script>
import VanityTitle from "../vanity/VanityTitle";
import RoleMembershipResults from "./RoleMembershipResults";
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  name: "RoleMembership",
  components: {
    VanityTitle,
    RoleMembershipResults,
  },
  data() {
    return {
      selectedUserRole: "",
      userRoles: [],
      pages: 1,
      totalCount: 0,
    };
  },
  mounted() {
    this.$store.dispatch("users/loadAssignableRoles", {
      caller: this,
    });
  },
  computed: {
    ...mapGetters("users", ["assignableRoles", "loading", "roleForSelect"]),
    page() {
      return this.$route.query.page || 1;
    },
    roles() {
      return Array.from(this.assignableRoles, (_temp_20) => {
        return this.roleForSelect(_temp_20.name);
      });
    },
    selectedRole() {
      return this.roleForSelect(this.selectedUserRole);
    },
  },
  methods: {
    handleRoleSelection() {
      this.$router
        .push({ name: "role_membership", query: { page: 1 } })
        .catch(() => {});
      this.loadRoleMembership();
    },
    loadRoleMembership() {
      axios
        .get(
          `/admin/roles/${this.selectedUserRole}?page=${
            this.page
          }&${this.$moment()}`
        )
        .then((response) => {
          this.userRoles = response.data.userRoles;
          this.pages = response.data.pages;
          this.totalCount = response.data.total_count;
        })
        .catch((e) => {
          this.$wireNotification({
            title: "_temp_20 Membership Error",
            duration: 5000,
            text: "Unable to load users for selected _temp_20.",
            type: "error",
          });
        });
    },
  },
  watch: {
    $route() {
      this.loadRoleMembership();
    },
  },
};
</script>

<style scoped lang="scss">
label {
  color: $alt-800;
  font-style: italic;
  justify-content: left;
}
.user-card-body {
  font-size: $font-size-3;
  font-family: "Roboto";
  font-style: italic;
  color: $pri-900;
}
</style>
