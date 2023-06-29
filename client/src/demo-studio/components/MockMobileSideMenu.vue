<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" class="block md:hidden" @close="close">
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
              class="relative min-h-screen w-72 max-w-calc[(100%-3rem)] p-6 text-left align-top transition-all transform text-gray-400 bg-slate-900 shadow-lg"
            >
              <button
                type="button"
                class="absolute top-5 right-5 w-8 h-8 flex items-center justify-center hover:text-gray-50"
                tabindex="0"
                @click="close"
              >
                <span class="sr-only">Close main menu</span
                ><XMarkIcon class="h-5 w-5" aria-hidden="true" />
              </button>
              <div class="flex flex-col">
                <div class="flex">
                  <div to="/" class="flex mx-auto items-center w-[200px]">
                    <img
                      class="w-16 h-16"
                      src="@/assets/nctc_logo.svg"
                      alt="NCTC. Seal. Link to homepage."
                    />
                    <span
                      class="ml-2 text-gray-200 font-medium text-xl tracking-tight"
                      >Studio</span
                    >
                  </div>
                </div>
              </div>
              <ul class="py-2 space-y-2">
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
                        <span class="ml-4">Dashboard</span>
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
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { getValueForCode } from "@/helpers";
import { computed, inject, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  HomeIcon,
  NewspaperIcon,
  VideoCameraIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
export default {
  components: {
    Dialog,
    DialogPanel,
    TransitionChild,
    TransitionRoot,
    HomeIcon,
    NewspaperIcon,
    VideoCameraIcon,
    XMarkIcon,
  },
  props: {
    isOpen: Boolean,
  },
  emits: ["close"],
  setup(props, { emit }) {
    const metadata = inject("metadata");
    const store = useStore();
    const router = useRouter();
    const loadingMetadata = computed(() => store.state.metadata.loading);
    const criteria = computed(() => store.state.metadata.criteria);

    const currentHash = ref(window.location.hash || "#home");

    window.addEventListener("hashchange", ({ target }) => {
      currentHash.value = target.location.hash;
    });

    const isActivePage = (hash) => {
      return hash === currentHash.value;
    };

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
      isActivePage,
    };
  },
};
</script>
<style lang="scss">
/* Empty on Purpose */
</style>
