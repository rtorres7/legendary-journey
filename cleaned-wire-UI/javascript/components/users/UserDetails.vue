<template>
  <div class="mt-6 user-search">
    <div class="mt-6 standard-page-margin">
      <vanity-title :title="`User Details: ${user.name}`"></vanity-title>
      <div class="user-code-name">
        {{ user.dn }}
      </div>
    </div>

    <UserState :user="user" v-if="canViewUserDetails" />

    <b-container class="standard-page-margin mt-8">
      <b-row class="pl-0" v-if="canViewUserDetails">
        <b-col cols="12" xl="8" class="pb-8">
          <h2 class="info-title d-flex separator pb-2">Personal Info</h2>
          <div class="info-details">
            <label>Rank:</label> {{ user.rank }}<br />
            <label>Full Name:</label> {{ user.name }}<br />
            <label>Secure _temp_36:</label> {{ user.secure_phone }}<br />
            <label>_temp_37:</label> {{ user._temp_37 }}<br />
            <label>Nationality:</label> {{ user.nationality }}<br />
            <label>ID:</label> {{ user.id }}<br />
            <label>Employee Type:</label> {{ user.employee_type }}<br />
            <label>Service Or Agency:</label> {{ user.service_or_agency }}<br />
            <label>Category:</label> {{ user.category }}<br />
          </div>
        </b-col>

        <b-col cols="12" xl="8" class="pl-6">
          <h2 class="info-title d-flex separator pb-2">
            Need-To-Know
            <b-btn
              v-if="hasUserSupportRole"
              variant="secondary"
              class="d-flex ml-auto"
              @click="fsdLookup(null, user.dn)"
              >FSD Lookup</b-btn
            >
          </h2>
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

        <b-col cols="12" xl="8" class="pl-6">
          <h2 class="info-title d-flex separator pb-2">
            User Roles<b-button
              class="d-flex ml-auto"
              variant="primary"
              v-if="canManageUserRoles"
              _temp_20="button"
              :to="`/admin/users/${userId}/roles`"
              >Manage Roles</b-button
            >
          </h2>
          <b-button
            variant="light"
            class="pill badge badge-pill mb-2 mr-2"
            v-for="_temp_20 in user.roles"
            :key="_temp_20.id"
            :disabled="!canManageUserRoles"
            @click="removeRole(_temp_20)"
          >
            {{ titleCase(_temp_20.name) }}<span class="sr-only"> delete</span>
            <img
              :src="require('@assets/delete-icon.svg')"
              class="delete-icon mr-1"
              alt="remove"
              v-if="canManageUserRoles"
            />
          </b-button>
        </b-col>

        <b-col cols="12" xl="8">
          <UserLockAndExemption />
        </b-col>

        <b-col cols="12" xl="8" class="pl-6">
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

        <b-col cols="12" xl="8" class="pl-6">
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
    ...mapGetters("user", ["canManageUser", "canManageUserRoles"]),
    ...mapGetters("users", ["loading", "user"]),
    ...mapState("metadata", ["name"]),
    userId() {
      return this.$route.params.id;
    },
    canViewUserDetails() {
      return this.canManageUser || this.canManageUserRoles;
    },
    hasUserSupportRole() {
      return this.canManageUser;
    },
  },
  methods: {
    fsdLookup(cert, cn) {
      this.$router.push({ name: "FSDTool", params: { cn: cn, cert: cert } });
    },
    formattedDate(value) {
      if (value) {
        return this.$moment(value).format("MMMM DD, YYYY HH:mm");
      }
    },
    titleCase(_temp_20) {
      return map(_temp_20.split("_"), capitalize).join(" ");
    },
    yesOrNo(value) {
      return value ? "Yes" : "No";
    },
    loadUser() {
      this.$store.dispatch("users/loadUser", {
        userId: this.userId,
        caller: this,
      });
    },
    removeRole(userRole) {
      if (this.canManageUserRoles) {
        this.$store
          .dispatch("users/removeUserRole", {
            userRole: userRole,
            caller: this,
          })
          .then(() => {
            if (this.currentUser.id === this.user.id) {
              setTimeout(
                function () {
                  this.$bus.$emit("reloadAdminOptions");
                  this.$store.dispatch("user/loadUser");
                }.bind(this),
                1000
              );
            }
          });
      }
    },
  },
  watch: {
    userId() {
      this.loadUser();
    },
  },
};
</script>

<style scoped lang="scss">
.user-search {
  padding-bottom: 6rem;
}
::v-deep .pill-row-icon {
  height: 14px;
  width: 14px;
}
::v-deep .reset-icon,
::v-deep .save-icon {
  width: 16px;
  height: 16px;
}
::v-deep .pill-button-text {
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
::v-deep .pill-container:only-child {
  .badge-pill {
    min-width: 70px;
  }
}
::v-deep .badge-pill {
  border-color: $alt-700;
  .fa {
    margin-left: 1px;
  }
}
::v-deep .double-emphasis {
  font-weight: 500;
  font-style: italic;
}
::v-deep .btn-light:focus {
  box-shadow: 0 0 0 0.2rem $alt-500;
}
.delete-icon {
  height: 8px;
  width: 8px;
}
</style>
