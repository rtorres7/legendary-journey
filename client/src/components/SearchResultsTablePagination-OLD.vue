<template>
  <div class="flex-1 flex items-center justify-between">
    <div>
      <p class="text-sm text-gray-700">
        Showing
        <span class="font-medium">{{ startingPageResult }}</span>
        to
        <span class="font-medium">{{ endingPageResult }}</span>
        of
        <span class="font-medium">{{ totalCount }}</span>
        results
      </p>
    </div>
    <div>
      <nav
        class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
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
              text-sm
              font-medium
              text-gray-500
              hover:bg-gray-50
            "
          >
            <span class="sr-only">Previous</span>
            <ChevronLeftIcon class="h-5 w-5" />
          </span>
        </template>
        <template v-else>
          <a
            @click="navigatePrevious()"
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
        <template v-for="n in pageButtons" :key="n">
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
                  border-gray-300
                  text-gray-500
                  hover:bg-gray-50
                  hidden
                  md:inline-flex
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

        <!-- <template v-if="currentPage === 1">
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
            1
          </span>
        </template>
        <template v-else>
          <a
            @click="navigateFirstPage()"
            class="
              bg-white
              border-gray-300
              text-gray-500
              hover:bg-gray-50
              hidden
              md:inline-flex
              relative
              items-center
              px-4
              py-2
              border
              text-sm
              font-medium
            "
          >
            1
          </a>
        </template> -->

        <!-- <span
          class="
            relative
            inline-flex
            items-center
            px-4
            py-2
            border border-gray-300
            bg-white
            text-sm
            font-medium
            text-gray-700
          "
        >
          ...
        </span> -->
        <!-- <a
          href="#"
          class="
            bg-white
            border-gray-300
            text-gray-500
            hover:bg-gray-50
            hidden
            md:inline-flex
            relative
            items-center
            px-4
            py-2
            border
            text-sm
            font-medium
          "
        >
          {{ totalPages }}
        </a> -->
        <template v-if="currentPage === totalPages">
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
              text-sm
              font-medium
              text-gray-500
              hover:bg-gray-50
            "
          >
            <span class="sr-only">Next</span>
            <ChevronRightIcon class="h-5 w-5" />
          </span>
        </template>
        <template v-else>
          <a
            @click="navigateNext()"
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
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/solid";

export default {
  components: {
    ChevronLeftIcon,
    ChevronRightIcon,
  },
  // props: {
  //   totalCount: Number,
  // },
  props: {
    modelValue: Number,
  },
  setup(props) {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const test = computed(() => props.modelValue);

    const totalCount = computed(() => store.state.search.totalCount);

    const currentPage = ref(parseInt(route.query.page) || 1);
    const totalPages = ref(Math.ceil(totalCount.value / 50));

    const getStartingResult = (page) => {
      return 50 * (page - 1) + 1;
    };
    const getEndingResult = (page) => {
      return 50 * page > totalCount.value ? totalCount.value : 50 * page;
    };

    const startingPageResult = ref(getStartingResult(route.query.page || 1));
    const endingPageResult = ref(getEndingResult(route.query.page || 1));

    const navigatePrevious = () => {
      router.push({
        name: "search",
        query: { ...route.query, page: currentPage.value - 1 },
      });
    };

    const navigateNext = () => {
      router.push({
        name: "search",
        query: { ...route.query, page: currentPage.value + 1 },
      });
    };

    const navigateFirstPage = () => {
      router.push({
        name: "search",
        query: { ...route.query, page: 1 },
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
        `Testing current of ${current} and total pages of ${total} : `,
        buttons
      );
      return buttons;
    };

    const pageButtons = ref(
      buildPageButtons(currentPage.value, totalPages.value)
    );

    watch(
      () => route.query,
      () => {
        console.log("count from parent: ", test.value);
        currentPage.value = parseInt(route.query.page) || 1;
        totalPages.value = Math.ceil(totalCount.value / 50);
        startingPageResult.value = getStartingResult(route.query.page || 1);
        endingPageResult.value = getEndingResult(route.query.page || 1);
        pageButtons.value = buildPageButtons(
          currentPage.value,
          totalPages.value
        );
      }
    );

    return {
      totalCount,
      currentPage,
      totalPages,
      startingPageResult,
      endingPageResult,
      navigatePrevious,
      navigateNext,
      navigatePage,
      navigateFirstPage,
      pageButtons,
    };
  },
};
</script>
<style scoped lang="scss">
</style>
