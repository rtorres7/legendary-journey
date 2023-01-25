<template>
  <teleport to="body">
    <div
      v-if="show"
      ref="overlay-backdrop"
      class="fixed z-10 inset-0 overflow-y-auto bg-black/25"
    >
      <span class="inline-block h-screen align-middle" aria-hidden="true"
        >&ZeroWidthSpace;</span
      >
      <div
        class="inline-block w-full align-middle text-center text-mission-blue dark:text-slate-300 energy:text-zinc-300"
      >
        <slot />
      </div>
    </div>
  </teleport>
</template>
<script>
import { Teleport } from "vue";

export default {
  components: { Teleport },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
