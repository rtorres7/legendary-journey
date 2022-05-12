<template>
  <div class="flex flex-wrap md:flex-nowrap justify-between mb-8">
    <div class="md:basis-9/12 flex flex-col space-y-4">
      <div class="flex space-x-2">
        <PrinterIcon class="h-5 w-5 cursor-pointer"/>
        <MailIcon class="h-5 w-5 cursor-pointer"/>
      </div>
      <p class="font-semibold text-sm lg:text-md uppercase">article</p>
      <h1 class="font-semibold text-2xl lg:text-3xl">
        (U) This is the placeholder headline for this recently published
        article
      </h1>
      <div class="flex space-x-4 text-sm md:text-md">
        <p>PUBLISHED WED, APR 27, 2022</p>
        <p> ● </p>
        <p>John E. Doe</p>
      </div>
      <img
        alt="article thumbnail"
        class="lg:w-4/5"
        src="@/assets/ukraine.jpg"
      />
      <p class="italic text-sm">
        (U) This caption is just a sample caption/description associated with
        the image above.
      </p>
      <p>
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
      <p>
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
      <p>
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
      <p class="italic border-t-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-gray-700/25 pt-4">(U) For additional information:</p>
      <ul class="list-disc list-inside">
        <li v-for="index in 2" :key="index" class="italic text-sm">
          <router-link to="/article" class="hover:underline">
            (U) This is the title for an article with additional information.
          </router-link>
        </li>
      </ul>
      <p class="font-semibold border-t-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-gray-700/25 pt-4">Document Details</p>
      <Disclosure v-slot="{ open }">
        <DisclosureButton class="flex space-x-2 text-sm">
          <span>CONTENTS</span>
          <ChevronDownIcon class="h-4 w-4" :class='open ? "transform rotate-180" : ""' />
        </DisclosureButton>
        <DisclosurePanel>
          <div class="ml-4 space-y-2 text-sm">
            <p><span class="font-semibold">Produced By: </span>NCTC</p>
            <p><span class="font-semibold">Product Type: </span>NexCT Article</p>
            <p><span class="font-semibold">Document Number: </span>NexCT2022-08088</p>
            <p><span class="font-semibold">Posted: </span>25 Apr 2022 00:01:15</p>
            <p><span class="font-semibold">Publication Date: </span>25 Apr 2022</p>
            <p><span class="font-semibold">Contact: </span>(U) Produced by the Test</p>
          </div>
        </DisclosurePanel>
      </Disclosure>
      <Disclosure v-slot="{ open }">
        <DisclosureButton class="flex space-x-2 text-sm">
          <span>SOURCES</span>
          <ChevronDownIcon class="h-4 w-4" :class='open ? "transform rotate-180" : ""' />
        </DisclosureButton>
        <DisclosurePanel>
          <ol class="list-decimal list-inside ml-4 space-y-2">
            <li v-for="index in 2" :key="index" class="text-sm">
              <router-link to="/article" class="hover:underline">
                (U) This would be the title with a link to the source being credited for the creation of this article.
              </router-link>
            </li>
          </ol>
        </DisclosurePanel>
      </Disclosure>
      <CommentsList :comments="comments" class="border-t-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-gray-700/25 pt-4"/>
      <CommentForm @comment-submitted="addComment" class="border-t-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-gray-700/25 pt-4"/>
    </div>
    <div class="flex flex-col pb-8 space-y-3 mt-10">
      <div class="border-t-2 md:border-t-0 border-b-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-gray-700/25 flex flex-col space-y-3">
        <p class="font-semibold mt-4 md:mt-0">Attachments</p>
        <router-link to="/article">
          <p class="hover:underline mb-4 text-sm">PDF Version of this product</p>
        </router-link>
      </div>
      <div class="flex flex-col space-y-3">
        <p class="font-semibold">Related Products</p>
        <router-link to="/article" class="hover:underline text-sm">(U) This is a related product title</router-link>
        <router-link to="/article" class="hover:underline text-sm">(U) Sample title of another related product</router-link>
      </div>
      <!-- <p class="font-semibold">Tags</p>
      <p class="font-medium text-sm">ukraine, protests, putin, invasion</p> -->
      <!-- <div>
        <p class="font-semibold">Metrics</p>
        <p>Unique Readers (1792)</p>
      </div> -->
    </div>
  </div>
</template>

<script>
import CommentForm from "@/components/comments/CommentForm.vue"
import CommentsList from "@/components/comments/CommentsList.vue"
import { PrinterIcon, MailIcon, ChevronDownIcon } from "@heroicons/vue/outline"
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue"

export default {
  name: "ArticlePageView",
  components: {
    CommentForm,
    CommentsList,
    PrinterIcon,
    MailIcon,
    ChevronDownIcon,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
  },
  data() {
    return {
      comments: []
    }
  },
  methods: {
    addComment(comment) {
      this.comments.push(comment)
    }
  }
};
</script>

<style lang="scss"></style>
