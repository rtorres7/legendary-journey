<template>
  <div class="flex bg-white md:border-r border-slate-900/10">
    <!-- Less than sm -->
    <div
      class="w-full flex md:hidden justify-between items-center h-16 px-8 border-b bg-white text-gray-900 z-[5]"
    >
      <div class="flex">
        <button
          type="button"
          class="max-w-xs rounded-full flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
          @click="open"
        >
          <span class="sr-only">Open main menu</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>
        <router-link
          to="/"
          class="text-indigo-700 ml-6 flex mx-auto items-center"
        >
          <div class="rounded-full bg-indigo-200 p-2">
            <VideoCameraIconSolid class="h-6 w-6" aria-hidden="true" />
          </div>
          <span class="ml-3 font-bold text-xl">Studio</span>
        </router-link>
      </div>
      <div class="flex">
        <div class="flex space-x-4 px-4">
          <button
            class="max-w-xs rounded-full flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <span class="sr-only">Search</span>
            <MagnifyingGlassIcon class="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            class="max-w-xs rounded-full flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <span class="sr-only">Notifications</span>
            <BellIcon class="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div class="pl-4 border-l border-slate-900/10">
          <!-- Profile dropdown -->
          <Menu as="div" class="block md:hidden relative">
            <div>
              <tippy content="User Menu" theme="studio">
                <MenuButton
                  class="max-w-xs rounded-full flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  <span class="sr-only">Open user menu.</span>
                  <img
                    src="@/shared/assets/mocks/avatar.jpg"
                    class="rounded-full w-7 h-7"
                  />
                </MenuButton>
              </tippy>
            </div>
            <transition
              enterActiveClass="transition ease-out duration-100"
              enterFromClass="transform opacity-0 scale-95"
              enterToClass="transform opacity-100 scale-100"
              leaveActiveClass="transition ease-in duration-75"
              leaveFromClass="transform opacity-100 scale-100"
              leaveToClass="transform opacity-0 scale-95"
            >
              <MenuItems
                class="origin-top-right absolute right-0 mt-2 w-[200px] rounded-md shadow-lg py-2 text-gray-900 ring-1 bg-white ring-gray-900 ring-opacity-5 focus:outline-none text-xs"
              >
                <MenuItem>
                  <router-link
                    to="/"
                    class="flex cursor-pointer py-2 px-3 hover:bg-gray-100"
                  >
                    Jonathan Oszczakiewicz
                  </router-link>
                </MenuItem>
                <MenuItem>
                  <a
                    class="flex cursor-pointer py-2 px-3 hover:bg-gray-100"
                    target="_blank"
                    >User Support
                  </a>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
    </div>
    <!--- md to xl --->
    <div class="hidden md:block 2xl:hidden">
      <div class="flex grow-0 flex-col max-h-full min-h-screen w-[80px]">
        <div class="flex grow flex-col pt-6">
          <div class="flex justify-center items-center pb-6">
            <router-link to="/studio">
              <div class="rounded-full bg-indigo-200 p-3">
                <VideoCameraIconSolid
                  class="h-6 w-6 text-indigo-700"
                  aria-hidden="true"
                />
              </div>
            </router-link>
          </div>
          <template
            v-if="
              isActiveRoute('studio-issue-detail') ||
              isActiveRoute('studio-issue-metrics')
            "
          >
            <ul class="pl-4 py-4 text-gray-500 space-y-1">
              <li>
                <tippy content="Issue Details" placement="right" theme="studio">
                  <div
                    :class="
                      isActiveRoute('studio-issue-detail')
                        ? 'text-indigo-700 bg-indigo-500/10 rounded-l-lg border-r border-r-indigo-700'
                        : 'hover:text-indigo-700'
                    "
                    class="cursor-pointer"
                  >
                    <router-link
                      :to="'/studio/issue/is-001'"
                      class="flex items-center justify-center h-12 w-12"
                    >
                      <template v-if="isActiveRoute('studio-issue-detail')">
                        <PencilIconSolid class="h-6 w-6" aria-hidden="true" />
                      </template>
                      <template v-else>
                        <PencilIcon class="h-6 w-6" aria-hidden="true" />
                      </template>
                    </router-link>
                  </div>
                </tippy>
              </li>
              <li>
                <tippy content="Issue Metrics" placement="right" theme="studio">
                  <div
                    :class="
                      isActiveRoute('studio-issue-metrics')
                        ? 'text-indigo-700 bg-indigo-500/10 rounded-l-lg border-r border-r-indigo-700'
                        : 'hover:text-indigo-700'
                    "
                    class="cursor-pointer"
                  >
                    <router-link
                      :to="'/studio/issue/is-001/metrics'"
                      class="flex items-center justify-center h-12 w-12"
                    >
                      <template v-if="isActiveRoute('studio-issue-metrics')">
                        <ChartBarIconSolid class="h-6 w-6" aria-hidden="true" />
                      </template>
                      <template v-else>
                        <ChartBarIcon class="h-6 w-6" aria-hidden="true" />
                      </template>
                    </router-link>
                  </div>
                </tippy>
              </li>
            </ul>
            <span class="mx-4 border-t border-slate-900/10"></span>
          </template>
          <template
            v-for="(category, index) in navigationItems"
            :key="category"
          >
            <ul class="pl-4 py-4 text-gray-500 space-y-1">
              <template
                v-for="categoryItem in category.items"
                :key="categoryItem"
              >
                <li>
                  <div
                    :class="
                      isActiveRoute(categoryItem.routeName)
                        ? 'text-indigo-700 bg-indigo-500/10 rounded-l-lg border-r border-r-indigo-700'
                        : 'hover:text-indigo-700'
                    "
                    class="cursor-pointer"
                  >
                    <tippy
                      :content="categoryItem.tooltip"
                      placement="right"
                      theme="studio"
                    >
                      <router-link
                        :to="categoryItem.routeLink"
                        class="flex items-center justify-center h-12 w-12"
                      >
                        <template v-if="isActiveRoute(categoryItem.routeName)">
                          <component
                            :is="categoryItem.icon + 'IconSolid'"
                            class="h-6 w-6"
                            aria-hidden="true"
                          />
                        </template>
                        <template v-else>
                          <component
                            :is="categoryItem.icon + 'Icon'"
                            class="h-6 w-6"
                            aria-hidden="true"
                          />
                        </template>
                      </router-link>
                    </tippy>
                  </div>
                </li>
              </template>
            </ul>
            <template v-if="index < navigationItems.length - 1">
              <span class="mx-4 border-t border-slate-900/10"></span>
            </template>
          </template>
        </div>
        <div class="pb-6 grow-0">
          <ul class="pl-7 py-4 font-medium text-gray-500 space-y-1">
            <li>
              <div>
                <tippy content="Settings" placement="right" theme="studio">
                  <div
                    class="flex items-center py-2 cursor-pointer hover:text-indigo-700"
                  >
                    <Cog8ToothIcon class="h-6 w-6" aria-hidden="true" />
                  </div>
                </tippy>
              </div>
            </li>
            <li>
              <tippy content="Help" placement="right" theme="studio">
                <div
                  class="flex items-center py-2 cursor-pointer hover:text-indigo-700"
                >
                  <QuestionMarkCircleIcon class="h-6 w-6" aria-hidden="true" />
                </div>
              </tippy>
            </li>
            <li>
              <tippy content="Exit Demo" placement="right" theme="studio">
                <router-link to="/">
                  <div
                    class="flex items-center py-2 cursor-pointer hover:text-indigo-700"
                  >
                    <ArrowLeftOnRectangleIcon
                      class="h-6 w-6"
                      aria-hidden="true"
                    />
                  </div>
                </router-link>
              </tippy>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!--- 2xl or higher - TODO: Rework how the width works --->
    <div class="hidden 2xl:block">
      <div
        class="flex grow-0 flex-col max-h-full min-h-screen w-[250px] text-sm"
      >
        <div class="flex grow flex-col pt-6">
          <div class="text-indigo-700 flex px-4 pb-6">
            <router-link to="/studio" class="flex items-center px-4">
              <div class="rounded-full bg-indigo-200 p-3">
                <VideoCameraIconSolid class="h-6 w-6" aria-hidden="true" />
              </div>
              <span class="ml-4 font-bold text-2xl">Studio</span>
            </router-link>
          </div>
          <template
            v-if="
              isActiveRoute('studio-issue-detail') ||
              isActiveRoute('studio-issue-metrics')
            "
          >
            <div class="text-gray-400 font-medium px-8 py-2 text-sm">Issue</div>
            <ul class="pl-6 py-4 font-medium text-gray-500 space-y-1 text-sm">
              <li>
                <div>
                  <router-link :to="'/studio/issue/is-001'">
                    <div
                      :class="
                        isActiveRoute('studio-issue-detail')
                          ? 'text-indigo-700 bg-indigo-500/10 rounded-l-lg border-r border-r-indigo-700'
                          : 'hover:text-indigo-700'
                      "
                      class="flex items-center px-4 py-3 cursor-pointer"
                    >
                      <template v-if="isActiveRoute('studio-issue-detail')">
                        <PencilIconSolid class="h-6 w-6" aria-hidden="true" />
                      </template>
                      <template v-else>
                        <PencilIcon class="h-6 w-6" aria-hidden="true" />
                      </template>
                      <span class="ml-4 font-medium">Details</span>
                    </div>
                  </router-link>
                </div>
              </li>
              <li>
                <div>
                  <router-link :to="'/studio/issue/is-001/metrics'">
                    <div
                      :class="
                        isActiveRoute('studio-issue-metrics')
                          ? 'text-indigo-700 bg-indigo-500/10 rounded-l-lg border-r border-r-indigo-700'
                          : 'hover:text-indigo-700'
                      "
                      class="flex items-center px-4 py-3 cursor-pointer"
                    >
                      <template v-if="isActiveRoute('studio-issue-metrics')">
                        <ChartBarIconSolid class="h-6 w-6" aria-hidden="true" />
                      </template>
                      <template v-else>
                        <ChartBarIcon class="h-6 w-6" aria-hidden="true" />
                      </template>
                      <span class="ml-4 font-medium">Metrics</span>
                    </div>
                  </router-link>
                </div>
              </li>
            </ul>
          </template>
          <template v-for="category in navigationItems" :key="category">
            <div class="text-gray-400 font-medium px-8 py-2">
              {{ category.categoryLabel }}
            </div>
            <ul class="pl-6 py-3 font-medium text-gray-500 space-y-1">
              <template
                v-for="categoryItem in category.items"
                :key="categoryItem"
              >
                <li>
                  <div>
                    <router-link :to="categoryItem.routeLink">
                      <div
                        :class="
                          isActiveRoute(categoryItem.routeName)
                            ? 'text-indigo-700 bg-indigo-500/10 rounded-l-lg border-r border-r-indigo-700'
                            : 'hover:text-indigo-700'
                        "
                        class="flex items-center px-4 py-3 cursor-pointer"
                      >
                        <template v-if="isActiveRoute(categoryItem.routeName)">
                          <component
                            :is="categoryItem.icon + 'IconSolid'"
                            class="h-6 w-6"
                            aria-hidden="true"
                          />
                        </template>
                        <template v-else>
                          <component
                            :is="categoryItem.icon + 'Icon'"
                            class="h-6 w-6"
                            aria-hidden="true"
                          />
                        </template>
                        <span class="ml-4 font-medium">{{
                          categoryItem.itemLabel
                        }}</span>
                      </div>
                    </router-link>
                  </div>
                </li>
              </template>
            </ul>
          </template>
        </div>
        <div class="pb-4 grow-0">
          <ul class="pl-6 py-4 font-medium text-gray-500 space-y-1">
            <li>
              <div>
                <div
                  class="flex items-center px-4 py-2 cursor-pointer hover:text-indigo-700"
                >
                  <Cog8ToothIcon class="h-6 w-6" aria-hidden="true" />
                  <span class="ml-4 font-medium">Settings</span>
                </div>
              </div>
            </li>
            <li>
              <div>
                <div
                  class="flex items-center px-4 py-2 cursor-pointer hover:text-indigo-700"
                >
                  <QuestionMarkCircleIcon class="h-6 w-6" aria-hidden="true" />
                  <span class="ml-4 font-medium">Help</span>
                </div>
              </div>
            </li>
            <li>
              <router-link to="/">
                <div
                  class="flex items-center px-4 py-2 cursor-pointer hover:text-indigo-700"
                >
                  <ArrowLeftOnRectangleIcon
                    class="h-6 w-6"
                    aria-hidden="true"
                  />
                  <span class="ml-4 font-medium">Exit Demo</span>
                </div>
              </router-link>
            </li>
          </ul>
          <!-- <div class="flex justify-between border-t border-slate-900/10 py-6">
            <div class="flex">
              <img
                src="@/shared/assets/mocks/avatar.jpg"
                class="rounded-full w-[45px]"
              />
              <div class="ml-3 max-w-[170px]">
                <div class="font-semibold text-xs line-clamp-1">
                  Jonathan Oszczakiewicz
                </div>
                <div class="font-medium text-xs text-gray-400">
                  Test Engineer
                </div>
              </div>
            </div>
            <button class="text-gray-500 hover:text-gray-700">
              <span class="sr-only">User Menu</span>
              <EllipsisVerticalIcon class="h-7 w-7" />
            </button>
          </div> -->
        </div>
      </div>
    </div>
  </div>
  <!-- Dialog (Mobile Only)-->
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" class="block md:hidden" @close="close">
      <div class="fixed z-20 inset-0 overflow-y-auto w-full">
        <div class="min-h-screen text-center">
          <TransitionChild
            as="template"
            enter="transition-opacity ease-linear duration-300"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black/25" />
          </TransitionChild>
          <TransitionChild
            as="template"
            enter="transform transition ease-in-out duration-300"
            enter-from="-translate-x-full"
            enter-to="translate-x-0"
            leave="transform transition ease-in-out duration-300"
            leave-from="translate-x-0"
            leave-to="-translate-x-full"
          >
            <DialogPanel
              class="relative min-h-screen w-72 max-w-calc[(100%-3rem)] p-6 text-left align-top transition-all transform text-gray-500 bg-white shadow-lg"
            >
              <button
                type="button"
                class="absolute top-5 right-5 w-8 h-8 flex items-center justify-center hover:text-gray-700"
                tabindex="0"
                @click="close"
              >
                <span class="sr-only">Close main menu</span
                ><XMarkIcon class="h-5 w-5" aria-hidden="true" />
              </button>
              <div class="flex text-indigo-700 py-6">
                <router-link
                  to="/studio"
                  class="ml-4 flex mx-auto items-center"
                >
                  <div class="rounded-full bg-indigo-200 p-3">
                    <VideoCameraIconSolid class="h-6 w-6" aria-hidden="true" />
                  </div>
                  <span class="ml-3 font-bold text-2xl">Studio</span>
                </router-link>
              </div>
              <div class="text-sm">
                <template
                  v-if="
                    isActiveRoute('studio-issue-detail') ||
                    isActiveRoute('studio-issue-metrics')
                  "
                >
                  <div class="text-gray-400 font-medium py-2 px-4">Issue</div>
                  <ul class="py-4 pl-4 font-medium text-gray-500 space-y-1">
                    <li>
                      <div>
                        <router-link :to="'/studio/issue/is-001'">
                          <div
                            :class="
                              isActiveRoute('studio-issue-detail')
                                ? 'text-indigo-700 bg-indigo-500/10 '
                                : 'hover:text-indigo-700 '
                            "
                            class="flex items-center px-4 py-3 rounded cursor-pointer w-[200px]"
                          >
                            <template
                              v-if="isActiveRoute('studio-issue-detail')"
                            >
                              <PencilIconSolid
                                class="h-6 w-6"
                                aria-hidden="true"
                              />
                            </template>
                            <template v-else>
                              <PencilIcon class="h-6 w-6" aria-hidden="true" />
                            </template>
                            <span class="ml-4">Details</span>
                          </div>
                        </router-link>
                      </div>
                    </li>
                    <li>
                      <div>
                        <router-link
                          :to="'/studio/issue/is-001/metrics'"
                          class=""
                        >
                          <div
                            :class="
                              isActiveRoute('studio-issue-metrics')
                                ? 'text-indigo-700 bg-indigo-500/10 '
                                : 'hover:text-indigo-700 '
                            "
                            class="flex items-center px-4 py-3 rounded cursor-pointer w-[200px]"
                          >
                            <template
                              v-if="isActiveRoute('studio-issue-metrics')"
                            >
                              <ChartBarIconSolid
                                class="h-6 w-6"
                                aria-hidden="true"
                              />
                            </template>
                            <template v-else>
                              <ChartBarIcon
                                class="h-6 w-6"
                                aria-hidden="true"
                              />
                            </template>
                            <span class="ml-4">Metrics</span>
                          </div>
                        </router-link>
                      </div>
                    </li>
                  </ul>
                </template>
                <template v-for="category in navigationItems" :key="category">
                  <div class="text-gray-400 font-medium py-2 px-4">
                    {{ category.categoryLabel }}
                  </div>
                  <ul class="py-3 pl-4 font-medium text-gray-500 space-y-1">
                    <template
                      v-for="categoryItem in category.items"
                      :key="categoryItem"
                    >
                      <li>
                        <div>
                          <router-link :to="categoryItem.routeLink" class="">
                            <div
                              :class="
                                isActiveRoute(categoryItem.routeName)
                                  ? 'text-indigo-700 bg-indigo-500/10 '
                                  : 'hover:text-indigo-700 '
                              "
                              class="flex items-center px-4 py-3 rounded cursor-pointer w-[200px]"
                            >
                              <template
                                v-if="isActiveRoute(categoryItem.routeName)"
                              >
                                <component
                                  :is="categoryItem.icon + 'IconSolid'"
                                  class="h-6 w-6"
                                  aria-hidden="true"
                                />
                              </template>
                              <template v-else>
                                <component
                                  :is="categoryItem.icon + 'Icon'"
                                  class="h-6 w-6"
                                  aria-hidden="true"
                                />
                              </template>
                              <span class="ml-4">{{
                                categoryItem.itemLabel
                              }}</span>
                            </div>
                          </router-link>
                        </div>
                      </li>
                    </template>
                  </ul>
                </template>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<script>
