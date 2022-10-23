<template>
  <div
    class="
      py-4
      border-b-2 border-slate-900/10
      dark:border-slate-50/[0.06]
      energy:border-zinc-700/50
    "
  >
    <p class="pb-2">{{ pageSubheader }}</p>
    <p class="font-semibold text-2xl">
      {{ pageHeader }}
    </p>
  </div>
  <!-- Search Form -->
  <BaseCard class="mt-4 p-4">
    <Disclosure v-slot="{ open }" defaultOpen>
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
          <div class="lg:w-2/5">
            <label class="text-sm font-medium line-clamp-1 xl:line-clamp-none"
              >Keyword Search or Filter
            </label>
            <input
              class="
                mt-1
                block
                w-full
                focus-visible:outline-none
                bg-transparent
                border-b border-gray-300
                energy:text-gray-300
              "
            />
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
            >{{ open ? "Less" : "More" }}</span
          >
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
    </Disclosure>
  </BaseCard>
  <!-- Results Container -->
  <template v-if="loading">
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
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
  </template>
  <template v-if="!loading && totalCount === 0">
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
  <template v-if="!loading && totalCount > 0">
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
              <label class="self-center font-medium text-sm">Sort By</label>
              <Listbox v-model="selectedOrder" class="ml-3 min-w-[115px]">
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
                    <span class="block truncate">{{
                      selectedOrder.label
                    }}</span>
                    <span
                      class="absolute inset-y-0 right-0 flex items-center pr-2"
                    >
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
                        v-slot="{ active }"
                        v-for="item in sortOptions"
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
              <Listbox v-model="selectedView" class="ml-3 min-w-[100px]">
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
                    <span
                      class="absolute inset-y-0 right-0 flex items-center pr-2"
                    >
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
                        v-slot="{ active }"
                        v-for="item in viewOptions"
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
            <SearchResultsTablePagination
              :totalCount="totalCount"
              :currentPage="currentPage"
            />
          </div>
          <!-- Results -->
          <template v-if="selectedView.label === 'List'">
            <template v-for="result in results" :key="result">
              <div
                class="
                  flex
                  p-4
                  border-b border-slate-900/10
                  dark:border-slate-50/[0.06]
                  energy:border-zinc-700/50
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
                <div class="px-2">
                  <div class="flex justify-between">
                    <div
                      class="
                        basis-[768px]
                        cursor-pointer
                        hover:underline
                        line-clamp-2
                      "
                    >
                      <span
                        class="
                          text-slate-600
                          dark:text-slate-300
                          energy:text-zinc-300
                        "
                        >{{
                          `${"(" + result.title_classification + ") "}`
                        }}</span
                      >
                      <span
                        class="text-black dark:text-white energy:text-white"
                        >{{ result.title }}</span
                      >
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
                    <span v-html="result.highlighted_result" />
                  </div>
                </div>
              </div>
            </template>
          </template>
          <template v-else-if="selectedView.label === 'Grid'">
            <div
              class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-4"
            >
              <template v-for="result in results" :key="result">
                <div
                  class="
                    flex
                    p-4
                    border border-slate-900/10
                    dark:border-slate-50/[0.12]
                    energy:border-zinc-700
                    h-36
                  "
                >
                  <div class="px-2">
                    <div
                      class="
                        basis-[768px]
                        cursor-pointer
                        hover:underline
                        line-clamp-3
                      "
                    >
                      <span
                        class="
                          text-slate-600
                          dark:text-slate-300
                          energy:text-zinc-300
                        "
                        >{{
                          `${"(" + result.title_classification + ") "}`
                        }}</span
                      >
                      <span
                        class="text-black dark:text-white energy:text-white"
                        >{{ result.title }}</span
                      >
                    </div>
                    <div class="mt-2 text-sm">
                      {{ dayjs(result.date_published).format("DD MMM YYYY") }}
                    </div>
                  </div>
                </div>
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
              <template v-for="result in results" :key="result">
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
                              @click="openMedia(result.images.table.secondary)"
                              class="hover:underline"
                            >
                              VIEW MEDIA
                              <span class="sr-only"
                                >Open media for {{ result.title }}</span
                              >
                            </button>
                            <p>|</p>
                            <router-link
                              class="hover:underline"
                              :to="{
                                name: 'demo-article',
                                params: { doc_num: result.doc_num },
                              }"
                              >VIEW ARTICLE
                            </router-link>
                          </div>
                        </div>
                      </div>
                      <img
                        :src="getImgUrl(result.images.table.secondary)"
                        alt=""
                        class="object-cover"
                      />
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
                          }}<span v-if="ind < result.regions.length - 1"
                            >,&nbsp;</span
                          >
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
            <SearchResultsTablePagination
              :totalCount="totalCount"
              :currentPage="currentPage"
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
            <Listbox v-model="selectedOrder" class="ml-3 min-w-[110px]">
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
                  <span class="block truncate">{{ selectedOrder.label }}</span>
                  <span
                    class="absolute inset-y-0 right-0 flex items-center pr-2"
                  >
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
                      v-slot="{ active }"
                      v-for="item in sortOptions"
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
            <Listbox v-model="selectedView" class="ml-3 min-w-[110px]">
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
                  <span
                    class="absolute inset-y-0 right-0 flex items-center pr-2"
                  >
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
                      v-slot="{ active }"
                      v-for="item in viewOptions"
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
      <TransitionRoot appear :show="isMobileFacetsDialogOpen" as="template">
        <Dialog as="div" @close="closeMobileFacetsDialog">
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
                      <span class="sr-only">Close navigation</span
                      ><XIcon class="h-5 w-5" aria-hidden="true" />
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
import { ChevronUpIcon, SelectorIcon, XIcon } from "@heroicons/vue/outline";
import SearchResultsTablePagination from "@/components/SearchResultsTablePagination";
import SearchResultsFacets from "@/components/SearchResultsFacets";
import { metadata } from "@/config";

