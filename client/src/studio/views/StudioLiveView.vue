<template>
  <div>
    <div class="max-w-[1480px] flex space-x-4 justify-end pt-8">
      <router-link
        class="flex space-x-2 min-h-[2.125rem] items-center text-sm rounded-md px-4 transition-colors text-gray-50 bg-blue-700 hover:border-blue-600 active:bg-blue-800 active:text-gray-200/80"
        :to="{
          name: 'studio-issue-detail',
          params: {
            id: 'ci-500',
          },
        }"
      >
        <span>Edit</span>
        <PencilSquareIcon class="h-5 w-5" />
      </router-link>
      <button
        class="flex space-x-2 min-h-[2.125rem] items-center text-sm rounded-md px-4 border border-gray-300"
      >
        <span>Preview</span>
        <DocumentMagnifyingGlassIcon class="h-5 w-5" />
      </button>
    </div>
    <div class="py-8">
      <div class="text-blue-600 font-medium text-sm">Changes in 4 days</div>
      <div class="text-5xl py-2 font-bold">
        {{ issues[0].title }}
      </div>
      <div class="flex flex-col py-2 space-y-2 font-medium text-sm">
        <p>By {{ issues[0].author }}</p>
        <p class="text-gray-400">Updated {{ issues[0].last_updated }}</p>
      </div>
    </div>
    <div class="pb-6 font-semibold text-gray-700">Featured Products</div>
    <div class="max-w-[1500px] grid grid-cols-1 xl:grid-cols-3 gap-2">
      <template
        v-for="product in issues[0].featured.slice(0, 3)"
        :key="product"
      >
        <div
          class="flex flex-col max-w-[768px] xl:max-w-[480px] px-6 py-4 bg-white rounded-md shadow-sm hover:shadow-md border border-slate-200 cursor-pointer"
        >
          <div class="max-h-[432px] xl:max-h-[270px] cursor-pointer">
            <img :src="getImg(product.src)" class="rounded-md" alt="" />
          </div>
          <div class="h-full flex flex-col justify-between">
            <div class="py-4">
              <p class="font-semibold text-lg line-clamp-2 xl:line-clamp-3">
                <span class="text-gray-500">{{ product.classification }}</span>
                {{ product.title }}
              </p>
            </div>
            <div class="flex space-x-2 font-medium text-sm">
              <div class="text-blue-700">{{ product.type }}</div>
              <div>•</div>
              <div class="text-gray-500">
                {{ product.date_posted }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div class="font-semibold text-gray-700 py-6">More Products</div>
    <div class="max-w-[800px] bg-white rounded-md border border-slate-200">
      <ul>
        <template v-for="product in issues[0].featured.slice(3)" :key="product">
          <li class="px-6 border-b border-gray-200 cursor-pointer">
            <div class="py-4">
              <p class="font-semibold text-lg line-clamp-2">
                <span class="text-gray-500">{{ product.classification }}</span>
                {{ product.title }}
              </p>
            </div>
            <div class="pb-4 flex space-x-2 font-medium text-sm">
              <div class="text-blue-700">{{ product.type }}</div>
              <div>•</div>
              <div class="text-gray-500">
                {{ product.date_posted }}
              </div>
            </div>
          </li>
        </template>
      </ul>
    </div>
  </div>
  <TransitionRoot appear :show="isEditOpen" as="template">
    <Dialog as="div" @close="closeEdit">
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
            <div class="fixed inset-0 bg-black/25" />
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
            <DialogPanel
              class="inline-block w-full min-w-[300px] sm:min-w-[600px] lg:min-w-[900px] h-[90vh] max-w-sm p-8 my-8 text-left overflow-auto align-middle transition-all transform text-gray-900 bg-white shadow-lg rounded-lg"
            >
              <button
                type="button"
                class="absolute top-5 right-5 w-8 h-8 flex items-center justify-center"
                tabindex="0"
                @click="closeEdit"
              >
                <span class="sr-only">Close navigation</span>
                <XMarkIcon class="h-5 w-5" aria-hidden="true" />
              </button>
              <div class="text-3xl font-semibold text-gray-700 py-8">
                New Issue
              </div>
              <div class="flex flex-col space-y-8">
                <div class="flex flex-col space-y-6">
                  <div>
                    <div class="font-medium">Basics</div>
                    <div class="text-sm text-gray-600">
                      The information below will feature on the main page.
                    </div>
                  </div>
                  <div class="flex flex-col space-y-6">
                    <div class="max-w-[600px]">
                      <label class="text-sm font-medium">Title</label>
                      <input
                        type="text"
                        aria-labelledby="4"
                        autocomplete="off"
                        class="min-h-[2rem] flex w-full rounded-lg cursor-default py-1 px-2 mt-2 bg-transparent border border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-offset-2"
                      />
                    </div>
                    <div class="flex space-x-6">
                      <div class="max-w-[250px]">
                        <label id="2" class="text-sm font-medium"
                          >Start Date</label
                        >
                        <div
                          class="flex items-center min-h-[2rem] mt-2 py-1 px-4 rounded-lg border border-gray-300"
                        >
                          <CalendarIcon class="h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            aria-labelledby="2"
                            autocomplete="off"
                            class="flex w-full cursor-default px-4 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div class="max-w-[250px]">
                        <label id="3" class="text-sm font-medium"
                          >Expires On</label
                        >
                        <div
                          class="flex items-center min-h-[2rem] mt-2 py-1 px-4 rounded-lg border border-gray-300"
                        >
                          <CalendarIcon class="h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            aria-labelledby="3"
                            autocomplete="off"
                            class="flex w-full cursor-default px-4 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col space-y-6">
                  <div>
                    <div class="font-medium">Content</div>
                    <div class="text-sm text-gray-600">
                      The top three products are shown with their thumbnails.
                    </div>
                  </div>
                  <div class="flex flex-col space-y-8">
                    <div class="text-sm">
                      <div class="font-medium">Breaking Product</div>
                      <Switch
                        v-model="breakingEnabled"
                        :class="breakingEnabled ? 'bg-blue-700' : 'bg-gray-300'"
                        class="relative inline-flex mt-3 h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                      >
                        <span class="sr-only">Use setting</span>
                        <span
                          aria-hidden="true"
                          :class="
                            breakingEnabled ? 'translate-x-9' : 'translate-x-0'
                          "
                          class="pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                        />
                      </Switch>
                      <div class="mt-2 text-gray-600">
                        Only the first product will have a breaking label.
                      </div>
                    </div>
                    <div>
                      <div class="font-medium text-sm">Products</div>
                      <div class="flex mt-3">
                        <ul
                          class="w-full rounded-md max-w-[800px] border border-dashed border-gray-400"
                        >
                          <li
                            class="flex justify-center items-center h-[100px] border-b border-dashed border-gray-400"
                          >
                            <div class="flex flex-col space-y-2">
                              <div
                                class="text-lg text-center font-bold text-gray-400/50 uppercase tracking-wide"
                              >
                                Top Featured
                              </div>
                              <div class="text-sm text-gray-500">
                                <span
                                  class="text-blue-700 font-semibold cursor-pointer"
                                  >Search for a product</span
                                >
                                to add.
                              </div>
                            </div>
                          </li>
                          <li
                            class="flex justify-center items-center h-[100px] border-b border-dashed border-gray-400"
                          >
                            <div class="flex flex-col space-y-2">
                              <div
                                class="text-lg text-center font-bold text-gray-400/50 uppercase tracking-wide"
                              >
                                Featured
                              </div>
                              <div class="text-sm text-gray-500">
                                <span
                                  class="text-blue-700 font-semibold cursor-pointer"
                                  >Search for a product</span
                                >
                                to add.
                              </div>
                            </div>
                          </li>
                          <li
                            class="flex justify-center items-center h-[100px] border-b border-dashed border-gray-400"
                          >
                            <div class="flex flex-col space-y-2">
                              <div
                                class="text-lg text-center font-bold text-gray-400/50 uppercase tracking-wide"
                              >
                                Featured
                              </div>
                              <div class="text-sm text-gray-500">
                                <span
                                  class="text-blue-700 font-semibold cursor-pointer"
                                  >Search for a product</span
                                >
                                to add.
                              </div>
                            </div>
                          </li>
                          <li
                            class="flex justify-center items-center h-[100px] border-b border-dashed border-gray-400"
                          >
                            <div class="text-sm text-gray-500">
                              <span
                                class="text-blue-700 font-semibold cursor-pointer"
                                >Search for a product</span
                              >
                              to add.
                            </div>
                          </li>
                          <li
                            class="flex justify-center items-center h-[100px] border-b border-dashed border-gray-400"
                          >
                            <div class="text-sm text-gray-500">
                              <span
                                class="text-blue-700 font-semibold cursor-pointer"
                                >Search for a product</span
                              >
                              to add.
                            </div>
                          </li>
                          <li
                            class="flex justify-center items-center h-[100px] border-b border-dashed border-gray-400"
                          >
                            <div class="text-sm text-gray-500">
                              <span
                                class="text-blue-700 font-semibold cursor-pointer"
                                >Search for a product</span
                              >
                              to add.
                            </div>
                          </li>
                          <li
                            class="flex justify-center items-center h-[100px] border-b border-dashed border-gray-400"
                          >
                            <div class="text-sm text-gray-500">
                              <span
                                class="text-blue-700 font-semibold cursor-pointer"
                                >Search for a product</span
                              >
                              to add.
                            </div>
                          </li>
                          <li
                            class="flex justify-center items-center h-[100px] border-b border-dashed border-gray-400"
                          >
                            <div class="text-sm text-gray-500">
                              <span
                                class="text-blue-700 font-semibold cursor-pointer"
                                >Search for a product</span
                              >
                              to add.
                            </div>
                          </li>
                          <li
                            class="flex justify-center items-center h-[100px]"
                          >
                            <div class="text-sm text-gray-500">
                              <span
                                class="text-blue-700 font-semibold cursor-pointer"
                                >Search for a product</span
                              >
                              to add.
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="flex justify-end items-center space-x-6 mt-8 pt-8 border-t border-gray-200"
              >
                <button
                  class="rounded-md px-4 py-2 transition-colors text-gray-50 bg-blue-700 hover:border-blue-600 active:bg-blue-800 active:text-gray-200/80"
                >
                  Save
                </button>
                <button class="font-medium text-blue-700" @click="closeEdit">
                  Close
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<script>
import dayjs from "dayjs/esm/index.js";
import { issues } from "../data";
import { ref } from "vue";
import {
  Dialog,
  DialogPanel,
  Switch,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  CalendarIcon,
  DocumentMagnifyingGlassIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
const themeOptions = ["light", "dark", "system"];
export default {
  components: {
    Dialog,
    DialogPanel,
    CalendarIcon,
    DocumentMagnifyingGlassIcon,
    PencilSquareIcon,
    XMarkIcon,
    Switch,
    TransitionChild,
    TransitionRoot,
  },
  setup() {
    const sortOptions = [
      { name: "Start Date: Recent" },
      { name: "Start Date: Last" },
    ];
    const breakingEnabled = ref(false);
    const isEditOpen = ref(false);
    const selectedSort = ref(sortOptions[0]);
    const hover = ref(false);

    const getImg = (src) => {
      //return new URL("../../assets/mocks/" + src, import.meta.url).href;
      return new URL(`../../assets/mocks/${src}`, import.meta.url).href;
    };

    const getPosition = (index, total) => {
      if (index === 0) {
        return "first";
      }
      if (index === total - 1) {
        return "last";
      }
      return null;
    };

    const closeEdit = () => {
      isEditOpen.value = false;
    };

    const openEdit = () => {
      isEditOpen.value = true;
    };

    return {
      dayjs,
      themeOptions,
      sortOptions,
      breakingEnabled,
      isEditOpen,
      selectedSort,
      hover,
      issues,
      getImg,
      getPosition,
      closeEdit,
      openEdit,
    };
  },
};
</script>
<style lang="scss"></style>
