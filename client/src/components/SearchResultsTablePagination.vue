<template>
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
    <div>
      <nav
        class="
          relative
          z-0
          hidden
          md:inline-flex
          rounded-md
          shadow-sm
          -space-x-px
        "
        aria-label="Pagination"
      >
        <template v-if="currentPage === 1">
          <span
            class="
              relative
              inline-flex
              items-center
              px-2
              py-2
              rounded-l-md
              border border-gray-300
              bg-white
              dark:bg-slate-800
              energy:bg-gray-800
              text-sm
              font-medium
              text-gray-300
              hover:bg-gray-50
            "
          >
            <span class="sr-only">Previous</span>
            <ChevronLeftIcon class="h-5 w-5" />
          </span>
        </template>
        <template v-else>
          <a
            @click="navigatePrevious(currentPage)"
            class="
              cursor-pointer
              relative
              inline-flex
              items-center
              px-2
              py-2
              rounded-l-md
              border border-gray-300
              bg-white
              dark:bg-slate-800
              energy:bg-gray-800
              text-sm
              font-medium
              text-gray-500
              hover:bg-gray-50
            "
          >
            <span class="sr-only">Previous</span>
            <ChevronLeftIcon class="h-5 w-5" />
          </a>
        </template>
        <template
          v-for="n in buildPageButtons(currentPage, totalPages(totalCount))"
          :key="n"
        >
          <template v-if="n === '...'">
            <span
              class="
                relative
                inline-flex
                items-center
                px-4
                py-2
                border border-gray-300
                bg-white
                dark:bg-slate-800
                energy:bg-gray-800
                text-sm
                font-medium
                text-gray-700
              "
            >
              ...
            </span>
          </template>
          <template v-else>
            <template v-if="currentPage === n">
              <span
                aria-current="page"
                class="
                  z-10
                  bg-slate-50
                  border-mission-blue
                  text-mission-blue
                  relative
                  inline-flex
                  items-center
                  px-4
                  py-2
                  border
                  text-sm
                  font-medium
                "
              >
                {{ n }}
              </span>
            </template>
            <template v-else>
              <a
                @click="navigatePage(n)"
                class="
                  cursor-pointer
                  bg-white
                  dark:bg-slate-800
                  energy:bg-gray-800
                  border-gray-300
                  text-gray-500
                  hover:bg-gray-50
                  inline-flex
                  relative
                  items-center
                  px-4
                  py-2
                  border
                  text-sm
                  font-medium
                "
              >
                {{ n }}
              </a>
            </template>
          </template>
        </template>
        <template v-if="currentPage === totalPages(totalCount)">
          <span
            class="
              relative
              inline-flex
              items-center
              px-2
              py-2
              rounded-r-md
              border border-gray-300
              bg-white
              dark:bg-slate-800
              energy:bg-gray-800
              text-sm
              font-medium
              text-gray-300
              hover:bg-gray-50
            "
          >
            <span class="sr-only">Next</span>
            <ChevronRightIcon class="h-5 w-5" />
          </span>
        </template>
        <template v-else>
          <a
            @click="navigateNext(currentPage)"
            class="
              cursor-pointer
              relative
              inline-flex
              items-center
              px-2
              py-2
              rounded-r-md
              border border-gray-300
              bg-white
              dark:bg-slate-800
              energy:bg-gray-800
              text-sm
              font-medium
              text-gray-500
              hover:bg-gray-50
            "
          >
            <span class="sr-only">Next</span>
            <ChevronRightIcon class="h-5 w-5" />
          </a>
        </template>
      </nav>
      <div
        class="relative z-0 inline-flex md:hidden rounded-md shadow-sm"
        aria-label="Pagination"
      >
        <template v-if="currentPage === 1">
          <span
            class="
              relative
              inline-flex
              items-center
              px-4
              py-2
              border border-gray-300
              text-sm
              font-medium
              rounded-md
              text-gray-300
              bg-white
              dark:bg-slate-800
              energy:bg-gray-800
              hover:bg-gray-50
            "
          >
            Previous
          </span>
        </template>
        <template v-else>
          <a
            @click="navigatePrevious(currentPage)"
            class="
              cursor-pointer
              relative
              inline-flex
              items-center
              px-4
              py-2
              border border-gray-300
              text-sm
              font-medium
              rounded-md
              text-gray-700
              bg-white
              dark:bg-slate-800
              energy:bg-gray-800
              hover:bg-gray-50
            "
          >
            Previous
          </a>
        </template>
        <template v-if="currentPage === totalPages(totalCount)">
          <span
            class="
              ml-3
              relative
              inline-flex
              items-center
              px-4
              py-2
              border border-gray-300
              text-sm
              font-medium
              rounded-md
              text-gray-300
              bg-white
              dark:bg-slate-800
              energy:bg-gray-800
              hover:bg-gray-50
            "
          >
            Next
          </span>
        </template>
        <template v-else>
          <a
            @click="navigateNext(currentPage)"
            class="
              cursor-pointer
              ml-3
              relative
              inline-flex
              items-center
              px-4
              py-2
              border border-gray-300
              text-sm
              font-medium
              rounded-md
              text-gray-700
              bg-white
              dark:bg-slate-800
              energy:bg-gray-800
              hover:bg-gray-50
            "
          >
            Next
          </a>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute, useRouter } from "vue-router";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/solid";

export default {
  components: {
    ChevronLeftIcon,
    ChevronRightIcon,
  },
  props: {
    totalCount: Number,
    currentPage: Number,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    const totalPages = (count) => {
      return Math.ceil(count / 50);
    };

    const startingResult = (page) => {
      return 50 * (page - 1) + 1;
    };

    const endingResult = (page, total) => {
      return 50 * page > total ? total : 50 * page;
    };

    const navigatePrevious = (current) => {
      router.push({
        name: "search",
        query: { ...route.query, page: current - 1 },
      });
    };

    const navigateNext = (current) => {
      router.push({
        name: "search",
        query: { ...route.query, page: current + 1 },
      });
    };

    const navigatePage = (page) => {
      router.push({
        name: "search",
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

    return {
      totalPages,
      startingResult,
      endingResult,
      navigatePrevious,
      navigateNext,
      navigatePage,
      buildPageButtons,
    };
  },
};
</script>
<style scoped lang="scss">
</style>
