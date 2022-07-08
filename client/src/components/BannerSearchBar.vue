<template>
  <div class="rounded-md pointer-events-auto">
    <div
      class="
        flex
        items-center
        pl-2
        pr-3
        rounded-md
        shadow-sm
        w-[400px]
        xl:w-[370px]
        bg-slate-100
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
      <vue3-simple-typeahead
        class="
          ml-2
          focus-visible:outline-none
          bg-slate-100
          dark:bg-slate-800
          energy:bg-gray-600
          w-full
          text-slate-800
          dark:text-gray-300
          energy:text-gray-300
        "
        id="typeahead_id"
        placeholder="Search"
        :items="[
          'One',
          'Two',
          'Three',
          'Four',
          'Five',
          'Six',
          'Seven',
          'Eight',
          'Nine',
          'Ten',
          'Eleven',
        ]"
        :minInputLength="1"
        :itemProjection="itemProjectionFunction"
        @selectItem="selectItemEventHandler"
        @onInput="onInputEventHandler"
        @onFocus="onFocusEventHandler"
        @onBlur="onBlurEventHandler"
      >
        <template #list-item-text="slot">
          <router-link :to="{ name: 'search' }">
            <div
              class="
                text-slate-800
                dark:text-gray-300
                energy:text-gray-300
                bg-slate-100
                dark:bg-slate-800
                energy:bg-gray-600
                hover:bg-slate-200
                dark:hover:bg-slate-700
                energy:hover:bg-gray-500
                active:bg-slate-300
                dark:active:bg-slate-600
                energy:active:bg-gray-400
                px-2
                py-1
              "
            >
              <span
                v-html="slot.boldMatchText(slot.itemProjection(slot.item))"
              ></span>
            </div>
          </router-link>
        </template>
      </vue3-simple-typeahead>
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
import BannerSearchBarModal from "@/components/BannerSearchBarModal.vue";
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
<style>
.simple-typeahead[data-v-590ce012] {
  position: relative;
  width: 100%;
}
.simple-typeahead > input[data-v-590ce012] {
  margin-bottom: 0;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
.simple-typeahead .simple-typeahead-list[data-v-590ce012] {
  position: absolute;
  width: 100%;
  border: none;
  max-height: 400px;
  overflow-y: auto;
  z-index: 9;
  box-shadow: 0 1px 3px 0 rgb(60 64 67 / 30%), 0 4px 8px 3px rgb(60 64 67 / 15%);
  border-width: 1px;
}
</style>
