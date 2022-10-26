<template>
  <div class="user-card d-flex">
    <User :user="userRole.user" :additionalDetails="assignedByDetails" />
    <div class="text-right ml-auto mt-4">
      <DeleteButton
        class="pl-2"
        v-if="canManageUserRoles"
        :_temp_1="`/admin/users/${userRole.user.id}/roles/${userRole._temp_20.id}`"
        :label="`${roleName} _temp_20 for ${userName}`"
        type="_temp_20"
        :caller="this"
      />
    </div>
  </div>
</template>

<script>
import DeleteButton from "@shared/DeleteButton";
import User from "../users/User";
import { mapGetters } from "vuex";

export default {
  name: "RoleMember",
  components: {
    DeleteButton,
    User,
  },
  props: {
    userRole: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapGetters("user", ["canManageUserRoles"]),
    ...mapGetters("users", ["roleForSelect"]),
    assignedByDetails() {
      let assignedAt = this.$moment(this.userRole._temp_20.updated_at).format(
        "MMMM DD, YYYY HH:mm"
      );
      return `| Granted by: ${this.userRole.assignedBy} on ${assignedAt}`;
    },
    roleName() {
      return this.roleForSelect(this.userRole._temp_20.name).text;
    },
    userName() {
      return this.userRole.user.full_name;
    },
  },
  methods: {
    deleted() {
      this.$wireNotification({
        title: "_temp_20 Deleted",
        duration: 5000,
        text: `${this.roleName} _temp_20 removed for ${this.userName}`,
        type: "success",
      });
      this.$emit("roleUpdated");
    },
    deletionFailed() {
      this.$wireNotification({
        title: "Removing User _temp_20 Failed",
        duration: 5000,
        text: `Failed to remove ${this.roleName} _temp_20 for ${this.userName}`,
        type: "error",
      });
      this.$emit("roleUpdated");
    },
  },
};
</script>

<style scoped lang="scss">
.card {
  border: unset !important;
  box-shadow: none;
  &:hover,
  &.focused {
    box-shadow: none;
  }
}

.user-card-title {
  border: none !important;
}
.user-card {
  border-top: solid 1px $alt-500;
  &:hover,
  &.focused {
    box-shadow: 0 5px 2px rgba(129, 103, 103, 0.25);
  }
}
</style>
