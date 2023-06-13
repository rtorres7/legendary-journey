<template>
  <div class="py-8">
    <div
      class="standard-page-margin"
      v-if="!secondaryLoading && additionalContent.content_cards.length > 0"
    >
      <SectionHeader
        :title="additionalContent.title"
        :description="additionalContent.subtext"
        class="section-heading"
      />
      <ContentItems
        :items="additionalContent.content_cards"
        :section="'acrossThe' + agency"
        :return-path="$route.fullPath"
      />
    </div>
  </div>
</template>

<script>
import SectionHeader from "../SectionHeader";

import { mapState } from "vuex";
import ContentItems from "./ContentItems";

export default {
  name: "AdditionalContent",

  components: { ContentItems, SectionHeader },

  computed: {
    ...mapState("products", ["secondaryLoading", "additionalContent"]),
    ...mapState("metadata", ["agency"]),
  },
};
</script>