const sortOptions = [
  { label: "Newest", key: "desc" },
  { label: "Oldest", key: "asc" },
];
const viewOptions = [
  { label: "List", key: "list" },
  { label: "Grid", key: "grid" },
  { label: "Visuals", key: "visuals" },
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
    ChevronUpIcon,
    SelectorIcon,
    XIcon,
    SearchResultsTablePagination,
    SearchResultsFacets,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const getCodeFromCountryName = (name) => {
      return metadata.countries.items.find((country) => country.name === name);
    };

    const getValueForCode = (list, code) => {
      return list.find((item) => item.code === code);
    };

    const getSubregionNameForCountryCode = (code) => {
      return metadata.subregions.items.find((subregion) => {
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
      return name === "countries"
        ? getSubregionNameForCountryCode(
            getCodeFromCountryName(params.name).key
          )
        : "";
    };

    const pageHeader = ref(getHeaderName(route));
    const pageSubheader = ref(getSubheaderName(route));

    const loading = computed(() => store.state.search.loading);
    const results = computed(() => store.state.search.results);
    const totalCount = computed(() => store.state.search.totalCount);
    const aggregations = computed(() => store.state.search.aggregations);

    const loadingMetadata = computed(() => store.state.metadata.loading);

    const criteriaRegions = computed(
      () => store.state.metadata.criteria.regions
    );
    const criteriaSubregions = computed(
      () => store.state.metadata.criteria.subregions
    );
    const criteriaCountries = computed(
      () => store.state.metadata.criteria.countries
    );
    const criteriaClassifications = computed(
      () => store.state.metadata.criteria.classification
    );
    const criteriaMediaTypes = computed(
      () => store.state.metadata.criteria.media_tags
    );
    const criteriaNonStateActors = computed(
      () => store.state.metadata.criteria.non_state_actors
    );
    const criteriaFrontPageFeatured = computed(
      () => store.state.metadata.criteria.selected_for
    );
    const criteriaReportingTypes = computed(
      () => store.state.metadata.criteria.reporting_types
    );
    const criteriaProductTypes = computed(
      () => store.state.metadata.criteria.product_types
    );
    const criteriaIssues = computed(() => store.state.metadata.criteria.issues);

    const selectedOrder = ref(
      route.query.sort_dir === "asc" ? sortOptions[1] : sortOptions[0]
    );
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

    /* 
      - Takes a list of types (e.g: ['countries[]', 'regions[]']) and a list of list box items
      - 1) Looks in the route query if any of types are present there
      - 2) For each type found in the query, it loops through the values for that query property
      - 3) Each value is then matched up against the list of list box items and pushed into the 'selectedModels' array
      - 4) The selectedModels represents the list of currently selected items in the list box
    */
    const currentModel = (types, list) => {
      const selectedModels = [];
      console.log("CODE: list: ", list);
      types.forEach((type) => {
        console.log("CODE: types: ", types);
        console.log("CODE route: ", route);
        if (route.query[type]) {
          if (!Array.isArray(route.query[type])) {
            route.query[type] = [route.query[type]];
          }
          console.log("CODE route.query[type]: ", route.query[type]);
          for (let i = 0; i < route.query[type].length; i++) {
            selectedModels.push(
              list.find((item) => item.code === route.query[type][i])
            );
          }
        }
      });
      //TODO: Delete console.log("selectedModels: ", selectedModels);
      console.log("CODE: selectedModels: ", selectedModels);
      return selectedModels;
    };

    const buildListItems = (items, type) => {
      return items.map((item) => ({ ...item, type }));
    };

    const buildRegions = () => {
      let items = [];
      criteriaRegions.value.forEach((region) => {
        items.push({ ...region, type: "regions[]" });
        if (region.subregions.length > 1) {
          region.subregions.forEach((subregionCode) => {
            const subregion = getValueForCode(
              criteriaSubregions.value,
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
      criteriaCountries.value.forEach((country) => {
        items.push({ ...country, type: "countries[]" });
      });
      return items;
    };

    const buildIssues = () => {
      let items = [];
      criteriaIssues.value.forEach((issue) => {
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
      criteriaReportingTypes.value.forEach((reportingType) => {
        items.push({ ...reportingType, type: "reporting_types[]" });
        reportingType.productTypes.forEach((productTypeCode) => {
          const productType = getValueForCode(
            criteriaProductTypes.value,
            productTypeCode
          );
          console.log("productType: ", productType);
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

    const issueItems = buildIssues();
    const reportingItems = buildReportingTypes();
    const classificationItems = buildListItems(
      criteriaClassifications.value,
      "classifications[]"
    );
    const mediaItems = buildListItems(criteriaMediaTypes.value, "media_tags[]");
    const nonStateItems = buildListItems(
      criteriaNonStateActors.value,
      "non_state_actors[]"
    );
    const frontPageItems = buildListItems(
      criteriaFrontPageFeatured.value,
      "selected_for[]"
    );
    const regionsItems = buildRegions();

    const buildQueryFilters = () => {
      return {
        regions: {
          label: "Regions & Countries",
          model: currentModel(
            ["regions[]", "subregions[]", "countries[]"],
            regionsItems
          ),
          list: regionsItems,
          types: ["regions[]", "subregions[]", "countries[]"],
        },
        issues: {
          label: "Issues & Topics",
          model: currentModel(["issues[]", "topics[]"], issueItems),
          list: issueItems,
          types: ["issues[]", "topics[]"],
        },
        reporting: {
          label: "Reporting & Product Types",
          model: currentModel(
            ["reporting_types[]", "product_types[]"],
            reportingItems
          ),
          list: reportingItems,
          types: ["reporting_types[]", "product_types[]"],
        },
        classifications: {
          label: "Classifications",
          model: currentModel(["classifications[]"], classificationItems),
          list: classificationItems,
          types: ["classifications[]"],
        },
        media_types: {
          label: "Media Types",
          model: currentModel(["media_tags[]"], mediaItems),
          list: mediaItems,
          types: ["media_tags[]"],
        },
        nonstate_actors: {
          label: "Non State Actors",
          model: currentModel(["non_state_actors[]"], nonStateItems),
          list: nonStateItems,
          types: ["non_state_actors[]"],
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
          model: currentModel(["selected_for[]"], frontPageItems),
          list: frontPageItems,
          types: ["selected_for[]"],
        },
      };
    };

    const queryFilters = ref(buildQueryFilters());

    /*
      - This method builds a watcher for each query filter in order to track changes at the individual listbox level
      - 1) First, a query value is initialized that contains a copy of the existing query.
      - 2) The types present in this query filter are then removed from the newly created query object
      - 3) If the query filter's model values are empty, this skips to step 6
      - 4) The unique types present in the query filter's model are identified
      - 5) Each unique type is matched up against the query filter's model values (selected items) and the query is updated for each type
      - 6) The updated query is sent to the router via a router.replace and this fires off a query update
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
            console.log("uniqueTypes: ", uniqueTypes);
            for (let i = 0; i < uniqueTypes.length; i++) {
              let valuesForType = [];
              for (let j = 0; j < newValue.model.length; j++) {
                console.log("newValue.model: ", newValue.model);
                if (newValue.model[j].type === uniqueTypes[i]) {
                  valuesForType.push(newValue.model[j].code);
                }
              }
              console.log("valuesForType after: ", valuesForType);
              query[uniqueTypes[i]] = valuesForType;
            }
          }
          console.log("query: ", query);
          router.replace({
            name: "demo-search",
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

    buildQueryWatchers(queryFilters.value);

    const isMobileFacetsDialogOpen = ref(false);

    onMounted(() => {
      store.dispatch("search/search");
    });

    watch([selectedOrder], () => {
      router.push({
        query: {
          ...route.query,
          page: currentPage.value,
          sort_dir: selectedOrder.value.key,
        },
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

    watch(
      () => route.query,
      () => {
        console.log("route.query watcher triggered.");
        if (
          route.name === "demo-search" ||
          route.name === "issues" ||
          route.name === "regions" ||
          route.name === "subregions" ||
          route.name === "countries"
        ) {
          store.dispatch("search/search");
          pageHeader.value = getHeaderName(route);
          pageSubheader.value = getSubheaderName(route);
          queryFilters.value = buildQueryFilters();
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

    watch(
      () => queryFilters,
      () => {
        buildQueryWatchers(queryFilters.value);
      },
      { deep: true }
    );

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
      selectedOrder,
      sortOptions,
      selectedView,
      viewOptions,
      pageHeader,
      pageSubheader,
      loading,
      //TODO: organize below
      loadingMetadata,
      results,
      totalCount,
      aggregations,
      currentPage,
      queryFilters,
      isMobileFacetsDialogOpen,
      closeMobileFacetsDialog,
      openMobileFacetsDialog,
      getImgUrl,
      openMedia,
    };
  },
};
</script>
<style scoped lang="scss">
</style>
