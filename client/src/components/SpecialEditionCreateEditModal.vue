
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
            <div class="fixed inset-0 bg-black/25" />
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
                min-w-[300px]
                sm:min-w-[400px]
                lg:min-w-[750px]
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
                {{ editMode ? "Edit" : "Create" }} Special Edition
                <button
                  type="button"
                  class="
                    absolute
                    top-5
                    right-5
                    w-8
                    h-8
                    flex
                    items-center
                    justify-center
                  "
                  tabindex="0"
                  @click="close"
                >
                  <span class="sr-only">Close navigation</span
                  ><XIcon class="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
              <form @submit.prevent="sendForm">
                <div class="flex mt-4">
                  <div class="basis-1/2">
                    <BaseInput
                      v-model="event.name"
                      label="Name"
                      autocomplete="off"
                      type="text"
                    />
                    <BaseInput
                      v-model="event.search_params"
                      label="Search params"
                      autocomplete="off"
                      type="text"
                    />
                  </div>
                  <div class="basis-1/2">
                    <BaseTextarea
                      maxlength="4000"
                      rows="4"
                      v-model="event.key_readings"
                      label="Selected Readings"
                    ></BaseTextarea>
                  </div>
                </div>
                <div class="flex justify-end">
                  <div class="flex space-x-3">
                    <BaseButton @click.prevent>Cancel</BaseButton>
                    <BaseButton type="submit">{{
                      editMode ? "Save" : "Create"
                    }}</BaseButton>
                  </div>
                </div>
              </form>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
//import { ref, watch, computed } from "vue";
import { ref } from "vue";
//import { useStore } from "vuex";
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XIcon } from "@heroicons/vue/outline";

export default {
  components: {
    Dialog,
    DialogPanel,
    TransitionChild,
    TransitionRoot,
    XIcon,
  },
  props: {
    isOpen: {
      type: Boolean,
    },
    editMode: {
      type: Boolean,
      default: false,
    },
    edition: {
      type: Object,
    },
  },
  emits: ["update:alert"],
  setup(props, { emit }) {
    // const store = useStore();

    const event = ref({
      icon: null,
      name: null,
      name_classification: null,
      search_params: null,
      state: null,
      position: 1,
      key_readings: "",
    });

    const close = () => {
      emit("close");
    };

    const sendForm = () => {
      console.log("sending form...! ", event.value);
    };

    return {
      event,
      close,
      sendForm,
    };
  },
};
</script>
<style lang="scss">
/* Empty on Purpose */
</style>
