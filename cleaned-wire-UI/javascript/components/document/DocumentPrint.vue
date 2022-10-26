<template>
  <div class="pb-3">
    <span class="badge badge-primary badge-pill count-indicator">{{
      printCount
    }}</span>
    <a
      :href="`${docPath}.pdf`"
      target="_blank"
      rel="nofollow"
      id="docPrintLink"
      class="ml-3 px-1 pt-4 pb-3"
      data-usage="doc-print"
      @click="recordPrint"
      @keydown.space.prevent="$event.srcElement.click"
      v-if="!isCable"
    >
      <i id="print-version" class="fa fa-print social-toolbar" alt="print" />
    </a>
    <b-dropdown v-else size="sm" variant="link" no-caret dropright>
      <template slot="button-content">
        <i id="print-version" class="fa fa-print social-toolbar" alt="print" />
      </template>
      <b-dropdown-item
        :href="`${docPath}.cable?title=Cable+Format`"
        @click="recordPrint"
        @keydown.space.prevent="$event.srcElement.click"
        data-link-target="popup"
        data-width="650"
        data-height="600"
        data-name="ncs_print_popup"
        >Cable Print Format</b-dropdown-item
      >
      <b-dropdown-item
        :href="`${docPath}/attachments/${document.relto_intel.file_name}`"
        @click="recordPrint"
        @keydown.space.prevent="$event.srcElement.click"
        target="_blank"
        rel="nofollow"
        v-if="document.relto_intel"
        >_temp_415 Intel Cable Print Format</b-dropdown-item
      >
      <template v-for="tearline in document.tearlines">
        <b-dropdown-item
          :href="`${docPath}/attachments/${tearline.file_name}`"
          @click="recordPrint"
          @keydown.space.prevent="$event.srcElement.click"
          target="_blank"
          rel="nofollow"
          :key="tearline.id"
        >
          {{ tearline.title.slice(0, 36) }}</b-dropdown-item
        >
      </template>
      <b-dropdown-item
        :href="`${docPath}.pdf`"
        @click="recordPrint"
        @keydown.space.prevent="$event.srcElement.click"
        target="_blank"
        rel="nofollow"
        >Online Format</b-dropdown-item
      >
    </b-dropdown>
  </div>
</template>

<script>
import documentMixin from "@shared/mixins/documentMixin";

export default {
  name: "DocumentPrint",
  mixins: [documentMixin],
  props: ["printCount"],
  methods: {
    recordPrint() {
      this.$emit("recordAction", "record_print");
    },
  },
};
</script>

<style scoped lang="scss">
.social-toolbar {
  color: $alt-600;
  padding: 5px;
  font-size: 24px;
}
</style>
