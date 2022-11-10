<template>
  <nav
    class="
      text-slate-200
      bg-mission-blue/95
      dark:text-slate-300 dark:bg-dark-space-blue/95
      energy:text-zinc-300 energy:bg-zinc-800/95
      sticky
      top-0
      z-10
      lg:h-full
      backdrop-filter backdrop-blur
      lg:border-b lg:border-b-zinc-700/75
    "
  >
    <div
      v-show="isLiveDemo"
      class="flex justify-center items-center bg-emerald-600/80 p-2"
    >
      <p class="text-sm text-white">
        Note: This page is a live preview. The contents of this page are meant
        to showcase future capabilities and gather user feedback.
      </p>
    </div>
    <div
      v-if="alertEnabled"
      id="alert-message"
      class="flex justify-between items-center bg-red-800 text-white p-2"
    >
      <div class="flex items-center">
        <ExclamationCircleIcon class="h-6 w-1/3 md:w-20 lg:w-6 mx-3 my-2" />
        <p class="text-sm ml-1">
          ALERT: This is a system alert. Ut est iusto decore nonumy, cum no
          mollis saperet. Esse percipitur id sea, mea no dicam aperiri. Ex assum
          quando aliquip his, vero porro voluptaria cum ea. Vero labore
          scribentur.
        </p>
      </div>
      <a
        @click="removeAlertMessage"
        class="
          mx-2
          text-slate-300
          hover:text-white
          focus:outline-none
          focus:ring-2
          focus:ring-offset-2
          focus:ring-offset-gray-800
          focus:ring-white
        "
        tabindex="0"
      >
        <span class="sr-only">Close Alert Message</span>
        <XIcon class="block cursor-pointer h-6 w-6" aria-hidden="true" />
      </a>
    </div>
    <div class="mx-auto pt-2 px-6 lg:px-8">
      <div
        class="
          flex
          items-center
          justify-between
          h-14
          pb-2
          lg:border-b lg:border-slate-700/50 lg:energy:border-zinc-700/50
        "
      >
        <!-- Left Nav Bar -->
        <div class="flex h-full items-center">
          <button
            type="button"
            @click="openMainMenuModal"
            class="
              block
              lg:hidden
              p-1
              m-auto
              rounded-full
              hover:text-white
              focus:outline-none
              focus:ring-1
              focus:ring-offset-0
              focus:ring-offset-gray-800
              focus:ring-white
            "
          >
            <span class="sr-only">Open main menu</span>
            <MenuIcon class="h-6 w-6" aria-hidden="true" />
          </button>
          <router-link class="hidden xl:block h-auto" to="/">
            <img
              class="h-12 w-12"
              src="@/assets/nctc_seal_color.svg"
              alt="NCTC. Seal. Link to homepage."
            />
          </router-link>
          <router-link
            class="
              hidden
              lg:block
              ml-4
              uppercase
              text-xl text-white
              dark:text-slate-100
              energy:text-energy-yellow
              font-semibold
              tracking-[.05em]
            "
            to="/"
          >
            {{ metadata.application_name }}
          </router-link>
        </div>
        <!-- Middle Nav Bar -->
        <BannerSearchBar />
        <!-- Right Nav Bar -->
        <div class="flex items-center space-x-2 xl:space-x-3">
          <!-- Mobile App Menu -->
          <button
            type="button"
            @click="openUserMenuModal"
            class="
              block
              lg:hidden
              p-1
              m-auto
              rounded-full
              hover:text-white
              focus:outline-none
              focus:ring-1
              focus:ring-offset-1
              focus:ring-offset-gray-800
              focus:ring-white
            "
          >
            <span class="sr-only">Open user menu</span>
            <DotsVerticalIcon class="h-6 w-6" aria-hidden="true" />
          </button>
          <!-- Admin Dropdown -->
          <Menu
            v-show="isAdmin || canManageSpecialEditions"
            as="div"
            class="hidden lg:block ml-3 relative"
          >
            <div>
              <MenuButton
                class="
                  max-w-xs
                  bg-slate-800
                  rounded-full
                  flex
                  items-center
                  text-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-offset-2
                  focus:ring-offset-gray-800
                  focus:ring-white
                "
              >
                <span class="sr-only">Admin Menu</span>
                <CogIcon class="h-6 w-6" aria-hidden="true" />
              </MenuButton>
            </div>
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems
                class="
                  origin-top-right
                  absolute
                  right-0
                  mt-2
                  w-48
                  rounded-md
                  shadow-2xl
                  py-2
                  ring-1 ring-black ring-opacity-5
                  focus:outline-none
                  text-sm
                  font-semibold
                  bg-mission-blue/95
                  dark:bg-dark-space-blue/95
                  energy:bg-zinc-800/95
                  dark:ring-0 dark:highlight-white/5 dark:text-slate-300
                  energy:text-zinc-300
                  border-x border-b border-slate-700/50
                  energy:border-zinc-700/50
                "
              >
                <MenuItem>
                  <router-link
                    to="/publish"
                    class="
                      py-1
                      px-3
                      hover:bg-slate-700/80
                      dark:hover:bg-slate-600/80
                      energy:hover:bg-zinc-600/80
                      flex
                      items-center
                      cursor-pointer
                    "
                  >
                    Publish an Article
                  </router-link>
                </MenuItem>
                <MenuItem>
                  <router-link
                    to="/special_editions"
                    class="
                      py-1
                      px-3
                      hover:bg-slate-700/80
                      dark:hover:bg-slate-600/80
                      energy:hover:bg-zinc-600/80
                      flex
                      items-center
                      cursor-pointer
                    "
                  >
                    Manage Special Editions
                  </router-link>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
          <button
            disabled
            type="button"
            class="
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
            "
          >
            <span class="sr-only">View notifications</span>
            <BaseTooltip placement="bottom" icon>
              <BellIcon class="h-6 w-6" aria-hidden="true" />
            </BaseTooltip>
          </button>
          <Menu as="div" class="hidden lg:block relative">
            <div>
              <MenuButton
                class="
                  max-w-xs
                  flex
                  items-center
                  p-1
                  rounded-full
                  focus:outline-none
                  focus:ring-2
                  focus:ring-offset-2
                  focus:ring-offset-gray-800
                  focus:ring-white
                "
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
                  <LightningBoltIcon class="h-6 w-6" aria-hidden="true" />
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
            </div>
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems
                class="
                  origin-top-right
                  absolute
                  right-0
                  mt-2
                  w-40
                  rounded-md
                  shadow-2xl
                  py-2
                  ring-1 ring-black ring-opacity-5
                  focus:outline-none
                  text-sm
                  font-semibold
                  bg-mission-blue/95
                  dark:bg-dark-space-blue/95
                  energy:bg-zinc-800/95
                  dark:ring-0 dark:highlight-white/5 dark:text-slate-300
                  energy:text-zinc-300
                  border-x border-b border-slate-700/50
                  energy:border-zinc-700/50
                "
              >
                <MenuItem v-for="item in themeOptions" :key="item">
                  <a
                    :class="isActive(item)"
                    class="
                      py-1
                      px-2
                      hover:bg-slate-700/80
                      dark:hover:bg-slate-600/80
                      energy:hover:bg-zinc-600/80
                      flex
                      items-center
                      space-x-2
                      cursor-pointer
                    "
                    @click="changeTheme(item)"
                  >
                    <template v-if="item === 'light'">
                      <SunIcon class="h-6 w-6" aria-hidden="true" />
                    </template>
                    <template v-else-if="item === 'dark'">
                      <MoonIcon class="h-6 w-6" aria-hidden="true" />
                    </template>
                    <template v-else-if="item === 'energy'">
                      <LightningBoltIcon class="h-6 w-6" aria-hidden="true"
                    /></template>
                    <template v-else-if="item === 'system'">
                      <DesktopComputerIcon
                        class="h-6 w-6"
                        aria-hidden="true" /></template
                    ><span class="capitalize">{{ item }}</span></a
                  >
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
          <!-- Profile dropdown -->
          <Menu as="div" class="hidden lg:block ml-3 relative">
            <div>
              <MenuButton
                class="
                  max-w-xs
                  rounded-full
                  flex
                  items-center
                  text-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-offset-2
                  focus:ring-offset-gray-800
                  focus:ring-white
                "
              >
                <span class="sr-only">Open user menu.</span>
                <UserCircleIcon class="h-8 w-8" aria-hidden="true" />
              </MenuButton>
            </div>
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems
                class="
                  origin-top-right
                  absolute
                  right-0
                  mt-2
                  w-52
                  rounded-md
                  shadow-2xl
                  py-2
                  ring-1 ring-black ring-opacity-5
                  focus:outline-none
                  text-sm
                  font-semibold
                  bg-mission-blue/95
                  dark:bg-dark-space-blue/95
                  energy:bg-zinc-800/95
                  dark:ring-0 dark:highlight-white/5 dark:text-slate-300
                  energy:text-zinc-300
                  border-x border-b border-slate-700/50
                  energy:border-zinc-700/50
                "
              >
                <MenuItem>
                  <router-link
                    to="/"
                    class="
                      flex
                      cursor-pointer
                      py-1
                      px-3
                      hover:bg-slate-700/80
                      dark:hover:bg-slate-600/80
                      energy:hover:bg-zinc-600/80
                    "
                    >{{
                      loadingUser ? "Loading..." : currentUsername
                    }}</router-link
                  >
                </MenuItem>
                <MenuItem>
                  <BaseTooltip placement="left">
                    <a
                      class="
                        flex
                        cursor-pointer
                        py-1
                        px-3
                        hover:bg-slate-700/80
                        dark:hover:bg-slate-600/80
                        energy:hover:bg-zinc-600/80
                      "
                      >Settings
                    </a>
                  </BaseTooltip>
                </MenuItem>
                <template v-if="environment === 'low'">
                  <MenuItem>
                    <a
                      class="
                        flex
                        cursor-pointer
                        py-1
                        px-3
                        hover:bg-slate-700/80
                        dark:hover:bg-slate-600/80
                        energy:hover:bg-zinc-600/80
                      "
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
      <ul class="hidden lg:flex space-x-8 text-sm leading-10 justify-center">
        <!-- <li>
          <Menu as="div" class="relative">
            <MenuButton
              class="
                flex
                items-center
                font-semibold
                hover:text-slate-100
                dark:hover:text-slate-100
                energy:hover:text-energy-yellow
              "
              tabindex="0"
            >
              Issues<ChevronDownIcon class="h-3 w-3 ml-1" aria-hidden="true" />
            </MenuButton>
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems
                class="
                  origin-top-right
                  absolute
                  right-0
                  mt-2
                  w-52
                  rounded-md
                  shadow-2xl
                  py-2
                  ring-1 ring-black ring-opacity-5
                  focus:outline-none
                  text-sm
                  bg-mission-blue/95
                  dark:bg-dark-space-blue/95
                  energy:bg-zinc-800/95
                  dark:ring-0 dark:highlight-white/5 dark:text-slate-300
                  energy:text-zinc-300
                "
              >
                <MenuItem
                  as="a"
                  v-for="issue in metadata.issues.items"
                  :key="issue"
                  v-slot="{ active }"
                  @click="navigateToIssue(issue)"
                >
                  <span
                    :class="[
                      active
                        ? 'bg-slate-700/80 dark:bg-slate-600/80 energy:bg-zinc-600/80'
                        : '',
                      'py-1 px-3 flex cursor-pointer',
                    ]"
                    >{{ issue.name }}</span
                  >
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </li> -->
        <li>
          <BannerNavPopover wideShrunk>
            <template #heading>
              Regions<ChevronDownIcon class="h-3 w-3 ml-1" aria-hidden="true" />
            </template>
            <template #content>
              <div class="hidden lg:block lg:m-auto">
                <div
                  class="
                    grid
                    lg:grid-cols-5
                    xl:grid-cols-7
                    gap-x-4 gap-y-2
                    pb-4
                  "
                  aria-label="select a region or subregion"
                >
                  <div v-for="region in metadata.regions.items" :key="region">
                    <a
                      href=""
                      @click.prevent="navigateToRegion(region)"
                      class="lg:text-lg hover:underline cursor-pointer"
                    >
                      {{ region.name }}
                    </a>
                    <ul class="pt-2 list-disc list-inside">
                      <template
                        v-for="subregion in region.subregions"
                        :key="subregion"
                      >
                        <template
                          v-for="subregionItem in metadata.subregions.items"
                          :key="subregionItem"
                        >
                          <li v-if="subregionItem.key === subregion">
                            <a
                              href=""
                              @click.prevent="
                                navigateToSubregion(subregionItem)
                              "
                              class="hover:underline cursor-pointer font-light"
                            >
                              {{ subregionItem.name }}
                            </a>
                          </li>
                        </template>
                      </template>
                    </ul>
                  </div>
                </div>
                <p
                  class="
                    pt-2
                    border-t border-slate-900/10
                    dark:border-slate-50/[0.06]
                    energy:border-zinc-700/25
                  "
                >
                  View a
                  <button
                    @click="openPDF"
                    class="underline"
                    aria-label="View a PDF document with a list of countries that fall under each region and subregion"
                  >
                    list of countries
                  </button>
                  that fall under each region and subregion
                </p>
              </div>
            </template>
          </BannerNavPopover>
        </li>
        <li>
          <BannerNavPopover wideShrunk>
            <template #heading>
              Countries<ChevronDownIcon
                class="h-3 w-3 ml-1"
                aria-hidden="true"
              />
            </template>
            <template #content>
              <div class="flex justify-center mb-4 m-auto">
                <label for="country" aria-hidden="true"
                  >Select a country from the map or the dropdown</label
                >
                <Listbox
                  v-model="selectedCountry"
                  aria-label="select a country from the dropdown"
                >
                  <div class="relative w-full max-w-[400px] ml-4">
                    <ListboxButton
                      class="
                        flex
                        w-full
                        px-2
                        text-left
                        capitalize
                        text-slate-800
                        dark:text-slate-300
                        energy:text-zinc-300
                        bg-slate-100
                        dark:bg-slate-800
                        energy:bg-zinc-600
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
                        selectedCountry.name
                      }}</span>
                      <span
                        class="
                          absolute
                          inset-y-0
                          right-0
                          flex
                          items-center
                          pr-2
                        "
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
                          text-slate-800
                          dark:text-slate-300
                          energy:text-zinc-300
                          bg-slate-100
                          dark:bg-slate-800
                          energy:bg-zinc-600
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
                          v-for="country in metadata.countries.items"
                          :key="country"
                          :value="country"
                          as="template"
                          class="capitalize px-2 py-1 cursor-pointer"
                          @click="navigateToCountry(country)"
                        >
                          <li
                            :class="[
                              active
                                ? 'bg-slate-200 dark:bg-slate-700 energy:bg-zinc-700'
                                : 'bg-none',
                            ]"
                          >
                            {{ country.name }}
                          </li>
                        </ListboxOption>
                      </ListboxOptions>
                    </transition>
                  </div>
                </Listbox>
              </div>
              <BannerNavMap aria-hidden="true" />
            </template>
          </BannerNavPopover>
        </li>
        <li>
          <div
            class="
              font-semibold
              flex
              items-center
              hover:text-slate-100
              dark:hover:text-slate-100
              energy:hover:text-energy-yellow
            "
            tabindex="0"
          >
            <BaseTooltip :placement="'bottom'"> Foreign </BaseTooltip>
          </div>
        </li>
        <li>
          <div
            class="
              font-semibold
              flex
              items-center
              hover:text-slate-100
              dark:hover:text-slate-100
              energy:hover:text-energy-yellow
            "
            tabindex="0"
          >
            <BaseTooltip placement="bottom"> Community </BaseTooltip>
          </div>
        </li>
        <li>
          <BannerNavPopover>
            <template #heading>
              Special Editions<ChevronDownIcon
                class="h-3 w-3 ml-1"
                aria-hidden="true"
              />
            </template>
            <template #content>
              <div class="hidden lg:block lg:m-auto">
                <template v-if="loadingSpecialEditionLinks">
                  <div class="flex justify-center">
                    <svg
                      class="
                        animate-spin
                        -ml-1
                        mr-3
                        h-14
                        w-14
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
                <template v-else>
                  <template
                    v-if="
                      specialEditionLinks.posted &&
                      specialEditionLinks.posted.length > 0
                    "
                  >
                    <div
                      class="flex flex-col space-y-3"
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
        <!-- <li>
          <div
            class="
              font-semibold
              flex
              items-center
              hover:text-slate-100
              dark:hover:text-slate-100
              energy:hover:text-energy-yellow
            "
            tabindex="0"
          >
            Special Editions
          </div>
        </li> -->
        <!-- <li class="2xl:hidden">
          <Menu as="div" class="relative">
            <MenuButton
              class="
                flex
                items-center
                font-semibold
                hover:text-slate-100
                dark:hover:text-slate-100
                energy:hover:text-energy-yellow
              "
              tabindex="0"
            >
              More<ChevronDownIcon class="h-3 w-3 ml-1" aria-hidden="true" />
            </MenuButton>
            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems
                class="
                  origin-top-right
                  absolute
                  right-0
                  mt-2
                  w-40
                  rounded-md
                  shadow-2xl
                  py-2
                  ring-1 ring-black ring-opacity-5
                  focus:outline-none
                  text-sm
                  bg-mission-blue/95
                  dark:bg-dark-space-blue/95
                  energy:bg-zinc-800/95
                  dark:ring-0 dark:highlight-white/5 dark:text-slate-300
                  energy:text-zinc-300
                "
              >
                <MenuItem as="div" v-slot="{ active }">
                  <a
                    href="/"
                    :class="[
                      active
                        ? 'bg-slate-700/80 dark:bg-slate-600/80 energy:bg-zinc-600/80'
                        : '',
                      'py-1 px-3 flex cursor-pointer',
                    ]"
                    >Community</a
                  >
                </MenuItem>
                <MenuItem as="div" v-slot="{ active }">
                  <a
                    href="/"
                    :class="[
                      active
                        ? 'bg-slate-700/80 dark:bg-slate-600/80 energy:bg-zinc-600/80'
                        : '',
                      'py-1 px-3 flex cursor-pointer',
                    ]"
                    >Special Editions</a
                  >
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>
        </li> -->
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
              enter-from="opacity-0"
              enter-to="opacity-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100"
              leave-to="opacity-0"
            >
              <div class="fixed inset-0 bg-black/25" />
            </TransitionChild>
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
                  fixed
                  max-w-xs
                  top-2
                  right-4
                  p-6
                  my-8
                  text-left
                  align-top
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
                  @click="closeUserMenuModal"
                >
                  <span class="sr-only">Close user menu</span
                  ><XIcon class="h-5 w-5" aria-hidden="true" />
                </button>
                <ul class="space-y-6">
                  <li>
                    <a
                      class="
                        hover:text-black
                        dark:hover:text-white
                        energy:hover:text-white
                      "
                      >{{ loadingUser ? "Loading..." : currentUsername }}</a
                    >
                  </li>
                  <li v-show="isAdmin">
                    <router-link
                      to="/publish"
                      class="
                        hover:text-black
                        dark:hover:text-white
                        energy:hover:text-white
                      "
                    >
                      Publish an Article
                    </router-link>
                  </li>
                  <li v-show="isAdmin || canManageSpecialEditions">
                    <router-link
                      to="/special_editions"
                      class="
                        hover:text-black
                        dark:hover:text-white
                        energy:hover:text-white
                      "
                    >
                      Manage Special Editions
                    </router-link>
                  </li>
                  <li>
                    <BaseTooltip placement="left">
                      <a
                        class="
                          hover:text-black
                          dark:hover:text-white
                          energy:hover:text-white
                        "
                        >Settings</a
                      >
                    </BaseTooltip>
                  </li>
                </ul>
                <ul
                  class="
                    mt-6
                    pt-6
                    space-y-4
                    border-t border-slate-900/10
                    dark:border-slate-50/[0.06]
                    energy:border-zinc-700/25
                  "
                >
                  <li class="flex items-center justify-between">
                    <label for="theme" class="font-normal">Switch theme</label>
                    <Listbox v-model="selectedTheme">
                      <div class="relative mt-1">
                        <ListboxButton
                          class="
                            flex
                            items-center
                            relative
                            w-full
                            p-2
                            text-left
                            capitalize
                            bg-white
                            dark:bg-dark-navy
                            energy:bg-zinc-800
                            rounded-lg
                            shadow-md
                            cursor-default
                            focus:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-opacity-75
                            focus-visible:ring-white
                            focus-visible:ring-offset-orange-300
                            focus-visible:ring-offset-2
                            focus-visible:border-indigo-500
                          "
                        >
                          <template v-if="selectedTheme === 'dark'">
                            <MoonIcon class="h-6 w-6 mr-2" aria-hidden="true" />
                          </template>
                          <template v-else-if="selectedTheme === 'energy'">
                            <LightningBoltIcon
                              class="h-6 w-6 mr-2"
                              aria-hidden="true"
                            />
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
                          class="
                            absolute
                            w-full
                            py-1
                            mt-1
                            overflow-auto
                            text-base
                            bg-white
                            dark:bg-dark-navy
                            energy:bg-zinc-800
                            rounded-md
                            shadow-lg
                            max-h-60
                            ring-1 ring-black ring-opacity-5
                            focus:outline-none
                            z-10
                          "
                        >
                          <ListboxOption
                            v-for="theme in themeOptions"
                            :key="theme"
                            :value="theme"
                            class="
                              capitalize
                              px-2
                              py-1
                              cursor-pointer
                              hover:bg-slate-200/80
                              dark:hover:bg-slate-600/80
                              energy:hover:bg-zinc-600/80
                            "
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
                      @click="openTestConsoleModalMobile"
                      >Test Console</a
                    >
                  </li>
                </ul>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
    <TestConsoleDialog
      :isOpen="isTestConsoleMenuOpen"
      @close="closeTestConsoleModal"
      v-model:alert="alertEnabled"
    />
  </nav>
