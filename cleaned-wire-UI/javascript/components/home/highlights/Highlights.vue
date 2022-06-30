<template>
  <div class="py-8" v-if="!secondaryLoading && highlights.articles.length > 0">
    <div class="standard-page-margin">
      <SectionHeader
        v-bind:title="highlights_header"
        :href="highlights.path"
        v-bind:description="highlights_subtext"
        class="section-heading"
      />
      <CardViewRow
        :articles="highlights.articles"
        section="highlights"
        :return-path="$route.fullPath"
        data-usage="front-page-da-highlights"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import CardViewRow from "@shared/CardViewRow";
import SectionHeader from "../SectionHeader";

export default {
  name: "Highlights",
  components: { CardViewRow, SectionHeader },
  computed: {
    ...mapState("articles", [
      "secondaryLoading",
      "highlights",
      "highlights_header",
      "highlights_subtext",
    ]),
  },
};
</script>
