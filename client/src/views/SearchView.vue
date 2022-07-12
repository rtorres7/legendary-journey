<template>
  <p
    class="
      font-semibold
      text-2xl
      py-4
      border-b-2 border-slate-900/10
      dark:border-slate-50/[0.06]
      energy:border-gray-700/25
    "
  >
    Search
  </p>
  <!-- Search Form -->
  <div class="py-4">
    <Disclosure v-slot="{ open }">
      <div class="flex flex-col justify-between">
        <div
          class="
            flex
            space-y-3
            lg:space-y-0 lg:space-x-6
            flex-col
            lg:flex-row
            w-full
          "
        >
          <div class="basis-2/5 max-w-[600px] lg:max-w-none">
            <label class="text-sm font-semibold line-clamp-1 xl:line-clamp-none"
              >Keyword Search or Filter
            </label>
            <input
              class="
                mt-1
                block
                w-full
                focus-visible:outline-none
                border-b
                bg-transparent
                border-b border-gray-300
                energy:text-gray-300
                border-b border-gray-300
              "
            />
          </div>
          <template
            v-for="n in [
              'Regions & Countries',
              'Issues & Topics',
              'Reporting & Product Types',
            ]"
            :key="n"
          >
            <div class="basis-1/5 max-w-[600px] lg:max-w-none">
              <label>
                <span
                  class="text-sm font-semibold line-clamp-1 xl:line-clamp-none"
                  >{{ n }}</span
                >
              </label>
              <SearchFormListbox :itemModel="testModel" :items="testItems" />
            </div>
          </template>
        </div>
        <DisclosureButton
          class="
            py-3
            lg:py-1
            max-w-fit
            hover:text-black
            dark:hover:text-white
            energy:hover:text-whit
          "
        >
          <span class="text-sm mr-2 inline-block">{{
            open ? "Less" : "More"
          }}</span>
          <ChevronUpIcon
            :class="open ? '' : 'rotate-180 transform'"
            class="h-5 w-5 inline-block"
          />
        </DisclosureButton>
      </div>
      <DisclosurePanel class="my-2">
        <div
          class="flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-6"
        >
          <div class="basis-2/5 flex space-x-6 max-w-[600px] lg:max-w-none">
            <div class="basis-1/2">
              <label class="text-sm font-semibold">Classifications</label>
              <SearchFormListbox :itemModel="testModel" :items="testItems" />
            </div>
            <div class="basis-1/2">
              <label class="text-sm font-semibold">Media Types</label>
              <SearchFormListbox :itemModel="testModel" :items="testItems" />
            </div>
          </div>
          <template
            v-for="n in [
              'Non State Actors',
              'Producing Offices',
              'Front Page Featured',
            ]"
            :key="n"
          >
            <div class="basis-1/5 max-w-[600px] lg:max-w-none">
              <label class="text-sm font-semibold">{{ n }}</label>
              <SearchFormListbox :itemModel="testModel" :items="testItems" />
            </div>
          </template>
        </div>
      </DisclosurePanel>
    </Disclosure>
  </div>
  <div>{{ results }}</div>
</template>

<script>
import { computed, ref, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronUpIcon } from "@heroicons/vue/outline";
import SearchFormListbox from "@/components/SearchFormListbox";

const testItems = [
  "test item 1",
  "test item 2",
  "test item 3",
  "test item 4",
  "test item 5",
];

export default {
  components: {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    ChevronUpIcon,
    SearchFormListbox,
  },
  setup() {
    const store = useStore();
    const route = useRoute();

    const results = computed(() => store.state.search.results);
    const testModel = ref(null);

    onMounted(() => {
      store.dispatch("search/search");
    });

    watch(
      () => route.query,
      () => {
        store.dispatch("search/search");
      }
    );

    return {
      testModel,
      testItems,
      results,
    };
  },
};
</script>

<style>
</style>
