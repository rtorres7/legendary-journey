<template>
  <div
    class="
      mt-1
      flex
      justify-center
      px-6
      pt-5
      pb-6
      border-2 border-gray-300 border-dashed
      rounded-md
    "
    @dragenter.prevent="toggleActive"
    @dragleave.prevent="toggleActive"
    @dragover.prevent
    @drop.prevent="toggleActive"
    :class="active ? 'bg-slate-200 dark:bg-slate-700 energy:bg-zinc-700' : ''"
  >
    <div class="space-y-2 text-center flex flex-col">
      <DocumentAddIcon class="h-10 w-10 text-gray-500 self-center" />
      <div class="flex">
        <label
          for="fileUpload"
          class="
            relative
            cursor-pointer
            focus-within:ring-2
            font-medium
            text-mission-blue
            dark:text-teal-300
            energy:text-energy-yellow
          "
        >
          <span>Upload a file</span>
          <input
            id="fileUpload"
            name="fileUpload"
            type="file"
            class="sr-only fileUpload"
            accept="application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          />
        </label>
        <p class="pl-1">or drag and drop</p>
      </div>
      <p class="text-sm">Word documents only</p>
    </div>
  </div>
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
