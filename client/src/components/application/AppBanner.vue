<template>
  <div
    v-if="!hasAcknowledged"
    id="system-message"
    class="
      bg-mission-blue
      dark:bg-dark-space-blue
      energy:bg-gray-800
      justify-center
      p-4
    "
  >
    <div
      class="
        flex
        items-center
        bg-slate-700/40
        dark:bg-slate-700/30
        energy:bg-gray-700/40
        rounded-lg
        p-4
      "
    >
      <p class="text-sm text-amber-300 dark:text-teal-400">
        Use of this system message content placeholder message. Sit an qualisque
        appellantur. Eu clita omnesque elaboraret usu, semper dictas vim ea. Nam
        ea ipsum sonet. Volumus fabellas expetendis no quo, ei pro commodo
        pertinax. Diam doming inimicus ex est, ex his audiam fastidii
        persequeris. No has nihil electram.
      </p>
      <a
        aria-label="Remove system message"
        @click="removeSystemMessage"
        class="m-4 text-slate-300 hover:text-white"
      >
        <XIcon class="block cursor-pointer h-6 w-6" aria-hidden="true" />
      </a>
    </div>
  </div>
  <div id="classification">
    <p
      class="
        text-slate-300
        bg-mission-blue
        dark:text-slate-300 dark:bg-dark-space-blue
        energy:text-gray-300 energy:bg-gray-800
        text-center text-sm
        uppercase
      "
    >
      Unclassified
    </p>
  </div>
  <nav
    class="
      text-slate-200
      bg-mission-blue
      dark:text-slate-300 dark:bg-dark-space-blue
      energy:text-gray-300 energy:bg-gray-800
      sticky
      top-0
      z-10
      backdrop-filter backdrop-blur
      lg:py-2
    "
  >
    <div
      v-if="alertEnabled"
      id="alert-message"
      class="flex justify-between items-center bg-red-800 text-white p-2 lg:p-1"
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
          m-4
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
    <div class="mx-auto lg:px-8 lg:pt-2">
      <div class="grid lg:flex items-center lg:justify-between h-16">
        <div class="hidden lg:flex h-full items-center">
          <router-link class="h-full" to="/">
            <img
              class="h-full w-18"
              src="@/assets/NCTCSealcolor.png"
              alt="NCTC. Seal. Link to homepage."
            />
          </router-link>
          <div
            class="
              hidden
              xl:block
              ml-4
              uppercase
              text-2xl text-white
              dark:text-slate-200
              energy:text-energy-yellow
              font-semibold
              tracking-[.25em]
            "
          >
            logo
          </div>
        </div>
        <div class="hidden lg:block">
          <div class="ml-4 flex items-center md:ml-6 lg:ml-3">
            <SearchBar />
            <div class="text-sm leading-6 pl-6 pr-3">
              <ul class="flex space-x-3 xl:space-x-4">
                <li>
                  <div
                    class="
                      font-semibold
                      flex
                      items-center
                      hover:text-amber-300
                      dark:hover:text-teal-400
                      energy:hover:text-energy-yellow
                    "
                    tabindex="0"
                  >
                    Community
                  </div>
                </li>
                <li>
                  <div
                    class="
                      font-semibold
                      flex
                      items-center
                      hover:text-amber-300
                      dark:hover:text-teal-400
                      energy:hover:text-energy-yellow
                    "
                    tabindex="0"
                  >
                    Special Editions
                  </div>
                </li>
                <li>
                  <Menu as="div" class="relative">
                    <MenuButton
                      class="
                        flex
                        items-center
                        font-semibold
                        hover:text-amber-300
                        dark:hover:text-teal-400
                        energy:hover:text-energy-yellow
                      "
                      tabindex="0"
                    >
                      <span class="sr-only">Open issues menu</span>
                      Issues<ChevronDownIcon
                        class="h-3 w-3 ml-1"
                        aria-hidden="true"
                      />
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
                          bg-mission-blue
                          dark:bg-dark-space-blue/95
                          energy:bg-gray-700
                          dark:ring-0 dark:highlight-white/5 dark:text-slate-300
                          energy:text-gray-300
                        "
                      >
                        <MenuItem
                          v-for="item in issuesNavigation"
                          :key="item.name"
                        >
                          <a
                            :href="item.href"
                            class="
                              py-1
                              px-3
                              hover:bg-slate-700/80
                              dark:hover:bg-slate-600/80
                              energy:hover:bg-gray-600/80
                              flex
                              cursor-pointer
                            "
                            >{{ item.name }}</a
                          >
                        </MenuItem>
                      </MenuItems>
                    </transition>
                  </Menu>
                </li>
                <li>
                  <MainNavPopover>
                    <template #heading>
                      Regions<ChevronDownIcon
                        class="h-3 w-3 ml-1"
                        aria-hidden="true"
                      />
                    </template>
                    <template #content>
                      <div class="hidden lg:block">
                        <div
                          class="grid grid-cols-3 gap-6 pb-4"
                          aria-label="select a region or subregion"
                        >
                          <div v-for="region in regions" :key="region">
                            <router-link
                              to=""
                              class="lg:text-lg hover:underline"
                              >{{ region.name }}</router-link
                            >
                            <ul class="pt-2 list-disc list-inside">
                              <template
                                v-for="subRegion in region.subRegions"
                                :key="subRegion"
                              >
                                <li v-if="subRegion.name != ''">
                                  <router-link
                                    to=""
                                    class="hover:underline font-light"
                                    >{{ subRegion.name }}</router-link
                                  >
                                </li>
                              </template>
                            </ul>
                          </div>
                        </div>
                        <p
                          class="
                            pt-4
                            border-t border-slate-900/10
                            dark:border-slate-50/[0.06]
                            energy:border-gray-700/25
                          "
                        >
                          View a
                          <a
                            @click="openPDF"
                            class="cursor-pointer underline"
                            aria-label="View a PDF document with a list of countries that fall under each region and subregion"
                          >
                            list of countries
                          </a>
                          that fall under each region and subregion
                        </p>
                      </div>
                    </template>
                  </MainNavPopover>
                </li>
                <li>
                  <MainNavPopover>
                    <template #heading>
                      <GlobeIcon class="h-6 w-6" aria-label="View world map" />
                    </template>
                    <template #content>
                      <div class="flex items-center mb-4">
                        <label for="country" aria-hidden="true"
                          >Select a country from the map or the dropdown</label
                        >
                        <Listbox
                          v-model="selectedCountry"
                          aria-label="select a country from the dropdown"
                        >
                          <div class="relative w-1/2 ml-4">
                            <ListboxButton
                              class="
                                flex
                                w-full
                                p-2
                                text-left
                                capitalize
                                text-slate-800
                                dark:text-gray-300
                                energy:text-gray-300
                                bg-slate-200
                                dark:bg-slate-800
                                energy:bg-gray-600
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
                                  text-slate-800
                                  dark:text-gray-300
                                  energy:text-gray-300
                                  bg-slate-200
                                  dark:bg-slate-800
                                  energy:bg-gray-600
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
                                  v-for="country in countries"
                                  :key="country"
                                  :value="country"
                                  as="template"
                                  class="capitalize px-2 py-1 cursor-pointer"
                                >
                                  <li
                                    :class="[
                                      active
                                        ? 'bg-slate-200/80 dark:bg-slate-700 energy:bg-gray-700'
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
                      <RegionsMap aria-hidden="true" />
                    </template>
                  </MainNavPopover>
                </li>
              </ul>
            </div>
            <div
              class="
                border-l border-slate-700
                flex
                items-center
                space-x-2
                xl:space-x-4
                ml-2
                pl-2
                xl:ml-4 xl:pl-4
              "
            >
              <button
                disabled
                type="button"
                class="
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
                <BellIcon class="h-6 w-6" aria-hidden="true" />
              </button>
              <Menu as="div" class="relative">
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
                      bg-mission-blue
                      dark:bg-dark-space-blue/95
                      energy:bg-gray-700
                      dark:ring-0 dark:highlight-white/5 dark:text-slate-300
                      energy:text-gray-300
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
                          energy:hover:bg-gray-600/80
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
              <Menu as="div" class="ml-3 relative">
                <div>
                  <MenuButton
                    class="
                      max-w-xs
                      bg-gray-800
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
                    <span class="sr-only">Open user menu</span>
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
                      w-40
                      rounded-md
                      shadow-2xl
                      py-2
                      ring-1 ring-black ring-opacity-5
                      focus:outline-none
                      text-sm
                      font-semibold
                      bg-mission-blue
                      dark:bg-dark-space-blue/95
                      energy:bg-gray-700
                      dark:ring-0 dark:highlight-white/5 dark:text-slate-300
                      energy:text-gray-300
                    "
                  >
                    <MenuItem v-for="item in userNavigation" :key="item.name">
                      <a
                        :href="item.href"
                        class="
                          py-1
                          px-3
                          hover:bg-slate-700/80
                          dark:hover:bg-slate-600/80
                          energy:hover:bg-gray-600/80
                          flex
                          items-center
                          cursor-pointer
                        "
                        >{{ item.name }}</a
                      >
                    </MenuItem>
                    <MenuItem>
                      <a
                        class="
                          flex
                          cursor-pointer
                          py-1
                          px-3
                          hover:bg-slate-700/80
                          dark:hover:bg-slate-600/80
                          energy:hover:bg-gray-600/80
                        "
                        @click="openAlertModal"
                        >Alert</a
                      >
                    </MenuItem>
                  </MenuItems>
                </transition>
              </Menu>
            </div>
          </div>
        </div>
        <!-- Mobile Nav Bar -->
        <div class="px-2 flex justify-between lg:hidden">
          <button
            type="button"
            @click="openMainMenuModal"
            class="
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
          <div class="px-2 w-full rounded-md pointer-events-auto">
            <div
              class="
                flex
                w-full
                items-center
                text-sm
                leading-6
                text-primary
                dark:text-slate-300
                rounded-md
                shadow-sm
                py-1.5
                pl-2
                pr-3
                bg-slate-300
                dark:bg-slate-800
                energy:bg-gray-600
              "
            >
              <SearchIcon
                class="
                  h-6
                  w-6
                  text-slate-800
                  dark:text-slate-300
                  energy:text-gray-300
                "
                aria-hidden="true"
              />
              <input
                class="
                  w-full
                  ml-2
                  focus-visible:outline-none
                  text-slate-800
                  dark:text-gray-300
                  energy:text-gray-300
                  bg-slate-300
                  dark:bg-slate-800
                  energy:bg-gray-600
                "
              />
            </div>
          </div>
          <!-- Mobile user menu button -->
          <button
            type="button"
            @click="openUserMenuModal"
            class="
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
        </div>
      </div>
    </div>
    <!-- Mobile side menu -->
    <TransitionRoot appear :show="isMainMenuOpen" as="template">
      <Dialog as="div" class="block lg:hidden" @close="closeMainMenuModal">
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
              <DialogOverlay class="fixed inset-0 bg-black opacity-50" />
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
              <div
                class="
                  relative
                  min-h-screen
                  w-80
                  max-w-calc[(100%-3rem)]
                  p-6
                  text-left
                  align-top
                  transition-all
                  transform
                  text-slate-700
                  dark:text-slate-300
                  energy:text-gray-300
                  bg-mission-gray
                  dark:bg-slate-700
                  energy:bg-gray-700
                  shadow-lg
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
                  @click="closeMainMenuModal"
                >
                  <span class="sr-only">Close main menu</span
                  ><XIcon class="h-5 w-5" aria-hidden="true" />
                </button>
                <ul class="space-y-6">
                  <li v-for="item in mainNavigation" :key="item">
                    <a
                      class="
                        font-semibold
                        hover:text-black
                        dark:hover:text-white
                        energy:text-white
                      "
                      :href="item.href"
                      >{{ item.name }}</a
                    >
                  </li>
                  <li>
                    <SideMenuDisclosure :title="'Issues'">
                      <ul class="list-disc list-inside ml-4 mt-4">
                        <template
                          v-for="issue in issuesNavigation"
                          :key="issue"
                        >
                          <li>
                            <router-link to="/" class="hover:underline">{{
                              issue.name
                            }}</router-link>
                          </li>
                        </template>
                      </ul>
                    </SideMenuDisclosure>
                  </li>
                  <li>
                    <SideMenuDisclosure :title="'Regions'">
                      <div class="ml-4 mt-4 space-y-4">
                        <div v-for="region in regions" :key="region">
                          <Disclosure v-slot="{ open }">
                            <DisclosureButton
                              class="
                                hover:text-black
                                dark:hover:text-white
                                energy:text-white
                                flex
                                space-x-2
                                items-center
                              "
                            >
                              <span>{{ region.name }}</span>
                              <ChevronDownIcon
                                class="h-3 w-3"
                                :class="open ? 'transform rotate-180' : ''"
                              />
                            </DisclosureButton>
                            <transition
                              enter-active-class="transition ease-out duration-100"
                              enter-from-class="transform opacity-0 scale-95"
                              enter-to-class="transform opacity-100 scale-100"
                              leave-active-class="transition ease-in duration-75"
                              leave-from-class="transform opacity-100 scale-100"
                              leave-to-class="transform opacity-0 scale-95"
                            >
                              <DisclosurePanel>
                                <ul class="list-disc list-inside ml-4 my-2">
                                  <template
                                    v-for="subRegion in region.subRegions"
                                    :key="subRegion"
                                  >
                                    <li v-if="subRegion.name != ''">
                                      <router-link
                                        to=""
                                        class="font-light hover:underline"
                                        >{{ subRegion.name }}</router-link
                                      >
                                    </li>
                                  </template>
                                </ul>
                              </DisclosurePanel>
                            </transition>
                          </Disclosure>
                        </div>
                        <p
                          class="
                            text-sm
                            pt-4
                            border-t border-slate-900/10
                            dark:border-slate-50/[0.06]
                            energy:border-gray-700/25
                          "
                        >
                          View a
                          <a
                            @click="openPDF"
                            class="cursor-pointer underline"
                            aria-label="View a PDF document with a list of countries that fall under each region and subregion"
                          >
                            list of countries
                          </a>
                          that fall under each region and subregion
                        </p>
                      </div>
                    </SideMenuDisclosure>
                  </li>
                  <li>
                    <SideMenuDisclosure :title="'Countries'">
                      <div class="ml-4 mt-4">
                        <label for="country" aria-hidden="true"
                          >Select a country</label
                        >
                        <Listbox
                          v-model="selectedCountry"
                          aria-label="select a country from the dropdown"
                        >
                          <div class="relative mt-1">
                            <ListboxButton
                              class="
                                flex
                                relative
                                w-full
                                p-2
                                text-left
                                capitalize
                                bg-white
                                dark:bg-slate-600
                                energy:bg-gray-600
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
                                  dark:bg-slate-600
                                  energy:bg-gray-600
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
                                  v-for="country in countries"
                                  :key="country"
                                  :value="country"
                                  as="template"
                                  class="capitalize px-2 py-1 cursor-pointer"
                                >
                                  <li
                                    :class="[
                                      active
                                        ? 'bg-slate-200/80 dark:bg-slate-700 energy:bg-gray-700'
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
                    </SideMenuDisclosure>
                  </li>
                </ul>
              </div>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
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
              <DialogOverlay class="fixed inset-0 bg-black opacity-50" />
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
              <div
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
                  energy:text-gray-300
                  bg-mission-gray
                  dark:bg-slate-700
                  energy:bg-gray-700
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
                  <li v-for="item in userNavigation" :key="item">
                    <a
                      class="
                        hover:text-black
                        dark:hover:text-white
                        energy:text-white
                      "
                      ::href="item.href"
                      >{{ item.name }}</a
                    >
                  </li>
                </ul>
                <div
                  class="
                    mt-6
                    pt-6
                    space-y-4
                    border-t border-slate-900/10
                    dark:border-slate-50/[0.06]
                    energy:border-gray-700/25
                  "
                >
                  <div class="flex items-center justify-between">
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
                            energy:bg-slate-800
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
                            energy:bg-slate-800
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
                              hover:bg-slate-700/80
                              dark:hover:bg-slate-600/80
                              energy:hover:bg-gray-600/80
                            "
                          >
                            {{ theme }}
                          </ListboxOption>
                        </ListboxOptions>
                      </div>
                    </Listbox>
                  </div>
                  <SwitchGroup>
                    <div class="flex items-center justify-between">
                      <SwitchLabel class="mr-4">Enable Alert</SwitchLabel>
                      <Switch
                        v-model="alertEnabled"
                        :class="
                          alertEnabled
                            ? 'bg-mission-blue dark:bg-dark-navy energy:bg-slate-800'
                            : 'bg-mission-blue/30 dark:bg-dark-navy/30 energy:bg-slate-800/30'
                        "
                        class="
                          relative
                          inline-flex
                          items-center
                          h-6
                          transition-colors
                          rounded-full
                          w-11
                          focus:outline-none
                          focus:ring-2
                          focus:ring-offset-2
                          focus:ring-slate-500
                        "
                      >
                        <span
                          :class="
                            alertEnabled ? 'translate-x-6' : 'translate-x-1'
                          "
                          class="
                            inline-block
                            w-4
                            h-4
                            transition-transform
                            transform
                            bg-white
                            rounded-full
                          "
                        />
                      </Switch>
                    </div>
                  </SwitchGroup>
                </div>
              </div>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
    <!-- Alert dialog -->
    <TransitionRoot appear :show="isAlertMenuOpen" as="template">
      <Dialog as="div" @close="closeAlertModal">
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
              <DialogOverlay class="fixed inset-0 bg-black opacity-50" />
            </TransitionChild>
            <span class="inline-block h-screen align-middle" aria-hidden="true">
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
              <div
                class="
                  inline-block
                  w-full
                  max-w-xs
                  p-6
                  my-8
                  text-left
                  align-middle
                  transition-all
                  transform
                  text-slate-700
                  dark:text-slate-300
                  energy:text-gray-300
                  bg-mission-gray
                  dark:bg-slate-700
                  energy:bg-gray-700
                  shadow-lg
                  rounded-lg
                "
              >
                <div class="mt-6 pt-6">
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
                    @click="closeAlertModal"
                  >
                    <span class="sr-only">Close navigation</span
                    ><XIcon class="h-5 w-5" aria-hidden="true" />
                  </button>
                  <SwitchGroup>
                    <div class="flex items-center justify-between">
                      <SwitchLabel class="mr-4">Enable Alert</SwitchLabel>
                      <Switch
                        v-model="alertEnabled"
                        :class="
                          alertEnabled
                            ? 'bg-mission-blue dark:bg-dark-navy energy:bg-slate-800'
                            : 'bg-mission-blue/30 dark:bg-dark-navy/30 energy:bg-slate-800/30'
                        "
                        class="
                          relative
                          inline-flex
                          items-center
                          h-6
                          transition-colors
                          rounded-full
                          w-11
                          focus:outline-none
                          focus:ring-2
                          focus:ring-offset-2
                          focus:ring-slate-500
                        "
                      >
                        <span
                          :class="
                            alertEnabled ? 'translate-x-6' : 'translate-x-1'
                          "
                          class="
                            inline-block
                            w-4
                            h-4
                            transition-transform
                            transform
                            bg-white
                            rounded-full
                          "
                        />
                      </Switch>
                    </div>
                  </SwitchGroup>
                </div>
              </div>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </nav>
