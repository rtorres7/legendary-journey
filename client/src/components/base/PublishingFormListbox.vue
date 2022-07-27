<template>
  <Listbox
    v-model="selectedItem"
    :id="id"
    :name="name"
    :value="modelValue"
  >
    <div class="relative">
      <ListboxButton
        :aria-label="name"
        class="
        min-h-[2rem]
        flex
        relative
        w-full
        py-1
        px-2
        text-left
        bg-white
        dark:bg-slate-700
        energy:bg-gray-700
        border-t border-t-gray-100
        dark:border-t-slate-800
        energy:border-t-gray-800
        rounded-lg
        shadow-md
        cursor-default
        focus:outline-none
        focus-visible:ring-2
        focus-visible:ring-opacity-75
        focus-visible:ring-offset-2
        "
      >
        <span class="block truncate pr-4">{{ modelValue }}</span>
        <span
          class="
            absolute
            inset-y-0
            right-0
            flex
            items-center
            pr-2
          "
        >
          <SelectorIcon
            class="h-5 w-5"
            aria-hidden="true"
          />
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
            energy:bg-gray-700
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
            class="capitalize px-2 py-1 cursor-pointer"
          >
            <li
              :class="[
                active
                  ? 'bg-slate-200/80 dark:bg-slate-600 energy:bg-gray-600'
                  : 'bg-none',
              ]"
            >
              <div class="flex">
                {{ item }}
                <CheckIcon v-show="selected" class="h-5 w-5 ml-2"/>
              </div>
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
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { CheckIcon, SelectorIcon } from "@heroicons/vue/outline";

export default {
  components: {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    CheckIcon,
    SelectorIcon,
  },
  props: {
    items: Array,
    id: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    modelValue: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
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
}
</script>

<style lang="scss"></style>
