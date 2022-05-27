<template>
  <div class="mt-6 user-search">
    <div class="mt-6 standard-page-margin">
      <vanity-title :title="`User Details: ${user.name}`"></vanity-title>
      <div class="user-code-name">
        {{ user.dn }}
      </div>
    </div>

    <UserState :user="user" v-if="canManageUser || canManageUserRoles" />

    <b-container class="standard-page-margin mt-8">
      <b-row class="_temp_488-0 mr-auto" v-if="canManageUser || canManageUserRoles">
        <b-col cols="8" class="pb-8">
          <h2 class="info-title d-flex separator pb-2">Personal Info</h2>
          <div class="info-details">
            <label>Rank:</label> {{ user.rank }}<br />
            <label>Full Name:</label> {{ user.name }}<br />
            <label>Secure Phone:</label> {{ user.secure_phone }}<br />
            <label>Email:</label> {{ user.email }}<br />
            <label>Nationality:</label> {{ user.nationality }}<br />
            <label>ID:</label> {{ user.id }}<br />
            <label>Employee Type:</label> {{ user.employee_type }}<br />
            <label>Service Or Agency:</label> {{ user.service_or_agency }}<br />
            <label>Category:</label> {{ user.category }}<br />
          </div>
        </b-col>
        <b-col cols="8" class="_temp_488-6">
          <h2 class="info-title d-flex separator pb-2">Need-To-Know</h2>
          <div class="info-details">
            <label>Home Org:</label> {{ user.home_org_path }}<br />
            <label>NTK Lock:</label>
            {{ user.lock_state === "unlocked" ? "Unlocked" : "Locked" }}<br />
            <label>NTK Expired:</label> {{ yesOrNo(user.ntk_expired) }}<br />
            <label>NTK Requests:</label> {{ user.ntk_requests_count }}<br />
            <label>Pending or Approved Requests:</label>
            {{ yesOrNo(user.pending_or_approved_request) }}<br />
            <label>Expiration Exemption:</label>
            {{ yesOrNo(user.ntk_expiration_exemption) }}<br />
          </div>
        </b-col>
        <b-col cols="8" class="_temp_488-6">
          <h2 class="info-title d-flex separator pb-2">
            User Roles<b-button
              class="d-flex ml-auto"
              variant="secondary"
              v-if="canManageUserRoles"
              role="button"
              :to="`/admin/users/${userId}/roles`"
              >Manage Roles</b-button
            >
          </h2>
          <b-button
            variant="light"
            class="pill badge badge-pill mb-2 mr-2"
            v-for="role in user.roles"
            :key="role.id"
            :disabled="!canManageUserRoles"
            @click="removeRole(role)"
          >
            {{ titleCase(role.name) }}<span class="sr-only"> delete</span>
            <img
              :src="require('@assets/delete-icon.svg')"
              class="delete-icon mr-1"
              alt="remove"
              v-if="canManageUserRoles"
            />
          </b-button>
        </b-col>
        <b-col cols="8">
          <UserLockAndExemption />
        </b-col>
        <b-col cols="8" class="_temp_488-6">
          <h2 class="info-title d-flex separator mt-6 pb-2">Recent Activity</h2>
          <div class="info-details">
            <label>First Daily Login:</label>
            {{ formattedDate(user.first_daily_login) }}<br />
            <label>Last Login:</label> {{ formattedDate(user.last_login)
            }}<br />
            <label>Updated At:</label> {{ formattedDate(user.updated_at)
            }}<br />
            <label>Created At:</label> {{ formattedDate(user.created_at)
            }}<br />
            <label>Doc Views Today:</label> {{ user.total_uniq_docs_viewed
            }}<br />
          </div>
        </b-col>
        <b-col cols="8" class="_temp_488-6">
          <h2 class="info-title d-flex separator mt-6 pb-2">Subscriptions</h2>
          <div class="info-details">
            <label>Revisions Subscription:</label>
            {{ yesOrNo(user.revisions_subscriber) }}<br />
            <label>{{ this.name }} Subscriber:</label>
            {{ yesOrNo(user.wire_subscriber) }}<br />
          </div>
        </b-col>
      </b-row>
      <b-row v-else> You are not authorized to view the user's details. </b-row>
    </b-container>
  </div>
