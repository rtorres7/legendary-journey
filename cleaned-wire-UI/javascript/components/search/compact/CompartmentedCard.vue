<template>
  <div>
    <b-card-body class="d-flex p-5">
      <Date :class="{ locked }" fullDate :documentDate="document.posted" />
      <div class="special-ie-happy-flex-grow">
        <div class="d-flex">
          <b-card-title
            class="flex-grow-1 d-flex align-items-center m-0"
            title-tag="div"
          >
            <a
              :href="document.links[0].href"
              @click="handleSDSLink"
              :data-usage="`fss-doc-${document.internalId}`"
              ><span class="fa fa-lock" v-if="!document.accessible" />

              <PortionMarkedString
                :portionMark="titlePortionMark(document.title)"
                class="locked"
                :textString="
                  document.title.value +
                  '<span class=&quot;sr-only&quot;>_temp_39 ' +
                  document.internalId +
                  '</span>'
                "
              />
            </a>
          </b-card-title>
          <b-card-sub-title
            class="pl-5 mt-3"
            sub-title-text-variant="black"
            sub-title-tag="div"
            >{{ document.internalId }}</b-card-sub-title
          >
        </div>
      </div>
    </b-card-body>
    <hr />
  </div>
</template>

<script>
import Date from "@shared/Date";
import fssMixin from "@shared/mixins/fssMixin";

export default {
  name: "CompartmentedCard",
  mixins: [fssMixin],
  components: { Date },
  methods: {
    handleSDSLink() {
      this.$bus.$emit("sdsLinkClicked");
    },
  },
};
</script>

<style scoped lang="scss">
.bounce-enter-active {
  animation: bounce-in 0.5s;
}

.card-subtitle {
  white-space: nowrap;
}

::v-deep .document_link {
  font-size: $font-size-5;
  font-family: $heading-stylized;
}

::v-deep .wire-date {
  margin-top: 9px;
}

.special-ie-happy-flex-grow {
  flex: 1 1 0%;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }

  100% {
    transform: scale(1);
  }
}
</style>
