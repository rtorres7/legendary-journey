export default {
  methods: {
    handleMissingFrontPage(e, requestedDate) {
      this.$wireNotification({
        group: "main",
        type: "error",
        duration: 7000,
        title: "Error loading WIRe",
        text: "Could not find a WIRe for " + requestedDate,
      });
      // TODO replace this page reload with proper navigation. this.$router.back() is preferred
      window.location.replace("/");
    },
  },
};
