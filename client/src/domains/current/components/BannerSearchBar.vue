<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    id="search-container"
    class="lg:absolute mx-3 lg:mx-auto lg:inset-x-0 flex items-center pointer-events-auto pl-3 max-w-[600px] rounded-md shadow-sm w-full border border-slate-400 dark:border-slate-700/80 energy:border-zinc-700/80 bg-transparent dark:bg-transparent energy:bg-zinc-900 leading-8 text-sm text-primary"
  >
    <vue3-simple-typeahead
      id="typeahead_id"
      ref="typeaheadRef"
      class="px-2 focus-visible:outline-none bg-transparent w-full text-slate-200 dark:text-slate-300 energy:text-zinc-300 placeholder-shown:truncate"
      aria-label="Search"
      placeholder="Search for keywords, documents, or pages"
      :items="searches"
      :min-input-length="1"
      :item-projection="
        (item) => {
          return item.text;
        }
      "
      :select-on-tab="false"
      @selectItem="selectItemEventHandler"
      @keydown.enter.prevent="onEnter"
    >
      <template #list-item-text="slot">
        <div
          class="bg-slate-100 dark:bg-slate-800 energy:bg-zinc-600 hover:bg-slate-200 dark:hover:bg-slate-700 energy:hover:bg-zinc-500 active:bg-slate-300 dark:active:bg-slate-600 energy:active:bg-zinc-400 px-2 py-1 flex justify-between"
          :class="
            slot.item.type === 'user'
              ? 'text-purple-800 dark:text-purple-300 energy:text-purple-300'
              : 'text-slate-800 dark:text-slate-300 energy:text-zinc-300'
          "
        >
          <span v-html="slot.boldMatchText(slot.itemProjection(slot.item))" />
          <template v-if="slot.item.type === 'user'">
            <button @click="deleteSearch(slot.item)">
              <XMarkIcon
                class="h-5 w-5 text-slate-800 dark:text-slate-300 energy:text-zinc-300"
                aria-hidden="true"
              />
            </button>
          </template>
        </div>
      </template>
    </vue3-simple-typeahead>
    <tippy content="Search">
      <button
        type="button"
        class="h-[2.5rem] px-3 rounded-r-md border-l border-slate-400 dark:border-slate-700/80 energy:border-zinc-700/80"
        tabindex="0"
        @click="onClickSearch"
      >
        <span class="sr-only">Search</span>
        <MagnifyingGlassIcon
          class="w-5 h-5 text-white dark:text-slate-300 energy:text-zinc-300"
          aria-hidden="true"
        />
      </button>
    </tippy>
  </div>
</template>

