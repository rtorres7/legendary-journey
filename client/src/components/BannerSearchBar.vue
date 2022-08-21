<template>
  <div class="rounded-md pointer-events-auto">
    <div
      class="
        flex
        items-center
        pl-2
        pr-3
        m-auto
        lg:m-0
        rounded-md
        shadow-sm
        max-w-[500px]
        lg:max-w-none lg:w-[370px]
        xl:w-[400px]
        border border-slate-200
        dark:border-slate-700/80
        bg-transparent
        leading-6
        text-sm text-primary
        dark:text-slate-300
      "
    >
      <button type="button" tabindex="0" @click="onClickSearch">
        <span class="sr-only">Search</span>
        <SearchIcon
          class="
            w-5
            h-5
            text-slate-200
            dark:text-slate-500/90
            energy:text-gray-300
          "
          aria-hidden="true"
        />
      </button>
      <vue3-simple-typeahead
        class="
          ml-2
          focus-visible:outline-none
          bg-transparent
          w-full
          text-slate-200
          dark:text-gray-300
          energy:text-gray-300
        "
        id="typeahead_id"
        placeholder="Search (e.g. Zelensky, United Nations)"
        :items="searchMatches"
        :minInputLength="1"
        :itemProjection="itemProjectionFunction"
        @selectItem="selectItemEventHandler"
        @onInput="onInputEventHandler"
        @onFocus="onFocusEventHandler"
        @onBlur="onBlurEventHandler"
        @keyup.enter="onEnter"
      >
        <template #list-item-text="slot">
          <!-- <span
            class="text-black"
            v-html="slot.boldMatchText(slot.itemProjection(slot.item))"
          ></span> -->
          <div
            class="
              cursor-pointer
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
        </template>
      </vue3-simple-typeahead>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { SearchIcon } from "@heroicons/vue/outline";

let searchMatches = ["United Nations", "Zelensky"];

export default {
  components: {
    SearchIcon,
  },
  setup() {
    const router = useRouter();
    const modalActive = ref(false);

    const selectItemEventHandler = (item) => {
      //console.log("selected: ", item);
      router.push({
        name: "search",
        query: {
          text: item,
          view: "list",
        },
      });
    };

    // const onFocusEventHandler = (event) => {
    //   console.log("focus event: ", event);
    // };

    // const onInputEventHandler = (event) => {
    //   console.log("input event: ", event);
    // };

    // const onBlurEventHandler = (event) => {
    //   console.log("blur event: ", event);
    // };

    const onEnter = (e) => {
      router.push({
        name: "search",
        query: {
          text: e.target.value,
          view: "list",
        },
      });
    };

    const onClickSearch = () => {
      router.push({
        name: "search",
      });
    };

    return {
      //test,
      searchMatches,
      modalActive,
      selectItemEventHandler,
      onEnter,
      onClickSearch,
      // onInputEventHandler,
      // onFocusEventHandler,
      //onBlurEventHandler,
    };
  },
};
</script>
<style>
.simple-typeahead[data-v-0ccb6f26] {
  position: relative;
  width: 100%;
}
.simple-typeahead > input[data-v-0ccb6f26] {
  margin-bottom: 0;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
.simple-typeahead .simple-typeahead-list[data-v-0ccb6f26] {
  position: absolute;
  width: 100%;
  border: none;
  max-height: 400px;
  overflow-y: auto;
  z-index: 9;
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
