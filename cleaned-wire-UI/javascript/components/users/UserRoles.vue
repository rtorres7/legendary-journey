<template>
  <div class="mt-6 standard-page-margin user-roles">
    <vanity-title :title="pageTitle"></vanity-title>

    <b-row class="mt-6">
      <b-btn
        variant="secondary"
        ref="detailsButton"
        :to="{ name: 'userdetails', id: '3' }"
        role="button"
        >User Details
      </b-btn>
    </b-row>

    <b-row v-if="canManageUser">
      <div
        v-if="loading"
        class="d-flex justify-content-center align-items-center loading-area"
      >
        <spinner />
      </div>

      <b-row class="mt-6" v-else>
        <b-col
          v-for="(role, index) in assignableRoles"
          :key="role.name"
          :class="`pb-6 ${index % 2 == 0 ? 'pr' : '_temp_488'}-4`"
          cols="12"
        >
          <UserRole
            :role="role"
            :user="user"
            @roleUpdated="loadUserRoles(role)"
          />
        </b-col>
      </b-row>
    </b-row>
    <b-row v-else class="mt-6">
      You do not have access to view this page.
    </b-row>
  </div>
</template>

<script>
import Spinner from "../shared/Spinner";
import VanityTitle from "../vanity/VanityTitle";
import UserRole from "./UserRole";
import { mapGetters } from "vuex";

export default {
  name: "UserRoles",
  components: {
    VanityTitle,
    Spinner,
    UserRole,
  },
  data() {
    return {
      selected_role: "",
    };
  },
  mounted() {
    this.$refs.detailsButton.focus();
    this.loadUserRoles();
  },

  computed: {
    ...mapGetters("user", { currentUser: "user" }),
    ...mapGetters("users", ["loading"]),
    ...mapGetters("users", ["assignableRoles"]),
    ...mapGetters("users", ["user"]),
    userId() {
      return this.$route.params.id;
    },
    pageTitle() {
      return this.user.name
        ? `Manage Roles: ${this.user.name}`
        : "Manage Roles";
    },
    canManageUser() {
      if (this.currentUser.roles) {
        return (
          this.currentUser.roles.includes("role_manager") ||
          this.currentUser.roles.includes("user_support")
        );
      }
      return false;
    },
  },
  watch: {
    loading() {
      // keep focus on select role button
      if (!this.loading && this.selected_role !== "") {
        this.$nextTick(() => {
          document
            .querySelector(`#${this.selected_role}_btn_div button`)
            .focus();
        });
      }
    },
    currentUser() {
      this.loadUserRoles();
    },
  },
  methods: {
    loadUserRoles(role) {
      if (this.canManageUser) {
        this.$store.dispatch("users/loadUserRoles", {
          userId: this.userId,
          caller: this,
        });

        if (role) {
          this.selected_role = role.name;
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
.user-roles {
  min-width: 800px;
}
</style>