</template>

<script>
import { ref, watch } from "vue";
import SearchBar from "./search/SearchBar.vue";
import SideMenuDisclosure from "@/layout/SideMenuDisclosure";
import MainNavPopover from "@/layout/MainNavPopover";
import RegionsMap from "@/components/regions/RegionsMap";
import {
  Dialog,
  DialogOverlay,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Switch,
  SwitchGroup,
  SwitchLabel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  BellIcon,
  ChevronDownIcon,
  DesktopComputerIcon,
  DotsVerticalIcon,
  ExclamationCircleIcon,
  GlobeIcon,
  LightningBoltIcon,
  MenuIcon,
  MoonIcon,
  SearchIcon,
  SelectorIcon,
  SunIcon,
  UserCircleIcon,
  XIcon,
} from "@heroicons/vue/outline";

import { regions, countries } from "@/data/regions.js";

const mainNavigation = [
  { name: "Home", href: "/", current: true },
  { name: "Searches", href: "/", current: false },
  { name: "Community", href: "/", current: false },
  { name: "Special Editions", href: "/", current: false },
];
const userNavigation = [
  { name: "Your Profile", href: "/" },
  { name: "Settings", href: "/" },
];
const issuesNavigation = [
  { name: "Issue 0", href: "/" },
  { name: "Issue 1", href: "/" },
  { name: "Issue 2", href: "/" },
  { name: "Issue 3", href: "/" },
  { name: "Issue 4", href: "/" },
  { name: "Issue 5", href: "/" },
  { name: "Issue 6", href: "/" },
  { name: "Issue 7", href: "/" },
  { name: "Issue 8", href: "/" },
  { name: "Issue 9", href: "/" },
];
const themeOptions = ["light", "dark", "energy", "system"];

