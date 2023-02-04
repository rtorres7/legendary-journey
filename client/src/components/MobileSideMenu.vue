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
              class="relative min-h-screen w-80 max-w-calc[(100%-3rem)] p-6 text-left align-top transition-all transform text-slate-700 dark:text-slate-300 energy:text-zinc-300 bg-slate-100 dark:bg-slate-700 energy:bg-zinc-700 shadow-lg"
            >
              <button
                type="button"
                class="absolute top-5 right-5 w-8 h-8 flex items-center justify-center"
                tabindex="0"
                @click="close"
              >
                <span class="sr-only">Close main menu</span
                ><XMarkIcon class="h-5 w-5" aria-hidden="true" />
              </button>
              <ul class="space-y-6">
                <li>
                  <a
                    class="font-medium hover:text-black dark:hover:text-white energy:text-white"
                    href="/"
                    >Home</a
                  >
                </li>
                <li>
                  <MobileSideMenuDisclosure :title="'Issues'">
                    <ul class="list-disc list-inside ml-4 mt-4">
                      <template v-for="issue in metadata.issues" :key="issue">
                        <li>
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
                        </li>
                      </template>
                    </ul>
                  </MobileSideMenuDisclosure>
                </li>
                <li>
                  <MobileSideMenuDisclosure :title="'Regions'">
                    <div class="ml-4 mt-4 space-y-4">
                      <template v-if="loadingMetadata"> Loading... </template>
                      <template v-else>
                        <div v-for="region in criteria.regions" :key="region">
                          <Disclosure v-slot="{ open }">
                            <DisclosureButton
                              class="hover:text-black dark:hover:text-white energy:text-white flex space-x-2 items-center"
                            >
                              <span>{{ region.name }}</span>
                              <ChevronDownIcon
                                class="h-4 w-4"
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
                                              'subregions[]':
                                                subregionItem.code,
                                            },
                                          }"
                                          class="hover:underline cursor-pointer font-light"
                                        >
                                          {{ subregionItem.name }}
                                        </router-link>
                                      </li>
                                    </template>
                                  </template>
                                </ul>
                              </DisclosurePanel>
                            </transition>
                          </Disclosure>
                        </div>
                        <p
                          class="text-sm pt-4 border-t border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25"
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
                      </template>
                    </div>
                  </MobileSideMenuDisclosure>
                </li>
                <li>
                  <MobileSideMenuDisclosure :title="'Countries'">
                    <div class="ml-4 mt-4">
                      <template v-if="loadingMetadata"> Loading... </template>
                      <template v-else>
                        <label for="country" aria-hidden="true"
                          >Select a country</label
                        >
                        <Listbox
                          v-model="selectedCountry"
                          aria-label="select a country from the dropdown"
                        >
                          <div class="relative mt-1">
                            <ListboxButton
                              class="flex relative w-full p-2 text-left capitalize bg-white dark:bg-slate-600 energy:bg-zinc-600 rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-offset-2"
                            >
                              <span class="block truncate">{{
                                selectedCountry
                                  ? selectedCountry.name
                                  : criteria.countries[0].name
                              }}</span>
                              <span
                                class="absolute inset-y-0 right-0 flex items-center pr-2"
                              >
                                <ChevronUpDownIcon
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
                                class="absolute w-full py-1 mt-1 overflow-auto bg-white dark:bg-slate-600 energy:bg-zinc-600 rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                              >
                                <ListboxOption
                                  v-for="country in criteria.countries"
                                  v-slot="{ active }"
                                  :key="country"
                                  :value="country"
                                  as="template"
                                  class="capitalize px-2 py-1 cursor-pointer"
                                  @click="navigateToCountry(country)"
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
                      </template>
                    </div>
                  </MobileSideMenuDisclosure>
                </li>
                <li>
                  <a
                    class="font-medium hover:text-black dark:hover:text-white energy:text-white"
                    :href="`/search?&product_types[]=10381&view=grid`"
                  >
                    Foreign
                  </a>
                </li>
                <li>
                  <a
                    class="font-medium hover:text-black dark:hover:text-white energy:text-white"
                    :href="`/search?&product_types[]=10378&view=grid`"
                  >
                    Community
                  </a>
                </li>
                <li>
                  <MobileSideMenuDisclosure :title="'Special Editions'">
                    <div class="mt-4">
                      <template v-if="loadingSpecialEditionLinks">
                        <div class="flex justify-center">
                          <svg
                            class="animate-spin -ml-1 mr-3 h-14 w-14 text-mission-blue dark:text-slate-300 energy:text-zinc-300"
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
                            />
                            <path
                              class="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
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
                  </MobileSideMenuDisclosure>
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
import { getValueForCode } from "@/helpers";
import { metadata } from "@/config";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import MobileSideMenuDisclosure from "@/components/MobileSideMenuDisclosure";
import SpecialEditionLink from "@/components/SpecialEditionLink";
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
import {
  ChevronDownIcon,
  ChevronUpDownIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
export default {
  components: {
    MobileSideMenuDisclosure,
    SpecialEditionLink,
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
    ChevronUpDownIcon,
    XMarkIcon,
  },
  props: {
    isOpen: Boolean,
  },
  setup(props, { emit }) {
    const store = useStore();
    const router = useRouter();
    const loadingMetadata = computed(() => store.state.metadata.loading);
    const criteria = computed(() => store.state.metadata.criteria);

    const loadingSpecialEditionLinks = computed(
      () => store.state.specialEditions.loading
    );
    const specialEditionLinks = computed(
      () => store.state.specialEditions.links
    );

    const selectedCountry = ref(null);
    const close = () => {
      emit("close");
    };

    const formattedSubregions = (codes) => {
      const subregions = [];
      codes.forEach((code) => {
        const subregion = getValueForCode(criteria.value.subregions, code);
        subregions.push(subregion);
      });
      return subregions;
    };

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

    return {
      metadata,
      close,
      loadingMetadata,
      criteria,
      loadingSpecialEditionLinks,
      specialEditionLinks,
      selectedCountry,
      formattedSubregions,
      navigateToCountry,
    };
  },
};
</script>
<style lang="scss">
/* Empty on Purpose */
</style>
