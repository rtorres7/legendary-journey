<template>
  <div class="bg-mission-blue dark:bg-dark-space-blue energy:bg-gray-800">
    <div
      class="max-w-8xl mx-auto px-4 flex justify-center lg:justify-between py-8"
    >
      <div class="hidden lg:flex h-full items-center">
        <img class="h-14 w-14" src="@/assets/NCTCSealcolor.png" />
        <div
          class="
            ml-4
            uppercase
            text-xl text-white
            dark:text-slate-200
            energy:text-energy-yellow
            font-semibold
            tracking-[.25em]
          "
        >
          logo
        </div>
      </div>
      <ul
        class="
          flex
          self-center
          space-x-6
          text-sm text-slate-300
          energy:text-gray-300
        "
      >
        <li class="cursor-pointer hover:text-white">My CT Daily</li>
        <li class="cursor-pointer hover:text-white">NCTC Info</li>
        <li class="cursor-pointer hover:text-white">Revisions</li>
        <Menu as="li" class="relative">
          <div>
            <MenuButton
              class="
                max-w-xs
                flex
                items-center
                hover:text-white
                focus:outline-none
                focus:ring-2
                focus:ring-offset-2
                focus:ring-offset-gray-800
                focus:ring-white
              "
            >
              Program of Analysis<ChevronDownIcon
                class="h-3 w-3 ml-1"
                aria-hidden="true"
              />
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
                absolute
                -top-2
                right-0
                transform
                -translate-y-full
                rounded-md
                shadow-2xl
                w-52
                py-2
                ring-1 ring-black ring-opacity-5
                focus:outline-none
                text-slate-700
                bg-mission-gray
                dark:bg-slate-800
                energy:bg-gray-700
                dark:ring-0 dark:highlight-white/5 dark:text-slate-300
                energy:text-gray-300
              "
            >
              <MenuItem v-for="item in poaLinks" :key="item.name">
                <a
                  :href="item.href"
                  class="
                    py-1
                    px-3
                    hover:bg-slate-200/80
                    dark:hover:bg-slate-600/80
                    energy:hover:bg-gray-600/80
                    flex
                    items-center
                    cursor-pointer
                  "
                  >{{ item.name }}</a
                >
              </MenuItem>
            </MenuItems>
          </transition>
        </Menu>
        <Menu as="li" class="relative">
          <div>
            <MenuButton
              class="
                max-w-xs
                flex
                items-center
                hover:text-white
                focus:outline-none
                focus:ring-2
                focus:ring-offset-2
                focus:ring-offset-gray-800
                focus:ring-white
              "
            >
              Resources<ChevronDownIcon
                class="h-3 w-3 ml-1"
                aria-hidden="true"
              />
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
                absolute
                -top-2
                right-0
                transform
                -translate-y-full
                rounded-md
                shadow-2xl
                w-56
                ring-1 ring-black ring-opacity-5
                focus:outline-none
                text-slate-700
                bg-mission-gray
                dark:bg-slate-700
                energy:bg-gray-700
                dark:ring-0 dark:highlight-white/5 dark:text-slate-300
                energy:text-gray-300
              "
            >
              <div
                v-for="linkGroup in resourceLinks"
                :key="linkGroup"
                class="
                  py-2
                  last:border-none
                  border-b border-slate-800/10
                  dark:border-slate-600
                  energy:border-gray-600
                "
              >
                <MenuItem v-for="item in linkGroup" :key="item">
                  <a
                    :href="item.href"
                    class="
                      py-1
                      px-3
                      hover:bg-slate-200/80
                      dark:hover:bg-slate-600/80
                      energy:hover:bg-gray-600/80
                      flex
                      items-center
                      cursor-pointer
                    "
                    >{{ item.name }}</a
                  >
                </MenuItem>
              </div>
            </MenuItems>
          </transition>
        </Menu>
      </ul>
    </div>
    <div id="classification">
      <p
        class="
          text-center text-sm
          uppercase
          text-slate-300
          energy:text-gray-300
        "
      >
        Unclassified
      </p>
    </div>
  </div>
</template>
<script>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/outline";

const poaLinks = [
  { name: "2022 Program of Analysis", href: "/" },
  { name: "2021 Program of Analysis", href: "/" },
  { name: "2020 Program of Analysis", href: "/" },
];
const resourceLinks = [
  [
    { name: "DI Tradecraft", href: "/" },
    { name: "NCTC/DI Artforms", href: "/" },
    { name: "NCTC Additional Resources", href: "/" },
    { name: "Production Processes", href: "/" },
  ],
  [
    { name: "Website Overview", href: "/" },
    { name: "World Factbook", href: "/" },
    { name: "Accessibility Help", href: "/" },
  ],
];

export default {
  components: {
    ChevronDownIcon,
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
  },
  setup() {
    return {
      poaLinks,
      resourceLinks,
    };
  },
};
</script>
<style lang="scss">
/* Empty on Purpose */
</style>