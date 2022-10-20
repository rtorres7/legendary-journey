<template>
  <Listbox v-model="selectedItem" :multiple="multiple" :disabled="disabled">
    <div class="relative mt-1">
      <ListboxLabel
        class="text-sm font-medium line-clamp-1 xl:line-clamp-none"
        >{{ label }}</ListboxLabel
      >
      <ListboxButton
        class="
          min-h-[2rem]
          flex
          relative
          w-full
          py-1
          px-2
          mt-1
          border border-gray-200
          dark:border-slate-800
          energy:border-zinc-800
          rounded-lg
          shadow-md
          cursor-default
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-opacity-75
          focus-visible:ring-offset-2
        "
        :class="
          disabled
            ? 'bg-slate-100/80 dark:bg-slate-800 energy:bg-zinc-700'
            : 'bg-white dark:bg-slate-700 energy:bg-zinc-600'
        "
      >
        <span class="block truncate max-w-[calc(100%-20px)]">{{
          multiple
            ? modelValue.length > 1
              ? `${modelValue[0].name} +(${modelValue.length - 1})`
              : modelValue.length === 1
              ? modelValue[0].name
              : ""
            : modelValue.name
        }}</span>
        <span class="absolute inset-y-0 right-0 flex items-center pr-2">
          <SelectorIcon class="h-5 w-5" aria-hidden="true" />
        </span>
      </ListboxButton>
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <ListboxOptions
          class="
            absolute
            w-full
            py-1
            mt-1
            overflow-auto
            bg-white
            dark:bg-slate-700
            energy:bg-zinc-600
            rounded-md
            shadow-lg
            max-h-60
            ring-1 ring-black ring-opacity-5
            focus:outline-none
            z-10
          "
        >
          <ListboxOption
            v-slot="{ active, selected }"
            v-for="item in items"
            :key="item"
            :value="item"
            as="template"
          >
            <li
              :class="[
                active
                  ? 'bg-slate-200/80 dark:bg-slate-600 energy:bg-zinc-600'
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
                  'block truncate text-sm',
                ]"
                >{{ item.name }}</span
              >
              <span
                v-if="selected"
                class="absolute inset-y-0 left-0 flex items-center pl-3"
              >
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>

<script>
import { computed } from "vue";
import {
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { CheckIcon, SelectorIcon } from "@heroicons/vue/outline";

export default {
  components: {
    Listbox,
    ListboxLabel,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    CheckIcon,
    SelectorIcon,
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
      type: [String, Array],
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    console.log("disabled: ", props);
    const selectedItem = computed({
      get: () => props.modelValue,
      set: (value) => {
        emit("update:modelValue", value);
      },
    });

    return {
      selectedItem,
    };
  },
};
</script>

<style lang="scss">
/* Empty on Purpose */
</style>
