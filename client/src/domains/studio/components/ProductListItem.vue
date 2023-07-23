<template>
  <div
    class="relative h-full hover:bg-gray-50"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <div class="h-full px-6 flex grow flex-col justify-between">
      <div class="py-4">
        <p class="font-semibold line-clamp-1">
          <span class="text-gray-500">{{ product.classification }}</span>
          {{ product.title }}
        </p>
      </div>
      <div class="pb-4 flex space-x-2 font-medium text-xs">
        <div class="text-blue-700">
          {{ product.type }}
        </div>
        <div>•</div>
        <div class="text-gray-500">
          {{ product.date_posted }}
        </div>
      </div>
    </div>
    <template v-if="hover">
      <div
        class="absolute top-[-20px] right-[15px] flex justify-end text-gray-400"
      >
        <div
          class="flex space-x-2 p-1 bg-white rounded-md shadow-sm border border-gray-300"
        >
          <tippy content="Move Up" theme="studio">
            <button
              type="button"
              class="max-w-xs rounded-lg flex items-center p-1 focus:outline-none focus:ring-2 focus:ring-gray-400"
              :class="
                position === 'first'
                  ? 'cursor-not-allowed'
                  : 'hover:bg-gray-50 hover:text-gray-600'
              "
            >
              <span class="sr-only">Move Up</span>
              <ChevronUpIconSolid class="h-5 w-5" aria-hidden="true" />
            </button>
          </tippy>
          <tippy content="Move Down" theme="studio">
            <button
              class="max-w-xs rounded-lg flex items-center p-1 focus:outline-none focus:ring-2 focus:ring-gray-400"
              :class="
                position === 'last'
                  ? 'cursor-not-allowed'
                  : 'hover:bg-gray-50 hover:text-gray-600'
              "
            >
              <span class="sr-only">Move Down</span>
              <ChevronDownIconSolid class="h-5 w-5" />
            </button>
          </tippy>
          <tippy content="Remove" theme="studio">
            <button
              class="max-w-xs rounded-lg flex items-center hover:bg-gray-50 hover:text-gray-600 p-1 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <span class="sr-only">Remove</span>
              <TrashIcon class="h-5 w-5" />
            </button>
          </tippy>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import { ref } from "vue";
import { TrashIcon } from "@heroicons/vue/24/outline";
import {
  ChevronUpIcon as ChevronUpIconSolid,
  ChevronDownIcon as ChevronDownIconSolid,
} from "@heroicons/vue/24/solid";
export default {
  components: {
    ChevronDownIconSolid,
    ChevronUpIconSolid,
    TrashIcon,
  },
  props: {
    product: {
      type: Object,
      default: null,
    },
    position: {
      type: String,
      default: null,
    },
  },
  setup() {
    const hover = ref(false);

    return {
      hover,
    };
  },
};
</script>
<style lang="scss"></style>
