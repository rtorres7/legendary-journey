<template>
  <div class="h-full flex">
    <!-- Left Panel -->
    <!--- Below 2XL but not Mobile --->
    <div
      class="hidden md:block 2xl:hidden bg-white border-r border-slate-900/10 min-h-screen min-w-[80px]"
    >
      <div class="flex flex-col">
        <div class="h-16 flex items-center">
          <router-link to="/" class="mx-auto px-4">
            <VideoCameraIconSolid
              class="h-7 w-7 text-blue-700"
              aria-hidden="true"
            />
          </router-link>
        </div>
        <ul class="py-4 mx-auto text-gray-500 space-y-1">
          <li>
            <tippy content="Home   " placement="right" theme="demo">
              <div
                :class="
                  isActivePage('#home')
                    ? 'text-blue-700 bg-gray-200/25'
                    : 'hover:text-blue-700 hover:bg-gray-200/25'
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
                    ? 'text-blue-700 bg-gray-200/25'
                    : 'hover:text-blue-700 hover:bg-gray-200/25'
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
                    ? 'text-blue-700 bg-gray-200/25'
                    : 'hover:text-blue-700 hover:bg-gray-200/25'
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
    <div
      class="hidden 2xl:block bg-white border-r border-slate-900/10 min-h-screen min-w-[250px]"
    >
      <div class="flex flex-col">
        <div class="h-16 flex items-center">
          <router-link to="/" class="flex mx-auto items-center px-4">
            <VideoCameraIconSolid
              class="h-7 w-7 text-blue-700"
              aria-hidden="true"
            />
            <span class="ml-3 font-bold text-3xl tracking-tight">Studio</span>
          </router-link>
        </div>
        <ul class="py-4 mx-auto text-gray-500 space-y-1">
          <li>
            <div>
              <a href="/studio#home">
                <div
                  :class="
                    isActivePage('#home')
                      ? 'text-blue-700 bg-gray-200/25'
                      : 'hover:text-blue-700 hover:bg-gray-200/25'
                  "
                  class="flex items-center px-4 py-3 rounded cursor-pointer w-[200px]"
                >
                  <HomeIcon class="h-6 w-6" aria-hidden="true" />
                  <span class="ml-4 font-medium">Home</span>
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
                      ? 'text-blue-700 bg-gray-200/25 '
                      : 'hover:text-blue-700 hover:bg-gray-200/25'
                  "
                  class="flex items-center px-4 py-3 rounded cursor-pointer w-[200px]"
                >
                  <VideoCameraIcon class="h-6 w-6" aria-hidden="true" />
                  <span class="ml-4 font-medium">Live Content</span>
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
                      ? 'text-blue-700 bg-gray-200/25'
                      : 'hover:text-blue-700 hover:bg-gray-200/25'
                  "
                  class="flex items-center px-4 py-3 rounded cursor-pointer w-[200px]"
                >
                  <NewspaperIcon class="h-6 w-6" aria-hidden="true" />
                  <span class="ml-4 font-medium">Issues</span>
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
          class="flex md:hidden justify-between items-center h-16 px-8 border-b bg-white text-gray-900"
        >
          <div class="flex">
            <button
              type="button"
              class="max-w-xs rounded-full flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
              @click="openMobileMenuModal"
            >
              <span class="sr-only">Open main menu</span>
              <Bars3Icon class="h-6 w-6" aria-hidden="true" />
            </button>
            <router-link to="/" class="ml-4 flex mx-auto items-center">
              <VideoCameraIconSolid
                class="h-7 w-7 text-blue-700"
                aria-hidden="true"
              />
              <span class="ml-3 font-bold text-3xl tracking-tight">Studio</span>
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
              <!-- Admin Dropdown -->
              <Menu as="div" class="block md:hidden relative">
                <div>
                  <tippy content="Admin" theme="demo">
                    <MenuButton
                      class="max-w-xs rounded-full flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
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
              <Menu as="div" class="block md:hidden relative">
                <div>
                  <tippy content="User Menu" theme="demo">
                    <MenuButton
                      class="max-w-xs rounded-full flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
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
          class="flex flex-col text-gray-900 w-full min-h-[calc(100vh-4rem)] h-full items-center bg-slate-50"
        >
          <div
            class="max-w-[475px] sm:max-w-[768px] xl:max-w-[1600px] w-full p-6 md:p-8"
          >
            <!-- Home -->
            <div :class="isActivePage('#home') ? 'block' : 'hidden'">
              <div
                class="flex space-x-1 justify-center xl:justify-start text-2xl text-gray-700 py-8"
              >
                <div class="font-bold uppercase tracking-wider">Current</div>
                <div class="text-gray-500">Issue</div>
              </div>
              <div class="">
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
            <div :class="isActivePage('#live') ? 'block' : 'hidden'">
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
              <!-- <div class="flex items-center space-x-2">
                <span class="relative flex h-2 w-2">
                  <span
                    class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"
                  ></span>
                  <span
                    class="relative inline-flex rounded-full h-2 w-2 bg-red-500"
                  ></span>
                </span>
                <span class="text-sm font-semibold tracking-wider uppercase"
                  >Live Now</span
                >
              </div> -->
              <div class="py-10">
                <div class="text-gray-500 uppercase text-sm">
                  Changes in 4 days
                </div>
                <div class="text-5xl py-2 font-bold">
                  {{ issues[0].title }}
                </div>
                <div
                  class="flex flex-col py-2 space-y-2 font-medium text-gray-500 text-sm"
                >
                  <p>By {{ issues[0].author }}</p>
                  <p>Updated {{ issues[0].last_updated }}</p>
                </div>
              </div>
              <div class="py-6 border-b border-gray-200">
                <div
                  class="uppercase tracking-wide font-medium text-gray-500 text-sm"
                >
                  Featured
                </div>
                <div class="flex flex-col max-w-[720px]">
                  <div class="py-4">
                    <p class="font-semibold text-2xl">
                      <span class="text-gray-500">{{
                        issues[0].featured[0].classification
                      }}</span>
                      {{ issues[0].featured[0].title }}
                    </p>
                  </div>
                  <div class="max-h-[405px] cursor-pointer">
                    <img src="@/assets/mocks/16x9_005_war.jpg" alt="" />
                  </div>
                  <p class="text-gray-700 text-xs py-2">
                    {{ issues[0].featured[0].caption }}
                  </p>
                </div>
              </div>
              <div class="py-6 border-b border-gray-200">
                <div
                  class="uppercase tracking-wide font-medium text-gray-500 text-sm pb-4"
                >
                  Important
                </div>
                <div class="flex space-x-10">
                  <div class="flex flex-col max-w-[500px]">
                    <div class="max-h-[281px] cursor-pointer">
                      <img src="@/assets/mocks/16x9_017_putin.jpg" alt="" />
                    </div>
                    <div class="py-4">
                      <p class="font-semibold text-lg line-clamp-2">
                        <span class="text-gray-500">{{
                          issues[0].featured[1].classification
                        }}</span>
                        {{ issues[0].featured[1].title }}
                      </p>
                    </div>
                    <!-- <p class="text-gray-700 text-xs py-2">
                      {{ issues[0].featured[1].caption }}
                    </p> -->
                  </div>
                  <div class="flex flex-col max-w-[500px]">
                    <div class="max-h-[281px] cursor-pointer">
                      <img src="@/assets/mocks/16x9_018_xi_putin.jpg" alt="" />
                    </div>
                    <div class="py-4">
                      <p class="font-semibold text-lg line-clamp-3">
                        <span class="text-gray-500">{{
                          issues[0].featured[2].classification
                        }}</span>
                        {{ issues[0].featured[2].title }}
                      </p>
                    </div>
                    <!-- <p class="text-gray-700 text-xs py-2">
                      {{ issues[0].featured[2].caption }}
                    </p> -->
                  </div>
                </div>
              </div>
              <div class="py-6">
                <div
                  class="uppercase tracking-wide font-medium text-gray-500 text-sm"
                >
                  More Products
                </div>
              </div>

              <button
                class="flex space-x-2 text-sm border border-gray-300 min-h-[2.125rem] items-center rounded px-3"
              >
                <span>Edit</span>
                <PencilSquareIcon class="h-5 w-5" />
              </button>
              <ul>
                <template v-for="n in issues[0].featured.slice(3)" :key="n">
                  <li class="py-4 border-b border-gray-200">
                    <p class="font-semibold text-xl">
                      <span class="text-gray-500">{{ n.classification }}</span>
                      {{ n.title }}
                    </p>
                  </li>
                </template>
              </ul>
            </div>
            <!-- Issues -->
            <div :class="isActivePage('#issues') ? 'block' : 'hidden'">
              <div class="pt-8 pb-6">
                <div
                  class="text-2xl font-bold text-gray-700 uppercase tracking-wider pb-6 lg:max-w-none"
                >
                  Issues
                </div>
                <!-- <div class="text-gray-500 text-sm">6 issues</div> -->
                <div class="flex justify-between items-center">
                  <a
                    class="inline-flex items-center justify-center rounded-lg border py-[calc(theme(spacing.2)-1px)] px-[calc(theme(spacing.3)-1px)] text-sm outline-2 outline-offset-2 transition-colors text-gray-50 bg-blue-700 hover:border-blue-600 active:bg-blue-800 active:text-gray-200/80 cursor-pointer"
                  >
                    <PlusIcon class="h-4 w-4" />
                    <span class="ml-2.5">New Issue</span></a
                  >
                  <div class="flex space-x-4">
                    <Listbox
                      v-model="selectedSort"
                      as="div"
                      class="min-w-[260px] hidden md:inline-flex items-center text-gray-700"
                    >
                      <div>
                        <ListboxLabel
                          class="text-sm line-clamp-1 xl:line-clamp-none w-max"
                        >
                          Sort By
                        </ListboxLabel>
                      </div>
                      <div class="w-full relative items-center ml-3">
                        <ListboxButton
                          class="relative w-full min-h-[2.125rem] rounded cursor-default pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-offset-2"
                        >
                          <span class="text-sm block truncate capitalize">{{
                            selectedSort.name
                          }}</span>
                          <span
                            class="absolute inset-y-0 right-0 flex items-center pr-2"
                          >
                            <ChevronDownIcon
                              class="h-4 w-4"
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
                            class="absolute w-full py-1 mt-1 overflow-auto text-gray-900 bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none z-[5]"
                          >
                            <ListboxOption
                              v-for="item in sortOptions"
                              v-slot="{ active, selected }"
                              :key="item.name"
                              :value="item"
                              as="template"
                            >
                              <li
                                :class="[
                                  active ? 'bg-gray-100  ' : 'bg-none',
                                  'relative cursor-default select-none py-2 pl-10 pr-4',
                                ]"
                              >
                                <span
                                  :class="[
                                    selected ? 'font-medium' : 'font-normal',
                                    'block truncate text-sm',
                                  ]"
                                  >{{ item.name }}</span
                                >
                                <span
                                  v-if="selected"
                                  class="absolute inset-y-0 left-0 flex items-center pl-3"
                                >
                                  <CheckIcon
                                    class="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              </li>
                            </ListboxOption>
                          </ListboxOptions>
                        </transition>
                      </div>
                    </Listbox>
                    <button
                      class="flex space-x-2 text-sm border border-gray-300 min-h-[2.125rem] items-center rounded px-3"
                    >
                      <span class="hidden md:block">Filters</span>
                      <span class="block md:hidden">Filters / Sort</span>
                      <AdjustmentsHorizontalIcon class="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div
                class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center"
              >
                <template v-for="n in issues" :key="n">
                  <MockIssueCard :issue="n" />
                </template>
              </div>
            </div>
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
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/vue";
import {
  AdjustmentsHorizontalIcon,
  Bars3Icon,
  CheckIcon,
  ChevronDownIcon,
  ComputerDesktopIcon,
  HomeIcon,
  NewspaperIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  PencilSquareIcon,
  PlusIcon,
  SunIcon,
  UserCircleIcon,
  VideoCameraIcon,
  WrenchIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import {
  ChevronRightIcon,
  VideoCameraIcon as VideoCameraIconSolid,
  //EyeIcon,
  //Square3Stack3DIcon,
} from "@heroicons/vue/24/solid";
import MockIssueCard from "@/demo-studio/components/MockIssueCard.vue";
import MockLiveIssueCard from "@/demo-studio/components/MockLiveIssueCard.vue";
import MockMobileSideMenu from "@/demo-studio/components/MockMobileSideMenu.vue";
const themeOptions = ["light", "dark", "system"];
export default {
  components: {
    Listbox,
    ListboxLabel,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    AdjustmentsHorizontalIcon,
    Bars3Icon,
    CheckIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    ComputerDesktopIcon,
    HomeIcon,
    MagnifyingGlassIcon,
    MoonIcon,
    NewspaperIcon,
    PencilSquareIcon,
    PlusIcon,
    SunIcon,
    UserCircleIcon,
    VideoCameraIcon,
    VideoCameraIconSolid,
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
    const sortOptions = [
      { name: "Posting Date: Recent" },
      { name: "Posting Date: Last" },
    ];

    const selectedSort = ref(sortOptions[0]);

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
      sortOptions,
      selectedSort,
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
