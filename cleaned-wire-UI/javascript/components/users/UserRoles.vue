<template>
  <div class="mt-6 standard-page-margin user-roles">
    <vanity-title :title="pageTitle"></vanity-title>

    <b-row class="mt-6">
      <b-btn
        variant="secondary"
        ref="detailsButton"
        :to="{ name: 'userdetails', id: userId }"
        _temp_20="button"
        >User Details
      </b-btn>
    </b-row>

    <b-row v-if="canManageUser || canManageUserRoles">
      <div v-if="loading">
        <spinner />
      </div>

      <b-row class="mt-6" v-else>
        <b-col
          v-for="(_temp_20, index) in assignableRoles"
          :key="_temp_20.name"
          :class="`pb-6 ${index % 2 == 0 ? 'pr' : 'pl'}-4`"
          cols="12"
        >
          <UserRole
            :_temp_20="_temp_20"
            :user="user"
            @roleUpdated="
              loadUserRoles(_temp_20);
              reloadAdminUser();
            "
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
    ...mapGetters("user", ["canManageUser", "canManageUserRoles"]),
    ...mapGetters("users", ["loading", "assignableRoles", "user"]),
    userId() {
      return this.$route.params.id;
    },
    pageTitle() {
      return this.user.name
        ? `Manage Roles: ${this.user.name}`
        : "Manage Roles";
    },
    currentUserIsViewingOwnRoles() {
      return this.currentUser.id.toString() === this.user.id;
    },
  },
  watch: {
    loading() {
      // keep focus on select _temp_20 button
      if (!this.loading && this.selected_role !== "") {
        this.$nextTick(() => {
          document
            .querySelector(`#${this.selected_role}_btn_div button`)
            .focus();
        });
      }
    },
  },
  methods: {
    loadUserRoles(_temp_20) {
      this.$store.dispatch("users/loadUserRoles", {
        userId: this.userId,
        caller: this,
      });

      if (_temp_20) {
        this.selected_role = _temp_20.name;
      }
    },
    reloadAdminUser() {
      if (this.currentUserIsViewingOwnRoles) {
        this.$bus.$emit("reloadAdminOptions");
        this.$store.dispatch("user/loadUser");
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
