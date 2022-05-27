<template>
  <div class="flex flex-wrap md:flex-nowrap justify-between md:space-x-10 lg:space-x-0 mb-8">
    <div class="md:basis-9/12 flex flex-col space-y-4">
      <div class="flex space-x-2">
        <PrinterIcon class="h-5 w-5 cursor-pointer"/>
        <MailIcon class="h-5 w-5 cursor-pointer"/>
      </div>
      <p class="font-semibold text-sm lg:text-md uppercase">article</p>
      <h1 class="font-semibold text-2xl lg:text-3xl">
       {{ selectedArticle.title }}
      </h1>
      <div class="flex space-x-4 text-sm md:text-md">
        <p>PUBLISHED {{ selectedArticle.published_date }}</p>
        <p aria-hidden="true"> ● </p>
        <p>{{ selectedArticle.author }}</p>
      </div>
      <img
        alt="article thumbnail"
        class="lg:w-4/5 max-h-96 w-full object-cover"
        :src="getImgUrl(selectedArticle.image.url)"
      />
      <p class="italic text-sm">
        {{ selectedArticle.image.caption }}
      </p>
      <p class="whitespace-pre-line">
       {{ selectedArticle.content.join("\n\n") }}
      </p>
      <p class="italic border-t-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-gray-700/25 pt-4">(U) For additional information:</p>
      <ul class="list-disc list-inside">
        <li v-for="index in 2" :key="index" class="italic text-sm">
          <router-link to="#" class="hover:underline">
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
            <div v-for="source in selectedArticle.sources" :key="source.name">
              <li class="text-sm">
                <router-link to="#" class="hover:underline">
                  {{ source.name }}
                </router-link>
              </li>
            </div>
          </ol>
        </DisclosurePanel>
      </Disclosure>
      <CommentsList :comments="comments" class="border-t-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-gray-700/25 pt-4"/>
      <CommentForm @comment-submitted="addComment" class="border-t-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-gray-700/25 pt-4"/>
    </div>
    <div class="flex flex-col pb-8 space-y-3 mt-10">
      <div class="border-t-2 md:border-t-0 border-b-2 pb-4 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-gray-700/25 flex flex-col space-y-3">
        <p class="font-semibold mt-4 md:mt-0">Attachments</p>
        <div v-for="attachment in selectedArticle.attachments" :key="attachment.name">
          <router-link :to="{ name: 'attachment', params: { url: attachment.url }}">
            <p class="hover:underline text-sm">{{ attachment.name }}</p>
          </router-link>
        </div>
      </div>
      <div class="flex flex-col space-y-3">
        <p class="font-semibold">Related Products</p>
        <router-link to="#" class="hover:underline text-sm">(U) This is a related product title</router-link>
        <router-link to="#" class="hover:underline text-sm">(U) Sample title of another related product</router-link>
      </div>
      <p class="font-semibold">Tags</p>
      <p class="font-medium text-sm">{{ selectedArticle.tags.join(", ") }}</p>
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
import articles from "@/data/articles.js";

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
  props: ['id'],
  data() {
    return {
      comments: [],
      articles: articles,
    }
  },
  methods: {
    addComment(comment) {
      this.comments.push(comment)
    },
    getImgUrl(url) {
      return require('@/assets/'+url)
    },
  },
  computed: {
    selectedArticle() {
      return this.articles.find(article => article.id === this.id);
    },
  },
};
</script>

<style lang="scss"></style>
