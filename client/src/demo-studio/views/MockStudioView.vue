<template>
  <div class="h-full flex">
    <!-- Left Panel -->
    <!--- Below 2XL but not Mobile --->
    <div class="hidden md:block 2xl:hidden bg-slate-900 min-h-screen w-20">
      <div class="flex flex-col">
        <div
          class="h-16 border-b border-slate-700/50 shadow-slate-700/50 shadow-sm"
        >
          <router-link to="/">
            <img
              class="mx-auto w-16 h-16"
              src="@/assets/nctc_logo.svg"
              alt="NCTC. Seal. Link to homepage."
            />
          </router-link>
        </div>
        <ul class="py-4 mx-auto text-gray-400 space-y-1">
          <li>
            <tippy content="Home   " placement="right" theme="demo">
              <div
                :class="
                  isActivePage('#home')
                    ? 'text-gray-50 bg-slate-800/90'
                    : 'hover:text-gray-50 hover:bg-slate-800/90'
                "
                class="my-auto rounded cursor-pointer"
              >
                <a
                  href="/studio#home"
                  class="flex items-center justify-center h-12 w-12"
                >
                  <HomeIcon class="h-6 w-6" aria-hidden="true" />
                </a>
              </div>
            </tippy>
          </li>
          <li>
            <tippy content="Live Content" placement="right" theme="demo">
              <div
                :class="
                  isActivePage('#live')
                    ? 'text-gray-50 bg-slate-800/90'
                    : 'hover:text-gray-50 hover:bg-slate-800/90'
                "
                class="my-auto rounded cursor-pointer"
              >
                <a
                  href="/studio#live"
                  class="flex items-center justify-center h-12 w-12"
                >
                  <VideoCameraIcon class="h-6 w-6" aria-hidden="true" />
                </a>
              </div>
            </tippy>
          </li>
          <li>
            <tippy content="Issues" placement="right" theme="demo">
              <div
                :class="
                  isActivePage('#issues')
                    ? 'text-gray-50 bg-slate-800/90'
                    : 'hover:text-gray-50 hover:bg-slate-800/90'
                "
                class="my-auto rounded cursor-pointer"
              >
                <a
                  href="/studio#issues"
                  class="flex items-center justify-center h-12 w-12"
                >
                  <NewspaperIcon class="h-6 w-6" aria-hidden="true" />
                </a>
              </div>
            </tippy>
          </li>
        </ul>
      </div>
    </div>
    <!--- 2XL or Above --->
    <div class="hidden 2xl:block bg-slate-900 min-h-screen w-[260px]">
      <div class="flex flex-col">
        <div
          class="h-16 border-b border-slate-700/50 shadow-slate-700/50 shadow-sm"
        >
          <div class="flex">
            <router-link
              to="/"
              class="flex mx-auto items-center px-4 w-[200px]"
            >
              <img
                class="w-16 h-16"
                src="@/assets/nctc_logo.svg"
                alt="NCTC. Seal. Link to homepage."
              />
              <span
                class="ml-2 text-gray-200 font-medium text-xl tracking-tight"
                >Studio</span
              >
            </router-link>
          </div>
        </div>
        <ul class="py-4 mx-auto text-gray-400 space-y-1">
          <li>
            <div>
              <a href="/studio#home" class="">
                <div
                  :class="
                    isActivePage('#home')
                      ? 'text-gray-50 bg-slate-800/90'
                      : 'hover:text-gray-50 hover:bg-slate-800/90'
                  "
                  class="flex items-center px-4 py-3 rounded cursor-pointer w-[200px]"
                >
                  <HomeIcon class="h-6 w-6" aria-hidden="true" />
                  <span class="ml-4">Home</span>
                </div>
              </a>
            </div>
          </li>
          <li>
            <div>
              <a href="/studio#live" class="">
                <div
                  :class="
                    isActivePage('#live')
                      ? 'text-gray-50 bg-slate-800/90'
                      : 'hover:text-gray-50 hover:bg-slate-800/90'
                  "
                  class="flex items-center px-4 py-3 rounded cursor-pointer w-[200px]"
                >
                  <VideoCameraIcon class="h-6 w-6" aria-hidden="true" />
                  <span class="ml-4">Live Content</span>
                </div>
              </a>
            </div>
          </li>
          <li>
            <div>
              <a href="/studio#issues" class="">
                <div
                  :class="
                    isActivePage('#issues')
                      ? 'text-gray-50 bg-slate-800/90'
                      : 'hover:text-gray-50 hover:bg-slate-800/90'
                  "
                  class="flex items-center px-4 py-3 rounded cursor-pointer w-[200px]"
                >
                  <NewspaperIcon class="h-6 w-6" aria-hidden="true" />
                  <span class="ml-4">Issues</span>
                </div>
              </a>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- Right Panel -->
    <div class="flex flex-col grow min-h-screen h-full">
      <div class="relative grow">
        <!-- Desktop Nav Bar -->
        <div
          class="hidden h-16 px-8 border-b border-slate-900/10 shadow-sm md:flex justify-between items-center"
        >
          <div class="w-full flex">
            <div class="self-center">
              <MagnifyingGlassIcon
                class="w-5 h-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <vue3-simple-typeahead
              id="typeahead_id"
              ref="typeaheadRef"
              class="px-4 focus-visible:outline-none bg-transparent w-full text-slate-900 placeholder-shown:truncate text-sm"
              aria-label="Search"
              placeholder="Search for keywords or products"
              :items="searches"
              :min-input-length="1"
              :item-projection="
                (item) => {
                  return item.text;
                }
              "
              :select-on-tab="false"
              @selectItem="selectItemEventHandler"
              @keydown.enter.prevent="onEnter"
            >
              <template #list-item-text="slot">
                <div
                  class="bg-slate-100 hover:bg-slate-200 active:bg-slate-300 px-2 py-1 flex justify-between"
                  :class="
                    slot.item.type === 'user'
                      ? 'text-purple-800 '
                      : 'text-slate-800'
                  "
                >
                  <span
                    v-html="slot.boldMatchText(slot.itemProjection(slot.item))"
                  />
                  <template v-if="slot.item.type === 'user'">
                    <button @click="deleteSearch(slot.item)">
                      <XMarkIcon
                        class="h-5 w-5 text-slate-800"
                        aria-hidden="true"
                      />
                    </button>
                  </template>
                </div>
              </template>
            </vue3-simple-typeahead>
          </div>
          <div class="flex">
            <div class="flex space-x-4 px-4">
              <!-- Admin Dropdown -->
              <Menu as="div" class="hidden md:block relative">
                <div>
                  <tippy content="Admin" theme="demo">
                    <MenuButton
                      class="max-w-xs rounded-full flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
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
                    class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-2 text-gray-900 ring-1 bg-white ring-gray-900 ring-opacity-5 focus:outline-none text-sm"
                  >
                    <MenuItem>
                      <router-link
                        class="flex py-2 px-3 hover:bg-gray-100 cursor-pointer"
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
                    <MenuItem>
                      <router-link
                        to="/special_editions"
                        class="flex py-2 px-3 hover:bg-gray-100 cursor-pointer"
                      >
                        Manage Special Editions
                      </router-link>
                    </MenuItem>
                  </MenuItems>
                </transition>
              </Menu>
              <!-- Theme dropdown -->
              <Menu as="div" class="hidden md:block relative">
                <div>
                  <tippy content="Themes" theme="demo">
                    <MenuButton
                      class="max-w-xs rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-gray-600"
                      :class="
                        selectedTheme === 'system'
                          ? 'text-gray-500 hover:text-gray-700'
                          : 'text-amber-600 hover:text-amber-700'
                      "
                    >
                      <span class="sr-only"
                        >Open menu for toggling color palettes.</span
                      >
                      <template v-if="selectedTheme === 'dark'">
                        <MoonIcon class="h-6 w-6" aria-hidden="true" />
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
                    class="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg py-2 text-gray-900 ring-1 bg-white ring-gray-900 ring-opacity-5 focus:outline-none text-sm"
                  >
                    <MenuItem v-for="item in themeOptions" :key="item">
                      <a
                        :class="isActiveTheme(item)"
                        class="py-1 px-3 hover:bg-gray-100 flex items-center space-x-2 cursor-pointer"
                        @click="changeTheme(item)"
                      >
                        <template v-if="item === 'light'">
                          <SunIcon class="h-6 w-6" aria-hidden="true" />
                        </template>
                        <template v-else-if="item === 'dark'">
                          <MoonIcon class="h-6 w-6" aria-hidden="true" />
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
            </div>
            <div class="pl-4 border-l border-slate-900/10">
              <!-- Profile dropdown -->
              <Menu as="div" class="hidden md:block relative">
                <div>
                  <tippy content="User Menu" theme="demo">
                    <MenuButton
                      class="max-w-xs rounded-full flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
                    >
                      <span class="sr-only">Open user menu.</span>
                      <UserCircleIcon class="h-6 w-6" aria-hidden="true" />
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
                    class="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg py-2 text-gray-900 ring-1 bg-white ring-gray-900 ring-opacity-5 focus:outline-none text-sm"
                  >
                    <MenuItem>
                      <router-link
                        to="/"
                        class="flex cursor-pointer py-2 px-3 hover:bg-gray-100"
                      >
                        Alvaro Ramirez
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
        <!-- Mobile Nav Bar -->
        <div
          class="flex md:hidden justify-between items-center h-16 px-8 border-b bg-slate-900 text-gray-400"
        >
          <div class="flex">
            <button
              type="button"
              class="max-w-xs rounded-full flex items-center text-gray-400 hover:text-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
              @click="openMobileMenuModal"
            >
              <span class="sr-only">Open main menu</span>
              <Bars3Icon class="h-6 w-6" aria-hidden="true" />
            </button>
            <span class="ml-3 text-gray-200 font-medium text-xl tracking-tight"
              >Studio</span
            >
          </div>
          <div class="flex">
            <div class="flex space-x-4 px-4">
              <button
                class="max-w-xs rounded-full flex items-center text-gray-400 hover:text-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <span class="sr-only">Search</span>
                <MagnifyingGlassIcon class="h-6 w-6" aria-hidden="true" />
              </button>
              <!-- Admin Dropdown -->
              <Menu as="div" class="block md:hidden relative">
                <div>
                  <tippy content="Admin" theme="demo">
                    <MenuButton
                      class="max-w-xs rounded-full flex items-center text-gray-400 hover:text-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
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
                    class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-2 text-gray-900 ring-1 bg-white ring-gray-900 ring-opacity-5 focus:outline-none text-sm"
                  >
                    <MenuItem>
                      <router-link
                        class="flex py-2 px-3 hover:bg-gray-100 cursor-pointer"
                        :to="{
                          name: 'publish',
                          params: {
                            date: dayjs().format('YYYY-MM-DD'),
                          },
                        }"
                      >
                        Manage Products
                      </router-link>
                    </MenuItem>
                    <MenuItem>
                      <router-link
                        to="/special_editions"
                        class="flex py-2 px-3 hover:bg-gray-100 cursor-pointer"
                      >
                        Manage Special Editions
                      </router-link>
                    </MenuItem>
                  </MenuItems>
                </transition>
              </Menu>
              <!-- Theme dropdown -->
              <Menu as="div" class="block md:hidden relative">
                <div>
                  <tippy content="Themes" theme="demo">
                    <MenuButton
                      class="max-w-xs rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-gray-600"
                      :class="
                        selectedTheme === 'system'
                          ? 'text-gray-400 hover:text-gray-50'
                          : 'text-amber-400 hover:text-amber-300'
                      "
                    >
                      <span class="sr-only"
                        >Open menu for toggling color palettes.</span
                      >
                      <template v-if="selectedTheme === 'dark'">
                        <MoonIcon class="h-6 w-6" aria-hidden="true" />
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
                    class="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg py-2 text-gray-900 ring-1 bg-white ring-gray-900 ring-opacity-5 focus:outline-none text-sm"
                  >
                    <MenuItem v-for="item in themeOptions" :key="item">
                      <a
                        :class="isActiveTheme(item)"
                        class="py-1 px-3 hover:bg-gray-100 flex items-center space-x-2 cursor-pointer"
                        @click="changeTheme(item)"
                      >
                        <template v-if="item === 'light'">
                          <SunIcon class="h-6 w-6" aria-hidden="true" />
                        </template>
                        <template v-else-if="item === 'dark'">
                          <MoonIcon class="h-6 w-6" aria-hidden="true" />
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
            </div>
            <div class="pl-4 border-l border-slate-50/10">
              <!-- Profile dropdown -->
              <Menu as="div" class="block md:hidden relative">
                <div>
                  <tippy content="User Menu" theme="demo">
                    <MenuButton
                      class="max-w-xs rounded-full flex items-center text-gray-400 hover:text-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                      <span class="sr-only">Open user menu.</span>
                      <UserCircleIcon class="h-6 w-6" aria-hidden="true" />
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
                    class="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg py-2 text-gray-900 ring-1 bg-white ring-gray-900 ring-opacity-5 focus:outline-none text-sm"
                  >
                    <MenuItem>
                      <router-link
                        to="/"
                        class="flex cursor-pointer py-2 px-3 hover:bg-gray-100"
                      >
                        Alvaro Ramirez
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
        <!-- Content Area -->
        <div
          class="flex flex-col text-gray-900 bg-slate-50 w-full min-h-[calc(100vh-4rem)] h-full items-center"
        >
          <!-- Home -->
          <div
            :class="
              isActivePage('#home')
                ? 'block max-w-[475px] sm:max-w-[768px] xl:max-w-[1280px] w-full p-8'
                : 'hidden'
            "
          >
            <div class="text-2xl text-gray-700">Responsive Check</div>
            <div class="text-gray-400 text-sm">
              <p class="hidden 3xl:block">3XL Mode 1800px</p>
              <p class="hidden 2xl:block 3xl:hidden">2XL Mode 1536px</p>
              <p class="hidden xl:block 2xl:hidden">XL Mode 1280px</p>
              <p class="hidden lg:block xl:hidden">L Mode 1024px</p>
              <p class="hidden md:block lg:hidden">MD Mode 768px</p>
              <p class="hidden sm:block md:hidden">SM Mode 640px</p>
              <p class="block sm:hidden">Less than SM mode</p>
            </div>
            <div
              class="flex space-x-1 justify-center xl:justify-start text-2xl text-gray-700 py-4"
            >
              <div class="font-bold uppercase tracking-wider">Current</div>
              <div class="text-gray-500">Issue</div>
            </div>
            <div class="py-3">
              <MockLiveIssueCard :issue="issues[0]" />
              <div
                class="py-8 flex justify-center xl:justify-between items-center"
              >
                <div
                  class="text-xl font-bold text-gray-700 uppercase tracking-widest"
                >
                  Coming Soon
                </div>
                <a
                  class="hidden xl:flex space-x-1 items-center text-gray-700 hover:text-gray-900 text-sm"
                  href="/studio#issues"
                >
                  <span>More Issues</span>
                  <ChevronRightIcon class="h-4 w-4" />
                </a>
              </div>
              <div
                class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center"
              >
                <MockIssueCard :issue="issues[1]" />
                <MockIssueCard :issue="issues[2]" />
                <MockIssueCard :issue="issues[3]" class="hidden xl:flex" />
              </div>
              <a
                class="flex xl:hidden space-x-1 items-center justify-end py-8 text-gray-500 hover:text-gray-700 font-semibold"
                href="/studio#issues"
              >
                <span>More Issues</span>
                <ChevronRightIcon class="h-5 w-5" />
              </a>
              <!-- <div
                class="text-xl font-bold text-gray-700 uppercase tracking-wider py-8"
              >
                Analytics
                top authors
                total issues created
                longest running issue
              </div> -->
            </div>
          </div>
          <!-- Live Content-->
          <div
            :class="
              isActivePage('#live')
                ? 'block max-w-[475px] sm:max-w-[768px] xl:max-w-[1280px] w-full p-8'
                : 'hidden'
            "
          >
            <div class="text-2xl text-gray-700">Responsive Check</div>
            <div class="text-gray-400 text-sm">
              <p class="hidden 3xl:block">3XL Mode 1800px</p>
              <p class="hidden 2xl:block 3xl:hidden">2XL Mode 1536px</p>
              <p class="hidden xl:block 2xl:hidden">XL Mode 1280px</p>
              <p class="hidden lg:block xl:hidden">L Mode 1024px</p>
              <p class="hidden md:block lg:hidden">MD Mode 768px</p>
              <p class="hidden sm:block md:hidden">SM Mode 640px</p>
              <p class="block sm:hidden">Less than SM mode</p>
            </div>
            <div class="flex justify-between py-4">
              <div>
                <div class="text-2xl text-gray-700">Live Content</div>
                <div class="text-gray-400">Changes in 4 days</div>
              </div>
              <button
                class="flex space-x-2 text-sm border border-gray-300 min-h-[2.125rem] items-center rounded px-3"
              >
                <span>Edit</span>
                <PencilSquareIcon class="h-5 w-5" />
              </button>
            </div>
            <div
              class="text-lg font-medium text-gray-900 uppercase tracking-wide"
            >
              Top Products
            </div>
            <div>Breaking On/Off</div>
            <div>Secondary Products</div>
            <div>More Products</div>
          </div>
          <!-- Issues -->
          <div
            :class="
              isActivePage('#issues')
                ? 'block max-w-[475px] sm:max-w-[768px] xl:max-w-[1280px] w-full p-8'
                : 'hidden'
            "
          >
            <div class="text-2xl text-gray-700">Issues</div>
            <div class="text-gray-400 text-sm">
              <p class="hidden 3xl:block">3XL Mode 1800px</p>
              <p class="hidden 2xl:block 3xl:hidden">2XL Mode 1536px</p>
              <p class="hidden xl:block 2xl:hidden">XL Mode 1280px</p>
              <p class="hidden lg:block xl:hidden">L Mode 1024px</p>
              <p class="hidden md:block lg:hidden">MD Mode 768px</p>
              <p class="hidden sm:block md:hidden">SM Mode 640px</p>
              <p class="block sm:hidden">Less than SM mode</p>
            </div>
            <div>Posts in one day</div>
            <div>Issue #2</div>
            <div>More Issues</div>
            <div>Issue #3</div>
            <div>Issue #4</div>
            <div>Issue #5</div>
            <div>Issue #6</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Mobile side menu -->
  <MockMobileSideMenu
    :isOpen="isMobileMenuOpen"
    @close="closeMobileMenuModal"
  />
