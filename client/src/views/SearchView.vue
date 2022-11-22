<template>
  <div
    class="
      py-4
      border-b-2 border-slate-900/10
      dark:border-slate-50/[0.06]
      energy:border-zinc-700/50
    "
  >
    <p
      v-show="!loadingMetadata"
      class="pb-2"
    >
      {{ pageSubheader }}
    </p>
    <p class="font-semibold text-2xl">
      {{ pageHeader }}
    </p>
  </div>
  <!-- Search Form -->
  <div class="flex flex-row-reverse py-1 my-2">
    <template v-if="loadingMetadata">
      <div
        class="
          h-8
          w-16
          animate-pulse
          bg-white
          dark:bg-slate-800/50
          energy:bg-zinc-800
          rounded
        "
      />
    </template>
    <template v-else>
      <button
        class="
          text-mission-light-blue
          dark:text-teal-400
          energy:text-energy-yellow
        "
        @click="clearFilters"
      >
        Clear All
      </button>
    </template>
  </div>
  <BaseCard
    :class="[
      'p-4',
      loadingMetadata
        ? 'animate-pulse h-[35rem] md:h-[23rem] lg:h-[12.5rem]'
        : '',
    ]"
  >
    <div v-show="!loadingMetadata">
      <Disclosure
        v-slot="{ open }"
        default-open
      >
        <div class="flex flex-col justify-between">
          <div
            class="
              grid-cols-1
              md:grid md:grid-cols-2 md:gap-4
              space-y-3
              md:space-y-0
              lg:flex lg:space-x-6 lg:gap-0
              flex-col
              lg:flex-row
              w-full
            "
          >
            <div class="lg:w-2/5 flex space-x-3">
              <div class="w-full">
                <BaseInput
                  v-model="queryText"
                  label="Keyword Search or Filter"
                  type="text"
                  autocomplete="off"
                  placeholder="Press enter after typing"
                  @keyup.enter="searchQueryText"
                />
              </div>
              <div class="flex flex-col mt-1 justify-between">
                <label
                  class="text-sm font-medium"
                >Date</label>
                <BaseDatepicker
                  v-model="queryDateRange"
                  :enable-time-picker="false"
                  range
                  multi-calendars
                  @update:modelValue="handleDateRange"
                >
                  <template #trigger>
                    <CalendarIcon
                      class="
                        cursor-pointer
                        hover:text-black
                        dark:hover:text-white
                        energy:hover:text-white
                        h-9
                        w-9
                      "
                    />
                  </template>
                  <template #left-sidebar>
                    <div
                      class="
                        text-mission-light-blue
                        dark:text-teal-400
                        energy:text-energy-yellow
                        p-4
                        flex flex-col
                        text-sm
                        space-y-6
                      "
                    >
                      <button @click="selectDate('24H')">
                        Past 24 Hours
                      </button>
                      <button @click="selectDate('1WK')">
                        Past Week
                      </button>
                      <button @click="selectDate('1MO')">
                        Past Month
                      </button>
                      <button @click="selectDate('6MO')">
                        Past 6 Months
                      </button>
                      <button @click="selectDate('1YR')">
                        Past Year
                      </button>
                    </div>
                  </template>
                </BaseDatepicker>
              </div>
            </div>
            <template
              v-for="n in [
                queryFilters.regions,
                queryFilters.issues,
                queryFilters.reporting,
              ]"
              :key="n"
            >
              <div class="lg:w-1/5">
                <BaseListbox
                  v-model="n.model"
                  :label="n.label"
                  :items="n.list"
                  multiple
                />
              </div>
            </template>
          </div>
          <DisclosureButton
            class="
              py-3
              lg:py-1
              max-w-fit
              hover:text-black
              dark:hover:text-white
              energy:hover:text-whit
            "
          >
            <span
              class="
                text-sm text-mission-light-blue
                dark:text-teal-400
                energy:text-energy-yellow
                mr-2
                inline-block
              "
            >{{ open ? "Less" : "More" }}</span>
            <ChevronUpIcon
              :class="open ? '' : 'rotate-180 transform'"
              class="
                text-mission-light-blue
                dark:text-teal-400
                energy:text-energy-yellow
                h-5
                w-5
                inline-block
              "
            />
          </DisclosureButton>
        </div>
        <transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-out"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <DisclosurePanel class="my-2">
            <div class="flex flex-col lg:flex-row space-y-3 lg:space-y-0">
              <div class="lg:w-2/5 flex space-x-4 lg:max-w-none lg:pr-6">
                <template v-if="!loadingMetadata">
                  <template
                    v-for="n in [
                      queryFilters.classifications,
                      queryFilters.media_types,
                    ]"
                    :key="n"
                  >
                    <div class="w-1/2">
                      <BaseListbox
                        v-model="n.model"
                        :label="n.label"
                        :items="n.list"
                        multiple
                      />
                    </div>
                  </template>
                </template>
              </div>
              <div
                class="
                  grid grid-cols-2
                  md:grid-cols-3
                  gap-4
                  lg:gap-0
                  lg:grid-cols-0
                  lg:flex
                  lg:w-3/5
                  lg:space-x-6
                  lg:max-w-none
                "
              >
                <template
                  v-for="n in [
                    queryFilters.nonstate_actors,
                    queryFilters.producing_offices,
                    queryFilters.frontpage_featured,
                  ]"
                  :key="n"
                >
                  <div class="lg:w-1/3">
                    <BaseListbox
                      v-model="n.model"
                      :label="n.label"
                      :items="n.list"
                      :disabled="n.disabled || false"
                      multiple
                    />
                  </div>
                </template>
              </div>
            </div>
          </DisclosurePanel>
        </transition>
      </Disclosure>
    </div>
  </BaseCard>
  <div class="flex flex-row-reverse py-1 mt-2">
    <template v-if="!loadingMetadata && booleanFilters.length > 0">
      <button
        class="
          text-mission-light-blue
          dark:text-teal-400
          energy:text-energy-yellow
        "
        @click="toggleSelectors"
      >
        {{
          showSelectors
            ? "Hide Selectors"
            : `Show Selectors (${booleanFilters.length})`
        }}
      </button>
    </template>
  </div>
  <!-- Search Booolean Selectors -->
  <template v-if="!loadingMetadata && showSelectors && booleanFilters.length > 0">
    <BaseCard class="mt-2 px-4 py-2 w-fit text-sm">
      <div class="flex flex-wrap">
        <template
          v-for="(n, index) in booleanFilters"
          :key="n"
        >
          <div
            class="my-2"
            :class="[
              n.lastItem && index < booleanFilters.length - 1
                ? 'pr-3 border-r border-slate-700/50 energy:border-zinc-700/50'
                : 'pr-2',
              index !== 0 && n.firstItem ? 'pl-3' : '',
            ]"
          >
            <div
              class="
                flex
                rounded-xl
                bg-slate-100
                dark:bg-slate-700
                energy:bg-zinc-600
                p-2
              "
            >
              <div class="self-center pr-1">
                <template v-if="n.type === 'text'">
                  <span class="pr-1 italic">Text: </span>
                </template>
                {{ n.displayName }}
              </div>
              <button
                type="button"
                class="w-5 h-5 flex items-center justify-center"
                tabindex="0"
                @click="removeFilter(n)"
              >
                <span class="sr-only">Remove filter</span>
                <XIcon
                  class="
                    h-5
                    w-5
                    text-mission-light-blue
                    dark:text-teal-400
                    energy:text-energy-yellow
                  "
                  aria-hidden="true"
                />
              </button>
            </div>
          </div>
          <template v-if="!n.lastItem">
            <template v-if="n.toggleable">
              <button
                class="
                  mr-3
                  text-mission-light-blue
                  dark:text-teal-400
                  energy:text-energy-yellow
                "
                @click="toggleBooleanValue(n)"
              >
                {{ n.boolean_val }}
              </button>
            </template>
            <template v-else>
              <div class="mr-3 self-center">
                {{ n.boolean_val }}
              </div>
            </template>
          </template>
        </template>
      </div>
    </BaseCard>
  </template>
  <!-- Results Container -->
  <template v-if="loadingResults">
    <div class="max-w-fit m-auto mt-[20vh]">
      <svg
        class="
          animate-spin
          -ml-1
          mr-3
          h-24
          w-24
          text-mission-blue
          dark:text-slate-300
          energy:text-zinc-300
        "
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  </template>
  <template v-if="!loadingResults && totalCount === 0">
    <div class="mt-6">
      <p class="text-xl text-center font-semibold">
        Sorry, we didn't find any results.
      </p>
      <p class="text text-center">
        Here's some information about your keyword search that might help you
        find what you're looking for.
      </p>
    </div>
  </template>
  <template v-if="!loadingResults && totalCount > 0">
    <div class="flex flex-col-reverse lg:flex-row py-4">
      <!-- Search Results & Sorting Listbox (Left) -->
      <div
        class="h-fit"
        :class="[
          selectedView.label === 'Grid' || selectedView.label === 'Visuals'
            ? 'basis-full'
            : 'basis-3/4',
        ]"
      >
        <!-- Search Sorting Listbox -->
        <div class="hidden lg:flex justify-between py-4">
          <div class="flex gap-x-8">
            <div class="inline-flex">
              <label class="self-center font-medium">Sort By</label>
              <Listbox
                v-model="selectedSort"
                class="ml-3 min-w-[115px]"
              >
                <div class="relative">
                  <ListboxButton
                    class="
                      min-h-[2rem]
                      flex
                      relative
                      w-full
                      py-1
                      px-2
                      text-left
                      capitalize
                      bg-white
                      dark:bg-slate-700
                      energy:bg-zinc-700
                      border-t border-t-gray-100
                      dark:border-t-slate-800
                      energy:border-t-zinc-800
                      rounded-lg
                      shadow-md
                      cursor-default
                      focus:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-opacity-75
                      focus-visible:ring-offset-2
                    "
                  >
                    <span class="block truncate">{{ selectedSort.label }}</span>
                    <span class="absolute inset-y-0 right-0 flex items-center pr-2">
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
                        energy:bg-zinc-700
                        rounded-md
                        shadow-lg
                        max-h-60
                        ring-1 ring-black ring-opacity-5
                        focus:outline-none
                        z-10
                      "
                    >
                      <ListboxOption
                        v-for="item in sortOptions"
                        v-slot="{ active }"
                        :key="item"
                        :value="item"
                        as="template"
                        class="capitalize px-2 py-1 cursor-pointer"
                      >
                        <li
                          :class="[
                            active
                              ? 'bg-slate-200/80 dark:bg-slate-600 energy:bg-zinc-600'
                              : 'bg-none',
                          ]"
                        >
                          {{ item.label }}
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
            </div>
            <div class="inline-flex">
              <label class="self-center">View</label>
              <Listbox
                v-model="selectedView"
                class="ml-3 min-w-[100px]"
              >
                <div class="relative">
                  <ListboxButton
                    class="
                      min-h-[2rem]
                      flex
                      relative
                      w-full
                      py-1
                      px-2
                      text-left
                      capitalize
                      bg-white
                      dark:bg-slate-700
                      energy:bg-zinc-700
                      border-t border-t-gray-100
                      dark:border-t-slate-800
                      energy:border-t-zinc-800
                      rounded-lg
                      shadow-md
                      cursor-default
                      focus:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-opacity-75
                      focus-visible:ring-offset-2
                    "
                  >
                    <span class="block truncate">{{ selectedView.label }}</span>
                    <span class="absolute inset-y-0 right-0 flex items-center pr-2">
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
                        energy:bg-zinc-700
                        rounded-md
                        shadow-lg
                        max-h-60
                        ring-1 ring-black ring-opacity-5
                        focus:outline-none
                        z-10
                      "
                    >
                      <ListboxOption
                        v-for="item in viewOptions"
                        v-slot="{ active }"
                        :key="item"
                        :value="item"
                        as="template"
                        class="capitalize px-2 py-1 cursor-pointer"
                      >
                        <li
                          :class="[
                            active
                              ? 'bg-slate-200/80 dark:bg-slate-600 energy:bg-zinc-600'
                              : 'bg-none',
                          ]"
                        >
                          {{ item.label }}
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
            </div>
          </div>
          <div
            v-show="
              selectedView.label === 'Grid' || selectedView.label === 'Visuals'
            "
            class="
              cursor-pointer
              text-mission-light-blue
              dark:text-teal-400
              energy:text-energy-yellow
              self-center
            "
            @click="openMobileFacetsDialog"
          >
            Show Filters
          </div>
        </div>
        <!-- Search Results Table -->
        <BaseCard>
          <!-- Top Pagination -->
          <div
            class="
              px-4
              py-3
              flex
              items-center
              border-b border-gray-200
              dark:border-slate-50/[0.06]
              energy:border-zinc-700/50
            "
          >
            <SearchResultsPagination
              :total-count="totalCount"
              :current-page="currentPage"
            />
          </div>
          <!-- Results -->
          <template v-if="selectedView.label === 'List'">
            <template
              v-for="result in results"
              :key="result"
            >
              <div
                class="
                  flex
                  p-4
                  border-b border-slate-900/10
                  dark:border-slate-50/[0.06]
                  energy:border-zinc-50/[0.06]
                "
                :class="
                  isLocked(result)
                    ? 'bg-slate-100 dark:bg-slate-800 energy:bg-zinc-700'
                    : ''
                "
              >
                <div class="h-fit px-2 text-center">
                  <span class="block font-semibold">{{
                    dayjs(result.date_published).format("DD")
                  }}</span>
                  <span class="block text-sm">{{
                    dayjs(result.date_published).format("MMM")
                  }}</span>
                  <span class="block text-sm">{{
                    dayjs(result.date_published).format("YYYY")
                  }}</span>
                </div>
                <div class="px-2 w-full">
                  <template v-if="isLocked(result)">
                    <div class="flex mb-2 items-center">
                      <LockClosedIcon
                        class="mr-2 h-4 w-4"
                        aria-hidden="true"
                      />
                      <span class="uppercase text-sm">Locked</span>
                    </div>
                  </template>
                  <div class="flex justify-between">
                    <div
                      class="basis-[768px] hover:underline"
                      :class="isLocked(result) ? '' : 'cursor-pointer'"
                    >
                      <a @click="goToArticle(result)">
                        <span
                          class="
                            text-slate-600
                            dark:text-slate-300
                            energy:text-zinc-300
                          "
                        >{{
                          `${"(" + result.title_classification + ") "}`
                        }}</span>

                        <span class="text-black dark:text-white energy:text-white">{{ result.title }}</span>
                      </a>
                    </div>
                    <div class="text-xs lg:text-sm">
                      {{ result.doc_num }}
                    </div>
                  </div>
                  <div
                    class="
                      py-2
                      text-sm text-slate-600
                      dark:text-slate-300
                      energy:text-zinc-300
                    "
                  >
                    <template v-if="showHighlightedResult()">
                      <span v-html="result.highlighted_result" />
                    </template>
                    <template v-else>
                      <span>{{ result.summary }}</span>
                    </template>
                  </div>
                </div>
              </div>
            </template>
          </template>
          <template v-else-if="selectedView.label === 'Grid'">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-4">
              <template
                v-for="result in results"
                :key="result"
              >
                <ArticleCard :article="result" />
              </template>
            </div>
          </template>
          <template v-else-if="selectedView.label === 'Visuals'">
            <div
              class="
                grid grid-cols-1
                md:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
                gap-4
                m-4
              "
            >
              <template
                v-for="result in results"
                :key="result"
              >
                <div class="flex p-4">
                  <div class="group">
                    <div class="relative">
                      <div
                        class="
                          invisible
                          group-hover:visible
                          absolute
                          h-full
                          p-2
                          py-5
                          inset-x-0
                          text-white
                          bg-mission-blue/[.90]
                          dark:bg-dark-space-blue/[.90]
                          energy:bg-zinc-800/[.90]
                        "
                      >
                        <div class="flex flex-col">
                          <div class="line-clamp-3">
                            <span>{{
                              `${"(" + result.title_classification + ") "}`
                            }}</span>
                            <span>{{ result.title }}</span>
                          </div>
                          <div
                            class="
                              flex
                              justify-around
                              absolute
                              inset-x-0
                              bottom-2
                              text-sm
                            "
                          >
                            <button
                              class="hover:underline"
                              @click="openMedia(result.images.table.secondary)"
                            >
                              VIEW MEDIA
                              <span class="sr-only">Open media for {{ result.title }}</span>
                            </button>
                            <p>|</p>
                            <router-link
                              class="hover:underline"
                              :to="{
                                name: 'demo-article',
                                params: { doc_num: result.doc_num },
                              }"
                            >
                              VIEW ARTICLE
                            </router-link>
                          </div>
                        </div>
                      </div>
                      <img
                        :src="getImgUrl(result.images.table.secondary)"
                        alt=""
                        class="object-cover"
                      >
                    </div>
                    <div
                      class="
                        flex
                        justify-between
                        p-2
                        border border-slate-900/10
                        dark:border-slate-50/[0.06]
                        energy:border-zinc-700/50
                        text-sm
                      "
                    >
                      <div>
                        <span
                          v-for="(region, ind) in result.regions"
                          :key="ind"
                        >
                          {{ region
                          }}<span v-if="ind < result.regions.length - 1">,&nbsp;</span>
                        </span>
                      </div>
                      <div>
                        {{ dayjs(result.date_published).format("DD MMM YYYY") }}
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </template>
          <!-- Bottom Pagination -->
          <div
            class="
              px-4
              py-3
              flex
              items-center
              border-t border-gray-200
              dark:border-slate-50/[0.06]
              energy:border-zinc-700/50
            "
          >
            <SearchResultsPagination
              :total-count="totalCount"
              :current-page="currentPage"
            />
          </div>
        </BaseCard>
      </div>
      <!-- Search Results Filters -->
      <BaseCard
        v-show="selectedView.label === 'List'"
        class="hidden lg:block basis-1/4 ml-4 h-full"
      >
        <SearchResultsFacets :facets="aggregations" />
      </BaseCard>
      <div class="lg:hidden flex justify-between gap-4 py-4">
        <div class="flex gap-y-4 sm:gap-y-0 sm:gap-x-4 flex-col sm:flex-row">
          <div class="inline-flex">
            <label class="self-center min-w-[58px] sm:min-w-0">Sort By</label>
            <Listbox
              v-model="selectedSort"
              class="ml-3 min-w-[110px]"
            >
              <div class="relative">
                <ListboxButton
                  class="
                    min-h-[2rem]
                    flex
                    relative
                    w-full
                    py-1
                    px-2
                    text-left
                    capitalize
                    bg-white
                    dark:bg-slate-700
                    energy:bg-zinc-700
                    border-t border-t-gray-100
                    dark:border-t-slate-800
                    energy:border-t-zinc-800
                    rounded-lg
                    shadow-md
                    cursor-default
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-opacity-75
                    focus-visible:ring-offset-2
                  "
                >
                  <span class="block truncate">{{ selectedSort.label }}</span>
                  <span class="absolute inset-y-0 right-0 flex items-center pr-2">
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
                      energy:bg-zinc-700
                      rounded-md
                      shadow-lg
                      max-h-60
                      ring-1 ring-black ring-opacity-5
                      focus:outline-none
                      z-10
                    "
                  >
                    <ListboxOption
                      v-for="item in sortOptions"
                      v-slot="{ active }"
                      :key="item"
                      :value="item"
                      as="template"
                      class="capitalize px-2 py-1 cursor-pointer"
                    >
                      <li
                        :class="[
                          active
                            ? 'bg-slate-200/80 dark:bg-slate-600 energy:bg-zinc-600'
                            : 'bg-none',
                        ]"
                      >
                        {{ item.label }}
                      </li>
                    </ListboxOption>
                  </ListboxOptions>
                </transition>
              </div>
            </Listbox>
          </div>
          <div class="inline-flex">
            <label class="self-center min-w-[58px] sm:min-w-0">View</label>
            <Listbox
              v-model="selectedView"
              class="ml-3 min-w-[110px]"
            >
              <div class="relative">
                <ListboxButton
                  class="
                    min-h-[2rem]
                    flex
                    relative
                    w-full
                    py-1
                    px-2
                    text-left
                    capitalize
                    bg-white
                    dark:bg-slate-700
                    energy:bg-zinc-700
                    border-t border-t-gray-100
                    dark:border-t-slate-800
                    energy:border-t-zinc-800
                    rounded-lg
                    shadow-md
                    cursor-default
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-opacity-75
                    focus-visible:ring-offset-2
                  "
                >
                  <span class="block truncate">{{ selectedView.label }}</span>
                  <span class="absolute inset-y-0 right-0 flex items-center pr-2">
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
                      energy:bg-zinc-700
                      rounded-md
                      shadow-lg
                      max-h-60
                      ring-1 ring-black ring-opacity-5
                      focus:outline-none
                      z-10
                    "
                  >
                    <ListboxOption
                      v-for="item in viewOptions"
                      v-slot="{ active }"
                      :key="item"
                      :value="item"
                      as="template"
                      class="capitalize px-2 py-1 cursor-pointer"
                    >
                      <li
                        :class="[
                          active
                            ? 'bg-slate-200/80 dark:bg-slate-600 energy:bg-zinc-600'
                            : 'bg-none',
                        ]"
                      >
                        {{ item.label }}
                      </li>
                    </ListboxOption>
                  </ListboxOptions>
                </transition>
              </div>
            </Listbox>
          </div>
        </div>
        <div
          class="
            cursor-pointer
            text-mission-light-blue
            dark:text-teal-400
            energy:text-energy-yellow
            self-center
          "
          @click="openMobileFacetsDialog"
        >
          Show Filters
        </div>
      </div>
      <!-- Mobile Result Facets Dialog -->
      <TransitionRoot
        appear
        :show="isMobileFacetsDialogOpen"
        as="template"
      >
        <Dialog
          as="div"
          @close="closeMobileFacetsDialog"
        >
          <div class="fixed inset-0 z-20 overflow-y-auto w-full">
            <div class="min-h-screen px-4 text-center">
              <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100"
                leave-to="opacity-0"
              >
                <div class="fixed inset-0 bg-black/25" />
              </TransitionChild>
              <span
                class="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95"
              >
                <DialogPanel
                  class="
                    inline-block
                    w-full
                    max-w-xl
                    md:max-w-[700px]
                    lg:max-w-[900px]
                    p-6
                    my-8
                    text-left
                    align-middle
                    transition-all
                    transform
                    text-slate-700
                    dark:text-slate-300
                    energy:text-zinc-300
                    bg-slate-100
                    dark:bg-slate-700
                    energy:bg-zinc-700
                    shadow-lg
                    rounded-lg
                  "
                >
                  <div class="mt-6">
                    <button
                      type="button"
                      class="
                        absolute
                        top-5
                        right-5
                        w-8
                        h-8
                        flex
                        items-center
                        justify-center
                      "
                      tabindex="0"
                      @click="closeMobileFacetsDialog"
                    >
                      <span class="sr-only">Close navigation</span>
                      <XIcon
                        class="h-5 w-5"
                        aria-hidden="true"
                      />
                    </button>
                    <SearchResultsFacets
                      :facets="aggregations"
                      class="grid grid-cols-2 md:grid-cols-3 gap-4"
                    />
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
    </div>
  </template>
