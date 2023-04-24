<template>
  <div class="mt-8">
    <div class="pb-5 font-size-4 d-flex justify-content-center">
      <PortionMarkedString
        v-if="document.title"
        :portionMark="document.title_classification"
        :textString="document.title"
      />
      <PortionMarkedString
        v-else
        portionMark="U//_temp_220"
        :textString="document.doc_num + ' is Locked'"
      />
    </div>
    <div class="font-size-2 d-flex justify-content-center">
      <div v-if="document.org_restricted && org_assigned">
        <p>This document was not disseminated to your organization.</p>
      </div>
      <div class="pl-4" v-else>
        <p>
          In order to view this document, you need to update your accesses by:
        </p>
        <div class="pl-8">
          <ul>
            <li v-for="sci in needed.sci_compartments" :key="sci">
              Having your access to {{ sci }} confirmed
            </li>
          </ul>
          <p v-if="neededNotEmpty">
            Submitting an access request in JEMS (found
            <a href="_temp_525jems.cia._temp_0/home.jsf" target="_blank">HERE</a>)
            for:
          </p>
          <ul>
            <AtLeastList :needed="needed" section="subregions"></AtLeastList>
            <AtLeastList :needed="needed" section="issues"></AtLeastList>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Error from "@shared/errors/Error";
import { mapState } from "vuex";
import { isEmpty } from "lodash";
import PortionMarkedString from "../PortionMarkedString";
import AtLeastList from "../DocumentLink/AtLeastList";

export default {
  name: "LockContent",
  components: { Error, PortionMarkedString, AtLeastList },
  props: {
    document: {
      required: true,
    },
  },
  computed: {
    ...mapState("user", ["user", "loading", "has_org"]),
    org_assigned() {
      return this.user.has_org;
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
  },
};
</script>
