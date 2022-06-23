<template>
  <div class="rounded-md pointer-events-auto">
    <div
      class="
        flex
        items-center
        py-1.5
        pl-2
        pr-3
        rounded-md
        shadow-sm
        w-[310px]
        xl:w-[400px]
        bg-slate-300
        dark:bg-slate-800
        energy:bg-gray-600
        leading-6
        text-sm text-primary
        dark:text-slate-300
      "
    >
      <SearchIcon
        class="w-6 h-6 text-slate-800 dark:text-slate-300 energy:text-gray-300"
        aria-hidden="true"
      />
      <input
        aria-label="Search field. Enter text to search."
        class="
          ml-2
          focus-visible:outline-none
          bg-slate-300
          dark:bg-slate-800
          energy:bg-gray-600
          w-full
          text-slate-800
          dark:text-gray-300
          energy:text-gray-300
        "
      />
      <button
        type="button"
        @click="toggleModal"
        class="ml-2 text-slate-800"
        aria-label="advanced search"
      >
        <ChevronDownIcon
          class="w-5 h-5 dark:text-slate-300 energy:text-gray-300"
        />
      </button>
      <BannerSearchBarModal :modalActive="modalActive" @close="toggleModal" />
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import BannerSearchBarModal from "./BannerSearchBarModal.vue";
import { SearchIcon, ChevronDownIcon } from "@heroicons/vue/outline";

export default {
  components: {
    BannerSearchBarModal,
    SearchIcon,
    ChevronDownIcon,
  },

  setup() {
    const modalActive = ref(false);

    const toggleModal = () => {
      modalActive.value = !modalActive.value;
    };

    return {
      modalActive,
      toggleModal,
    };
  },
};
</script>

<style lang="scss">
</style>
