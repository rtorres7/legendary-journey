<template>
  <b-card-header :class="userRole ? 'user-card-title' : 'user-card-locked'"
    ><b-row
      >{{ roleName }}
      <div
        class="d-flex align-items-center ml-auto"
        :id="`${_temp_20.name}_btn_div`"
      >
        <DeleteButton
          v-if="userRole && canManageUserRoles"
          :_temp_1="`/admin/users/${user.id}/roles/${userRole.id}`"
          :label="roleName"
          type="_temp_20"
          :caller="this"
        />
        <b-button
          v-if="!userRole && canManageUserRoles"
          variant="link"
          @click="addRole"
        >
          Add <span class="sr-only">{{ roleName }} </span>_temp_20</b-button
        >
      </div>
    </b-row>
    <div :class="`user-card-body mt-3 mb-${userRole ? '2' : '5'}`">
      {{ _temp_20.description }}
    </div>
    <div class="user-card-subtitle" v-if="userRole">
      Granted By: {{ userRole.assigned_by }} on {{ grantDate }}
    </div>
    <div
      class="user-card-subtitle"
      v-if="_temp_20.subroles && _temp_20.subroles.length > 0"
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
    _temp_20: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapGetters("user", ["canManageUserRoles"]),
    userRole() {
      return find(this.user.roles, ["name", this._temp_20.name]);
    },
    roleName() {
      return this.properCase(this._temp_20.name);
    },
    grantDate() {
      return this.$moment(this.userRole.updated_at).format(
        "MMMM DD, YYYY HH:mm"
      );
    },
    subRoles() {
      return this._temp_20.subroles
        .map((subrole) => this.properCase(subrole))
        .join(", ");
    },
  },
  methods: {
    properCase(value) {
      return map(value.split("_"), capitalize).join(" ");
    },
    addRole() {
      this.$store.dispatch("users/addUserRole", {
        userRole: { user_id: this.user.id, name: this._temp_20.name },
        caller: this,
      });
    },
    deleted() {
      this.$wireNotification({
        title: "_temp_20 Deleted",
        duration: 5000,
        text: this.roleName + " removed",
        type: "success",
      });
      this.$emit("roleUpdated");
    },
    deletionFailed() {
      this.$wireNotification({
        title: "Removing User _temp_20 Failed",
        duration: 5000,
        text: "Failed to remove _temp_20 '" + this.roleName + "'",
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
