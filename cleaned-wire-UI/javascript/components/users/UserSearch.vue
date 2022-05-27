<template>
  <div class="mt-6 standard-page-margin user-search">
    <vanity-title title="User Search"></vanity-title>
    <b-form @submit="onSubmit">
      <b-form-group>
        <b-row class="mt">
          <b-col cols="11">
            <label class="pt-6">Enter email, full name, or CN</label>
            <b-input
              v-model="user.name_parts"
              placeholder="e.g, 'doej@doe.ic.gov', 'John Doe', or 'CN=DOE JOHN J XYZZY,OU=SNL,OU=DOE,O=U.S. GOVERNMENT,C=US'"
              aria-label="User's email, full name, or CN"
              autofocus
            />
          </b-col>
        </b-row>
      </b-form-group>
      <b-btn variant="primary" type="submit" :disabled="!canManageUser"
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
    ...mapGetters("user", { currentUser: "user" }),
    canManageUser() {
      if (this.currentUser.roles) {
        return (
          this.currentUser.roles.includes("user_support") ||
          this.currentUser.roles.includes("role_manager")
        );
      }
      return false;
    },
  },
  mounted() {
    // if search criteria is present in url, run search
    if (!isEmpty(this.$route.query)) {
      this.findUsers();
    }
  },
  methods: {
    findUsers() {
      if (this.canManageUser) {
        // call store/backend
        this.$store.dispatch("users/findUsers", {
          user: this.user,
          route: this.$route,
          caller: this,
        });
      }
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