</template>

<script>
import { ref, watch, computed } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { metadata } from "@/config";
import BannerSearchBar from "@/components/BannerSearchBar";
import BannerNavPopover from "@/components/BannerNavPopover";
import BannerNavMap from "@/components/BannerNavMap";
import SpecialEditionLink from "@/components/SpecialEditionLink";
import MobileSideMenu from "@/components/MobileSideMenu";
import TestConsoleDialog from "@/components/TestConsoleDialog";
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
  BellIcon,
  CogIcon,
  ChevronDownIcon,
  DesktopComputerIcon,
  DotsVerticalIcon,
  ExclamationCircleIcon,
  LightningBoltIcon,
  MenuIcon,
  MoonIcon,
  //SearchIcon,
  SelectorIcon,
  SunIcon,
  UserCircleIcon,
  XIcon,
} from "@heroicons/vue/outline";

import { regions, countries } from "@/data";

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
    BellIcon,
    CogIcon,
    ChevronDownIcon,
    DesktopComputerIcon,
    DotsVerticalIcon,
    ExclamationCircleIcon,
    LightningBoltIcon,
    MenuIcon,
    MoonIcon,
    //SearchIcon,
    SelectorIcon,
    SunIcon,
    UserCircleIcon,
    XIcon,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const environment = ref(process.env.NODE_ENV);
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
    const canManageSpecialEditions = computed(
      () => store.getters["user/canManageSpecialEditions"]
    );
    const selectedCountry = ref(countries[0]);

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

    // NOTE: setTimeout added as a temporary workaround for
    // multiple dialog scroll behavior bug
    const openTestConsoleModalMobile = () => {
      isUserMenuOpen.value = false;
      setTimeout(() => (isTestConsoleMenuOpen.value = true), 500);
    };

    const openPDF = () => {
      //TODO: figure the right approach to PDF referencing
      //window.open("/pdf/List-of-Countries-by-Region-UN-Annex-II.pdf");
    };

    const navigateToIssue = (issue) => {
      let query = {
        "reporting_types[]": "analysis.all_source",
        view: "grid",
        landing: true,
      };
      query[metadata.issues.type] = issue.key;
      router.push({
        name: "issues",
        params: {
          name: issue.name,
        },
        query,
      });
    };

    const navigateToRegion = (region) => {
      let query = {
        "reporting_types[]": "analysis.all_source",
        view: "grid",
        landing: true,
      };
      query[metadata.regions.type] = region.key;
      router.push({
        name: "regions",
        params: {
          name: region.name,
        },
        query,
      });
    };

    const navigateToSubregion = (subregion) => {
      let query = {
        "reporting_types[]": "analysis.all_source",
        view: "grid",
        landing: true,
      };
      query[metadata.subregions.type] = subregion.key;
      router.push({
        name: "subregions",
        params: {
          name: subregion.name,
        },
        query,
      });
    };

    const navigateToCountry = (country) => {
      let query = {
        "reporting_types[]": "analysis.all_source",
        view: "grid",
        landing: true,
      };
      query[metadata.countries.type] = country.key;
      router.push({
        name: "countries",
        params: {
          name: country.name,
        },
        query,
      });
    };

    return {
      metadata,
      regions,
      countries,
      environment,
      isLiveDemo,
      selectedCountry,
      themeOptions,
      isMainMenuOpen,
      isUserMenuOpen,
      isTestConsoleMenuOpen,
      isDark,
      selectedTheme,
      changeTheme,
      alertEnabled,
      currentUsername,
      loadingUser,
      loadingSpecialEditionLinks,
      specialEditionLinks,
      isAdmin,
      canManageSpecialEditions,
      isActive,
      closeMainMenuModal,
      openMainMenuModal,
      closeUserMenuModal,
      openUserMenuModal,
      closeTestConsoleModal,
      openTestConsoleModal,
      openTestConsoleModalMobile,
      openPDF,
      removeAlertMessage,
      navigateToIssue,
      navigateToRegion,
      navigateToSubregion,
      navigateToCountry,
    };
  },
};
</script>
<style lang="scss">
/* Empty on Purpose */
</style>
