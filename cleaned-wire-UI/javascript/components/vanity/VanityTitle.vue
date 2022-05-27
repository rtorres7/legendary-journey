<template>
  <b-row class="vanity-title-box pt-8 pb-6">
    <b-col class="image-area d-none d-sm-block col-sm-2">
      <WireBackgroundAsset :image-name="img" fill />
    </b-col>
    <b-col
      class="col-24 col-sm-22 d-flex flex-column justify-content-around title-area _temp_488-sm-6 pr-0"
    >
      <slot></slot>
      <div class="d-flex">
        <StandardTitle :title="title"></StandardTitle>
        <AdvancedTipsLink
          v-if="
            featuresAvailable.advancedTipsLink && this.$route.name === 'search'
          "
          class="align-self-end ml-auto"
          responsive
        />
      </div>
    </b-col>
  </b-row>
</template>

<script>
import { mapState } from "vuex";
import AdvancedTipsLink from "../shared/AdvancedTipsLink";
import ResultsNav from "@shared/ResultsNav";
import StandardTitle from "./vanityTitle/StandardTitle";
import WireBackgroundAsset from "@shared/WireBackgroundAsset";
export default {
  name: "VanityTitle",
  components: {
    AdvancedTipsLink,
    WireBackgroundAsset,
    StandardTitle,
    ResultsNav,
  },
  props: ["title"],
  computed: {
    ...mapState("metadata", ["featuresAvailable"]),
    img() {
      switch (this.$route.name) {
        case "exports":
          return "exports-icon.svg";
        case "folder":
        case "folders":
          return "folders-icon.svg";
        case "usersearch":
        case "userdetails":
        case "userroles":
          return "user-search-icon.svg";
        case "search":
          return "searchpage-icon.svg";
        case "regions":
        case "subregions":
        case "countries":
          return "regions-icon.svg";
        case "managealerts":
          return "alerts-icon.svg";
        case "tag":
        case "myTags":
        case "allTags":
        case "searchTags":
          return "tags-icon.svg";
        case "leadership":
        case "issues":
        case "topics":
          return "intelligence-icon.svg";
        case "revisions":
          return "revisions-icon.svg";
        case "contact_us":
          return "contact-icon.svg";
      }
    },
  },
};
</script>

<style scoped lang="scss">
.vanity-title-box {
  border-bottom: 1px solid $alt-400;
}

.map {
  position: absolute;
  z-index: 0;
  height: 354px;
  width: 94%;
  top: 30px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.icon-box {
  font-size: 120px;
  color: $alt-300;
}

.title-area {
  min-height: 75px;
}

.image-area {
  border-right: 2px solid $alt-400;
}
</style>
