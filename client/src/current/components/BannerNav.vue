<template>
  <nav
    class="no-print text-slate-200 bg-mission-blue/95 dark:text-slate-300 dark:bg-dark-space-blue/95 energy:text-zinc-300 energy:bg-zinc-800/95 sticky top-0 z-10 lg:h-full backdrop-filter backdrop-blur lg:border-b lg:border-b-zinc-700/75"
  >
    <!-- <div
      v-show="isLiveDemo"
      class="flex justify-center items-center bg-emerald-600/80 p-2"
    >
      <p class="text-sm text-white">
        Note: This page is a live preview. The contents of this page are meant
        to showcase future capabilities and gather user feedback.
      </p>
    </div> -->
    <div
      v-if="alertEnabled"
      id="alert-message"
      class="flex justify-between items-center bg-red-800 text-white p-2"
    >
      <div class="flex items-center">
        <ExclamationCircleIcon class="h-6 w-1/3 md:w-20 lg:w-6 mx-3 my-2" />
        <p class="text-sm ml-1" role="alert">
          <span class="sr-only">new notification from Current.</span>
          ALERT: This is a system alert. Ut est iusto decore nonumy, cum no
          mollis saperet. Esse percipitur id sea, mea no dicam aperiri. Ex assum
          quando aliquip his, vero porro voluptaria cum ea. Vero labore
          scribentur.
        </p>
      </div>
      <a
        class="mx-2 text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
        tabindex="0"
        @click="removeAlertMessage"
      >
        <span class="sr-only">Close Alert Message</span>
        <XMarkIcon class="block cursor-pointer h-6 w-6" aria-hidden="true" />
      </a>
    </div>
    <div class="mx-auto pt-2 px-6 lg:px-8">
      <div
        class="relative flex items-center justify-between h-18 pb-2 lg:border-b lg:border-slate-700/50 lg:energy:border-zinc-700/50"
      >
        <!-- Left Nav Bar -->
        <div class="flex h-full items-center">
          <button
            type="button"
            class="block lg:hidden p-1 m-auto rounded-full hover:text-white focus:outline-none focus:ring-1 focus:ring-offset-0 focus:ring-offset-gray-800 focus:ring-white"
            @click="openMainMenuModal"
          >
            <span class="sr-only">Open main menu</span>
            <Bars3Icon class="h-6 w-6" aria-hidden="true" />
          </button>
          <router-link class="hidden lg:block" to="/">
            <img
              class="w-40 h-16 xl:w-48 xl:h-16"
              src="@/assets/nctc_logo.svg"
              alt="NCTC. Seal. Link to homepage."
            />
          </router-link>
        </div>
        <!-- Middle Nav Bar -->
        <BannerSearchBar />
        <!-- Right Nav Bar -->
        <div class="flex items-center space-x-2 xl:space-x-3">
          <!-- Mobile App Menu -->
          <button
            type="button"
            class="block lg:hidden p-1 m-auto rounded-full hover:text-white focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-offset-gray-800 focus:ring-white"
            @click="openUserMenuModal"
          >
            <span class="sr-only">Open user menu</span>
            <EllipsisVerticalIcon class="h-6 w-6" aria-hidden="true" />
          </button>
          <!-- Admin Dropdown -->
          <Menu
            v-show="canManageSpecialEditions || canManageWire"
            v-slot="{ close }"
            as="div"
            class="hidden lg:block ml-3 relative"
          >
            <div>
              <tippy content="Admin Options">
                <MenuButton
                  class="max-w-xs rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                >
                  <span class="sr-only">Admin Menu</span>
                  <WrenchIcon class="h-6 w-6" aria-hidden="true" />
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
                class="origin-top-right absolute right-0 z-10 mt-2 w-48 rounded-md shadow-2xl py-2 ring-1 ring-black ring-opacity-5 focus:outline-none text-sm font-semibold bg-mission-blue/95 dark:bg-dark-space-blue/95 energy:bg-zinc-800/95 dark:ring-0 dark:highlight-white/5 dark:text-slate-300 energy:text-zinc-300 border-x border-b border-slate-700/50 energy:border-zinc-700/50"
                @click="close"
              >
                <MenuItem v-show="canManageWire">
                  <router-link
                    class="py-1 px-3 hover:bg-slate-700/80 dark:hover:bg-slate-600/80 energy:hover:bg-zinc-600/80 flex items-center cursor-pointer"
                    :to="{
                      name: 'products',
                      params: {
                        date: dayjs().format('YYYY-MM-DD'),
                      },
                    }"
                  >
                    Manage Products
                  </router-link>
                </MenuItem>
                <MenuItem v-show="canManageSpecialEditions">
                  <router-link
                    to="/special_editions"
                    class="py-1 px-3 hover:bg-slate-700/80 dark:hover:bg-slate-600/80 energy:hover:bg-zinc-600/80 flex items-center cursor-pointer"
                  >
                    Manage Special Editions
                  </router-link>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
          <!-- <button disabled type="button" class="
              hidden
              lg:block
              p-1
              rounded-full
              hover:text-white
              focus:outline-none
              focus:ring-2
              focus:ring-offset-2
              focus:ring-offset-gray-800
              focus:ring-white
            ">
            <span class="sr-only">View notifications</span>
            <MaxTooltip placement="bottom" icon>
              <BellIcon class="h-6 w-6" aria-hidden="true" />
            </MaxTooltip>
          </button> -->
          <Menu as="div" class="hidden lg:block relative">
            <div>
              <tippy content="Themes">
                <MenuButton
                  class="max-w-xs flex items-center p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  :class="
                    selectedTheme === 'system'
                      ? 'text-slate-400'
                      : 'text-amber-300 dark:text-teal-400 energy:text-energy-yellow'
                  "
                >
                  <span class="sr-only"
                    >Open menu for toggling color palettes.</span
                  >
                  <template v-if="selectedTheme === 'dark'">
                    <MoonIcon class="h-6 w-6" aria-hidden="true" />
                  </template>
                  <template v-else-if="selectedTheme === 'energy'">
                    <BoltIcon class="h-6 w-6" aria-hidden="true" />
                  </template>
                  <template v-else-if="selectedTheme === 'system'">
                    <template v-if="isDark">
                      <MoonIcon class="h-6 w-6" aria-hidden="true" />
                    </template>
                    <template v-else>
                      <SunIcon class="h-6 w-6" aria-hidden="true" />
                    </template>
                  </template>
                  <template v-else>
                    <SunIcon class="h-6 w-6" aria-hidden="true" />
                  </template>
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
                class="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-2xl py-2 ring-1 ring-black ring-opacity-5 focus:outline-none text-sm font-semibold bg-mission-blue/95 dark:bg-dark-space-blue/95 energy:bg-zinc-800/95 dark:ring-0 dark:highlight-white/5 dark:text-slate-300 energy:text-zinc-300 border-x border-b border-slate-700/50 energy:border-zinc-700/50"
              >
                <MenuItem v-for="item in themeOptions" :key="item">
                  <a
                    :class="isActive(item)"
                    class="py-1 px-2 hover:bg-slate-700/80 dark:hover:bg-slate-600/80 energy:hover:bg-zinc-600/80 flex items-center space-x-2 cursor-pointer"
                    @click="changeTheme(item)"
                  >
                    <template v-if="item === 'light'">
                      <SunIcon class="h-6 w-6" aria-hidden="true" />
                    </template>
                    <template v-else-if="item === 'dark'">
                      <MoonIcon class="h-6 w-6" aria-hidden="true" />
                    </template>
                    <template v-else-if="item === 'energy'">
                      <BoltIcon class="h-6 w-6" aria-hidden="true" />
                    </template>
                    <template v-else-if="item === 'system'">
                      <ComputerDesktopIcon
                        class="h-6 w-6"
                        aria-hidden="true"
                      /> </template
                    ><span class="capitalize">{{ item }}</span></a
                  >
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
          <!-- Profile dropdown -->
          <Menu
            v-slot="{ close }"
            as="div"
            class="hidden lg:block ml-3 relative"
          >
            <div>
              <tippy content="User Menu">
                <MenuButton
                  class="max-w-xs rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                >
                  <span class="sr-only">Open user menu.</span>
                  <UserCircleIcon class="h-8 w-8" aria-hidden="true" />
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
                class="origin-top-right absolute right-0 mt-2 w-52 rounded-md shadow-2xl py-2 ring-1 ring-black ring-opacity-5 focus:outline-none text-sm font-semibold bg-mission-blue/95 dark:bg-dark-space-blue/95 energy:bg-zinc-800/95 dark:ring-0 dark:highlight-white/5 dark:text-slate-300 energy:text-zinc-300 border-x border-b border-slate-700/50 energy:border-zinc-700/50"
                @click="close"
              >
                <MenuItem>
                  <router-link
                    to="/"
                    class="flex cursor-pointer py-1 px-3 hover:bg-slate-700/80 dark:hover:bg-slate-600/80 energy:hover:bg-zinc-600/80"
                  >
                    {{ loadingUser ? "Loading..." : currentUsername }}
                  </router-link>
                </MenuItem>
                <MenuItem>
                  <a
                    class="flex cursor-pointer py-1 px-3 hover:bg-slate-700/80 dark:hover:bg-slate-600/80 energy:hover:bg-zinc-600/80"
                    :href="`${metadata.user_support.help_url}`"
                    target="_blank"
                    >User Support
                  </a>
                </MenuItem>
                <template v-if="environment === 'offline'">
                  <MenuItem>
                    <a
                      class="flex cursor-pointer py-1 px-3 hover:bg-slate-700/80 dark:hover:bg-slate-600/80 energy:hover:bg-zinc-600/80"
                      @click="openTestConsoleModal"
                      >Test Console</a
                    >
                  </MenuItem>
                </template>
              </MenuItems>
            </transition>
          </Menu>
        </div>
      </div>
      <!-- Desktop Navigation -->
      <ul class="hidden lg:flex space-x-10 text-sm justify-center items-center">
        <li>
          <BannerNavPopover :wideShrunk="loadingMetadata ? false : true">
            <template #heading>
              Issues
              <ChevronDownIcon class="h-3 w-3 ml-1" aria-hidden="true" />
            </template>
            <template #content>
              <div class="hidden lg:block lg:mx-6">
                <p class="text-lg font-medium mb-4">Issues</p>
                <template v-if="loadingMetadata">
                  <div class="flex justify-center">
                    <MaxLoadingSpinner class="text-slate-100 h-14 w-14" />
                  </div>
                </template>
                <template v-else>
                  <div
                    class="grid lg:grid-cols-2 xl:grid-cols-3 gap-4 pb-4"
                    aria-label="select an issue"
                  >
                    <template v-for="issue in metadata.issues" :key="issue">
                      <router-link
                        :to="{
                          name: 'issues',
                          params: {
                            name: issue.name,
                          },
                          query: {
                            view: 'grid',
                            landing: true,
                            text: issue.query,
                          },
                        }"
                        class="hover:underline cursor-pointer"
                      >
                        {{ issue.name }}
                      </router-link>
                    </template>
                  </div>
                </template>
              </div>
            </template>
          </BannerNavPopover>
        </li>
        <li>
          <BannerNavPopover :wideShrunk="loadingMetadata ? false : true">
            <template #heading>
              Regions
              <ChevronDownIcon class="h-3 w-3 ml-1" aria-hidden="true" />
            </template>
            <template #content>
              <template v-if="loadingMetadata">
                <div class="hidden lg:block lg:m-auto w-fit">
                  <MaxLoadingSpinner class="text-slate-100 h-20 w-20" />
                </div>
              </template>
              <template v-else>
                <div class="hidden lg:block lg:m-auto">
                  <div
                    class="grid lg:grid-cols-5 xl:grid-cols-7 gap-4 pb-4"
                    aria-label="select a region or subregion"
                  >
                    <div v-for="region in criteria.regions" :key="region">
                      <router-link
                        :to="{
                          name: 'regions',
                          params: {
                            name: region.name,
                          },
                          query: {
                            view: 'grid',
                            landing: true,
                            'regions[]': region.code,
                          },
                        }"
                        class="lg:text-lg hover:underline cursor-pointer"
                      >
                        {{ region.name }}
                      </router-link>
                      <template v-if="region.subregions.length > 1">
                        <ul class="pt-2 list-disc list-inside space-y-3">
                          <template
                            v-for="subregionItem in formattedSubregions(
                              region.subregions
                            )"
                            :key="subregionItem"
                          >
                            <li>
                              <router-link
                                :to="{
                                  name: 'subregions',
                                  params: {
                                    name: subregionItem.name,
                                  },
                                  query: {
                                    view: 'grid',
                                    landing: true,
                                    'subregions[]': subregionItem.code,
                                  },
                                }"
                                class="hover:underline cursor-pointer font-light"
                              >
                                {{ subregionItem.name }}
                              </router-link>
                            </li>
                          </template>
                        </ul>
                      </template>
                    </div>
                  </div>
                  <p
                    class="pt-2 border-t border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25"
                  >
                    View a
                    <a
                      class="underline"
                      aria-label="View a PDF document with a list of countries that fall under each region and subregion"
                      :href="metadata.countries_link"
                      target="_blank"
                    >
                      list of countries
                    </a>
                    that fall under each region and subregion
                  </p>
                </div>
              </template>
            </template>
          </BannerNavPopover>
        </li>
        <li>
          <BannerNavPopover :wideShrunk="loadingMetadata ? false : true">
            <template #heading>
              Countries
              <ChevronDownIcon class="h-3 w-3 ml-1" aria-hidden="true" />
            </template>
            <template #content>
              <template v-if="loadingMetadata">
                <div class="hidden lg:block lg:m-auto w-fit">
                  <MaxLoadingSpinner class="text-slate-100 h-20 w-20" />
                </div>
              </template>
              <template v-else>
                <div class="flex justify-center items-center mb-4 m-auto">
                  <span aria-hidden="true"
                    >Select a country from the map or the dropdown</span
                  >
                  <MaxCombobox
                    v-model="selectedCountry"
                    :items="
                      criteria.countries.filter(
                        (country) => country.code !== 'WW'
                      )
                    "
                    class="w-full max-w-[400px] ml-4"
                  />
                </div>
                <BannerNavMap aria-hidden="true" />
              </template>
            </template>
          </BannerNavPopover>
        </li>
        <li>
          <div
            class="font-semibold flex items-center hover:text-slate-100 dark:hover:text-slate-100 energy:hover:text-energy-yellow"
            tabindex="0"
          >
            <a :href="`/search?&product_types[]=10381&view=grid`">Foreign </a>
          </div>
        </li>
        <li>
          <div
            class="font-semibold flex items-center hover:text-slate-100 dark:hover:text-slate-100 energy:hover:text-energy-yellow"
            tabindex="0"
          >
            <a :href="`/search?&product_types[]=10378&view=grid`">Community </a>
          </div>
        </li>
        <li>
          <BannerNavPopover
            :wideShrunk="loadingSpecialEditionLinks ? false : true"
          >
            <template #heading>
              Special Editions
              <ChevronDownIcon class="h-3 w-3 ml-1" aria-hidden="true" />
            </template>
            <template #content>
              <div class="hidden lg:block lg:mx-6">
                <p class="text-lg font-medium mb-4">Special Editions</p>
                <template v-if="loadingSpecialEditionLinks">
                  <div class="flex justify-center">
                    <MaxLoadingSpinner class="text-slate-100 h-14 w-14" />
                  </div>
                </template>
                <template v-else>
                  <template
                    v-if="
                      specialEditionLinks.posted &&
                      specialEditionLinks.posted.length > 0
                    "
                  >
                    <div
                      class="grid lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-2 pb-4"
                      aria-label="select a special edition"
                    >
                      <template
                        v-for="link in specialEditionLinks.posted"
                        :key="link"
                      >
                        <SpecialEditionLink :link="link" />
                      </template>
                    </div>
                  </template>
                  <template v-else>
                    <p class="italic">
                      There are currently no Special Editions
                    </p>
                  </template>
                </template>
              </div>
            </template>
          </BannerNavPopover>
        </li>
        <li>
          <div
            class="font-semibold flex items-center hover:text-slate-100 dark:hover:text-slate-100 energy:hover:text-energy-yellow"
            tabindex="0"
          >
            <a
              :href="`/search?&product_types[]=10391&product_types[]=10389&product_types[]=10392&product_types[]=10390&view=grid`"
              >Alerts</a
            >
          </div>
        </li>
      </ul>
    </div>
    <!-- Mobile side menu -->
    <MobileSideMenu :isOpen="isMainMenuOpen" @close="closeMainMenuModal" />
    <!-- Mobile user menu -->
    <TransitionRoot appear :show="isUserMenuOpen" as="template">
      <Dialog as="div" class="block lg:hidden" @close="closeUserMenuModal">
        <div class="fixed z-20 overflow-y-auto w-full">
          <div class="min-h-screen px-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="duration-200 ease-in"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div class="fixed inset-0 bg-black/25" />
            </TransitionChild>
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel
                class="inline-block w-full fixed max-w-xs top-2 right-4 p-6 my-8 text-left align-top transition-all transform text-slate-700 dark:text-slate-300 energy:text-zinc-300 bg-slate-100 dark:bg-slate-800 energy:bg-zinc-800 shadow-lg rounded-lg"
              >
                <button
                  type="button"
                  class="absolute top-5 right-5 w-8 h-8 flex items-center justify-center"
                  tabindex="0"
                  @click="closeUserMenuModal"
                >
                  <span class="sr-only">Close user menu</span>
                  <XMarkIcon class="h-5 w-5" aria-hidden="true" />
                </button>
                <ul class="space-y-6">
                  <li>
                    <a
                      class="hover:text-black dark:hover:text-white energy:hover:text-white"
                      >{{ loadingUser ? "Loading..." : currentUsername }}</a
                    >
                  </li>
                  <li v-show="canManageWire">
                    <router-link
                      class="hover:text-black dark:hover:text-white energy:hover:text-white cursor-pointer"
                      :to="{
                        name: 'products',
                        params: {
                          date: dayjs().format('YYYY-MM-DD'),
                        },
                      }"
                      @click="closeUserMenuModal"
                    >
                      Manage Products
                    </router-link>
                  </li>
                  <li v-show="canManageSpecialEditions">
                    <router-link
                      to="/special_editions"
                      class="hover:text-black dark:hover:text-white energy:hover:text-white"
                      @click="closeUserMenuModal"
                    >
                      Manage Special Editions
                    </router-link>
                  </li>
                </ul>
                <ul
                  class="mt-6 pt-6 space-y-4 border-t border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25"
                >
                  <li class="flex items-center justify-between">
                    <label for="theme" class="font-normal">Switch theme</label>
                    <Listbox v-model="selectedTheme">
                      <div class="relative mt-1">
                        <ListboxButton
                          class="flex items-center relative w-full p-2 text-left capitalize bg-white dark:bg-slate-900 energy:bg-zinc-900 rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500"
                        >
                          <template v-if="selectedTheme === 'dark'">
                            <MoonIcon class="h-6 w-6 mr-2" aria-hidden="true" />
                          </template>
                          <template v-else-if="selectedTheme === 'energy'">
                            <BoltIcon class="h-6 w-6 mr-2" aria-hidden="true" />
                          </template>
                          <template v-else-if="selectedTheme === 'system'">
                            <template v-if="isDark">
                              <MoonIcon
                                class="h-6 w-6 mr-2"
                                aria-hidden="true"
                              />
                            </template>
                            <template v-else>
                              <SunIcon
                                class="h-6 w-6 mr-2"
                                aria-hidden="true"
                              />
                            </template>
                          </template>
                          <template v-else>
                            <SunIcon class="h-6 w-6 mr-2" aria-hidden="true" />
                          </template>
                          {{ selectedTheme }}
                          <ChevronDownIcon
                            class="h-4 w-4 ml-2"
                            aria-hidden="true"
                          />
                        </ListboxButton>
                        <ListboxOptions
                          class="absolute w-full py-1 mt-1 overflow-auto text-base bg-white dark:bg-slate-900 energy:bg-zinc-900 rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                        >
                          <ListboxOption
                            v-for="theme in themeOptions"
                            :key="theme"
                            :value="theme"
                            class="capitalize px-2 py-1 cursor-pointer hover:bg-slate-200/80 dark:hover:bg-slate-600/80 energy:hover:bg-zinc-600/80"
                          >
                            {{ theme }}
                          </ListboxOption>
                        </ListboxOptions>
                      </div>
                    </Listbox>
                  </li>
                  <li>
                    <a
                      class="cursor-pointer"
                      :href="`${metadata.user_support.help_url}`"
                      target="_blank"
                      >User Support</a
                    >
                  </li>
                  <template v-if="environment === 'offline'">
                    <li>
                      <a
                        class="cursor-pointer"
                        @click="openTestConsoleModalMobile"
                        >Test Console</a
                      >
                    </li>
                  </template>
                </ul>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
    <TestConsoleDialog
      v-model:alert="alertEnabled"
      :isOpen="isTestConsoleMenuOpen"
      @close="closeTestConsoleModal"
    />
  </nav>
