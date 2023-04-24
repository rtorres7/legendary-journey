<template>
  <div class="mt-6 standard-page-margin user-search">
    <vanity-title title="User Accounts"></vanity-title>
    <b-form @submit="onSubmit">
      <b-form-group>
        <b-row class="mt">
          <b-col cols="11">
            <label class="pt-6">Enter _temp_37, full name, or CN</label>
            <b-input
              v-model="user.name_parts"
              placeholder="e.g, 'doej@doe._temp_0', 'John Doe', or 'CN=DOE JOHN J XYZZY,OU=SNL,OU=DOE,O=U.S. GOVERNMENT,C=US'"
              aria-label="User's _temp_37, full name, or CN"
              autofocus
            />
          </b-col>
        </b-row>
      </b-form-group>
      <b-btn variant="primary" type="submit" :disabled="!canSearchForUser"
        >Search
      </b-btn>
    </b-form>
    <UserSearchResults @findUsers="findUsers()" />
    <TopTen v-if="canManageUser" />
  </div>
</template>

<script>
import TopTen from "../users/TopTen";
import UserSearchResults from "../users/UserSearchResults";
import VanityTitle from "../vanity/VanityTitle";
import { mapGetters } from "vuex";
import { isEmpty } from "lodash";

export default {
  name: "UserSearch",
  components: {
    VanityTitle,
    TopTen,
    UserSearchResults,
  },
  data() {
    return {
      user: {
        name_parts: "",
      },
    };
  },
  computed: {
    ...mapGetters("user", ["canManageUser", "canManageUserRoles"]),
    canSearchForUser() {
      return this.canManageUser || this.canManageUserRoles;
    },
  },
  mounted() {
    // if search criteria is present in _temp_1, run search
    if (!isEmpty(this.$route.query)) {
      this.findUsers();
    }
  },
  methods: {
    findUsers() {
      this.$store.dispatch("users/findUsers", {
        user: this.user,
        route: this.$route,
        caller: this,
      });
    },
    onSubmit(evt) {
      evt.preventDefault();
      let query = {
        name_parts: this.user.name_parts,
      };
      this.$router.push({ name: "usersearch", query: query });
      this.findUsers();
    },
  },
};
</script>

<style scoped lang="scss">
.user-search {
  padding-bottom: 6rem;
  min-width: 800px;
}
label {
  color: $alt-800;
  font-style: italic;
  justify-content: left;
}
</style>
