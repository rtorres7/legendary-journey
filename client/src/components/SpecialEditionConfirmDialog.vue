
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
              class="
                inline-block
                w-full
                min-w-fit
                max-w-xs
                p-6
                my-8
                text-left text-sm
                md:text-base
                align-middle
                transition-all
                transform
                text-slate-700
                dark:text-slate-300
                energy:text-zinc-300
                bg-slate-100
                dark:bg-slate-700
                energy:bg-zinc-700
                shadow-lg
                rounded-lg
              "
            >
              <div
                class="
                  pb-4
                  border-b border-slate-900/10
                  dark:border-slate-50/[0.06]
                  energy:border-zinc-500/50
                "
              >
                {{ header }}
              </div>
              <div class="py-4">{{ text }}</div>
              <div class="flex justify-end">
                <div class="flex space-x-3">
                  <BaseButton @click.prevent="close">{{
                    cancelText
                  }}</BaseButton>
                  <BaseButton @click.prevent="confirm">{{
                    confirmText
                  }}</BaseButton>
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

export default {
  components: {
    Dialog,
    DialogPanel,
    TransitionChild,
    TransitionRoot,
  },
  props: {
    isOpen: {
      type: Boolean,
    },
    header: {
      type: String,
      default: "Confirm Action",
    },
    text: {
      type: String,
      default: "Are you sure you want to do this?",
    },
    cancelText: {
      type: String,
      default: "Cancel",
    },
    confirmText: {
      type: String,
      default: "Ok",
    },
  },
  emits: ["close", "onConfirmAction"],
  setup(props, { emit }) {
    const confirm = () => {
      emit("onConfirmAction");
    };
    const close = () => {
      emit("close");
    };
    return {
      confirm,
      close,
    };
  },
};
</script>
<style lang="scss">
/* Empty on Purpose */
</style>
