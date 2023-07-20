<template>
  <div class="h-full">
    <WorkspaceNavigation>
      <router-view />
    </WorkspaceNavigation>
  </div>
</template>
<script>
import WorkspaceNavigation from "@/workspace/components/WorkspaceNavigation.vue";
export default {
  components: {
    WorkspaceNavigation,
  },
  setup() {},
};
</script>
<style lang="scss"></style>
