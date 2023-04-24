<template>
  <div
    class="col-auto executive-link-container d-flex justify-content-center my-2"
  >
    <div class="d-flex px-3" :class="{ locked }">
      <div v-if="locked" class="align-self-center mr-4">
        <span class="fa fa-lock" />
      </div>
      <div>
        <div v-if="locked">
          <b-btn
            @click="
              () => {
                showLock = !showLock;
              }
            "
            variant="link"
            class="locked-btn document_link p-0"
          >
            <span class="subtext">({{ portionMark }}) </span>
            <span class="title">{{ title }}</span>
          </b-btn>
          <LockedModal
            :document="headline"
            :show="showLock"
            @hiding-modal="
              () => {
                showLock = !showLock;
              }
            "
          />
        </div>

        <router-link
          :to="{
            name: 'document',
            params: {
              docNum: headline.doc_num,
              section: 'headlineStack',
              returnPath: $route.fullPath,
            },
          }"
          v-else
        >
          <div class="document_link">
            <span class="subtext">({{ portionMark }}) </span>
            <span class="title">{{ title }}</span>
          </div>
        </router-link>
        <div v-if="asOfDate" class="subtext">
          {{ asOfDate | moment("MM/DD/YY") }}, {{ asOfTime }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isEmpty } from "lodash";
import LockedModal from "../../shared/DocumentLink/LockedModal";
export default {
  name: "Card",
  components: { LockedModal },
  props: ["headline"],

  data() {
    return {
      showLock: false,
    };
  },

  computed: {
    locked() {
      return !isEmpty(this.headline.needed);
    },

    noAsOfTitle() {
      if (this.headline.title !== null) {
        if (this.headline.title.indexOf("as of") > -1) {
          return this.headline.title.substring(
            0,
            this.headline.title.indexOf("as of")
          );
        } else {
          return this.headline.title;
        }
      } else {
        return "";
      }
    },

    asOf() {
      if (this.headline.title !== null) {
        if (this.headline.title.indexOf("as of") > -1) {
          return this.headline.title.substring(
            this.headline.title.indexOf("as of") + 5,
            this.headline.title.length
          );
        }
      } else {
        return "";
      }
    },

    asOfDate() {
      if (this.asOf) {
        const firstPart = this.asOf.split(",")[0];
        const d = Date.parse(firstPart);
        return d ? d : firstPart;
      }
      return "";
    },

    asOfTime() {
      if (this.asOf && this.asOf.split(",").length > 0) {
        return this.asOf.split(",")[1];
      }
      return "";
    },

    title() {
      return this.noAsOfTitle
        .replace("Executive Update", "")
        .replace("Intelligence Highlight", "");
    },

    portionMark() {
      return this.headline.title_classification;
    },
  },
};
</script>

<style lang="scss" scoped>
.executive-link-container {
  text-align: left;
  flex: 1 1 auto;
  border-left: 1px solid $border-light;
}

.subtext {
  font-size: $font-size-1;
  color: $alt-800;
}

.title {
  font-size: $font-size-2;
}

.locked {
  background-color: $alt-300;
  .subtext {
    color: $alt-900;
  }
}

.locked-btn {
  color: $alt-900;
  text-align: left;
}
.fa-lock span {
  color: $alt-900;
  font-family: $headings-font-family;
  text-transform: uppercase;
}
</style>
