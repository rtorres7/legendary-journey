<template>
  <DocumentExpansionPanel panelId="contents">
    <template slot="header"> Contents </template>
    <template slot="content">
      <ul class="list-group separator">
        <li class="pb-2" v-if="!isCable">
          <dl>
            <dt>Produced By:</dt>
            <dd>{{ productLine }}</dd>
            <dt>Product Type:</dt>
            <dd>{{ productType }}</dd>
            <dt>Document Number:</dt>
            <dd>{{ document.doc_num }}</dd>
            <dt v-if="showPublicationNum">Publication Number:</dt>
            <dd v-if="showPublicationNum">{{ document.pub_num }}</dd>
          </dl>
        </li>
        <li class="pb-2" v-if="!isCable">
          <dl>
            <dt>Posted:</dt>
            <dd>
              {{
                document.posted_at
                  ? formattedDate(document.posted_at, true)
                  : "Not Posted Yet"
              }}
            </dd>
            <dt>Publication Date:</dt>
            <dd>{{ formattedDate(document.date_published) }}</dd>
          </dl>
        </li>

        <li class="pb-2" v-if="isCable">
          <dl>
            <dt>Document Number:</dt>
            <dd>{{ document.doc_num }}</dd>
          </dl>
        </li>
        <li class="pb-2" v-if="isCable">
          <dl>
            <dt>Country:</dt>
            <dd>
              {{
                document.countries_fn ? document.countries_fn.join(", ") : ""
              }}
            </dd>
            <dt>Topic:</dt>
            <dd>{{ document.topics ? document.topics.join(", ") : "" }}</dd>
          </dl>
        </li>
        <li class="pb-2" v-if="isCable">
          <dl>
            <dt>Date Time Group:</dt>
            <dd>{{ document.dtg }}</dd>
            <dt>Date of Information:</dt>
            <dd>{{ document.date_of_information }}</dd>
            <dt>Date of Acquisition:</dt>
            <dd>{{ document.date_of_acquisition }}</dd>
          </dl>
        </li>
        <li class="pb-2" v-if="isOpenSource && document.osint_detail">
          <dl>
            <dt>Source Name:</dt>
            <dd>{{ document.osint_detail.source_name }}</dd>
            <dt>Source Language:</dt>
            <dd>{{ document.osint_detail.source_language }}</dd>
            <dt>Source City:</dt>
            <dd>{{ document.osint_detail.source_city }}</dd>
            <dt>Source Start Date:</dt>
            <dd>
              {{ formattedSourceDate(document.osint_detail.source_date_start) }}
            </dd>
            <dt>Source End Date:</dt>
            <dd>
              {{ formattedSourceDate(document.osint_detail.source_date_end) }}
            </dd>
          </dl>
        </li>
        <li
          class="pb-2"
          v-if="
            isOpenSource &&
            document.osint_detail &&
            document.osint_detail.sub_slug
          "
        >
          <dl>
            <dt>Slug:</dt>
            <dd>{{ document.osint_detail.sub_slug }}</dd>
          </dl>
        </li>
        <li class="pb-2" v-if="document.poc_attrib || document.poc_info">
          <dl>
            <dt>{{ isOpenSource ? "POC Information" : "Contact" }}:</dt>
            <dd>{{ contactInfo }}</dd>
          </dl>
        </li>
      </ul>
    </template>
  </DocumentExpansionPanel>
</template>

<script>
import DocumentExpansionPanel from "../document/DocumentExpansionPanel";
import documentMixin from "@shared/mixins/documentMixin";
import { isEmpty } from "lodash";
import { mapState } from "vuex";

export default {
  name: "DocumentAttribution",
  mixins: [documentMixin],
  components: { DocumentExpansionPanel },
  computed: {
    ...mapState("metadata", ["agency"]),
    contactInfo() {
      return !isEmpty(this.document.poc_attrib)
        ? this.document.poc_attrib
        : this.document.poc_info;
    },
    productType() {
      return this.document.type === "DstDocument"
        ? `DS&T ${this.document.product_type_name}`
        : this.document.product_type_name;
    },
    productLine() {
      let producingOffice = this.document.producing_office;
      if (this.document.type == "DstDocument") return "DS&T";
      else if (producingOffice == "NIC") return "NIC";
      else if (producingOffice == "ONCIX") return "ONCIX";
      else if (producingOffice == "_temp_373") return "_temp_373";
      else if (this.daProduct) return "DA";
      else return this.agency;
    },
    showPublicationNum() {
      return (
        this.isLeadership && this.document.doc_num !== this.document.pub_num
      );
    },
  },
  methods: {
    formattedSourceDate(value) {
      return value ? value.replace(/\//g, "-") : value;
    },
  },
};
</script>
