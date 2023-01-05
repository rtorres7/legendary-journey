<template>
  <div
    v-if="!hasAcknowledged"
    id="system-message"
    class="bg-mission-blue dark:bg-dark-space-blue energy:bg-zinc-800 justify-center p-4 no-print"
  >
    <div
      class="flex items-center justify-center bg-slate-700/40 dark:bg-slate-700/30 energy:bg-zinc-700/40 rounded-lg p-4"
    >
      <p class="text-sm text-amber-300 dark:text-teal-400">
        {{ metadata.system_message }}
      </p>
      <a
        aria-label="Remove system message"
        class="ml-2 text-slate-300 energy:text-zinc-300 hover:text-white"
        @click="removeSystemMessage"
      >
        <XMarkIcon class="block cursor-pointer h-6 w-6" aria-hidden="true" />
      </a>
    </div>
  </div>
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
import { ref } from "vue";
import BannerNav from "@/components/BannerNav.vue";
import { metadata } from "@/config";
import { XMarkIcon } from "@heroicons/vue/24/outline";

export default {
  components: {
    BannerNav,
    XMarkIcon,
  },
  setup() {
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