<script>
import { computed, inject, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/vue/24/outline";

let searchMatches = ["United Nations", "Zelensky"];

export default {
  components: {
    MagnifyingGlassIcon,
    XMarkIcon,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const metadata = inject("metadata");
    const typeaheadRef = ref(null);
    const removeSearch = ref(false);

    const searches = computed(() => store.state.savedSearches.searches);
    const loading = computed(() => store.state.savedSearches.loading);

    const lastSort = ref(localStorage.getItem("lastSort"));

    onMounted(() => {
      store.dispatch("savedSearches/getAllSearches");
    });

    watch(
      () => route.query,
      () => {
        if (route.name === "search") {
          typeaheadRef.value.input = route.query.text;
          if (route.query.sort_dir) {
            localStorage.setItem("lastSort", route.query.sort_dir);
          } else if (route.query.sort_field) {
            localStorage.setItem("lastSort", route.query.sort_field);
          }
        }
      }
    );

    const selectItemEventHandler = (item) => {
      console.log("selectItemEventHandler: ", item);
      if (removeSearch.value) {
        console.log("no routing");
        removeSearch.value = false;
      } else {
        router.push({
          name: "search",
          query: {
            text: item.text,
          },
        });
      }
    };

    // const onFocusEventHandler = (event) => {
    //   console.log("focus event: ", event);
    //   store.dispatch("savedSearches/getAllSearches");
    // };

    // const onInputEventHandler = (event) => {
    //   console.log("onInputEventHandler: ", event);
    // };

    // const onBlurEventHandler = (event) => {
    //   console.log("blur event: ", event);
    // };

    const onEnter = (e) => {
      store.dispatch("savedSearches/addSearch", {
        text: e.target.value,
        type: "user",
      });
      if (
        localStorage.getItem("lastSort") === "asc" ||
        localStorage.getItem("lastSort") === "desc"
      ) {
        router.push({
          name: "search",
          query: {
            text: e.target.value,
            per_page: 10,
            sort_dir: localStorage.getItem("lastSort"),
          },
        });
      } else if (localStorage.getItem("lastSort") === "score") {
        router.push({
          name: "search",
          query: {
            text: e.target.value,
            per_page: 10,
            sort_field: localStorage.getItem("lastSort"),
          },
        });
      } else {
        router.push({
          name: "search",
          query: {
            text: e.target.value,
            per_page: 10,
          },
        });
      }
    };

    const onClickSearch = () => {
      if (
        localStorage.getItem("lastSort") === "asc" ||
        localStorage.getItem("lastSort") === "desc"
      ) {
        router.push({
          name: "search",
          query: {
            text: typeaheadRef.value.input,
            per_page: 10,
            sort_dir: localStorage.getItem("lastSort"),
          },
        });
      } else if (localStorage.getItem("lastSort") === "score") {
        router.push({
          name: "search",
          query: {
            text: typeaheadRef.value.input,
            per_page: 10,
            sort_field: localStorage.getItem("lastSort"),
          },
        });
      } else {
        router.push({
          name: "search",
          query: {
            text: typeaheadRef.value.input,
            per_page: 10,
          },
        });
      }
    };

    const deleteSearch = (item) => {
      removeSearch.value = true;
      store.dispatch("savedSearches/deleteSearch", item);
    };

    return {
      typeaheadRef,
      metadata,
      searches,
      loading,
      searchMatches,
      selectItemEventHandler,
      onEnter,
      onClickSearch,
      deleteSearch,
      lastSort,
    };
  },
};
</script>
<style>
.simple-typeahead {
  position: relative;
  width: 100%;
}

.simple-typeahead > input {
  margin-bottom: 0;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}

.simple-typeahead .simple-typeahead-list {
  position: absolute;
  width: 100%;
  border: none;
  max-height: 400px;
  overflow-y: auto;
  z-index: 11;
  box-shadow: 0 1px 3px 0 rgb(60 64 67 / 30%), 0 4px 8px 3px rgb(60 64 67 / 15%);
  border-width: 1px;
}

/* .simple-typeahead[data-v-590ce012] {
  position: relative;
  width: 100%;
}
.simple-typeahead > input[data-v-590ce012] {
  margin-bottom: 0;
}
.simple-typeahead .simple-typeahead-list[data-v-590ce012] {
  position: absolute;
  width: 100%;
  border: none;
  max-height: 400px;
  overflow-y: auto;
  border-bottom: 0.1rem solid #d1d1d1;
  z-index: 9;
}
.simple-typeahead
  .simple-typeahead-list
  .simple-typeahead-list-header[data-v-590ce012] {
  background-color: #fafafa;
  padding: 0.6rem 1rem;
  border-bottom: 0.1rem solid #d1d1d1;
  border-left: 0.1rem solid #d1d1d1;
  border-right: 0.1rem solid #d1d1d1;
}
.simple-typeahead
  .simple-typeahead-list
  .simple-typeahead-list-footer[data-v-590ce012] {
  background-color: #fafafa;
  padding: 0.6rem 1rem;
  border-left: 0.1rem solid #d1d1d1;
  border-right: 0.1rem solid #d1d1d1;
}
.simple-typeahead
  .simple-typeahead-list
  .simple-typeahead-list-item[data-v-590ce012] {
  cursor: pointer;
  background-color: #fafafa;
  padding: 0.6rem 1rem;
  border-bottom: 0.1rem solid #d1d1d1;
  border-left: 0.1rem solid #d1d1d1;
  border-right: 0.1rem solid #d1d1d1;
}
.simple-typeahead
  .simple-typeahead-list
  .simple-typeahead-list-item[data-v-590ce012]:last-child {
  border-bottom: none;
}
.simple-typeahead
  .simple-typeahead-list
  .simple-typeahead-list-item.simple-typeahead-list-item-active[data-v-590ce012] {
  background-color: #e1e1e1;
} */
</style>
