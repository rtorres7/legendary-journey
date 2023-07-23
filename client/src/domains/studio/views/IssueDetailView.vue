<template>
  <div>
    <div
      class="flex justify-between items-center pt-8 pb-2 md:pb-8 max-w-[1000px]"
    >
      <div class="text-3xl font-semibold text-gray-700">Issue Details</div>
      <div class="hidden md:flex space-x-4 items-center text-sm">
        <div class="tracking-tight uppercase font-medium text-gray-400">
          Undo Changes
        </div>
        <button
          class="rounded-md px-4 py-2 transition-colors text-gray-50 bg-indigo-700 hover:border-blue-600 active:bg-indigo-800 active:text-gray-200/80"
        >
          Save
        </button>
        <button class="text-gray-500 hover:text-gray-700">
          <span class="sr-only">User Menu</span>
          <EllipsisVerticalIcon class="h-6 w-6" />
        </button>
      </div>
    </div>
    <div class="flex justify-end md:hidden space-x-4 items-center text-sm py-4">
      <div class="tracking-tight uppercase font-medium text-gray-400">
        Undo Changes
      </div>
      <button
        class="rounded-md px-4 py-2 transition-colors text-gray-50 bg-indigo-700 hover:border-blue-600 active:bg-indigo-800 active:text-gray-200/80"
      >
        Save
      </button>
      <button class="text-gray-500 hover:text-gray-700">
        <span class="sr-only">User Menu</span>
        <EllipsisVerticalIcon class="h-6 w-6" />
      </button>
    </div>
    <div
      class="flex flex-col space-y-8 bg-white rounded-md border border-slate-200 p-10 max-w-[1000px]"
    >
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
              value="Russo-Ukrainan War"
              class="min-h-[2rem] flex w-full rounded-lg cursor-default py-1 px-2 mt-2 bg-transparent border border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-offset-2"
            />
          </div>
          <div class="flex space-x-6">
            <div class="max-w-[250px]">
              <label id="2" class="text-sm font-medium">Start Date</label>
              <div
                class="flex items-center min-h-[2rem] mt-2 py-1 px-4 rounded-lg border border-gray-300"
              >
                <CalendarIcon class="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  aria-labelledby="2"
                  autocomplete="off"
                  value="07-12-23 09:00"
                  class="flex w-full cursor-default px-4 focus:outline-none"
                />
              </div>
            </div>
            <div class="max-w-[250px]">
              <label id="3" class="text-sm font-medium">Expires On</label>
              <div
                class="flex items-center min-h-[2rem] mt-2 py-1 px-4 rounded-lg border border-gray-300"
              >
                <CalendarIcon class="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  aria-labelledby="3"
                  autocomplete="off"
                  value="07-16-23 11:00"
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
              :class="breakingEnabled ? 'bg-indigo-700' : 'bg-gray-300'"
              class="relative inline-flex mt-3 h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            >
              <span class="sr-only">Use setting</span>
              <span
                aria-hidden="true"
                :class="breakingEnabled ? 'translate-x-9' : 'translate-x-0'"
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
                class="w-full rounded-md max-w-[900px] border border-dashed border-gray-400"
              >
                <template
                  v-for="(product, index) in issues[0].featured"
                  :key="index"
                >
                  <!-- <ProductListItem :product="product" :id="index" /> -->
                  <li class="border-b border-gray-200 h-[100px]">
                    <ProductListItem
                      :product="product"
                      :position="getPosition(index, issues[0].featured.length)"
                    />
                  </li>
                </template>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { issues } from "../data";
import { ref } from "vue";
import { Switch } from "@headlessui/vue";
import { CalendarIcon, EllipsisVerticalIcon } from "@heroicons/vue/24/outline";
import ProductListItem from "@studio/components/ProductListItem.vue";
export default {
  components: {
    CalendarIcon,
    EllipsisVerticalIcon,
    ProductListItem,
    Switch,
  },
  setup() {
    const breakingEnabled = ref(false);

    const getPosition = (index, total) => {
      if (index === 0) {
        return "first";
      }
      if (index === total - 1) {
        return "last";
      }
      return null;
    };

    return {
      breakingEnabled,
      issues,
      getPosition,
    };
  },
};
</script>
<style lang="scss"></style>
