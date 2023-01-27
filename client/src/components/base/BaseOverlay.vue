<template>
  <teleport to="body">
    <div v-if="show">
      <div class="fixed z-20 inset-0 overflow-y-auto">
        <div class="min-h-screen px-4 text-center">
          <div
            class="fixed inset-0 bg-black/20 dark:bg-black/25 energy:bg-black/25"
          />
          <span class="inline-block h-screen align-middle" aria-hidden="true">
            &ZeroWidthSpace;
          </span>
          <!-- TODO: This opacity hack is weird. HeadlessUI does something with Dialogs where this isn't needed-->
          <!-- TODO: Restrict scrolling -->
          <div
            class="inline-block w-full align-middle text-center text-slate-900 dark:text-slate-300 energy:text-zinc-300 opacity-[.99]"
          >
            <slot />
          </div>
        </div>
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
