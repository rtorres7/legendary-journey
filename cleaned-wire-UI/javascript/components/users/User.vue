<template>
  <b-card-header :class="`card ${cardTitleStyle}`" @click="goToUserDetails">
    <router-link :to="{ name: 'userdetails', params: { id: user.id } }">
      {{ user.full_name
      }}<span class="user-card-details">
        ({{ agencyOrg }})
        <span class="user-card-subtitle pl-4"
          ><span class="fa fa-envelope pr-2" /> {{ user._temp_37 }}</span
        ></span
      >

      <div class="user-card-body mt-3 mb-2">
        Last Login: {{ lastLogin }} {{ additionalDetails }}
      </div>
      <div class="user-card-subtitle">
        {{ user.dn }}
      </div>
    </router-link>
  </b-card-header>
</template>

<script>
export default {
  name: "User",

  props: {
    user: {
      type: Object,
      required: true,
    },
    topTen: {
      type: Boolean,
      default: false,
    },
    additionalDetails: {
      type: String,
      required: false,
    },
  },
  computed: {
    agencyOrg() {
      let org =
        this.user.organization !== null && this.user.organization !== undefined
          ? this.user.organization
          : "";
      let agency =
        this.user.service_or_agency !== null &&
        this.user.service_or_agency !== undefined
          ? this.user.service_or_agency
          : "";
      let separator = agency && org ? " / " : "";
      return `${agency} ${separator} ${org}`.trim();
    },
    cardTitleStyle() {
      return this.topTen ? "ten-card-title" : "user-card-title";
    },
    lastLogin() {
      if (this.user.last_login) {
        return this.$moment(this.user.last_login).format("MMMM DD, YYYY HH:mm");
      }
    },
  },
  methods: {
    goToUserDetails() {
      this.$router
        .push({ name: "userdetails", params: { id: this.user.id } })
        .catch(() => {});
    },
  },
};
</script>

<style scoped lang="scss">
.user-card-details {
  color: $pri-600;
  font-size: $font-size-4;
  font-family: $font-family-heading;
}
/* Default Title with white background */
.user-card-title {
  color: $pri-600;
  font-size: $font-size-5;
  font-family: $heading-stylized;
  padding-top: 1rem;
  padding-bottom: 1rem;
  background-color: white;
  border: 1px solid $alt-400;
  border-radius: 0;
  cursor: pointer;
}
/* Title with blue background */
.ten-card-title {
  color: $pri-600;
  font-size: $font-size-5;
  font-family: $heading-stylized;
  padding-top: 1rem;
  padding-bottom: 1rem;
  background-color: $pri-100;
  border: 1px solid $pri-300;
  border-radius: 0;
  cursor: pointer;
}
.user-card-body {
  font-size: $font-size-2;
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
.card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid $alt-400;
  box-shadow: 0 3px 1px rgba(0, 0, 0, 0.1);
  border-radius: unset;
  &:hover,
  &.focused {
    box-shadow: 0 5px 2px rgba(129, 103, 103, 0.25);
  }
}
a:hover,
a:focus,
a:active {
  text-decoration: none !important;
}
</style>
