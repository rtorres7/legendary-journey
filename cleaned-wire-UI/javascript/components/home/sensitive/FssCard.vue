<template>
  <b-card
    class="selectable h-100"
    :class="{ locked: locked }"
    @click="clickCard()"
    :data-usage="`fss-doc-${document.internalId}`"
    no-body
  >
    <b-card-body class="p-0">
      <div class="d-flex flex-column h-100">
        <b-row class="card-contents flex-grow-1">
          <b-col
            class="col d-flex flex-column justify-content-between py-5 pl-6 pr-5"
          >
            <b-card-title title-tag="h3" @click.prevent v-if="document.title">
              <a :href="documentLink"
                ><span class="subtext fa fa-lock pr-2" v-if="locked" />
                <span
                  class="title"
                  v-if="showDocumentIdentifier(document.title.value)"
                >
                  {{ docNumForTitle() }}</span
                >
                <PortionMarkedString
                  v-else
                  :portionMark="titlePortionMark(document.title)"
                  class="locked-btn document_link"
                  :textString="document.title.value"
                />
              </a>
            </b-card-title>
            <b-card-text>
              <div class="published-date font-size-2 alt-800">
                {{ formattedPostedDate }}
              </div>
            </b-card-text>
          </b-col>
          <b-col class="col-auto">
            <img
              class="image"
              :src="require('@assets/wire-sensitive-thumb.jpg')"
              alt=""
            />
          </b-col>
        </b-row>
      </div>
    </b-card-body>
  </b-card>
</template>

<script>
import fssMixin from "@shared/mixins/fssMixin";

export default {
  name: "FssCard",
  mixins: [fssMixin],
  methods: {
    clickCard() {
      window.open(this.documentLink, "sds");
      this.$bus.$emit("sdsLinkClicked");
    },
    showDocumentIdentifier(docTitle) {
      return (
        docTitle === "Title Restricted" || docTitle === "No Title Available"
      );
    },
    docNumForTitle() {
      return `(${this.titlePortionMark(this.document.title)}) ${
        this.document.internalId
      }`;
    },
  },
};
</script>

<style scoped lang="scss">
.card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid $alt-400;
  box-shadow: 0 3px 1px rgba(0, 0, 0, 0.1);
  border-radius: unset;

  &:hover,
  &.focused {
    box-shadow: 0 5px 2px rgba(129, 103, 103, 0.25);
    .card-title a {
      color: $link-color !important;
      text-decoration: unset;
      outline: none;
    }
  }
}

.featured {
  .card-title {
    font-size: $font-size-5;
  }
}

.selectable {
  cursor: pointer;
  border-left: 4px solid $sec-600;
}

.image {
  height: 165px;
  width: 165px;
}

.subtext {
  font-size: $font-size-2;
  color: $pri-800;
}

.title {
  font-size: $font-size-2;
}

.locked {
  background-color: $alt-300;
}

.locked-btn {
  text-align: left;
}
.fa-lock span {
  font-family: $headings-font-family;
  text-transform: uppercase;
}
</style>
