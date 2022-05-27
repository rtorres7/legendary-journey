<template>
  <b-modal
    @show="lockedAccessAttempt"
    v-model="showModal"
    title="Document Locked"
    title-class="modal-header-title"
    ok-only
  >
    <div class="pb-5 font-size-4">
      <PortionMarkedString
        v-if="document.title"
        :portionMark="document.title_classification"
        :textString="document.title"
      />
      <PortionMarkedString
        v-else
        portionMark="U//FOUO"
        :textString="document.doc_num + ' is Locked'"
      />
    </div>
    <div class="font-size-2">
      <div v-if="document.org_restricted && org_assigned">
        <p>This document was not disseminated to your organization.</p>
      </div>
      <div v-else>
        <p>
          In order to view this document, you need to update your accesses by:
        </p>
        <ul>
          <li v-for="_temp_545 in needed.sci_compartments">
            Having your access to {{ _temp_545 }} confirmed
          </li>
        </ul>
        <p v-if="neededNotEmpty">
          Submitting an access request in JEMS (found
          <a href="https://jems._temp_327.ic.gov/home.jsf" _temp_576="_blank">HERE</a>)
          for:
        </p>
        <ul>
          <AtLeastList :needed="needed" section="subregions"></AtLeastList>
          <AtLeastList :needed="needed" section="issues"></AtLeastList>
        </ul>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";
import AtLeastList from "./AtLeastList";
import { isEmpty } from "lodash";
import PortionMarkedString from "../PortionMarkedString";
export default {
  name: "LockedModal",
  components: { PortionMarkedString, AtLeastList },
  props: ["document", "ind", "show"],

  computed: {
    ...mapState("user", ["user", "loading", "has_org"]),
    showModal: {
      get() {
        return this.show;
      },
      set() {
        this.$emit("hiding-modal");
        return;
      },
    },
    org_assigned() {
      if (!this.loading) {
        return this.user.has_org;
      }
    },
    needed() {
      return this.document.needed;
    },

    neededNotEmpty() {
      return (
        !isEmpty(this.needed["regions"]) ||
        !isEmpty(this.needed["subregions"]) ||
        !isEmpty(this.needed["issues"]) ||
        !isEmpty(this.needed["topics"])
      );
    },

    ntk_string() {
      return this.approved_ntk ? "update your accesses" : "request a NTK";
    },
  },
  methods: {
    lockedAccessAttempt() {
      // intentionally making a document access request and ignoring the response to generate an audit event
      axios
        .get("/documents/" + this.document.doc_num.replace("/", "!") + "/")
        .then(
          (response) => {},
          (error) => {}
        );
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
/deep/ .modal-header-title {
  color: $pri-800;
  font-size: $font-size-5;
}
</style>