</template>

<script>
import Spinner from "../shared/Spinner";
import VanityTitle from "../vanity/VanityTitle";
import UserState from "./UserState";
import UserLockAndExemption from "./UserLockAndExemption";
import { mapState } from "vuex";
import { mapGetters } from "vuex";
import { capitalize, map } from "lodash";

export default {
  name: "UserDetails",
  components: {
    VanityTitle,
    Spinner,
    UserState,
    UserLockAndExemption,
  },

  mounted() {
    this.loadUser();
  },
  computed: {
    ...mapGetters("user", { currentUser: "user" }),
    ...mapGetters("users", ["loading"]),
    ...mapGetters("users", ["user"]),
    ...mapState("metadata", ["name"]),
    userId() {
      return this.$route.params.id;
    },
    canManageUser() {
      if (this.currentUser.roles) {
        return this.currentUser.roles.includes("user_support");
      }
      return false;
    },
    canManageUserRoles() {
      if (this.currentUser.roles) {
        return this.currentUser.roles.includes("role_manager");
      }
      return false;
    },
  },
  methods: {
    formattedDate(value) {
      if (value) {
        return this.$moment(value).format("MMMM DD, YYYY HH:mm");
      }
    },
    titleCase(role) {
      return map(role.split("_"), capitalize).join(" ");
    },
    yesOrNo(value) {
      return value ? "Yes" : "No";
    },
    loadUser() {
      if (this.canManageUser || this.canManageUserRoles) {
        this.$store.dispatch("users/loadUser", {
          userId: this.userId,
          caller: this,
        });
      }
    },
    removeRole(userRole) {
      if (this.canManageUserRoles) {
        this.$store.dispatch("users/removeUserRole", {
          userRole: userRole,
          caller: this,
        });
      }
    },
  },
  watch: {
    userId() {
      this.loadUser();
    },
    currentUser() {
      this.loadUser();
    },
  },
};
</script>

<style scoped lang="scss">
.user-search {
  padding-bottom: 6rem;
}
/deep/ .pill-row-icon {
  height: 14px;
  width: 14px;
}
/deep/ .reset-icon,
/deep/ .save-icon {
  width: 16px;
  height: 16px;
}
/deep/ .pill-button-text {
  margin-left: 4px;
  font-size: $font-size-1;
  color: $pri-800;
}
.user-code-name {
  padding-top: 2rem;
  padding-bottom: 2rem;
  color: $alt-800;
  font-size: $font-size-4;
  font-family: $font-family-heading;
}
.separator {
  border-bottom: 1px solid $alt-400;
  margin-bottom: 5px;
}
.info-title {
  font-family: $font-family-heading;
  font-size: $font-size-6;
  color: $pri-600;
  line-height: 1.5;
}
.info-details {
  font-size: $font-size-2;
  color: $pri-900;
}
label {
  color: $pri-600;
  margin-bottom: 0;
  font-style: normal;
}
.pill-group {
  border-right: 1px solid $alt-700;
}
.pill {
  font-size: $font-size-1;
}
/deep/ .pill-container:only-child {
  .badge-pill {
    min-width: 70px;
  }
}
/deep/ .badge-pill {
  border-color: $alt-700;
  .fa {
    margin-left: 1px;
  }
}
/deep/ .double-emphasis {
  font-weight: 500;
  font-style: italic;
}
/deep/ .btn-light:focus {
  box-shadow: 0 0 0 0.2rem $alt-500;
}
.delete-icon {
  height: 8px;
  width: 8px;
}
</style>