</template>
<script>
import dayjs from "dayjs/esm/index.js";
import { issues } from "../data";
import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import {
  // Listbox,
  // ListboxLabel,
  // ListboxButton,
  // ListboxOptions,
  // ListboxOption,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/vue";
import {
  Bars3Icon,
  ComputerDesktopIcon,
  HomeIcon,
  NewspaperIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  PencilSquareIcon,
  SunIcon,
  UserCircleIcon,
  VideoCameraIcon,
  WrenchIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import {
  ChevronRightIcon,
  //EyeIcon,
  //Square3Stack3DIcon,
} from "@heroicons/vue/24/solid";
import MockIssueCard from "@/demo-studio/components/MockIssueCard.vue";
import MockLiveIssueCard from "@/demo-studio/components/MockLiveIssueCard.vue";
import MockMobileSideMenu from "@/demo-studio/components/MockMobileSideMenu.vue";
const themeOptions = ["light", "dark", "system"];
export default {
  components: {
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Bars3Icon,
    ChevronRightIcon,
    ComputerDesktopIcon,
    HomeIcon,
    MagnifyingGlassIcon,
    MoonIcon,
    NewspaperIcon,
    PencilSquareIcon,
    SunIcon,
    UserCircleIcon,
    VideoCameraIcon,
    WrenchIcon,
    XMarkIcon,
    MockIssueCard,
    MockLiveIssueCard,
    MockMobileSideMenu,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const isMobileMenuOpen = ref(false);
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
    const currentHash = ref(window.location.hash || "#dashboard");

    onMounted(() => {
      window.location.hash = window.location.hash || "#home";
    });

    const closeMobileMenuModal = () => {
      isMobileMenuOpen.value = false;
    };

    const openMobileMenuModal = () => {
      isMobileMenuOpen.value = true;
    };

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

    const onEnter = (e) => {
      store.dispatch("savedSearches/addSearch", {
        text: e.target.value,
        type: "user",
      });
      if (
        localStorage.getItem("lastSort") === "asc" ||
        localStorage.getItem("lastSort") === "desc"
      ) {
        router.push({
          name: "search",
          query: {
            text: e.target.value,
            per_page: 10,
            sort_dir: localStorage.getItem("lastSort"),
          },
        });
      } else if (localStorage.getItem("lastSort") === "score") {
        router.push({
          name: "search",
          query: {
            text: e.target.value,
            per_page: 10,
            sort_field: localStorage.getItem("lastSort"),
          },
        });
      } else {
        router.push({
          name: "search",
          query: {
            text: e.target.value,
            per_page: 10,
          },
        });
      }
    };

    window.addEventListener("hashchange", ({ target }) => {
      currentHash.value = target.location.hash;
    });

    const isActivePage = (hash) => {
      return hash === currentHash.value;
    };

    return {
      dayjs,
      themeOptions,
      searches,
      loading,
      isDark,
      selectedTheme,
      issues,
      isMobileMenuOpen,
      openMobileMenuModal,
      closeMobileMenuModal,
      changeTheme,
      isActiveTheme,
      selectItemEventHandler,
      onEnter,
      isActivePage,
    };
  },
};
</script>
<style lang="scss"></style>
