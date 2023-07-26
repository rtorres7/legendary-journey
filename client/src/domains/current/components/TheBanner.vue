<template>
  <div id="classification_banner" class="no-print">
    <p
      class="text-slate-300 bg-mission-blue dark:text-slate-300 dark:bg-dark-space-blue energy:text-zinc-300 energy:bg-zinc-800 text-center text-xs uppercase"
    >
      {{ metadata.system_classification }}
    </p>
  </div>
  <BannerNav />
</template>

<script>
import { inject, ref } from "vue";
import BannerNav from "@current/components/BannerNav.vue";

export default {
  components: {
    BannerNav,
  },
  setup() {
    const metadata = inject("metadata");
    const hasAcknowledged = ref(sessionStorage.getItem("acknowledged"));

    const removeSystemMessage = () => {
      document.querySelector("#system-message").remove();
      sessionStorage.setItem("acknowledged", true);
    };

    return {
      hasAcknowledged,
      removeSystemMessage,
      metadata,
    };
  },
};
</script>
<style lang="scss">
/* Empty on Purpose */
</style>
