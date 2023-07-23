<template>
  <div>
    <div class="flex space-x-1 justify-center xl:justify-start text-2xl py-8">
      <div class="text-gray-700 font-bold uppercase tracking-wider">
        Current
      </div>
      <div class="text-gray-500 font-medium">Issue</div>
    </div>
    <div>
      <LiveIssueCard :issue="issues[0]" />
      <div class="py-8 flex justify-center xl:justify-between items-center">
        <div class="text-2xl font-bold text-gray-700">Coming Soon</div>
        <router-link
          class="hidden xl:block text-gray-500 hover:text-gray-700 text-sm font-medium"
          to="/studio/issues"
        >
          See All
        </router-link>
      </div>
      <div
        class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center"
      >
        <IssueCard :issue="issues[1]" />
        <IssueCard :issue="issues[2]" />
        <IssueCard :issue="issues[3]" class="hidden xl:flex" />
      </div>
      <router-link
        class="block xl:hidden text-end py-8 text-gray-500 hover:text-gray-700 text-sm font-medium"
        to="/studio/issues"
      >
        See All
      </router-link>
    </div>
  </div>
</template>
<script>
import { issues } from "@/studio/data";
import IssueCard from "@/studio/components/IssueCard.vue";
import LiveIssueCard from "@/studio/components/LiveIssueCard.vue";
export default {
  components: {
    IssueCard,
    LiveIssueCard,
  },
  setup() {
    return {
      issues,
    };
  },
};
</script>
<style lang="scss"></style>