</template>

<script>
import * as dayjs from "dayjs";
import { isEmpty, getValueForCode, getValueForName } from "@/helpers";
import { computed, ref, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  CalendarIcon,
  ChevronUpIcon,
  SelectorIcon,
  XIcon,
} from "@heroicons/vue/outline";
import { LockClosedIcon } from "@heroicons/vue/solid";
import ArticleCard from "@/components/ArticleCard";
import SearchResultsFacets from "@/components/SearchResultsFacets";
import SearchResultsPagination from "@/components/SearchResultsPagination";
const sortOptions = [
  { label: "Newest", key: "desc", type: "sort_dir" },
  { label: "Oldest", key: "asc", type: "sort_dir" },
  { label: "Relevance", key: "score", type: "sort_field" },
];
const viewOptions = [
  { label: "List", key: "list" },
  { label: "Grid", key: "grid" },
  //{ label: "Visuals", key: "visuals" },
];

export default {
  components: {
    Dialog,
    DialogPanel,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    TransitionChild,
    TransitionRoot,
    CalendarIcon,
    ChevronUpIcon,
    SelectorIcon,
    XIcon,
    LockClosedIcon,
    ArticleCard,
    SearchResultsFacets,
    SearchResultsPagination,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const loadingMetadata = computed(() => store.state.metadata.loading);
    const criteria = computed(() => store.state.metadata.criteria);
    const loadingResults = computed(() => store.state.search.loading);
    const results = computed(() => store.state.search.results);
    const totalCount = computed(() => store.state.search.totalCount);
    const aggregations = computed(() => store.state.search.aggregations);

    const getSubregionNameForCountryCode = (code) => {
      return criteria.value.subregions.find((subregion) => {
        return subregion.country_codes.find(
          (countryCode) => countryCode === code
        );
      }).name;
    };

    const getHeaderName = (route) => {
      if (
        route.name === "issues" ||
        route.name === "regions" ||
        route.name === "subregions" ||
        route.name === "countries"
      ) {
        return route.params.name ? route.params.name : "Search";
      } else {
        return "Search";
      }
    };
    const getSubheaderName = ({ name, params }) => {
      if (name === "countries") {
        const countryValue = getValueForName(
          criteria.value.countries,
          params.name
        );
        let subregionName = "";
        if (countryValue) {
          subregionName = getSubregionNameForCountryCode(countryValue.code);
        }
        return subregionName;
      } else {
        return "";
      }
    };

    const pageHeader = ref(getHeaderName(route));
    const pageSubheader = ref(getSubheaderName(route));

    const buildDateRange = () => {
      const queryStartDate = route.query["start_date"];
      const queryEndDate = route.query["end_date"];
      if (!queryStartDate && !queryEndDate) {
        return null;
      }
      let dateRange = [null, null];
      if (queryStartDate) {
        dateRange[0] = dayjs(queryStartDate).toDate();
      }
      if (queryEndDate) {
        dateRange[1] = dayjs(queryEndDate).toDate();
      }
      return dateRange;
    };

    const queryDateRange = ref(buildDateRange());

    const handleDateRange = () => {
      let query = {
        ...route.query,
      };
      const startDate = queryDateRange.value[0];
      const endDate = queryDateRange.value[1];
      if (startDate) {
        query["start_date"] = dayjs(startDate).format("YYYY-MM-DD");
      } else {
        delete query["start_date"];
      }
      if (endDate) {
        query["end_date"] = dayjs(endDate).format("YYYY-MM-DD");
      } else {
        delete query["end_date"];
      }
      router.push({
        query,
      });
    };

    const selectDate = (code) => {
      const today = dayjs().toDate();
      let pastDate = dayjs();
      switch (code) {
        case "24H":
          pastDate = pastDate.subtract(1, "day").toDate();
          break;
        case "1WK":
          pastDate = pastDate.subtract(1, "week").toDate();
          break;
        case "1MO":
          pastDate = pastDate.subtract(1, "month").toDate();
          break;
        case "6MO":
          pastDate = pastDate.subtract(6, "month").toDate();
          break;
        case "1YR":
          pastDate = pastDate.subtract(1, "year").toDate();
          break;
      }
      if (queryDateRange.value) {
        queryDateRange.value[0] = pastDate;
        queryDateRange.value[1] = today;
      } else {
        queryDateRange.value = [];
        queryDateRange.value[0] = pastDate;
        queryDateRange.value[1] = today;
      }
    };

    const clearFilters = () => {
      router.push({ name: "search", query: {} });
    };

    /* 
      - Takes a list of types (e.g: ['countries[]', 'regions[]']) and a list of list box items
      - 1) Looks in the route query if any of types are present there
      - 2) For each type found in the query, it loops through the values for that query property
      - 3) Each value is then matched up against the list of list box items and pushed into the 'selectedModels' array
      - 4) The selectedModels represents the list of currently selected items in the list box
    */
    const currentModel = ({ items, types }) => {
      //console.log("currentModel: ", items, types);
      const selectedModels = [];
      if (items.length > 0) {
        types.forEach((type) => {
          if (route.query[type]) {
            if (!Array.isArray(route.query[type])) {
              route.query[type] = [route.query[type]];
            }
            for (let i = 0; i < route.query[type].length; i++) {
              selectedModels.push(
                items.find((item) => item.code === route.query[type][i])
              );
            }
          }
        });
      }
      if (selectedModels.length > 0) {
        console.log("selectedModels: ", selectedModels);
      }
      return selectedModels;
    };

    const buildItems = (items, type) => {
      return items.map((item) => ({ ...item, type }));
    };
    const buildRegions = () => {
      let items = [];
      criteria.value.regions.forEach((region) => {
        items.push({ ...region, type: "regions[]" });
        if (region.subregions.length > 1) {
          region.subregions.forEach((subregionCode) => {
            const subregion = getValueForCode(
              criteria.value.subregions,
              subregionCode
            );
            items.push({
              ...subregion,
              type: "subregions[]",
              subitem: true,
            });
          });
        }
      });
      criteria.value.countries.forEach((country) => {
        items.push({ ...country, type: "countries[]" });
      });
      return items;
    };
    const buildIssues = () => {
      let items = [];
      criteria.value.issues.forEach((issue) => {
        items.push({ ...issue, type: "issues[]" });
        issue.topics.forEach((topic) => {
          items.push({
            ...topic,
            code: topic.codes[0],
            type: "topics[]",
            subitem: true,
          });
        });
      });
      return items;
    };
    const buildReportingTypes = () => {
      let items = [];
      criteria.value.reporting_types.forEach((reportingType) => {
        items.push({ ...reportingType, type: "reporting_types[]" });
        reportingType.productTypes.forEach((productTypeCode) => {
          const productType = getValueForCode(
            criteria.value.product_types,
            productTypeCode
          );
          items.push({
            ...productType,
            code: productType.code.toString(),
            type: "product_types[]",
            subitem: true,
          });
        });
      });
      return items;
    };

    const buildQueryFilters = () => {
      const regions = {
        items: buildRegions(),
        types: ["regions[]", "subregions[]", "countries[]"],
      };
      const issues = {
        items: buildIssues(),
        types: ["issues[]", "topics[]"],
      };
      const reportings = {
        items: buildReportingTypes(),
        types: ["reporting_types[]", "product_types[]"],
      };
      const classifications = {
        items: buildItems(criteria.value.classification, "classification[]"),
        types: ["classification[]"],
      };
      const mediaTypes = {
        items: buildItems(criteria.value.media_tags, "media_tags[]"),
        types: ["media_tags[]"],
      };
      const nonStateActors = {
        items: buildItems(
          criteria.value.non_state_actors,
          "non_state_actors[]"
        ),
        types: ["non_state_actors[]"],
      };
      const frontPageFeatured = {
        items: buildItems(criteria.value.selected_for, "selected_for[]"),
        types: ["selected_for[]"],
      };
      return {
        regions: {
          label: "Regions & Countries",
          model: currentModel(regions),
          list: regions.items,
          types: regions.types,
        },
        issues: {
          label: "Counterterrorism and Subtopics",
          model: currentModel(issues),
          list: issues.items,
          types: issues.types,
        },
        reporting: {
          label: "Reporting & Product Types",
          model: currentModel(reportings),
          list: reportings.items,
          types: reportings.types,
        },
        classifications: {
          label: "Classifications",
          model: currentModel(classifications),
          list: classifications.items,
          types: classifications.types,
        },
        media_types: {
          label: "Media Types",
          model: currentModel(mediaTypes),
          list: mediaTypes.items,
          types: mediaTypes.types,
        },
        nonstate_actors: {
          label: "Non State Actors",
          model: currentModel(nonStateActors),
          list: nonStateActors.items,
          types: nonStateActors.types,
        },
        producing_offices: {
          label: "Producing Offices",
          model: [],
          list: [],
          types: ["producing_offices[]"],
          disabled: true,
        },
        frontpage_featured: {
          label: "Front Page Featured",
          model: currentModel(frontPageFeatured),
          list: frontPageFeatured.items,
          types: frontPageFeatured.types,
        },
      };
    };
    const queryText = ref(route.query.text || "");
    const queryFilters = ref(buildQueryFilters());

    const getBooleanMapping = (queryKey) => {
      if (queryKey === "product_types[]") {
        return false;
      } else {
        const bracketIndex = queryKey.indexOf("[]");
        if (bracketIndex !== -1) {
          return queryKey.slice(0, bracketIndex).concat("_bool");
        }
        return false;
      }
    };

    const getListForType = (type) => {
      switch (type) {
        case "regions[]":
          return criteria.value.regions;
        case "subregions[]":
          return criteria.value.subregions;
        case "countries[]":
          return criteria.value.countries;
        case "issues[]":
          return criteria.value.issues;
        case "topics[]":
          return criteria.value.topics;
        case "reporting_types[]":
          return criteria.value.reporting_types;
        case "product_types[]":
          return criteria.value.product_types;
        case "classification[]":
          return criteria.value.classification;
        case "media_tags[]":
          return criteria.value.media_tags;
        case "non_state_actors[]":
          return criteria.value.non_state_actors;
        case "selected_for[]":
          return criteria.value.selected_for;
        default:
          return [];
      }
    };

    const buildBooleanFilters = () => {
      const filteredKeys = Object.keys(route.query).filter((key) => {
        if (key.indexOf("[]") !== -1) {
          return true;
        }
        return false;
      });
      let queryText, queryDates;
      if (route.query["text"]) {
        queryText = {
          displayName: route.query["text"],
          firstItem: true,
          lastItem: true,
          type: "text",
        };
      }
      if (route.query["start_date"] || route.query["end_date"]) {
        let endDate = route.query["end_date"];
        if (!endDate) {
          endDate = "Present";
        }
        queryDates = {
          displayName: route.query["start_date"] + " - " + endDate,
          firstItem: true,
          lastItem: true,
          type: "dates",
        };
      }
      let booleanFilterGroups = [];
      filteredKeys.forEach((type) => {
        const booleanMapping = getBooleanMapping(type);
        const list = getListForType(type);
        let items = !Array.isArray(route.query[type])
          ? [route.query[type]]
          : route.query[type];
        items = items.map((code) => {
          const displayName = getValueForCode(
            list,
            type === "product_types[]" ? parseInt(code) : code
          );
          return {
            code,
            displayName: displayName ? displayName.name : null,
          };
        });
        //console.log("items: ", items);
        let boolean_val = "or";
        let toggleable = false;
        if (booleanMapping) {
          boolean_val = route.query[booleanMapping];
          toggleable = type === "reporting_types[]" ? false : true;
        }
        booleanFilterGroups.push({
          type,
          items,
          boolean_val,
          toggleable,
        });
      });
      //console.log("booleanFilterGroups: ", booleanFilterGroups);
      let booleanFilters = [];
      if (queryText) {
        booleanFilters.push(queryText);
      }
      if (queryDates) {
        booleanFilters.push(queryDates);
      }
      booleanFilterGroups.forEach((filterGroup) => {
        filterGroup.items.forEach((item, index, array) => {
          let booleanFilter = {
            displayName: item.displayName,
            code: item.code,
            type: filterGroup.type,
            boolean_val: filterGroup.boolean_val,
            toggleable: filterGroup.toggleable,
          };
          if (index === 0) {
            booleanFilter.firstItem = true;
          }
          if (index === array.length - 1) {
            booleanFilter.lastItem = true;
          }
          booleanFilters.push(booleanFilter);
        });
      });
      console.log("booleanFilters: ", booleanFilters);
      return booleanFilters;
    };
    const booleanFilters = ref(buildBooleanFilters());
    const showSelectors = ref(true);

    const toggleSelectors = () => {
      showSelectors.value = !showSelectors.value;
    };

    const removeFilter = (item) => {
      let query = {
        ...route.query,
      };
      if (item.type === "text") {
        delete query[item.type];
      } else if (item.type === "dates") {
        delete query["start_date"];
        delete query["end_date"];
      } else {
        query[item.type] = query[item.type].filter(
          (queryItem) => queryItem !== item.code
        );
        if (query[item.type].length < 2) {
          const booleanMapping = getBooleanMapping(item.type);
          if (query[booleanMapping]) {
            delete query[booleanMapping];
          }
          if (query[item.type].length === 0) {
            delete query[item.type];
          }
        }
      }
      router.push({
        name: "search",
        query,
      });
    };

    const toggleBooleanValue = (item) => {
      let query = {
        ...route.query,
      };
      const booleanMapping = getBooleanMapping(item.type);
      if (query[booleanMapping] === "and") {
        query[booleanMapping] = "or";
      } else {
        query[booleanMapping] = "and";
      }
      router.push({
        query,
      });
    };

    /*
      - This method builds a watcher for each query filter in order to track changes at the individual listbox level
      - 1) First, a query value is initialized that contains a copy of the existing query.
      - 2) The types present in this query filter are then removed from the newly created query object
      - 3) If the query filter's model values are empty, this skips to step 8
      - 4) The unique types present in the query filter's model are identified
      - 5) Each unique type is matched up against the query filter's model values (selected items) and the query is updated for each type
      - 6) For each unique type, it checks if a boolean mapping exists in the updated query
      - 7a) If it exists and the number of items for the query object is more than 1, it adds/keeps the boolean mapping
      - 7b) If it exists and the number of items for the query object is 1 or less, it removes the boolean mapping
      - 8) The updated query is sent to the router via a router.push and this fires off a query update
    */
    const buildWatcher = (object) => {
      return watch(
        () => object,
        (newValue) => {
          console.log("local watcher triggered.", newValue);
          let query = {
            ...route.query,
          };
          newValue.types.forEach((type) => {
            delete query[type];
          });
          if (newValue.model.length > 0) {
            const uniqueTypes = [
              ...new Set(newValue.model.map((item) => item.type)),
            ];
            //console.log("uniqueTypes: ", uniqueTypes);
            for (let i = 0; i < uniqueTypes.length; i++) {
              let valuesForType = [];
              for (let j = 0; j < newValue.model.length; j++) {
                //console.log("newValue.model: ", newValue.model);
                if (newValue.model[j].type === uniqueTypes[i]) {
                  valuesForType.push(newValue.model[j].code);
                }
              }
              //console.log("valuesForType after: ", valuesForType);
              query[uniqueTypes[i]] = valuesForType;
            }
            uniqueTypes.forEach((type) => {
              const booleanMapping = getBooleanMapping(type);
              //console.log("booleanMapping: ", booleanMapping);
              if (booleanMapping) {
                const mappingFound = Object.keys(query).find(
                  (queryKey) => queryKey === booleanMapping
                );
                if (!mappingFound && query[type] && query[type].length > 1) {
                  query[booleanMapping] = "and";
                }
                if (mappingFound && query[type].length <= 1) {
                  delete query[booleanMapping];
                }
              }
            });
          }
          //console.log("query: ", query);
          router.push({
            name: "search",
            query: query,
          });
        },
        { deep: true }
      );
    };
    const buildQueryWatchers = (object) => {
      let watchers = [];
      Object.keys(object).forEach((filter) => {
        watchers.push(buildWatcher(object[filter]));
      });
      return watchers;
    };

    const getSortOption = (query) => {
      const sortDir = query.sort_dir ? query.sort_dir : undefined;
      const sortField = query.sort_field ? query.sort_field : undefined;
      if (sortDir && !sortField) {
        return sortDir === "asc" ? sortOptions[1] : sortOptions[0];
      }
      if (sortField && !sortDir) {
        if (sortField === "score") {
          return sortOptions[2];
        }
      }
      return sortOptions[0];
    };

    const selectedSort = ref(getSortOption(route.query));
    const selectedView = ref(
      route.query.view === "grid"
        ? viewOptions[1]
        : route.query.view === "visuals"
          ? viewOptions[2]
          : viewOptions[0]
    );
    const currentPage = ref(parseInt(route.query.page) || 1);

    const getImgUrl = (url) => {
      return require("@/assets/" + url);
    };
    const isMobileFacetsDialogOpen = ref(false);

    onMounted(() => {
      store.dispatch("search/search");
      buildQueryWatchers(queryFilters.value);
    });

    const searchQueryText = () => {
      let query = {
        ...route.query,
      };
      if (!queryText.value) {
        delete query["text"];
      } else {
        query = { ...query, text: queryText.value };
      }
      router.push({
        name: "search",
        query: query,
      });
    };

    const showHighlightedResult = () => {
      if (route.name === "search" && route.query.text !== "") {
        return true;
      }
      return false;
    };

    const isLocked = (result) => {
      return !isEmpty(result.needed) || result.org_restricted;
    };

    const goToArticle = (result) => {
      if (!isLocked(result)) {
        router.push({
          name: "article",
          params: { doc_num: result.doc_num },
        });
      }
    };

    const toggleImgContainer = (result, value) => {
      result.hasImage = value;
    };

    watch(
      () => route.query,
      () => {
        console.log(`route.query watcher triggered [${route.name}]`);
        if (
          route.name === "search" ||
          route.name === "issues" ||
          route.name === "regions" ||
          route.name === "subregions" ||
          route.name === "countries"
        ) {
          store.dispatch("search/search");
          pageHeader.value = getHeaderName(route);
          pageSubheader.value = getSubheaderName(route);

          queryText.value = route.query.text || "";
          queryDateRange.value = buildDateRange();
          queryFilters.value = buildQueryFilters();
          booleanFilters.value = buildBooleanFilters();
          currentPage.value = parseInt(route.query.page) || 1;
          selectedView.value =
            route.query.view === "grid"
              ? viewOptions[1]
              : route.query.view === "visuals"
                ? viewOptions[2]
                : viewOptions[0];
        }
      }
    );

    /*
      Metadata needs to load first before building the query filters.
      Countries subheader relies on Metadata so we load that as well.
    */
    watch([loadingMetadata], () => {
      if (!loadingMetadata.value) {
        queryFilters.value = buildQueryFilters();
        booleanFilters.value = buildBooleanFilters();
      }
      if (route.name === "countries") {
        pageSubheader.value = getSubheaderName(route);
      }
    });

    watch(
      () => queryFilters,
      () => {
        buildQueryWatchers(queryFilters.value);
      },
      { deep: true }
    );

    watch([selectedSort], () => {
      let query = { ...route.query, page: currentPage.value };
      if (selectedSort.value.type === "sort_dir") {
        if (query.sort_field) {
          delete query["sort_field"];
        }
        query = { ...query, sort_dir: selectedSort.value.key };
      } else {
        if (query.sort_dir) {
          delete query["sort_dir"];
        }
        query = { ...query, sort_field: selectedSort.value.key };
      }
      router.push({
        query,
      });
    });

    watch([selectedView], () => {
      console.log("selectedView watcher triggered.");
      if (
        selectedView.value.key === "list" ||
        selectedView.value.key === "grid"
      ) {
        router.push({
          query: {
            ...route.query,
            view: selectedView.value.key,
          },
        });
      } else if (selectedView.value.key === "visuals") {
        let query = {
          ...route.query,
          view: selectedView.value.key,
        };
        //TODO: Align these values with thats on the backend
        query["media_tags[]"] = [
          "audio",
          "interactive",
          "graphic",
          "map",
          "video",
        ];
        router.push({
          query,
        });
      }
    });

    const closeMobileFacetsDialog = () =>
      (isMobileFacetsDialogOpen.value = false);

    const openMobileFacetsDialog = () =>
      (isMobileFacetsDialogOpen.value = true);

    const openMedia = (url) => {
      let route = getImgUrl(url);
      window.open(route);
    };

    return {
      dayjs,
      loadingMetadata,
      loadingResults,
      results,
      totalCount,
      aggregations,
      pageHeader,
      pageSubheader,
      queryDateRange,
      handleDateRange,
      selectDate,
      clearFilters,
      queryText,
      searchQueryText,
      showHighlightedResult,
      goToArticle,
      isLocked,
      toggleImgContainer,
      queryFilters,
      booleanFilters,
      showSelectors,
      toggleSelectors,
      removeFilter,
      toggleBooleanValue,
      sortOptions,
      selectedSort,
      viewOptions,
      selectedView,
      currentPage,
      getImgUrl,
      isMobileFacetsDialogOpen,
      closeMobileFacetsDialog,
      openMobileFacetsDialog,
      openMedia,
    };
  },
};
</script>
<style scoped lang="scss">

</style>
