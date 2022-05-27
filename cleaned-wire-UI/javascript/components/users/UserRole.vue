<template>
  <b-card-header :class="userRole ? 'user-card-title' : 'user-card-locked'"
    ><b-row
      >{{ roleName }}
      <div
        class="d-flex align-items-center ml-auto"
        :id="`${role.name}_btn_div`"
      >
        <DeleteButton
          v-if="userRole && canManageUserRoles"
          :url="`/admin/users/${user.id}/roles/${userRole.id}`"
          :label="roleName"
          type="role"
          :caller="this"
        />
        <b-button
          v-if="!userRole && canManageUserRoles"
          variant="link"
          @click="addRole"
        >
          Add <span class="sr-only">{{ roleName }} </span>Role</b-button
        >
      </div>
    </b-row>
    <div :class="`user-card-body mt-3 mb-${userRole ? '2' : '5'}`">
      {{ role.description }}
    </div>
    <div class="user-card-subtitle" v-if="userRole">
      Granted By: {{ userRole.assigned_by }} on {{ grantDate }}
    </div>
    <div
      class="user-card-subtitle"
      v-if="role.subroles && role.subroles.length > 0"
    >
      Grants these subroles: {{ subRoles }}
    </div>
  </b-card-header>
</template>

<script>
import DeleteButton from "../shared/DeleteButton";
import Spinner from "../shared/Spinner";
import { mapGetters } from "vuex";
import { capitalize, find, map } from "lodash";

export default {
  name: "UserRole",
  components: {
    DeleteButton,
    Spinner,
  },

  props: {
    user: {
      type: Object,
      required: true,
    },
    role: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapGetters("user", { currentUser: "user" }),
    userRole() {
      return find(this.user.roles, ["name", this.role.name]);
    },
    roleName() {
      return this.properCase(this.role.name);
    },
    grantDate() {
      return this.$moment(this.userRole.updated_at).format(
        "MMMM DD, YYYY HH:mm"
      );
    },
    subRoles() {
      return this.role.subroles
        .map((subrole) => this.properCase(subrole))
        .join(", ");
    },
    canManageUserRoles() {
      if (this.currentUser.roles) {
        return this.currentUser.roles.includes("role_manager");
      }
      return false;
    },
  },
  methods: {
    properCase(value) {
      return map(value.split("_"), capitalize).join(" ");
    },
    addRole() {
      this.$store.dispatch("users/addUserRole", {
        userRole: { user_id: this.user.id, name: this.role.name },
        caller: this,
      });
    },
    deleted() {
      this.$wireNotification({
        title: "Role Deleted",
        duration: 5000,
        text: this.roleName + " removed",
        type: "success",
      });
      this.$emit("roleUpdated");
    },
    deletionFailed() {
      this.$wireNotification({
        title: "Removing User Role Failed",
        duration: 5000,
        text: "Failed to remove role '" + this.roleName + "'",
        type: "error",
      });
      this.$emit("roleUpdated");
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
.user-card-title {
  color: $pri-600;
  font-size: $font-size-5;
  font-family: $heading-stylized;
  padding-top: 1rem;
  padding-bottom: 1rem;
  background-color: white;
  height: 100%;
  border: 1px solid $alt-500;
  border-radius: 0;
}
.user-card-locked {
  color: $pri-600;
  font-size: $font-size-5;
  font-family: $heading-stylized;
  padding-top: 1rem;
  padding-bottom: 1rem;
  background-color: $alt-300;
  height: 100%;
  border-radius: 0;
}
.user-card-body {
  font-size: $font-size-3;
  font-family: "Roboto";
  font-style: italic;
  color: $pri-900;
}
.user-card-subtitle {
  font-size: $font-size-2;
  font-family: "Roboto Condensed";
  color: $pri-600;
  text-transform: uppercase;
}
.reset-icon {
  height: 16px;
  width: 16px;
}
</style>
