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
</template>
<script>
import { issues } from "@studio/data";
import {
  DocumentMagnifyingGlassIcon,
  PencilSquareIcon,
} from "@heroicons/vue/24/outline";
export default {
  components: {
    DocumentMagnifyingGlassIcon,
    PencilSquareIcon,
  },
  setup() {
    const getImg = (src) => {
      //return new URL("../../../shared/assets/mocks/" + src, import.meta.url).href;
      return new URL(`../../../shared/assets/mocks/${src}`, import.meta.url)
        .href;
    };

    return {
      issues,
      getImg,
    };
  },
};
</script>
<style lang="scss"></style>
