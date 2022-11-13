<template>
  <!-- About                   Program of Analysis          Resources                  
  
NCTC Info               2022 Program of Analysis     DI Tradecraft              
Revisions               2021 Program of Analysis     NCTC/DI ARES               
Security & Copyright    2020 Program of Analysis     WIRe Accessibility Page
                                                     WIRe FAQ
                                                     WIRe Handbook
                                       WIRe Intellipedia
                                      World Factbook	


Current Logo                NCTC/DI Managing Editor/NCTC Current - U: (571) 280-3627 S: 93-24533
                   ITS Help - 24/7 Support - ITS-HELP-LINE@current.gov	
                             -->
  <div
    class="
      max-w-8xl
      mx-auto
      bg-mission-blue
      dark:bg-dark-space-blue
      energy:bg-zinc-800
      text-slate-200
      dark:text-slate-300
      energy:text-zinc-300
    "
  >
    <div class="border-b border-slate-700/50 energy:border-zinc-700/50">
      <div class="max-w-fit mx-auto py-6 grid grid-cols-3 gap-20">
        <template v-for="linkGroup in metadata.footer_links" :key="linkGroup">
          <div>
            <p class="font-semibold pb-4">{{ linkGroup.header }}</p>
            <ul
              class="
                flex flex-col
                space-y-3
                text-sm text-slate-300
                energy:text-zinc-300
              "
            >
              <template v-for="link in linkGroup.links" :key="link">
                <li class="hover:text-white">
                  <a :href="link.href">{{ link.name }}</a>
                </li>
              </template>
            </ul>
          </div>
        </template>
      </div>
    </div>
    <div class="py-6 px-4 flex justify-between items-center">
      <div class="flex items-center">
        <router-link to="/">
          <img
            class="w-16"
            src="@/assets/nctc_seal_color.svg"
            alt="NCTC seal. Link to top of the homepage"
          />
        </router-link>
        <div class="ml-4">
          <div
            class="
              mb-1
              uppercase
              text-xl text-white
              dark:text-slate-200
              energy:text-energy-yellow
              font-semibold
              tracking-[.05em]
            "
          >
            {{ metadata.application_name }}
          </div>
          <p class="text-slate-300 energy:text-zinc-300 text-sm italic">
            {{ metadata.footer_note }}
          </p>
        </div>
      </div>
      <div class="flex space-x-8 text-sm">
        <div class="flex flex-col">
          <p class="mb-1">NCTC/DI Managing Editor, NCTC Current</p>
          <div class="flex space-x-4">
            <p>
              U:
              <span
                class="
                  text-amber-300
                  dark:text-teal-400
                  energy:text-energy-yellow
                "
                >(571) 280-3627</span
              >
            </p>
            <p>
              S:
              <span
                class="
                  text-amber-300
                  dark:text-teal-400
                  energy:text-energy-yellow
                "
                >93-24533</span
              >
            </p>
          </div>
        </div>
        <div class="flex flex-col">
          <p class="mb-1">ITS Help - 24/7 Support</p>
          <a
            :href="`mailto:${metadata.footer_contact.email}`"
            class="
              text-amber-300
              dark:text-teal-400
              energy:text-energy-yellow
              flex
              items-center
              hover:underline
              w-fit
              m-auto
              lg:m-0
            "
          >
            {{ metadata.footer_contact.email }}
            <MailIcon class="h-5 w-5 ml-1" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>

    <!-- <div class="hidden lg:flex h-full items-center">
        <router-link class="hidden xl:block h-full" to="/">
          <img
            class="h-full w-14"
            src="@/assets/nctc_seal_color.svg"
            alt="NCTC seal. Link to top of the homepage"
          />
        </router-link>
        <div class="ml-4">
          <div
            class="
              mb-1
              uppercase
              text-xl text-white
              dark:text-slate-200
              energy:text-energy-yellow
              font-semibold
              tracking-[.05em]
            "
          >
            {{ metadata.application_name }}
          </div>
          <p
            class="
              text-slate-300
              dark:text-slate-300
              energy:text-zinc-300
              text-xs
              italic
            "
          >
            {{ metadata.footer_note }}
          </p>
        </div>
      </div> -->
    <!-- <div class="flex flex-col space-y-3 mb-5 lg:mb-0">
        <p class="font-semibold text-center">Useful Links</p>
        <ul
          class="
            flex flex-col
            md:flex-row
            self-center
            space-y-3
            text-center
            md:text-left md:space-y-0 md:space-x-6
            text-sm
          "
        >
          <li class="cursor-pointer hover:text-white">NCTC Info</li>
          <li class="cursor-pointer hover:text-white">Revisions</li>
          <li class="cursor-pointer hover:text-white">Security & Copyright</li>
          <Menu as="li" class="relative">
            <div>
              <MenuButton
                class="
                  max-w-xs
                  flex
                  items-center
                  m-auto
                  md:m-0
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
                  shadow-2xl
                  w-52
                  py-2
                  ring-1 ring-black ring-opacity-5
                  focus:outline-none
                  bg-mission-blue
                  dark:bg-dark-space-blue
                  energy:bg-zinc-700
                  dark:ring-0 dark:highlight-white/5 dark:text-slate-300
                  energy:text-zinc-300
                "
              >
                <MenuItem
                  v-for="item in metadata.footer_links.poa_links"
                  :key="item.name"
                >
                  <a
                    :href="item.href"
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
                  m-auto
                  md:m-0
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
                  shadow-2xl
                  w-56
                  ring-1 ring-black ring-opacity-5
                  focus:outline-none
                  bg-mission-blue
                  dark:bg-dark-space-blue
                  energy:bg-zinc-700
                  dark:ring-0 dark:highlight-white/5 dark:text-slate-300
                  energy:text-zinc-300
                "
              >
                <div
                  v-for="linkGroup in metadata.footer_links.resources_links"
                  :key="linkGroup"
                  class="
                    py-2
                    last:border-none
                    border-b border-slate-700
                    dark:border-slate-600
                    energy:border-zinc-600
                  "
                >
                  <MenuItem v-for="item in linkGroup" :key="item">
                    <a
                      :href="item.href"
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
                      >{{ item.name }}</a
                    >
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>
        </ul>
      </div> -->
    <!-- <div
        class="
          flex flex-col
          space-y-3
          text-slate-200
          energy:text-zinc-300
          self-center
          lg:self-auto
          text-center
          lg:text-left
        "
      >
        <p class="font-semibold">Contact Us</p>
        <div>
          <p class="mb-2">NCTC/DI Managing Editor, NCTC Current</p>
          <div>
            <p>U: <span class="highlight">(571) 280-3627</span></p>
            <p>S: <span class="highlight">93-24533</span></p>
          </div>
        </div>
        <div>
          <p class="mb-2">ITS Help - 24/7 Support</p>
          <a
            :href="`mailto:${metadata.footer_contact.email}`"
            class="
              highlight
              flex
              items-center
              hover:underline
              w-fit
              m-auto
              lg:m-0
            "
          >
            {{ metadata.footer_contact.email }}
            <MailIcon class="h-5 w-5 ml-1" aria-hidden="true" />
          </a>
        </div>
      </div> -->
    <div id="classification">
      <p class="text-center text-xs uppercase">
        {{ metadata.system_classification }}
      </p>
    </div>
  </div>
</template>
<script>
import { metadata } from "@/config";
//import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { MailIcon } from "@heroicons/vue/outline";

export default {
  components: {
    //ChevronDownIcon,
    MailIcon,
    // Menu,
    // MenuButton,
    // MenuItem,
    // MenuItems,
  },
  setup() {
    return {
      metadata,
    };
  },
};
</script>
<style lang="scss">
</style>
