<template>
  <component
    :is="isGrid ? 'div' : 'MaxCard'"
    :class="
      isGrid
        ? 'border-t-2 border-gray-200 dark:border-slate-50/[0.06] energy:border-zinc-700/50 mt-2'
        : ''
    "
  >
    <!-- Top Pagination -->
    <div
      class="flex items-center"
      :class="
        isGrid
          ? 'py-4'
          : 'py-3 px-4 border-b border-gray-200 dark:border-slate-50/[0.06] energy:border-zinc-700/50'
      "
    >
      <div class="flex-1 flex items-center justify-between">
        <div>
          <p class="text-sm">
            Showing
            <span class="font-medium">{{ startingResult(currentPage) }}</span>
            to
            <span class="font-medium">{{
              endingResult(currentPage, totalCount)
            }}</span>
            of
            <span class="font-medium">{{ totalCount }}</span>
            results
          </p>
        </div>
        <MaxPagination
          :totalCount="totalCount"
          :currentPage="currentPage"
          :maxPerPage="maxPerPage"
        />
      </div>
    </div>
    <!-- Items -->
    <template v-if="isGrid">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
        <template v-for="item in items" :key="item">
          <slot name="grid" :item="item" />
        </template>
      </div>
    </template>
    <template v-else>
      <ol>
        <template v-for="item in items" :key="item">
          <li
            class="border-b border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-50/[0.06] last:border-b-0"
          >
            <slot :item="item" />
          </li>
        </template>
      </ol>
    </template>
    <!-- Bottom Pagination -->
    <div
      class="flex items-center"
      :class="
        isGrid
          ? 'py-4'
          : 'px-4 py-3 border-t border-gray-200 dark:border-slate-50/[0.06] energy:border-zinc-700/50'
      "
    >
      <div class="flex-1 flex items-center justify-between">
        <div>
          <p class="text-sm">
            Showing
            <span class="font-medium">{{ startingResult(currentPage) }}</span>
            to
            <span class="font-medium">{{
              endingResult(currentPage, totalCount)
            }}</span>
            of
            <span class="font-medium">{{ totalCount }}</span>
            results
          </p>
        </div>
        <MaxPagination
          :totalCount="totalCount"
          :currentPage="currentPage"
          :maxPerPage="maxPerPage"
        />
      </div>
    </div>
  </component>
</template>
<script>
import { onMounted } from "vue";
export default {
  props: {
    items: {
      type: Array,
      required: true,
    },
    totalCount: {
      type: Number,
      required: true,
    },
    currentPage: {
      type: Number,
      required: true,
    },
    maxPerPage: {
      type: Number,
      default: 10,
    },
    isGrid: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { slots }) {
    onMounted(() => {
      if (props.isGrid && !slots.grid) {
        console.error(
          "Missing slot for Grid Table. Be sure to use the 'grid' named slot."
        );
      }
    });
    const startingResult = (page) => {
      return props.maxPerPage * (page - 1) + 1;
    };
    const endingResult = (page, total) => {
      return props.maxPerPage * page > total ? total : props.maxPerPage * page;
    };

    return {
      startingResult,
      endingResult,
    };
  },
};
</script>
<style scoped lang="scss"></style>
