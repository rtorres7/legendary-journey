<template>
      <div 
        class="
          mt-1 
          flex 
          justify-center 
          px-6 pt-5 pb-6 
          border-2 
          border-gray-300 
          border-dashed 
          rounded-md 
          
        "
        @dragenter.prevent="toggleActive"
        @dragleave.prevent="toggleActive"
        @dragover.prevent
        @drop.prevent="toggleActive"
        :class="
          //change this
          active
            ? 'bg-white dark:opacity-20 dark:text-white energy:opacity-60'
            : ''
        "
      >
        <div class="space-y-2 text-center flex flex-col">
          <DocumentAddIcon class = "h-10 w-10 text-gray-500 self-center" />
          <div class="flex =">
            <label for="file-upload" class="relative cursor-pointer font-medium text-mission-blue dark:text-teal-300 energy:text-energy-yellow">
              <span>Upload a file</span>
              <input id="file-upload" name="file-upload" type="file" class="sr-only" accept="application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document">
            </label>
            <p class="pl-1">or drag and drop</p>
          </div>
          <p class="text-sm">Only Word documents allowed</p>
        </div>
      </div>
  <!-- <div
    @dragenter.prevent="toggleActive"
    @dragleave.prevent="toggleActive"
    @dragover.prevent
    @drop.prevent="toggleActive"
    :class="
      active
        ? 'bg-white text-black dark:bg-teal-300 energy:bg-energy-yellow'
        : ''
    "
    class="
      w-full
      mt-2
      p-2
      flex
      justify-center
      items-center
      gap-4
      bg-slate-100
      hover:bg-slate-200/80
      dark:bg-slate-700 dark:hover:bg-slate-700/80
      energy:bg-gray-700 energy:hover:bg-gray-700/80
      border border-dashed border-slate-400
    "
  >
    <DocumentAddIcon class="h-5 w-5"/>
    <span class="text-sm line-clamp-1">Upload a file or drag and drop Only Word documents allowed</span>
    <slot />
  </div> -->
</template>

<script>
import { ref } from "vue";
import { DocumentAddIcon } from "@heroicons/vue/outline";

export default {
  components: {
    DocumentAddIcon,
  },
  setup() {
    const active = ref(false);

    const toggleActive = () => {
      active.value = !active.value;
    };

    return {
      active,
      toggleActive,
    };
  },
};
</script>

<style lang="scss">
</style>
