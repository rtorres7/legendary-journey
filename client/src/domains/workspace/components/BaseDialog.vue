<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="close">
      <div class="fixed inset-0 z-20 overflow-y-auto w-full">
        <div class="min-h-screen px-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black/30" />
          </TransitionChild>
          <span class="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="inline-block w-full p-6 text-left align-middle transition-all transform text-slate-900 dark:text-slate-300 energy:text-zinc-300 bg-white dark:bg-slate-800 energy:bg-zinc-800 shadow-lg rounded-lg"
              v-bind="$attrs"
            >
              <div
                class="border-b border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-500/50"
                :class="title ? 'pb-4 text-lg' : 'pb-10'"
              >
                {{ title }}
                <button
                  type="button"
                  class="absolute top-5 right-5 w-8 h-8 flex items-center justify-center"
                  tabindex="0"
                  @click="close"
                >
                  <span class="sr-only">Close navigation</span
                  ><XMarkIcon class="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <div class="py-4">
                <slot />
              </div>
              <div
                class="flex justify-end pt-4 border-t border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-500/50"
              >
                <div class="flex space-x-3">
                  <slot name="actions">
                    <BaseButton color="secondary" @click.prevent="close"
                      >Close</BaseButton
                    >
                  </slot>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XMarkIcon } from "@heroicons/vue/24/outline";
import BaseButton from "./BaseButton.vue";
export default {
  components: {
    Dialog,
    DialogPanel,
    TransitionChild,
    TransitionRoot,
    XMarkIcon,
    BaseButton,
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
  },
  emits: ["close"],
  setup(props, { emit }) {
    const close = () => {
      emit("close");
    };
    return {
      close,
    };
  },
};
</script>
<style lang="scss">
/* Empty on Purpose */
</style>
