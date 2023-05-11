<template>
  <div class="flex flex-col space-y-4">
    <div v-if="isPreview" class="text-center text-sm">
      <p>PREVIEW</p>
      <p>
        If you do not see changes in your document, please save the document and
        select preview again
      </p>
    </div>
    <div
      v-if="product.classification !== 'INVALID'"
      class="text-center pb-2 text-sm lg:text-md"
    >
      {{ product.classification }}
    </div>
    <p class="font-semibold text-sm lg:text-md uppercase">product</p>
    <h1 class="font-semibold text-2xl lg:text-3xl wrap-anywhere">
      <span
        v-if="product.title_classif !== 'X'"
        class="text-slate-500 dark:text-slate-400 energy:text-zinc-400"
      >
        ({{ product.title_classif }})
      </span>
      <span>
        {{ product.title }}
      </span>
    </h1>
    <div class="flex space-x-4 text-sm md:text-md">
      <p class="capitalize">
        {{ `${product.state} -` }}
        {{ formatDate(product.date_published) }}
      </p>
      <p aria-hidden="true">●</p>
      <p v-if="product.authors?.length > 0">
        <template v-for="(author, index) in product.authors" :key="index">
          {{ author.name
          }}<span
            v-if="
              product.authors?.length > 1 && index < product.authors?.length - 1
            "
            >,
          </span>
        </template>
      </p>
    </div>
    <div class="w-full pr-2">
      <!-- <img
            v-if="product.product_image"
            :src="`/documents/${product.doc_num}/images/article?updated_at=${product.updated_at}`"
            class="h-[350px] w-[350px] float-right"
          /> -->
      <p v-if="product.html_body" class="whitespace-pre-line wrap-anywhere">
        <span class="ck-content summary" v-html="product.html_body" />
      </p>
    </div>
    <p
      class="font-semibold border-t-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25 pt-4"
    >
      Document Details
    </p>
    <Disclosure v-slot="{ open }">
      <DisclosureButton class="flex space-x-2 text-sm">
        <span>CONTENTS</span>
        <ChevronDownIcon
          class="h-4 w-4"
          :class="open ? 'transform rotate-180' : ''"
        />
      </DisclosureButton>
      <DisclosurePanel>
        <div class="ml-4 space-y-2 text-sm">
          <!-- <p>
                <span class="font-semibold">Authored By: </span
                >{{ product.producing_office }}
              </p> -->
          <p>
            <span class="font-semibold">Product Type: </span
            >{{ product.product_type_name }}
          </p>
          <p>
            <span class="font-semibold">Document Number: </span
            >{{ product.doc_num }}
          </p>
          <p>
            <span class="font-semibold">Posted: </span>
            <template v-if="product.posted_at">
              {{ formatDate(product.posted_at) }}
            </template>
            <template v-else>
              {{ formatDate(product.posted_on) }}
            </template>
          </p>
          <p>
            <span class="font-semibold">Publication Date: </span
            >{{ formatDate(product.date_published) }}
          </p>
          <p>
            <span class="font-semibold">Audience: </span>
            <template
              v-if="product.dissem_orgs && product.dissem_orgs?.length > 0"
            >
              {{ product.dissem_orgs.join(", ") }}
            </template>
            <template v-else>
              <span class="italic">Viewable to all.</span>
            </template>
          </p>
          <p
            v-if="
              product.producing_offices &&
              product.producing_offices.length !== 0
            "
          >
            <span class="font-semibold">Authored By: </span>
            {{ product.producing_offices.join(", ") }}
          </p>
          <p v-if="product.coordinators && product.coordinators.length !== 0">
            <span class="font-semibold">Coordinated With: </span>
            {{ product.coordinators.join(", ") }}
          </p>
          <p v-if="product.coauthors && product.coauthors.length !== 0">
            <span class="font-semibold">Co-Authored By: </span>
            {{ product.coauthors.join(", ") }}
          </p>
          <p v-if="product.published_by && canManageWire">
            <span class="font-semibold">Published By: </span>
            {{ product.published_by }}
          </p>
          <p v-if="product.poc_info">
            <span class="font-semibold">Contact: </span>{{ product.poc_info }}
          </p>
        </div>
      </DisclosurePanel>
    </Disclosure>
    <div
      v-if="product.classification !== 'INVALID'"
      class="text-center pb-2 text-sm lg:text-md"
    >
      {{ product.classification }}
    </div>
  </div>
</template>

<script>
import { formatDate } from "@/helpers";
import { ChevronDownIcon } from "@heroicons/vue/24/outline";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { mapGetters } from "vuex";

export default {
  components: {
    ChevronDownIcon,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
  },
  computed: {
    ...mapGetters("user", ["canManageWire", "canViewDocumentAdminTools"]),
  },
  props: {
    product: {
      type: Object,
      default: () => {},
    },
    isPreview: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    return {
      formatDate,
    };
  },
};
</script>
<style scoped>
::v-deep .summary > p {
  @apply block my-4;
}

::v-deep .source-reference {
  @apply hidden align-top;
}
</style>
