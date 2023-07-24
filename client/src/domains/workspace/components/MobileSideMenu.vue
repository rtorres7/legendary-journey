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
              <ul class="space-y-2">
                <li>
                  <div>
                    <router-link to="/workspace">
                      <div
                        :class="
                          route.name == 'dashboard'
                            ? 'text-gray-50 bg-slate-800/90'
                            : 'hover:text-gray-50 hover:bg-slate-800/90'
                        "
                        class="flex items-center px-4 py-3 rounded cursor-pointer w-[200px]"
                      >
                        <HomeIcon class="h-6 w-6" aria-hidden="true" />
                        <span class="ml-4">Dashboard</span>
                      </div>
                    </router-link>
                  </div>
                </li>
                <li>
                  <div>
                    <router-link to="/workspace/products">
                      <div
                        :class="
                          route.name == 'myProducts'
                            ? 'text-gray-50 bg-slate-800/90'
                            : 'hover:text-gray-50 hover:bg-slate-800/90'
                        "
                        class="flex items-center px-4 py-3 rounded cursor-pointer w-[200px]"
                      >
                        <BriefcaseIcon class="h-6 w-6" aria-hidden="true" />
                        <span class="ml-4">My Products</span>
                      </div>
                    </router-link>
                  </div>
                </li>
                <!-- <li>
                  <div>
                    <a href="/workspace#saved" class="">
                      <div
                        :class="
                          isActivePage('#saved')
                            ? 'text-gray-50 bg-slate-800/90'
                            : 'hover:text-gray-50 hover:bg-slate-800/90'
                        "
                        class="flex items-center px-4 py-3 rounded cursor-pointer w-[200px]"
                      >
                        <BookmarkIcon class="h-6 w-6" aria-hidden="true" />
                        <span class="ml-4">Saved</span>
                      </div>
                    </a>
                  </div>
                </li>
                <li>
                  <div>
                    <a href="/workspace#collections" class="">
                      <div
                        :class="
                          isActivePage('#collections')
                            ? 'text-gray-50 bg-slate-800/90'
                            : 'hover:text-gray-50 hover:bg-slate-800/90'
                        "
                        class="flex items-center px-4 py-3 rounded cursor-pointer w-[200px]"
                      >
                        <FolderIcon class="h-6 w-6" aria-hidden="true" />
                        <span class="ml-4">Collections</span>
                      </div>
                    </a>
                  </div>
                </li> -->
              </ul>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { useRoute } from "vue-router";
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  HomeIcon,
  BriefcaseIcon,
  BookmarkIcon,
  FolderIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
export default {
  components: {
    Dialog,
    DialogPanel,
    TransitionChild,
    TransitionRoot,
    HomeIcon,
    BriefcaseIcon,
    BookmarkIcon,
    FolderIcon,
    XMarkIcon,
  },
  props: {
    isOpen: Boolean,
  },
  emits: ["close"],
  setup(props, { emit }) {
    const route = useRoute();

    const close = () => {
      emit("close");
    };

    return {
      route,
      close,
    };
  },
};
</script>
<style lang="scss">
/* Empty on Purpose */
</style>
