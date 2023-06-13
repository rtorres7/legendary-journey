<template>
  <div class="w-100 d-none d-print-block pr-8">
    <div :class="`print-_temp_519 print-header ${pageCssClass}`">
      <img
        v-if="document && (!isLeadership || includeBanner)"
        :class="bannerGraphic.split('.')[0]"
        :alt="bannerGraphicAltText"
        :src="require(`@/assets/consumer/${bannerGraphic}`)"
      />
      <img
        v-else
        class="banner_wire"
        alt="_temp_519"
        :src="require('@/assets/consumer/banner_wire.jpg')"
      />

      <span class="classification">
        {{ document ? document.classification : siteClassification }}
      </span>

      <div :class="`product by-line ${docClassName}`">
        <div class="">
          <div class="header-by-line" v-if="document">
            <template v-if="isWire">
              <div class="red-cell-branding" v-if="isRedCell">Red Cell</div>

              <div
                class="strategic-perspective-branding"
                v-else-if="isStrategicPerspective"
              >
                Strategic Perspective
              </div>

              <span class="wire-branding" v-else>
                <img
                  class="wire-logo"
                  :src="require(`@assets/_temp_540-logo-dark.svg`)"
                />
                <span class="logo-text">
                  <span class="org-text">_temp_6</span
                  ><span class="site-text">WIRe</span>
                </span>
              </span>

              <div class="by-line-title">
                <span>{{ truncatedPortionMarkedTitle }}</span>
              </div>
              <div class="by-line-continuation">
                <span class="by-line-pubdate">{{
                  formattedDate(document.display_date, false)
                }}</span>
                <span class="by-line-continued">Continued</span>
              </div>
            </template>
            <template v-else>
              <span class="by-line-title">{{ portionMarkedTitle }} </span>
              <span class="by-line-continuation">
                <span class="by-line-continued">Continued</span>
              </span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import documentMixin from "@shared/mixins/documentMixin";
import { mapState } from "vuex";
import { snakeCase } from "lodash";

export default {
  name: "PrintHeader",
  mixins: [documentMixin],
  props: {
    document: {
      type: Object,
      required: false,
    },
    pageCssClass: {
      type: String,
      default: "first-page",
    },
  },
  computed: {
    ...mapState("metadata", ["siteClassification"]),
    ...mapState("metadata/criteria/selectedFor", { selectedFor: "values" }),
    docClassName() {
      return this.document ? snakeCase(this.document.type) : "";
    },
    includeBanner() {
      return (
        this.isLeadership &&
        (this.isExtremistProfile ||
          this.isLeadershipNote ||
          this.isTerroristNote)
      );
    },
    redCell() {
      return this.selectedFor.find((category) => category.name == "Red Cell");
    },
    strategicPerspective() {
      return this.selectedFor.find(
        (category) => category.name == "Strategic Perspective"
      );
    },
    isRedCell() {
      return (
        this.isWire &&
        this.document.product_type_id === parseInt(this.redCell.code)
      );
    },
    isStrategicPerspective() {
      return (
        this.isWire &&
        this.document.product_type_id ===
          parseInt(this.strategicPerspective.code)
      );
    },
    bannerGraphic() {
      let _temp_519 = "banner_blank.jpg";

      if (this.isOpenSource) {
        _temp_519 = "banner_ose.png";
      }
      if (this.daProduct) {
        _temp_519 = "banner_blank.jpg";
      }
      if (this.isDstDocument) {
        _temp_519 = "banner_dst.gif";
      }
      if (this.isWire) {
        if (this.isRedCell) {
          _temp_519 = "banner_red_cell.png";
        } else if (this.isStrategicPerspective) {
          _temp_519 = "banner_strategic_perspective.png";
        } else {
          _temp_519 = "banner_wire.jpg";
        }
      }

      return _temp_519;
    },
    bannerGraphicAltText() {
      let altText = "Unknown";

      if (this.isOpenSource) {
        altText = "DNI Open Source Enterprise";
      }
      if (this.daProduct) {
        altText = "_temp_6 Directorate of Analysis";
      }
      if (this.isDstDocument) {
        altText = "_temp_6 DS&T";
      }
      if (this.isWire) {
        if (this.isRedCell) {
          altText = "_temp_6 Directorate of Analysis/Red Cell";
        } else if (this.isStrategicPerspective) {
          altText = "_temp_6 Directorate of Analysis/Strategic Perspective";
        } else {
          altText = "_temp_6 Directorate of Analysis";
        }
      }

      return altText;
    },
    truncatedPortionMarkedTitle() {
      let numOfChars = this.isRedCell || this.isStrategicPerspective ? 75 : 70;
      return this.portionMarkedTitle.slice(0, numOfChars) + "...";
    },
  },
};
</script>

<style scoped lang="scss">
.app-icon {
  height: 50px;
  width: 50px;
}
</style>