</template>

<script>
import dayjs from "dayjs/esm/index.js";
import { getValueForCode } from "@/current/helpers";
import { inject, ref, watch, computed } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import BannerSearchBar from "@/current/components/BannerSearchBar.vue";
import BannerNavPopover from "@/current/components/BannerNavPopover.vue";
import BannerNavMap from "@/current/components/BannerNavMap.vue";
import SpecialEditionLink from "@/current/components/SpecialEditionLink.vue";
import MobileSideMenu from "@/current/components/MobileSideMenu.vue";
import TestConsoleDialog from "@/current/components/TestConsoleDialog.vue";
import {
  Dialog,
  DialogPanel,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  //BellIcon,
  ChevronDownIcon,
  ComputerDesktopIcon,
  EllipsisVerticalIcon,
  ExclamationCircleIcon,
  BoltIcon,
  Bars3Icon,
  MoonIcon,
  //SearchIcon,
  //ChevronUpDownIcon,
  SunIcon,
  WrenchIcon,
  UserCircleIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";

const themeOptions = ["light", "dark", "energy", "system"];

export default {
  components: {
    BannerSearchBar,
    BannerNavPopover,
    MobileSideMenu,
    TestConsoleDialog,
    BannerNavMap,
    SpecialEditionLink,
    Dialog,
    DialogPanel,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    TransitionChild,
    TransitionRoot,
    //BellIcon,
    WrenchIcon,
    ChevronDownIcon,
    ComputerDesktopIcon,
    EllipsisVerticalIcon,
    ExclamationCircleIcon,
    BoltIcon,
    Bars3Icon,
    MoonIcon,
    //SearchIcon,
    //ChevronUpDownIcon,
    SunIcon,
    UserCircleIcon,
    XMarkIcon,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const metadata = inject("metadata");
    const environment = ref(import.meta.env.MODE);
    const isLiveDemo = computed(() => {
      return route.meta.demo ? true : false;
    });
    const isMainMenuOpen = ref(false);
    const isUserMenuOpen = ref(false);
    const isTestConsoleMenuOpen = ref(false);
    const isDark = ref(localStorage.getItem("theme") === "dark" ? true : false);
    if (localStorage.getItem("theme") === "system") {
      isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? true
        : false;
    }
    const selectedTheme = ref(localStorage.getItem("theme"));
    const loadingMetadata = computed(() => store.state.metadata.loading);
    const criteria = computed(() => store.state.metadata.criteria);

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
    watch(selectedTheme, (newTheme) => {
      changeTheme(newTheme);
    });

    const alertEnabled = ref(false);
    const currentUsername = computed(() => store.state.user.user.name);
    const loadingUser = computed(() => store.state.user.loading);
    const loadingSpecialEditionLinks = computed(
      () => store.state.specialEditions.loading
    );
    const specialEditionLinks = computed(
      () => store.state.specialEditions.links
    );
    const isAdmin = computed(() => store.state.testConsole.admin);
    const canManageWire = computed(() => store.getters["user/canManageWire"]);
    const canManageSpecialEditions = computed(
      () => store.getters["user/canManageSpecialEditions"]
    );
    const selectedCountry = ref(null);

    const removeAlertMessage = () => {
      alertEnabled.value = false;
    };

    const isActive = (selection) => {
      if (selection === localStorage.theme) {
        return "text-amber-300 dark:text-teal-400 energy:text-energy-yellow";
      }
    };

    const closeMainMenuModal = () => {
      isMainMenuOpen.value = false;
    };

    const openMainMenuModal = () => {
      isMainMenuOpen.value = true;
    };

    const closeUserMenuModal = () => {
      isUserMenuOpen.value = false;
    };

    const openUserMenuModal = () => {
      isUserMenuOpen.value = true;
    };

    const closeTestConsoleModal = () => {
      isTestConsoleMenuOpen.value = false;
    };

    const openTestConsoleModal = () => {
      isTestConsoleMenuOpen.value = true;
    };

    // TODO: setTimeout added as a temporary workaround for
    // multiple dialog scroll behavior bug
    const openTestConsoleModalMobile = () => {
      isUserMenuOpen.value = false;
      setTimeout(() => (isTestConsoleMenuOpen.value = true), 500);
    };

    const formattedSubregions = (codes) => {
      const subregions = [];
      codes.forEach((code) => {
        const subregion = getValueForCode(criteria.value.subregions, code);
        subregions.push(subregion);
      });
      return subregions;
    };

    watch([selectedCountry], () => {
      navigateToCountry(selectedCountry.value);
    });

    const navigateToCountry = (country) => {
      let query = {
        view: "grid",
        landing: true,
      };
      query["countries[]"] = country.code;
      router.push({
        name: "countries",
        params: {
          name: country.name,
        },
        query,
      });
    };

    const navigateToPublish = () => {
      const today = dayjs().format("YYYY-MM-DD");
      router.push({
        name: "products",
        params: {
          date: today,
        },
      });
    };

    return {
      dayjs,
      metadata,
      environment,
      isLiveDemo,
      selectedCountry,
      themeOptions,
      isMainMenuOpen,
      isUserMenuOpen,
      isTestConsoleMenuOpen,
      isDark,
      selectedTheme,
      loadingMetadata,
      criteria,
      changeTheme,
      alertEnabled,
      currentUsername,
      loadingUser,
      loadingSpecialEditionLinks,
      specialEditionLinks,
      isAdmin,
      canManageWire,
      canManageSpecialEditions,
      isActive,
      closeMainMenuModal,
      openMainMenuModal,
      closeUserMenuModal,
      openUserMenuModal,
      closeTestConsoleModal,
      openTestConsoleModal,
      openTestConsoleModalMobile,
      removeAlertMessage,
      formattedSubregions,
      navigateToCountry,
      navigateToPublish,
    };
  },
};
</script>
<style lang="scss">
/* Empty on Purpose */
</style>
