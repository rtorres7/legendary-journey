<template>
  <p
    class="
      font-semibold
      text-2xl
      py-4
      border-b-2 border-slate-900/10
      dark:border-slate-50/[0.06]
      energy:border-gray-700/25
    "
  >
    {{ pageHeader }}
  </p>
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
                border-b
                bg-transparent
                border-b border-gray-300
                energy:text-gray-300
                border-b border-gray-300
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
          <div class="lg:basis-2/5 flex space-x-4 lg:max-w-none lg:pr-6">
            <template
              v-for="n in [
                queryFilters.classifications,
                queryFilters.media_types,
              ]"
              :key="n"
            >
              <div class="basis-1/2">
                <BaseListbox
                  v-model="n.model"
                  :label="n.label"
                  :items="n.list"
                  multiple
                />
              </div>
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
              lg:basis-3/5
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
              <div class="lg:basis-1/3 lg:max-w-none">
                <BaseListbox
                  v-model="n.model"
                  :label="n.label"
                  :items="n.list"
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
          energy:text-gray-300
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
              <label class="self-center">Sort By</label>
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
                              ? 'bg-slate-200/80 dark:bg-slate-600 energy:bg-gray-600'
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
                              ? 'bg-slate-200/80 dark:bg-slate-600 energy:bg-gray-600'
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
              energy:border-gray-700/50
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
                  energy:border-gray-700/25
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
                          energy:text-gray-300
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
                      energy:text-gray-300
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
                    energy:border-gray-700
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
                          energy:text-gray-300
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
                          energy:bg-gray-800/[.90]
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
                                name: 'article',
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
                        energy:border-gray-700/25
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
              energy:border-gray-700/50
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
                            ? 'bg-slate-200/80 dark:bg-slate-600 energy:bg-gray-600'
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
                            ? 'bg-slate-200/80 dark:bg-slate-600 energy:bg-gray-600'
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
                    energy:text-gray-300
                    bg-slate-100
                    dark:bg-slate-700
                    energy:bg-gray-700
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
import { getItems } from "@/data";

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

    const getHeaderName = (route) => {
      if (route.name === "issues") {
        return route.params.name ? route.params.name : "Search";
      } else {
        return "Search";
      }
    };

    const pageHeader = ref(getHeaderName(route));

    const loading = computed(() => store.state.search.loading);
    const results = computed(() => store.state.search.results);
    const totalCount = computed(() => store.state.search.totalCount);
    const aggregations = computed(() => store.state.search.aggregations);

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

    const currentModel = (key, list) => {
      if (key) {
        if (Array.isArray(key)) {
          const selectedModels = [];
          key.forEach((k) => {
            selectedModels.push(list.find((item) => item.key === k));
          });
          return selectedModels;
        }
        return [list.find((item) => item.key === key)];
      }
      return [];
    };

    const buildListItems = (items, type) => {
      return items.map((item) => ({ ...item, type }));
    };

    const buildQueryFilters = () => {
      const issueItems = buildListItems(
        metadata.issues.items,
        metadata.issues.type
      );
      const reportingItems = buildListItems(
        metadata.reporting_types.items,
        metadata.reporting_types.type
      );
      const classificationItems = buildListItems(
        metadata.classifications.items,
        metadata.classifications.type
      );
      const mediaItems = buildListItems(
        metadata.media.items,
        metadata.media.type
      );
      return {
        regions: {
          label: "Regions & Countries",
          model: [],
          list: getItems("regions"),
        },
        issues: {
          label: "Issues & Topics",
          model: currentModel(route.query[metadata.issues.type], issueItems),
          list: issueItems,
          types: [metadata.issues.type],
        },
        reporting: {
          label: "Reporting & Product Types",
          model: currentModel(
            route.query[metadata.reporting_types.type],
            reportingItems
          ),
          list: reportingItems,
          types: [metadata.reporting_types.type],
        },
        classifications: {
          label: "Classifications",
          model: currentModel(
            route.query[metadata.classifications.type],
            classificationItems
          ),
          list: classificationItems,
          types: [metadata.classifications.type],
        },
        media_types: {
          label: "Media Types",
          model: currentModel(route.query[metadata.media.type], mediaItems),
          list: mediaItems,
          types: [metadata.media.type],
        },
        nonstate_actors: {
          label: "Non State Actors",
          model: [],
          list: getItems("non-state"),
        },
        producing_offices: {
          label: "Producing Offices",
          model: [],
          list: getItems("producing"),
        },
        frontpage_featured: {
          label: "Front Page Featured",
          model: [],
          list: getItems("front-page"),
        },
      };
    };

    const queryFilters = ref(buildQueryFilters());

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
            let selectedOptions = [];
            for (let i = 0; i < newValue.model.length; i++) {
              selectedOptions.push(newValue.model[i]);
            }
            let uniqueTypes = [];
            for (let i = 0; i < selectedOptions.length; i++) {
              uniqueTypes.push(selectedOptions[i].type);
            }
            uniqueTypes = [...new Set(uniqueTypes)];
            for (let i = 0; i < uniqueTypes.length; i++) {
              let valuesForType = [];
              for (let j = 0; j < selectedOptions.length; j++) {
                if (selectedOptions[j].type === uniqueTypes[i]) {
                  valuesForType.push(selectedOptions[j].key);
                }
              }
              query[uniqueTypes[i]] = valuesForType;
            }
          }
          console.log("query: ", query);
          router.replace({
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

    buildQueryWatchers(queryFilters.value);

    const isMobileFacetsDialogOpen = ref(false);

    onMounted(() => {
      store.dispatch("search/search");
    });

    watch([selectedOrder], () => {
      router.push({
        name: "search",
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
        if (route.name === "search" || route.name === "issues") {
          store.dispatch("search/search");
          pageHeader.value = getHeaderName(route);
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
      loading,
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