import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  BellIcon,
  BriefcaseIcon,
  BookmarkIcon,
  ChartBarIcon,
  CalendarDaysIcon,
  Cog8ToothIcon,
  ComputerDesktopIcon,
  // EllipsisVerticalIcon,
  NewspaperIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  PencilIcon,
  QuestionMarkCircleIcon,
  RectangleStackIcon,
  SignalIcon,
  Squares2X2Icon,
  SunIcon,
  WrenchIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import {
  BriefcaseIcon as BriefcaseIconSolid,
  BookmarkIcon as BookmarkIconSolid,
  ChartBarIcon as ChartBarIconSolid,
  CalendarDaysIcon as CalendarDaysIconSolid,
  MagnifyingGlassIcon as MagnifyingGlassIconSolid,
  NewspaperIcon as NewspaperIconSolid,
  PencilIcon as PencilIconSolid,
  RectangleStackIcon as RectangleStackIconSolid,
  SignalIcon as SignalIconSolid,
  Squares2X2Icon as Squares2X2IconSolid,
  VideoCameraIcon as VideoCameraIconSolid,
} from "@heroicons/vue/24/solid";
const themeOptions = ["light", "dark", "system"];
export default {
  components: {
    Dialog,
    DialogPanel,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    TransitionChild,
    TransitionRoot,
    ArrowLeftOnRectangleIcon,
    Bars3Icon,
    BellIcon,
    BriefcaseIcon,
    BriefcaseIconSolid,
    BookmarkIcon,
    BookmarkIconSolid,
    ChartBarIcon,
    ChartBarIconSolid,
    CalendarDaysIcon,
    CalendarDaysIconSolid,
    Cog8ToothIcon,
    ComputerDesktopIcon,
    // EllipsisVerticalIcon,
    NewspaperIcon,
    NewspaperIconSolid,
    MagnifyingGlassIcon,
    MagnifyingGlassIconSolid,
    MoonIcon,
    PencilIcon,
    PencilIconSolid,
    QuestionMarkCircleIcon,
    RectangleStackIcon,
    RectangleStackIconSolid,
    SignalIcon,
    SignalIconSolid,
    Squares2X2Icon,
    Squares2X2IconSolid,
    SunIcon,
    VideoCameraIconSolid,
    WrenchIcon,
    XMarkIcon,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const route = useRoute();

    const isOpen = ref(false);
    const removeSearch = ref(false);
    const searches = computed(() => store.state.savedSearches.searches);
    const loading = computed(() => store.state.savedSearches.loading);
    const isDark = ref(localStorage.getItem("theme") === "dark" ? true : false);
    if (localStorage.getItem("theme") === "system") {
      isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? true
        : false;
    }
    const selectedTheme = ref(localStorage.getItem("theme"));

    const close = () => {
      isOpen.value = false;
    };

    const open = () => {
      isOpen.value = true;
    };

    const navigationItems = [
      {
        categoryLabel: "Menu",
        items: [
          {
            itemLabel: "Dashboard",
            icon: "Squares2X2",
            tooltip: "Dashboard",
            routeLink: "/studio",
            routeName: "studio",
          },
          {
            itemLabel: "Find",
            icon: "MagnifyingGlass",
            tooltip: "Find",
            routeLink: "/studio/find",
            routeName: "studio-find",
          },
          {
            itemLabel: "Saved",
            icon: "Bookmark",
            tooltip: "Saved",
            routeLink: "/studio/saved",
            routeName: "studio-saved",
          },
          {
            itemLabel: "My Portfolio",
            icon: "Briefcase",
            tooltip: "My Portfolio",
            routeLink: "/studio/portfolio",
            routeName: "studio-portfolio",
          },
        ],
      },
      {
        categoryLabel: "Content Management",
        items: [
          {
            itemLabel: "Live",
            icon: "Signal",
            tooltip: "Live Content",
            routeLink: "/studio/live",
            routeName: "studio-live",
          },
          {
            itemLabel: "Calendar",
            icon: "CalendarDays",
            tooltip: "Content Calendar",
            routeLink: "/studio/calendar",
            routeName: "studio-calendar",
          },
          {
            itemLabel: "Issues",
            icon: "Newspaper",
            tooltip: "Issues",
            routeLink: "/studio/issues",
            routeName: "studio-issues",
          },
          {
            itemLabel: "Products",
            icon: "RectangleStack",
            tooltip: "Products",
            routeLink: "/studio/products",
            routeName: "studio-products",
          },
        ],
      },
    ];

    const changeTheme = (newTheme) => {
      selectedTheme.value = newTheme;
      localStorage.setItem("theme", newTheme);
      if (localStorage.theme === "system") {
        isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? true
          : false;
        document.documentElement.classList.remove(
          ...document.documentElement.classList
        );
        if (isDark.value) {
          document.documentElement.classList.add("dark");
        }
      } else {
        document.documentElement.classList.remove(
          ...document.documentElement.classList
        );
        document.documentElement.classList.add(localStorage.theme);
      }
      store.dispatch("localStorage/saveTheme", selectedTheme.value);
    };

    const isActiveTheme = (selection) => {
      if (selection === localStorage.theme) {
        return "text-amber-600";
      }
    };

    watch(selectedTheme, (newTheme) => {
      changeTheme(newTheme);
    });

    const selectItemEventHandler = (item) => {
      console.log("selectItemEventHandler: ", item);
      if (removeSearch.value) {
        console.log("no routing");
        removeSearch.value = false;
      } else {
        router.push({
          name: "search",
          query: {
            text: item.text,
          },
        });
      }
    };

    const isActiveRoute = (name) => {
      return route.name === name;
    };

    return {
      themeOptions,
      searches,
      loading,
      isDark,
      selectedTheme,
      isOpen,
      open,
      close,
      navigationItems,
      changeTheme,
      isActiveTheme,
      selectItemEventHandler,
      isActiveRoute,
    };
  },
};
</script>
<style lang="scss"></style>
