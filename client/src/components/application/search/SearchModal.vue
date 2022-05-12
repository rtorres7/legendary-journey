<template>
  <TransitionRoot :show="modalActive" as="template">
    <Dialog 
      class="absolute my-auto inset-0 z-50"
      :open="modalActive">
      <TransitionChild 
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
        as="template"
      >      
        <DialogOverlay class="fixed inset-0 bg-black bg-opacity-50" />
      </TransitionChild>
      <TransitionChild
        enter="duration-300 ease-out"
        enter-from="opacity-0 scale-95"
        enter-to="opacity-100 scale-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100 scale-100"
        leave-to="opacity-0 scale-95"
        as="template"      
      >
        <div
          class="
            relative
            focus:outline-none
            p-4
            rounded-md
            shadow-xl
            ring-1 ring-black ring-opacity-5
            bg-mission-gray
            dark:bg-slate-700
            energy:bg-gray-700
            w-full
            mx-auto
            max-w-4xl
            mt-[10vh]            
            text-lg text-slate-700
            dark:ring-0 dark:highlight-white/5 dark:text-slate-300
            energy:text-gray-300"
        >
          <div class="flex items-center mb-5">
            <div>Advanced Search</div>
            <button
                  type="button"
                  class="
                    absolute
                    right-5
                  "
                  tabindex="0"
                  @click="close"
                >
                  <span class="sr-only">Close navigation</span
                  ><XIcon class="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div class="flex">
            <SearchIcon
              class="
                w-6
                h-6
                text-slate-800
                dark:text-slate-300
                energy:text-gray-300
              "
              aria-hidden="true"
            />
            <input
              class="
                inline-block
                focus-visible:outline-none
                ml-2
                mb-6
                border-b
                bg-transparent
                w-full
                text-slate-800
                dark:text-gray-300 border-b border-gray-300
                energy:text-gray-300 border-b border-gray-300
              "
            />
          </div>
          <div class="flex text-sm">
            <label class="inline-flex items-center">
              <input type="checkbox" class="ml-8" /> 
              <span class="ml-1">SITREPS</span>
            </label>
            <label class="inline-flex items-center">
              <input type="checkbox" class="ml-4" /> 
              <span class="ml-1">FININT</span>
            </label>
            <label class="inline-flex items-center">
              <input type="checkbox" class="ml-4" /> 
              <span class="ml-1">Articles</span>
            </label>
            <label class="inline-flex items-center">
              <input type="checkbox" class="ml-4" /> 
              <span class="ml-1">Threats</span>
            </label>
          </div>
        </div>
      </TransitionChild>
    </Dialog>
  </TransitionRoot>    
</template>

<script>
  import {
    Dialog,
    DialogOverlay,
    TransitionRoot,
    TransitionChild,
  } from "@headlessui/vue";

  import {
    SearchIcon,
    XIcon,
  } from "@heroicons/vue/outline"

  export default {
    components: {
      Dialog,
      DialogOverlay,
      TransitionRoot,
      TransitionChild,
      SearchIcon,
      XIcon,
    },

    props: ["modalActive"],

    setup(props, {emit}) {
      const close = () => {
        emit("close");
      };

      return {
        close,
      }
    },
  };
</script>

<style lang="scss" scoped>

</style>
