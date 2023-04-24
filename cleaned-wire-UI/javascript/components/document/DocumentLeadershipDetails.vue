<template>
  <div
    id="leadership_fields"
    v-if="isLeadership && supportedXMLVersion"
    class="col-xs-24 col-sm-16 col-md-16 col-lg-16 col-xl-18"
  >
    <p class="countries" v-if="document.country_line">
      <strong>{{ document.country_line }}</strong>
    </p>
    <dl class="lp_dl" v-if="isExtremistProfile">
      <dt class="label" v-if="document.name">Name</dt>
      <dd class="value" v-if="document.name">{{ document.name }}</dd>
      <dt class="label" v-if="document.phonetic">Phonetic</dt>
      <dd class="value" v-if="document.phonetic">{{ document.phonetic }}</dd>
      <dt class="label" v-if="document.key_aliases">Key Alias(es)</dt>
      <dd class="value" v-if="document.key_aliases">
        {{ document.key_aliases }}
      </dd>
      <dt class="label" v-if="document.affiliations">Affiliations</dt>
      <dd class="value" v-if="document.affiliations">
        {{ document.affiliations }}
      </dd>
      <dt class="label" v-if="document.nationality">Nationality</dt>
      <dd class="value" v-if="document.nationality">
        {{ document.nationality }}
      </dd>
      <dt class="label" v-if="document.date_detained">Date Detained</dt>
      <dd class="value" v-if="document.date_detained">
        {{ document.date_detained }}
      </dd>
    </dl>
    <div id="fisa_warning" v-if="isExtremistProfile && document.fisa_warning">
      <p>{{ document.fisa_warning }}</p>
    </div>
    <h3 class="unmargined" v-if="!isExtremistProfile">
      {{ document.name || document.title }}
      <span
        class="alt_spelling"
        v-if="isLeadershipProfile && document.alt_spelling"
        >(also spelled {{ document.alt_spelling }})</span
      >
    </h3>
    <p id="phonetic" v-if="isLeadershipProfile && document.phonetic">
      (Phonetic: {{ document.phonetic }})
    </p>
    <p id="position" v-if="isLeadershipProfile && document.address_as">
      <strong
        ><em
          >{{ document.position }}
          {{ document.address_as ? "" : `(${document.title_classif})` }}</em
        ></strong
      >
    </p>
    <p id="addressed_as" v-if="isLeadershipProfile && document.address_as">
      <strong
        ><em
          >Addressed as: {{ document.address_as }} ({{
            document.title_classif
          }})</em
        ></strong
      >
    </p>
  </div>
</template>

<script>
import documentMixin from "@shared/mixins/documentMixin";

export default {
  name: "DocumentLeadershipDetails",
  mixins: [documentMixin],
  computed: {
    supportedXMLVersion() {
      return (
        this.document.xml_schema_ver !== "CIAPUBSV1" &&
        this.document.xml_schema_ver !== "PUBSV12"
      );
    },
  },
};
</script>

<style scoped lang="scss">
.label {
  text-transform: uppercase;
}
::v-deep .lp_dl {
  left: 20px;
  position: relative;
}
</style>
