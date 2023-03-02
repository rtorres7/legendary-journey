<template>
  <Combobox
    v-model="selectedItem"
    :multiple="multiple"
    :disabled="disabled"
    as="div"
  >
    <ComboboxLabel
      :class="[
        'text-sm font-medium',
        required ? 'inline-flex' : 'line-clamp-1 xl:line-clamp-none',
      ]"
    >
      {{ label }}
      <template v-if="required">
        <span class="sr-only">Required</span>
        <span class="pl-1 text-red-500">*</span>
      </template>
    </ComboboxLabel>
    <div class="relative">
      <span
        ref="displayEl"
        :class="['absolute truncate max-w-[calc(100%-20px)] px-2 mt-1']"
        >{{ displayValue(modelValue) }}</span
      >
      <ComboboxInput
        ref="inputEl"
        class="flex relative w-full rounded-lg cursor-default py-1 px-2 mt-1 border border-gray-300 dark:border-slate-600 energy:border-zinc-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-offset-2"
        :class="
          disabled
            ? 'bg-slate-100/80 dark:bg-slate-800 energy:bg-zinc-700'
            : 'bg-transparent'
        "
        @change="query = $event.target.value"
        @input="hideDisplayValue()"
        @focusout="showDisplayValue()"
      >
      </ComboboxInput>
      <ComboboxButton class="absolute inset-y-0 right-0 flex items-center pr-2">
        <ChevronUpDownIcon class="h-5 w-5" aria-hidden="true" />
      </ComboboxButton>
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
        @after-leave="query = ''"
      >
        <ComboboxOptions
          class="absolute py-1 mt-1 w-full overflow-auto text-slate-900 dark:text-slate-300 energy:text-zinc-300 bg-white dark:bg-slate-700 energy:bg-zinc-600 rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none z-[5]"
        >
          <div
            v-if="filteredItems.length === 0 && query !== ''"
            class="relative cursor-default select-none py-2 px-4 text-sm"
          >
            Nothing found.
          </div>
          <ComboboxOption
            v-for="item in filteredItems"
            v-slot="{ active, selected }"
            :key="item"
            :value="item"
            as="template"
          >
            <li
              :class="[
                active
                  ? 'bg-slate-200/80 dark:bg-slate-600 energy:bg-zinc-700'
                  : 'bg-none',
                'relative cursor-default select-none py-2 pl-10 pr-4',
              ]"
            >
              <span
                :class="[
                  selected
                    ? 'font-medium'
                    : item.subitem
                    ? 'font-light'
                    : 'font-normal',
                  item.subitem ? 'pl-2' : '',
                  multiple ? '' : 'capitalize',
                  'block truncate text-sm',
                ]"
                >{{ displayValue(item) }}</span
              >
              <span
                v-if="selected"
                class="absolute inset-y-0 left-0 flex items-center pl-3"
              >
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </transition>
    </div>
  </Combobox>
</template>

<script>
import { computed, ref } from "vue";
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  ComboboxLabel,
  ComboboxButton,
} from "@headlessui/vue";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/24/outline";

export default {
  components: {
    Combobox,
    ComboboxInput,
    ComboboxOptions,
    ComboboxOption,
    ComboboxLabel,
    ComboboxButton,
    CheckIcon,
    ChevronUpDownIcon,
  },
  props: {
    label: {
      type: String,
      default: "",
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      required: true,
    },
    modelValue: {
      type: [Object, String, Number, Array],
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "clicked"],
  setup(props, { emit }) {
    const displayEl = ref(null);
    const inputEl = ref(null);

    const selectedItem = computed({
      get: () => props.modelValue,
      set: (value) => {
        emit("update:modelValue", value);
      },
    });

    const displayValue = (model) => {
      if (model) {
        const type = typeof model;
        if (props.multiple && model.length > 0) {
          const suffix = model.length > 1 ? ` +(${model.length - 1})` : "";
          if (type === "object") {
            return model[0].name + suffix;
          } else {
            return model + suffix;
          }
        } else {
          if (type === "object") {
            return model.name;
          } else {
            return model;
          }
        }
      } else {
        return null;
      }
    };

    const query = ref("");

    //TODO: Attempted to implement sorting the selected items at the top. This presented a new bug
    // where sorted items was triggering a refresh due to repositioning the countries_bool in the URL.
    // The bug could reside in SearchView but further investigation is needed.
    // Update: The behavior is definetly unique to countries/regions and also exists when using
    // MaxListbox, however, it is still odd that a refresh is triggered by simply clicking the selector icon.

    // const hasSelectedItem = (item) => {
    //   return selectedItem.value.find((selected) => selected.name === item.name);
    // };

    // const compareSelected = (a, b) => {
    //   if (hasSelectedItem(a) && !hasSelectedItem(b)) {
    //     return -1;
    //   }
    //   if (!hasSelectedItem(a) && hasSelectedItem(b)) {
    //     return 1;
    //   }
    //   return 0;
    // };

    // const sortBySelected = (items) => {
    //   return items.sort(compareSelected);
    // };

    const filteredItems = computed(() => {
      return query.value === ""
        ? props.items
        : props.items.filter((item) => {
            return item.name.toLowerCase().includes(query.value.toLowerCase());
          });
    });

    const hideDisplayValue = () => {
      if (!displayEl.value.classList.contains("hidden")) {
        displayEl.value.classList.add("hidden");
      }
    };

    const showDisplayValue = () => {
      if (displayEl.value.classList.contains("hidden")) {
        displayEl.value.classList.remove("hidden");
      }
    };

    return {
      displayEl,
      inputEl,
      selectedItem,
      displayValue,
      query,
      filteredItems,
      hideDisplayValue,
      showDisplayValue,
    };
  },
};
</script>
<style lang="scss">
/* Empty on Purpose */
</style>
