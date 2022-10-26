<template>
  <span class="fa mr-3" :class="iconClass"></span>
</template>

<script>
export default {
  name: "AlertIcon",
  props: ["type"],

  computed: {
    iconClass() {
      var iconClasses = {
        error: "fa-ban",
        danger: "fa-ban",
        notice: "fa-info-circle",
        info: "fa-info-circle",
        warning: "fa-warning",
        announcement: "fa-bullhorn",
      };

      return iconClasses[this.type];
    },
  },
};
</script>
