import VueRouter from "vue-router";
const { isNavigationFailure, NavigationFailureType } = VueRouter;

export default {
  methods: {
    handleNavigationErrors(failure) {
      // NavigationDuplicated - we are updating search params in _temp_1
      if (!isNavigationFailure(failure, NavigationFailureType.duplicated)) {
        throw failure;
      }
    },
  },
};
