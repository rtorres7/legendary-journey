<template>
  <Listbox v-model="selectedItem" :multiple="multiple" :disabled="disabled">
    <div class="relative">
      <ListboxLabel
        v-if="label"
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
      </ListboxLabel>
      <ListboxButton
        class="relative w-full min-h-[2.125rem] rounded-lg cursor-default pl-3 pr-10 text-left border border-gray-300 dark:border-slate-600 energy:border-zinc-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-offset-2"
        :class="[
          disabled
            ? 'bg-slate-100/80 dark:bg-slate-800 energy:bg-zinc-700'
            : 'bg-transparent',
          label ? 'mt-1' : '',
        ]"
      >
        <span
          class="block truncate max-w-[calc(100%-20px)]"
          :class="multiple ? '' : 'capitalize'"
          >{{ displayValue(modelValue) }}</span
        >
        <span class="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon class="h-5 w-5" aria-hidden="true" />
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
          class="absolute w-full py-1 mt-1 overflow-auto text-slate-900 dark:text-slate-300 energy:text-zinc-300 bg-white dark:bg-slate-700 energy:bg-zinc-600 rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none z-[5]"
        >
          <ListboxOption
            v-for="item in items"
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
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/24/outline";

export default {
  components: {
    Listbox,
    ListboxLabel,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
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

    return {
      selectedItem,
      displayValue,
    };
  },
};
</script>

<style lang="scss">
/* Empty on Purpose */
</style>
