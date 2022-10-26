<template>
  <div class="d-flex pull-right">
    <b-btn variant="link" @click="goToEditWirePage" class="py-0 mb-1">
      <img :src="require('@assets/edit.svg')" alt="" class="edit-icon" />
      <span class="sr-only"> Edit {{ documentTitle }} Article </span>
    </b-btn>
    <b-btn
      v-b-modal="`wire-unfeature-article-${feature.id}`"
      class="py-0 px-0"
      variant="link"
    >
      <img :src="require('@assets/reset.svg')" alt="" class="reset-icon" />
      <span class="sr-only"> Unfeature {{ documentTitle }} Article </span>
    </b-btn>
    <b-modal
      :id="`wire-unfeature-article-${feature.id}`"
      title="Confirm Unfeature Article"
      title-class="modal-header-title"
      @ok="unfeatureArticle"
    >
      <div id="unfeature-modal-text">
        Are you sure you want to remove {{ documentTitle }} from being a feature
        on the front page? This will not delete the product, it will just remove
        it from the TOC for this date only.
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "WireAdminToolBar",
  props: {
    feature: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState("user", ["user", "loading"]),
    selectedDate() {
      return this.$route.query.date || this.$route.params.date;
    },
    documentTitle() {
      return this.feature.document.title;
    },
  },
  methods: {
    unfeatureArticle() {
      this.$store
        .dispatch(`features/unfeatureProduct`, {
          featureDate: this.selectedDate,
          featureId: this.feature.id,
          caller: this,
        })
        .then(() => {
          this.$bus.$emit("featureUpdated");
        });
    },
    goToEditWirePage() {
      this.$router.push({
        path: `/wires/${this.selectedDate}/articles/${this.feature.id}/edit?cachebuster=true`,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.edit-icon,
.reset-icon {
  height: 16px;
  width: 16px;
}

button {
  &:focus {
    outline: 1px dotted $link-color;
  }
}

::v-deep .modal-header-title {
  color: $pri-800;
  font-size: $font-size-5;
}
</style>
