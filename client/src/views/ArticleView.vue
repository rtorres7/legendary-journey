<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <div class="col-span-2">
      <div class="flex flex-col pb-8 space-y-3">
        <p class="font-bold text-sm lg:text-md uppercase">article</p>
        <h1
          class="
            text-black
            dark:text-teal-300
            energy:text-slate-200
            font-bold
            text-2xl
            lg:text-3xl
            mb-2
            lg:mb-4
          "
        >
          (U) This is the placeholder headline for this recently published
          article
        </h1>
        <div class="flex flex-row space-x-4 text-sm md:text-md">
          <p>PUBLISHED WED, APR 27, 2022</p>
          <p
            class="
              text-slate-400
              dark:text-teal-300
              energy:text-energy-yellow
            "
          >
            ●
          </p>
          <p>John E. Doe</p>
        </div>
        <img
          alt="article thumbnail"
          class="pt-4 lg:w-4/5"
          src="@/assets/ukraine.jpg"
        />
        <p class="italic text-sm">
          (U) This caption is just a sample caption/description associated with
          the image above.
        </p>
        <p class="pt-8">
          (U) Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum
          dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
          velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
          occaecat cupidatat non proident, sunt in culpa qui officia deserunt
          mollit anim id est laborum.
        </p>
        <p class="pt-8">
          (U) Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum
          dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
          velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
          occaecat cupidatat non proident, sunt in culpa qui officia deserunt
          mollit anim id est laborum.
        </p>
        <p class="pt-8">
          (U) Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
          nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum
          dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
          velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
          occaecat cupidatat non proident, sunt in culpa qui officia deserunt
          mollit anim id est laborum.
        </p>
        <p class="italic pt-8">(U) For additional information:</p>
        <ul class="list-disc list-inside">
          <li v-for="index in 2" :key="index" class="italic text-sm">
            <router-link to="/article" class="hover:underline">
              (U) This is the title for an article with additional information.
            </router-link>
          </li>
        </ul>
        <p class="font-bold pt-4">Document Details</p>
        <p>CONTENTS</p>
        <div class="flex text-sm space-x-4">
          <p><span class="font-bold">Produced By: </span>NCTC</p>
          <p><span class="font-bold">Product Type: </span>NexCT Article</p>
          <p><span class="font-bold">Document Number: </span>NexCT2022-08088</p>
        </div>
        <div class="flex text-sm space-x-4">
          <p><span class="font-bold">Posted: </span>25 Apr 2022 00:01:15</p>
          <p><span class="font-bold">Publication Date: </span>25 Apr 2022</p>
        </div>
        <p class="text-sm"><span class="font-bold">Contact: </span>(U) Produced by the Test</p>
        <p class="font-bold pt-4">SOURCES</p>
        <ol class="list-decimal list-inside">
          <li v-for="index in 2" :key="index" class="text-sm">
            <router-link to="/article" class="hover:underline">
              (U) This would be the title with a link to the source being credited for the creation of this article.
            </router-link>
          </li>
        </ol>
        <p class="font-bold pt-4">Discussion</p>
      </div>
    </div>
    <div class="col-span-1 lg:pl-20 lg:pt-10">
      <div class="flex flex-col pb-8 space-y-3">
        <p class="font-bold">Attachments</p>
        <router-link to="/article">
          <p
            class="
              border-b-4 border-slate-400
              dark:border-teal-300
              energy:border-energy-yellow
              hover:underline
              pb-4
              text-sm
            "
          >
            PDF Version of this product
          </p>
          </router-link>
        <p class="font-bold">Related Products</p>
        <router-link to="/article">
          <p class="hover:underline text-sm">(U) This is a related product title</p>
        </router-link>
        <router-link to="/article">
          <p class="hover:underline text-sm">(U) Sample title of another related product</p>
        </router-link>
        <!-- <p class="font-bold">Tags</p>
        <p class="font-medium text-sm">ukraine, protests, putin, invasion</p> -->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ArticlePageView",
};
</script>

<style lang="scss"></style>
