<template>
  <div v-if="!locked">
    <router-link
      :to="routeTo"
      @focus.native="$emit('focus')"
      @focusout.native="$emit('focusout')"
      v-shortkey.focus="{
        noSR: [ind + 1],
        sr: ['alt', ind + 1],
      }"
    >
      <PortionMarkedString
        v-if="document.title"
        :portionMark="document.title_classification"
        :class="styleClass"
        :textString="document.title"
      />
      <PortionMarkedString
        v-else
        portionMark="(U//FOUO)"
        :class="styleClass"
        :textString="document.doc_num"
      />
      <span class="after-link-text" v-if="this.afterLinkText"
        >({{ this.afterLinkText }})</span
      >
    </router-link>
  </div>
  <div v-else>
    <b-btn
      v-shortkey.focus="{
        noSR: [ind + 1],
        sr: ['alt', ind + 1],
      }"
      @click="visitDoc"
      @focus="$emit('focus')"
      @focusout="$emit('focusout')"
      variant="link"
      class="locked"
    >
      <span class="sr-only"
        >Document {{ document.doc_num }} locked information</span
      >
      <span class="fa fa-lock">
        <span> Locked</span>
      </span>
      <div>
        <PortionMarkedString
          v-if="document.title"
          :portionMark="document.title_classification"
          class="document_link"
          :textString="document.title"
        />
        <PortionMarkedString
          v-else
          portionMark="U//FOUO"
          class="document_link"
          :textString="document.doc_num + ' is Locked'"
        />
        <span class="after-link-text-locked" v-if="this.afterLinkText"
          >({{ this.afterLinkText }})</span
        >
      </div>
    </b-btn>
    <LockedModal
      ref="lockedModal"
      :document="document"
      :id="`locked-${document.id}`"
      :ind="ind"
      :show="showLock"
      @hiding-modal="
        () => {
          showLock = !showLock;
        }
      "
      @focus="$emit('focus')"
      @focusout="$emit('focusout')"
    ></LockedModal>
  </div>
</template>

<script>
import LockedModal from "./LockedModal";
import PortionMarkedString from "../PortionMarkedString";
import _ from "lodash";

export default {
  name: "DocumentLink",
  components: { PortionMarkedString, LockedModal },
  props: ["document", "section", "returnPath", "ind", "afterLinkText"],

  data() {
    return {
      showLock: false,
    };
  },

  computed: {
    locked() {
      const locked =
        !_.isEmpty(this.document.needed) || this.document.org_restricted;
      if (locked) {
        this.$emit("locked");
      }
      return locked;
    },
    routeTo() {
      return {
        name: "document",
        params: {
          docNum: this.document.doc_num.replace("/", "!"),
          section: this.section,
          returnPath: this.returnPath,
        },
        query: {
          search_text: this.$route.query.text,
        },
      };
    },
    styleClass() {
      if (this.document.title) {
        return "document_link";
      }
    },
  },
  methods: {
    visitDoc(ctrlKeyPressed) {
      if (this.locked) {
        this.showLock = true;
      } else {
        if (ctrlKeyPressed) {
          const route = this.$router.resolve(this.routeTo);
          window.open(route.href, "_blank");
        } else {
          this.$router.push(this.routeTo);
        }
      }
    },
  },
};
</script>

<style scoped lang="scss">
.locked {
  color: $alt-900;
  margin-left: -11px;
  margin-top: -11px;
  text-align: left;
}
.fa-lock span {
  color: $alt-900;
  font-family: $headings-font-family;
  text-transform: uppercase;
}
</style>
