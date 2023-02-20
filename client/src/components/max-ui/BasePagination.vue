<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <nav
    class="hidden md:block rounded-md shadow-sm border border-slate-300 dark:border-slate-600 energy:border-zinc-600"
    aria-label="Pagination Navigation"
  >
    <ol class="inline-flex -space-x-px text-sm">
      <li
        class="z-[5] hover:z-0 border-r border-slate-900/10 dark:border-slate-600 energy:border-zinc-600"
      >
        <div
          :class="[
            'h-full inline-flex rounded-l-md items-center px-4 py-2',
            isDisabled('previous')
              ? 'disabled cursor-not-allowed'
              : 'hoverable',
          ]"
          role="button"
          :aria-disabled="isDisabled('previous') ? true : null"
          :disabled="isDisabled('previous') ? true : null"
          @click="isDisabled('previous') ? null : navigatePrevious(currentPage)"
        >
          <span class="sr-only">Previous</span>
          <ChevronLeftIcon class="h-5 w-5" />
        </div>
      </li>
      <template
        v-for="n in buildPageButtons(currentPage, totalPages(totalCount))"
        :key="n"
      >
        <li
          class="z-[5] hover:z-0 border-r border-slate-900/10 dark:border-slate-600 energy:border-zinc-600"
        >
          <div
            :class="[
              'h-full px-4 py-2',
              n === currentPage
                ? 'selected'
                : isDisabled(n)
                ? 'disabled'
                : 'hoverable',
            ]"
            :aria-current="n === currentPage ? `Current Page, Page ${n}` : null"
            :aria-label="`Page ${n}`"
            :role="isDisabled(n) ? null : 'button'"
            @click="isDisabled(n) ? null : navigatePage(n)"
          >
            {{ n }}
          </div>
        </li>
      </template>
      <li class="z-[5] hover:z-0">
        <div
          :class="[
            'h-full inline-flex items-center rounded-r-md px-4 py-2',
            isDisabled('next') ? 'disabled cursor-not-allowed' : 'hoverable',
          ]"
          role="button"
          @click="isDisabled('next') ? null : navigateNext(currentPage)"
        >
          <span class="sr-only">Next</span>
          <ChevronRightIcon class="h-5 w-5" />
        </div>
      </li>
    </ol>
  </nav>
  <nav
    class="relative inline-flex md:hidden text-sm"
    aria-label="Pagination Navigation"
  >
    <div
      :class="[
        'rounded-md items-center px-4 py-2 border border-slate-300 dark:border-slate-600 energy:border-zinc-600',
        isDisabled('previous') ? 'disabled cursor-not-allowed' : 'hoverable',
      ]"
      role="button"
      :aria-disabled="isDisabled('previous') ? true : null"
      :disabled="isDisabled('previous') ? true : null"
      @click="isDisabled('previous') ? null : navigatePrevious(currentPage)"
    >
      Previous
    </div>
    <div
      :class="[
        'ml-3 rounded-md items-center px-4 py-2 border border-slate-300 dark:border-slate-600 energy:border-zinc-600',
        isDisabled('next') ? 'disabled cursor-not-allowed' : 'hoverable',
      ]"
      role="button"
      :aria-disabled="isDisabled('next') ? true : null"
      :disabled="isDisabled('next') ? true : null"
      @click="isDisabled('next') ? null : navigateNext(currentPage)"
    >
      Next
    </div>
  </nav>
</template>
<script>
import { useRoute, useRouter } from "vue-router";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/solid";
export default {
  components: {
    ChevronLeftIcon,
    ChevronRightIcon,
  },
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalCount: {
      type: Number,
      required: true,
    },
    maxPerPage: {
      type: Number,
      default: 50,
    },
    pages: {
      type: Number,
      default: null,
    },
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();

    const totalPages = (count) => {
      if (props.pages) {
        return props.pages;
      }
      return Math.ceil(count / props.maxPerPage);
    };

    const navigatePrevious = (current) => {
      router.push({
        query: { ...route.query, page: current - 1 },
      });
    };

    const navigateNext = (current) => {
      router.push({
        query: { ...route.query, page: current + 1 },
      });
    };

    const navigatePage = (page) => {
      router.push({
        query: { ...route.query, page },
      });
    };

    const buildPageButtons = (current, total) => {
      const buttons = [];
      const before = current - 1;
      const after = current + 1;
      if (total <= 5) {
        for (let n = 1; n <= total; n++) {
          buttons.push(n);
        }
      } else {
        if (current < 5) {
          buttons.push(1, 2, 3);
          if (current >= 3) {
            buttons.push(4);
          }
          if (current === 4) {
            buttons.push(5);
          }
        } else {
          buttons.push(1, "...");
          if (current === total) {
            //last item
            buttons.push(before - 1, before, current);
          }
          if (total - current >= 1) {
            //at least the third item from last
            buttons.push(before, current, after);
          }
        }
        if (total - current > 1) {
          if (total - current === 2) {
            buttons.push(total);
          }
          if (total - current === 3) {
            buttons.push(total - 1, total);
          }
          if (total - current > 3) {
            buttons.push("...", total);
          }
        }
      }
      console.log(
        `Pagination button builder result for page ${current} and total number pages of ${total} : [${buttons}]`
      );
      return buttons;
    };

    const isDisabled = (button) => {
      switch (button) {
        case "previous":
          if (props.currentPage === 1) {
            return true;
          }
          return false;
        case "next":
          if (props.currentPage === totalPages(props.totalCount)) {
            return true;
          }
          return false;
        case "...":
          return true;
        default:
          if (button === props.currentPage) {
            return true;
          }
          return false;
      }
    };

    return {
      totalPages,
      navigatePrevious,
      navigateNext,
      navigatePage,
      buildPageButtons,
      isDisabled,
    };
  },
};
</script>
<style scoped lang="scss">
.selected {
  @apply border border-mission-blue dark:border-slate-300 energy:border-zinc-300 font-bold;
}
.disabled {
  @apply text-slate-400 dark:text-slate-500 energy:text-zinc-500;
}
.hoverable {
  @apply hover:bg-slate-50 dark:hover:bg-slate-700/75 energy:hover:bg-zinc-700/75;
}
</style>
