<template>
  <div class="h-full flex">
    <!-- Left Panel -->
    <div class="hidden md:block bg-slate-900 min-h-screen w-20">
      <div class="flex flex-col">
        <div class="h-16">
          <router-link to="/">
            <img
              class="mx-auto w-16 h-16"
              src="@/assets/nctc_logo.svg"
              alt="NCTC. Seal. Link to homepage."
            />
          </router-link>
        </div>
        <ul class="py-2 mx-auto text-gray-400 space-y-1">
          <li>
            <tippy content="Dashboard" placement="right" theme="demo">
              <div
                :class="
                  isActivePage('#dashboard')
                    ? 'text-gray-50 bg-slate-800/90'
                    : 'hover:text-gray-50 hover:bg-slate-800/90'
                "
                class="my-auto rounded cursor-pointer"
              >
                <a
                  href="/workspace#dashboard"
                  class="flex items-center justify-center h-12 w-12"
                >
                  <HomeIcon class="h-6 w-6" aria-hidden="true" />
                </a>
              </div>
            </tippy>
          </li>
          <li>
            <tippy content="My Products" placement="right" theme="demo">
              <div
                :class="
                  isActivePage('#products')
                    ? 'text-gray-50 bg-slate-800/90'
                    : 'hover:text-gray-50 hover:bg-slate-800/90'
                "
                class="my-auto rounded cursor-pointer"
              >
                <a
                  href="/workspace#products"
                  class="flex items-center justify-center h-12 w-12"
                >
                  <BriefcaseIcon class="h-6 w-6" aria-hidden="true" />
                </a>
              </div>
            </tippy>
          </li>
          <li>
            <tippy content="Saved Products" placement="right" theme="demo">
              <div
                :class="
                  isActivePage('#saved')
                    ? 'text-gray-50 bg-slate-800/90'
                    : 'hover:text-gray-50 hover:bg-slate-800/90'
                "
                class="my-auto rounded cursor-pointer"
              >
                <a
                  href="/workspace#saved"
                  class="flex items-center justify-center h-12 w-12"
                >
                  <BookmarkIcon class="h-6 w-6" aria-hidden="true" />
                </a>
              </div>
            </tippy>
          </li>
          <li>
            <tippy content="Favorites" placement="right" theme="demo">
              <div
                :class="
                  isActivePage('#favorites')
                    ? 'text-gray-50 bg-slate-800/90'
                    : 'hover:text-gray-50 hover:bg-slate-800/90'
                "
                class="my-auto rounded cursor-pointer"
              >
                <a
                  href="/workspace#favorites"
                  class="flex items-center justify-center h-12 w-12"
                >
                  <StarIcon class="h-6 w-6" aria-hidden="true" />
                </a>
              </div>
            </tippy>
          </li>
          <li>
            <tippy content="Collections" placement="right" theme="demo">
              <div
                :class="
                  isActivePage('#collections')
                    ? 'text-gray-50 bg-slate-800/90'
                    : 'hover:text-gray-50 hover:bg-slate-800/90'
                "
                class="my-auto rounded cursor-pointer"
              >
                <a
                  href="/workspace#collections"
                  class="flex items-center justify-center h-12 w-12"
                >
                  <FolderIcon class="h-6 w-6" aria-hidden="true" />
                </a>
              </div>
            </tippy>
          </li>
        </ul>
      </div>
    </div>
    <!-- Right Panel -->
    <div class="flex flex-col min-h-screen w-full h-full">
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
          <button
            type="button"
            class="max-w-xs rounded-full flex items-center text-gray-400 hover:text-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
            @click="openMobileMenuModal"
          >
            <span class="sr-only">Open main menu</span>
            <Bars3Icon class="h-6 w-6" aria-hidden="true" />
          </button>
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
          <!-- Dashboard View -->
          <div
            :class="
              isActivePage('#dashboard')
                ? 'block max-w-[475px] sm:max-w-[1600px] w-full p-8'
                : 'hidden'
            "
          >
            <div class="text-2xl text-gray-700">Alvaro's Workspace</div>
            <!-- <div class="text-gray-400 text-sm">
                <p class="hidden 3xl:block">3XL Mode 1800px</p>
                <p class="hidden 2xl:block 3xl:hidden">2XL Mode 1536px</p>
                <p class="hidden xl:block 2xl:hidden">XL Mode 1280px</p>
                <p class="hidden lg:block xl:hidden">L Mode 1024px</p>
                <p class="hidden md:block lg:hidden">MD Mode 768px</p>
                <p class="hidden sm:block md:hidden">SM Mode 640px</p>
                <p class="block sm:hidden">Less than SM mode</p>
              </div> -->
            <div class="py-6 flex items-center">
              <div class="text-lg font-bold">Continue where you left off</div>
            </div>
            <div
              class="relative flex flex-col bg-white shadow-md hover:shadow-lg rounded max-w-[450px] p-8 cursor-pointer"
            >
              <div
                class="text-gray-500 hover:text-gray-900 absolute top-3 right-3"
              >
                <Menu as="div" class="relative">
                  <div>
                    <tippy content="More" placement="bottom" theme="demo">
                      <MenuButton
                        class="max-w-xs rounded-full flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
                      >
                        <span class="sr-only">More Options</span>
                        <EllipsisVerticalIcon
                          class="h-6 w-6"
                          aria-hidden="true"
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
                      class="origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg py-2 text-gray-900 ring-1 bg-white ring-gray-900 ring-opacity-5 focus:outline-none text-sm"
                    >
                      <MenuItem>
                        <div
                          class="py-2 px-3 hover:bg-gray-100 flex items-center space-x-4 cursor-pointer"
                        >
                          <ShareIcon class="h-5 w-5" aria-hidden="true" /><span
                            class="capitalize"
                            >Share</span
                          >
                        </div>
                      </MenuItem>
                      <MenuItem>
                        <div
                          class="py-2 px-3 hover:bg-gray-100 flex items-center space-x-4 cursor-pointer"
                        >
                          <PencilSquareIcon
                            class="h-5 w-5"
                            aria-hidden="true"
                          /><span class="capitalize">Edit</span>
                        </div>
                      </MenuItem>
                      <MenuItem>
                        <div
                          class="py-2 px-3 hover:bg-gray-100 flex items-center space-x-4 cursor-pointer"
                        >
                          <TrashIcon class="h-5 w-5" aria-hidden="true" /><span
                            class="capitalize"
                            >Delete</span
                          >
                        </div>
                      </MenuItem>
                    </MenuItems>
                  </transition>
                </Menu>
              </div>
              <div class="flex items-center space-x-4">
                <MaxProductIcon class="w-8 h-8 text-green-500" icon="globe" />
                <div class="text-xs text-gray-500">Community</div>
              </div>
              <p
                class="font-semibold text-gray-700 line-clamp-2 mt-4"
                title="(U) Canada 'will not be intimidated' after China expels
                  diplomat: Trudeau"
              >
                <span class="font-medium text-gray-500">(U)</span> Canada 'will
                not be intimidated' after China expels diplomat: Trudeau
              </p>
              <div class="text-sm text-gray-500 mt-4">15 hours ago</div>
            </div>
            <div class="py-6 flex justify-between items-center">
              <div class="text-lg font-bold">My Recent Products</div>
              <a
                class="flex items-center text-gray-500 text-sm font-semibold"
                href="/workspace#products"
              >
                <span>More Products</span>
                <ChevronRightIcon class="h-4 w-4" />
              </a>
            </div>
            <div
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
            >
              <MockProductCard :product="products[0]" type="product" />
              <MockProductCard :product="products[1]" type="product" />
              <MockProductCard
                :product="products[2]"
                type="product"
                class="hidden lg:flex"
              />
              <MockProductCard
                :product="products[3]"
                type="product"
                class="hidden 2xl:flex"
              />
            </div>
            <div class="py-6 flex items-center">
              <div class="text-lg font-bold">Your Stats</div>
            </div>
            <div
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
            >
              <div
                class="flex justify-between border border-slate-300/70 shadow-sm rounded px-6 py-4 max-w-[464px]"
              >
                <div class="flex space-x-4 items-center text-slate-500">
                  <Square3Stack3DIcon class="h-5 w-5" />
                  <span class="text-sm font-normal"> Total Created</span>
                </div>
                <div class="font-semibold text-xl text-slate-700">16</div>
              </div>
              <div
                class="flex justify-between border border-slate-300/70 shadow-sm rounded px-6 py-4 max-w-[464px]"
              >
                <div class="flex space-x-4 items-center text-slate-500">
                  <EyeIcon class="h-5 w-5" />
                  <span class="text-sm font-normal">Total Views</span>
                </div>
                <div class="font-semibold text-xl text-slate-700">2.4m</div>
              </div>
            </div>
          </div>
          <!-- My Products View -->
          <div
            :class="
              isActivePage('#products')
                ? 'block max-w-[475px] sm:max-w-[1600px] w-full p-8'
                : 'hidden'
            "
          >
            <div class="text-2xl text-gray-700">My Products</div>
            <!-- <div class="text-gray-400 text-sm">
                <p class="hidden 3xl:block">3XL Mode 1800px</p>
                <p class="hidden 2xl:block 3xl:hidden">2XL Mode 1536px</p>
                <p class="hidden xl:block 2xl:hidden">XL Mode 1280px</p>
                <p class="hidden lg:block xl:hidden">L Mode 1024px</p>
                <p class="hidden md:block lg:hidden">MD Mode 768px</p>
                <p class="hidden sm:block md:hidden">SM Mode 640px</p>
                <p class="block sm:hidden">Less than SM mode</p>
              </div> -->
            <div class="py-6 sm:flex justify-between items-center">
              <div class="font-semibold mb-4 sm:mb-0">16 products</div>
              <div class="flex space-x-4">
                <Listbox
                  v-model="selectedSort"
                  as="div"
                  class="min-w-[215px] inline-flex items-center text-gray-700"
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
                        <ChevronDownIcon class="h-4 w-4" aria-hidden="true" />
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
                              <CheckIcon class="h-5 w-5" aria-hidden="true" />
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
                  <span>Filters</span>
                  <AdjustmentsHorizontalIcon class="h-5 w-5" />
                </button>
              </div>
            </div>
            <div
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
            >
              <template v-for="n in products" :key="n">
                <MockProductCard :product="n" type="product" />
              </template>
            </div>
          </div>
          <!-- Saved Products View -->
          <div
            :class="
              isActivePage('#saved')
                ? 'block max-w-[475px] sm:max-w-[1600px] w-full p-8'
                : 'hidden'
            "
          >
            <div class="text-2xl text-gray-700">Saved Products</div>
            <div class="py-6 sm:flex justify-between items-center">
              <div class="font-semibold mb-4 sm:mb-0">8 products</div>
              <div class="flex space-x-4">
                <Listbox
                  v-model="selectedSort"
                  as="div"
                  class="min-w-[215px] inline-flex items-center text-gray-700"
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
                        <ChevronDownIcon class="h-4 w-4" aria-hidden="true" />
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
                              <CheckIcon class="h-5 w-5" aria-hidden="true" />
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
                  <span>Filters</span>
                  <AdjustmentsHorizontalIcon class="h-5 w-5" />
                </button>
              </div>
            </div>
            <div
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
            >
              <template v-for="n in savedProducts" :key="n">
                <MockProductCard :product="n" type="saved" />
              </template>
            </div>
          </div>
          <!-- Favorites View -->
          <div
            :class="
              isActivePage('#favorites')
                ? 'block max-w-[475px] sm:max-w-[1600px] w-full p-8'
                : 'hidden'
            "
          >
            <div class="text-2xl text-gray-700">Favorites</div>
            <div class="py-6 sm:flex justify-between items-center">
              <div class="font-semibold mb-4 sm:mb-0">4 products</div>
              <div class="flex space-x-4">
                <Listbox
                  v-model="selectedSort"
                  as="div"
                  class="min-w-[215px] inline-flex items-center text-gray-700"
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
                        <ChevronDownIcon class="h-4 w-4" aria-hidden="true" />
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
                              <CheckIcon class="h-5 w-5" aria-hidden="true" />
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
                  <span>Filters</span>
                  <AdjustmentsHorizontalIcon class="h-5 w-5" />
                </button>
              </div>
            </div>
            <div
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6"
            >
              <template v-for="n in favoriteProducts" :key="n">
                <MockProductCard :product="n" type="favorites" />
              </template>
            </div>
          </div>
          <!-- Collections View -->
          <div
            :class="
              isActivePage('#collections')
                ? 'w-full flex grow bg-slate-100'
                : 'hidden'
            "
          >
            <div class="hidden w-[300px] md:flex flex-col">
              <div class="font-semibold p-6 text-lg">Collections</div>
              <ul class="px-6 space-y-3 text-slate-600">
                <li
                  class="flex items-center cursor-pointer hover:text-slate-900"
                >
                  <div class="w-[60px] h-[60px]">
                    <img
                      src="@/assets/mocks/1x1_001_plane.jpg"
                      alt=""
                      class="rounded-full"
                    />
                  </div>
                  <span class="ml-4">Travel</span>
                </li>
                <li
                  class="flex items-center cursor-pointer hover:text-slate-900"
                >
                  <div class="w-[60px] h-[60px]">
                    <img
                      src="@/assets/mocks/1x1_002_military.jpg"
                      alt=""
                      class="rounded-full"
                    />
                  </div>
                  <span class="ml-4">Military</span>
                </li>
                <li
                  class="flex items-center cursor-pointer font-semibold text-slate-900"
                >
                  <div class="w-[60px] h-[60px]">
                    <img
                      src="@/assets/mocks/1x1_003_china.jpg"
                      alt=""
                      class="rounded-full"
                    />
                  </div>
                  <span class="ml-4 line-clamp-1">China Tensions</span>
                </li>
                <li class="flex items-center cursor-pointer h-[60px] text-sm">
                  <PlusIcon class="h-5 w-5" />
                  <span class="ml-4">New Collection</span>
                </li>
              </ul>
            </div>
            <div
              class="w-full md:w-[calc(100%-300px)] bg-slate-50 border-l border-slate-200 p-8 flex md:block justify-center"
            >
              <div class="max-w-[475px] sm:max-w-[1450px]">
                <div class="text-2xl text-gray-700">China Tensions</div>
                <div class="py-6 sm:flex justify-between items-center">
                  <div class="font-semibold mb-4 sm:mb-0">4 products</div>
                  <div class="flex space-x-4">
                    <Listbox
                      v-model="selectedSort"
                      as="div"
                      class="min-w-[215px] inline-flex items-center text-gray-700"
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
                  </div>
                </div>
                <div
                  class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6"
                >
                  <template v-for="n in collectionProducts" :key="n">
                    <MockProductCard :product="n" type="product" />
                  </template>
                </div>
              </div>
            </div>
            <!-- <div class="text-2xl text-gray-700">Collections</div>
              <div class="text-gray-400 text-sm">
                <p class="hidden 3xl:block">3XL Mode 1800px</p>
                <p class="hidden 2xl:block 3xl:hidden">2XL Mode 1536px</p>
                <p class="hidden xl:block 2xl:hidden">XL Mode 1280px</p>
                <p class="hidden lg:block xl:hidden">L Mode 1024px</p>
                <p class="hidden md:block lg:hidden">MD Mode 768px</p>
                <p class="hidden sm:block md:hidden">SM Mode 640px</p>
                <p class="block sm:hidden">Less than SM mode</p>
              </div> -->
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
import * as dayjs from "dayjs";
import {
  products,
  savedProducts,
  favoriteProducts,
  collectionProducts,
} from "../data";
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
  BookmarkIcon,
  BriefcaseIcon,
  CheckIcon,
  ChevronDownIcon,
  ComputerDesktopIcon,
  EllipsisVerticalIcon,
  FolderIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  PencilSquareIcon,
  PlusIcon,
  ShareIcon,
  StarIcon,
  SunIcon,
  TrashIcon,
  UserCircleIcon,
  WrenchIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import {
  ChevronRightIcon,
  EyeIcon,
  Square3Stack3DIcon,
} from "@heroicons/vue/24/solid";
import MockProductCard from "@/demo/components/MockProductCard.vue";
import MockMobileSideMenu from "@/demo/components/MockMobileSideMenu.vue";
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
    BookmarkIcon,
    BriefcaseIcon,
    CheckIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    ComputerDesktopIcon,
    EllipsisVerticalIcon,
    EyeIcon,
    FolderIcon,
    HomeIcon,
    MagnifyingGlassIcon,
    MoonIcon,
    PencilSquareIcon,
    PlusIcon,
    ShareIcon,
    Square3Stack3DIcon,
    StarIcon,
    SunIcon,
    TrashIcon,
    UserCircleIcon,
    WrenchIcon,
    XMarkIcon,
    MockProductCard,
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
      { name: "Newest" },
      { name: "Oldest" },
      { name: "Most Views" },
    ];

    const selectedSort = ref(sortOptions[0]);

    onMounted(() => {
      window.location.hash = window.location.hash || "#dashboard";
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
      products,
      savedProducts,
      favoriteProducts,
      collectionProducts,
      selectedSort,
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
<style lang="scss">
.simple-typeahead {
  position: relative;
  width: 100%;
}

.simple-typeahead .simple-typeahead-list {
  position: absolute;
  width: 100%;
  border: none;
  max-height: 400px;
  overflow-y: auto;
  z-index: 11;
  box-shadow: 0 1px 3px 0 rgb(60 64 67 / 30%), 0 4px 8px 3px rgb(60 64 67 / 15%);
  border-width: 1px;
}
</style>
