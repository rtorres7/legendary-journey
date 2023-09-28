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
    <p class="font-semibold text-sm lg:text-md uppercase">
      {{ product.product_type_name }}
    </p>
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
    <div class="flex flex-col space-y-2 text-sm md:text-md">
      <p class="capitalize">
        {{ product.state }} -
        {{ formatDate(product.posted_at) }}
      </p>
      <p v-if="product.producing_offices?.length > 0">
        Authored By:
        <template
          v-for="(author, index) in product.producing_offices"
          :key="index"
        >
          <router-link
            class="hover:underline"
            :to="'/search?text=&producing_offices[]=' + author.name"
            target="_blank"
          >
            {{ author.name }}
          </router-link>
          <span
            v-if="
              product.producing_offices?.length > 1 &&
              index < product.producing_offices?.length - 1
            "
            >,
          </span>
        </template>
      </p>
      <p v-if="product.coauthors?.length > 0">
        Co-Authored By:
        <template v-for="(coauthor, index) in product.coauthors" :key="index">
          {{ coauthor
          }}<span
            v-if="
              product.coauthors?.length > 1 &&
              index < product.coauthors?.length - 1
            "
            >,
          </span>
        </template>
      </p>
      <p v-if="product.coordinators?.length > 0">
        <template
          v-for="(coordinator, index) in product.coordinators"
          :key="index"
        >
          Coordinated With:
          {{ coordinator
          }}<span
            v-if="
              product.coordinators?.length > 1 &&
              index < product.coordinators?.length - 1
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
          <p>
            <span class="font-semibold">Product Type: </span
            >{{ product.product_type_name }}
          </p>
          <p>
            <span class="font-semibold">Document Number: </span
            >{{ product.doc_num }}
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
              {{ product.dissem_orgs.map((a) => a.name).join(", ") }}
            </template>
            <template v-else>
              <span class="italic">Viewable to all.</span>
            </template>
          </p>
          <p
            v-if="
              product.producing_offices &&
              product.producing_offices?.values?.length !== 0
            "
          >
            <span class="font-semibold">Authored By: </span>
            {{ product.producing_offices.values.map((a) => a.name).join(", ") }}
          </p>
          <p
            v-if="
              product.coordinators && product.coordinators?.values?.length !== 0
            "
          >
            <span class="font-semibold">Coordinated With: </span>
            {{ product.coordinators.values.map((a) => a.name).join(", ") }}
          </p>
          <p
            v-if="product.coauthors && product.coauthors?.values?.length !== 0"
          >
            <span class="font-semibold">Co-Authored By: </span>
            {{ product.coauthors.values.map((a) => a.name).join(", ") }}
          </p>
          <p v-if="product.created_by && canManageWire">
            <span class="font-semibold">Created By: </span>
            {{ product.created_by }}
          </p>
          <p v-if="product.published_by && canManageWire">
            <span class="font-semibold">Published By: </span>
            {{ product.published_by }}
          </p>
          <p v-if="product.updatedBy?.cn && canManageWire">
            <span class="font-semibold">Updated By: </span>
            {{ product.updatedBy.cn }}
          </p>
          <!--temporary until snake case is gone on high side-->
          <p v-if="product.updated_by?.cn && canManageWire">
            <span class="font-semibold">Updated By: </span>
            {{ product.updated_by.cn }}
          </p>
          <!--temporary until platform gets CN in updatedBy-->
          <p v-if="product.updatedBy?.dn && canManageWire">
            <span class="font-semibold">Updated By: </span>
            {{ product.updatedBy.dn }}
          </p>
        </div>
      </DisclosurePanel>
    </Disclosure>
    <template v-if="product.poc_info">
      <p class="font-semibold pt-4">Contact Information</p>
      <p v-if="product.poc_info" class="text-sm pb-4">
        {{ product.poc_info }}
      </p>
    </template>
    <div
      v-if="product.classification_detail"
      class="flex space-x-2 justify-center text-sm"
    >
      <p v-if="product.classification_detail.cl_by">
        Classified By: {{ product.classification_detail.cl_by }}
      </p>
      <p v-if="product.classification_detail.drv_from">
        Derived From: {{ product.classification_detail.drv_from }}
      </p>
      <p v-if="product.classification_detail.decl_on">
        Declassify On: {{ product.classification_detail.decl_on }}
      </p>
    </div>
    <div
      v-if="product.classification !== 'INVALID'"
      class="text-center pb-2 text-sm lg:text-md"
    >
      {{ product.classification }}
    </div>
  </div>
</template>

<script>
import { formatDate } from "@/shared/helpers";
import { ChevronDownIcon } from "@heroicons/vue/24/outline";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { mapGetters } from "vuex";
import { ref } from "vue";

export default {
  components: {
    ChevronDownIcon,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
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
    const environment = ref(import.meta.env.MODE);
    return {
      formatDate,
      environment,
    };
  },
  computed: {
    ...mapGetters("user", ["canManageWire", "canViewDocumentAdminTools"]),
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
