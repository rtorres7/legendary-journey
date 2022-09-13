<template>
  <div
    v-if="!hasAcknowledged"
    id="system-message"
    class="
      bg-mission-blue
      dark:bg-dark-space-blue
      energy:bg-zinc-800
      justify-center
      p-4
    "
  >
    <div
      class="
        flex
        items-center
        bg-slate-700/40
        dark:bg-slate-700/30
        energy:bg-zinc-700/40
        rounded-lg
        p-4
      "
    >
      <p class="text-sm text-amber-300 dark:text-teal-400">
        {{ metadata.system_message }}
      </p>
      <a
        aria-label="Remove system message"
        @click="removeSystemMessage"
        class="m-4 text-slate-300 energy:text-zinc-300 hover:text-white"
      >
        <XIcon class="block cursor-pointer h-6 w-6" aria-hidden="true" />
      </a>
    </div>
  </div>
  <div id="classification">
    <p
      class="
        text-slate-300
        bg-mission-blue
        dark:text-slate-300 dark:bg-dark-space-blue
        energy:text-zinc-300 energy:bg-zinc-800
        text-center text-sm
        uppercase
      "
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
import { XIcon } from "@heroicons/vue/outline";

export default {
  components: {
    BannerNav,
    XIcon,
  },
  setup() {
    const hasAcknowledged = ref(sessionStorage.getItem("acknowledged"));
    return {
      hasAcknowledged,
      metadata,
    };
  },
  methods: {
    removeSystemMessage() {
      document.querySelector("#system-message").remove();
      sessionStorage.setItem("acknowledged", true);
    },
  },
};
</script>
<style lang="scss">
/* Empty on Purpose */
</style>
