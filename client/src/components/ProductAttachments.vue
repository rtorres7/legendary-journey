<template>
  <div
    class="flex flex-col space-y-3 pb-4 border-b-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25"
  >
    <p class="font-semibold text-lg">Attachments</p>
    <div v-if="article.highlightAttachmentText">
      {{ article.highlightAttachmentText }}
    </div>
    <div v-if="pdfVersions.length === 0 && attachments.length === 0">
      There are no attachments
    </div>
    <ul>
      <li v-for="pdf in pdfVersions" :key="pdf.binary_id">
        <router-link :to="attachmentLink + '/' + pdf.file_name" target="_blank">
          <div class="flex hover:underline">
            PDF version of this product
            <DocumentIcon class="h-5 w-5 ml-2" aria-hidden="true" />
          </div>
        </router-link>
      </li>
      <li v-for="attachment in attachments" :key="attachment.binary_id">
        <router-link
          :to="attachmentLink + '/' + attachment.file_name"
          target="_blank"
        >
          <div class="flex hover:underline">
            {{
              attachment.title
                ? attachment.title
                : attachment.file_name.split(".")[0]
            }}
            <DocumentIcon class="h-5 w-5 ml-2" aria-hidden="true" />
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { DocumentIcon } from "@heroicons/vue/24/outline";

export default {
  components: {
    DocumentIcon,
  },
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const route = useRoute();
    const docNum = computed(
      () => `${route.params.doc_num}` || props.article.doc_num
    );
    const attachmentLink = computed(
      () => `/documents/${docNum.value}/attachments`
    );

    const pdfVersions = computed(() => {
      const pdfs = props.article.attachments_metadata.filter(
        (attachment) =>
          attachment.pdf_version === true && attachment.visible === true
      );
      return pdfs;
    });

    const attachments = computed(() => {
      const attachments_metadata = props.article.attachments_metadata.filter(
        (attachment) =>
          attachment.pdf_version !== true &&
          attachment.visible === true &&
          attachment.inline_interactive !== true &&
          attachment.type !== "PackagedMultimediaAttachment"
      );
      return attachments_metadata;
    });

    return {
      docNum,
      attachmentLink,
      pdfVersions,
      attachments,
    };
  },
};
</script>

<style lang="scss"></style>