export default {
  components: {
    SearchBar,
    SideMenuDisclosure,
    MainNavPopover,
    RegionsMap,
    Dialog,
    DialogOverlay,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    Switch,
    SwitchGroup,
    SwitchLabel,
    TransitionChild,
    TransitionRoot,
    BellIcon,
    ChevronDownIcon,
    DesktopComputerIcon,
    DotsVerticalIcon,
    ExclamationCircleIcon,
    GlobeIcon,
    LightningBoltIcon,
    MenuIcon,
    MoonIcon,
    SearchIcon,
    SelectorIcon,
    SunIcon,
    UserCircleIcon,
    XIcon,
  },
  setup() {
    const isMainMenuOpen = ref(false);
    const isUserMenuOpen = ref(false);
    const isAlertMenuOpen = ref(false);
    const isDark = ref(localStorage.getItem("theme") === "dark" ? true : false);
    if (localStorage.getItem("theme") === "system") {
      isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? true
        : false;
    }
    const selectedTheme = ref(localStorage.getItem("theme"));
    const hasAcknowledged = ref(sessionStorage.getItem("acknowledged"));

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

    const selectedCountry = ref(countries[0]);
    return {
      regions,
      countries,
      selectedCountry,
      mainNavigation,
      themeOptions,
      userNavigation,
      issuesNavigation,
      isMainMenuOpen,
      isUserMenuOpen,
      isAlertMenuOpen,
      isDark,
      selectedTheme,
      hasAcknowledged,
      changeTheme,
      alertEnabled,
    };
  },
  methods: {
    removeSystemMessage() {
      document.querySelector("#system-message").remove();
      sessionStorage.setItem("acknowledged", true);
    },
    removeAlertMessage() {
      this.alertEnabled = false;
    },
    isActive(selection) {
      if (selection === localStorage.theme) {
        return "text-amber-300 dark:text-teal-400 energy:text-energy-yellow";
      }
    },
    closeMainMenuModal() {
      this.isMainMenuOpen = false;
    },
    openMainMenuModal() {
      this.isMainMenuOpen = true;
    },
    closeUserMenuModal() {
      this.isUserMenuOpen = false;
    },
    openUserMenuModal() {
      this.isUserMenuOpen = true;
    },
    closeAlertModal() {
      this.isAlertMenuOpen = false;
    },
    openAlertModal() {
      this.isAlertMenuOpen = true;
    },
    openPDF() {
      window.open("/pdf/List-of-Countries-by-Region-UN-Annex-II.pdf");
    },
  },
};
</script>
<style lang="scss">
/* Empty on Purpose */
</style>
