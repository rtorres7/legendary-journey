<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <div class="col-span-2">
      <div class="flex flex-col pb-8 space-y-3">
        <p class="font-bold text-sm lg:text-md uppercase">article</p>
        <h5
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
        </h5>
        <div class="flex flex-row space-x-4 text-sm md:text-md">
          <p>PUBLISHED WED, APR 27, 2022</p>
          <p
            class="
              text-slate-500
              dark:text-teal-300
              energy:text-energy-yellow
              text-sm
            "
          >
            ●
          </p>
          <p>John E. Doe</p>
        </div>
        <img
          alt="image of..."
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
        <p class="font-bold pt-4">SOURCES</p>
        <ol class="list-decimal list-inside">
          <li v-for="index in 2" :key="index">
            This would be the title with a link to the source being credited for
            the creation of this article.
          </li>
        </ol>
      </div>
    </div>
    <div class="col-span-1 lg:pl-20 lg:pt-10">
      <div class="flex flex-col pb-8 space-y-3">
        <p class="font-bold">Attachments</p>
        <p
          class="
            border-b-4 border-slate-400
            dark:border-teal-300
            energy:border-energy-yellow
            pb-4
            text-sm
          "
        >
          PDF Version of this product
        </p>
        <p class="font-bold">Tags</p>
        <p class="font-medium text-sm">ukraine, protests, putin, invasion</p>
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
