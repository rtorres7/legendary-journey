<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" class="block lg:hidden" @close="close">
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
                energy:text-zinc-300
                bg-slate-100
                dark:bg-slate-700
                energy:bg-zinc-700
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
                @click="close"
              >
                <span class="sr-only">Close main menu</span
                ><XIcon class="h-5 w-5" aria-hidden="true" />
              </button>
              <ul class="space-y-6">
                <li>
                  <a
                    class="
                      font-medium
                      hover:text-black
                      dark:hover:text-white
                      energy:text-white
                    "
                    href="/"
                    >Home</a
                  >
                </li>
                <li>
                  <a
                    class="
                      font-medium
                      hover:text-black
                      dark:hover:text-white
                      energy:text-white
                    "
                    href="/"
                    >Searches</a
                  >
                </li>
                <li>
                  <MobileSideMenuDisclosure :title="'Issues'">
                    <ul class="list-disc list-inside ml-4 mt-4">
                      <template
                        v-for="issue in metadata.issues.items"
                        :key="issue"
                      >
                        <li>
                          <a
                            @click="navigateToIssue(issue)"
                            class="hover:underline cursor-pointer"
                            >{{ issue.name }}</a
                          >
                        </li>
                      </template>
                    </ul>
                  </MobileSideMenuDisclosure>
                </li>
                <li>
                  <MobileSideMenuDisclosure :title="'Regions'">
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
                                  <!-- TODO: These mobile links aren't working for regions/subregions/countries -->
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
                  </MobileSideMenuDisclosure>
                </li>
                <li>
                  <MobileSideMenuDisclosure :title="'Countries'">
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
                                v-for="country in countries"
                                :key="country"
                                :value="country"
                                as="template"
                                class="capitalize px-2 py-1 cursor-pointer"
                              >
                                <li
                                  :class="[
                                    active
                                      ? 'bg-slate-200/80 dark:bg-slate-700 energy:bg-zinc-700'
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
                  </MobileSideMenuDisclosure>
                </li>
                <BaseTooltip placement="bottom">
                  <li>
                    <a
                      class="
                        font-medium
                        hover:text-black
                        dark:hover:text-white
                        energy:text-white
                      "
                      href="/"
                      >Community</a
                    >
                  </li>
                </BaseTooltip>
                <li>
                  <BaseTooltip placement="bottom">
                    <a
                      class="
                        font-medium
                        hover:text-black
                        dark:hover:text-white
                        energy:text-white
                      "
                      href="/"
                      >Special Editions</a
                    >
                  </BaseTooltip>
                </li>
                <li>
                  <BaseTooltip placement="bottom">
                    <a
                      class="
                        font-medium
                        hover:text-black
                        dark:hover:text-white
                        energy:text-white
                      "
                      href="/"
                      >Foreign</a
                    >
                  </BaseTooltip>
                </li>
              </ul>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { metadata } from "@/config";
import { regions, countries } from "@/data";
import MobileSideMenuDisclosure from "@/components/MobileSideMenuDisclosure";
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
import { ChevronDownIcon, SelectorIcon, XIcon } from "@heroicons/vue/outline";

export default {
  components: {
    MobileSideMenuDisclosure,
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
    ChevronDownIcon,
    SelectorIcon,
    XIcon,
  },
  props: {
    isOpen: Boolean,
  },
  setup(props, { emit }) {
    const router = useRouter();

    const selectedCountry = ref(countries[0]);
    const close = () => {
      emit("close");
    };

    const navigateToIssue = (issue) => {
      router.push({
        name: "issues",
        params: {
          name: issue.name,
        },
        query: {
          "issues[]": issue.key,
          "reporting_types[]": "analysis.all_source",
          view: "grid",
          landing: true,
        },
      });
    };

    return {
      metadata,
      close,
      regions,
      countries,
      selectedCountry,
      navigateToIssue,
    };
  },
  methods: {
    openPDF() {
      window.open("/pdf/List-of-Countries-by-Region-UN-Annex-II.pdf");
    },
  },
};
</script>
<style lang="scss">
/* Empty on Purpose */
</style>
