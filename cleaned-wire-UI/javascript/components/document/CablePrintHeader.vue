<template>
  <div id="ncs_body_header" class="d-none d-print-block">
    <p class="article_classification text-center">
      {{ document.classification }}
    </p>
    <h1 id="ncs_print_title">
      {{ document.portion_marked_title }}
    </h1>
    <p class="article_classification text-center">
      {{ document.classification }}<br />
    </p>
    <p>{{ nonFintelWarning }}</p>
    <p>
      <span class="subtitle_value" title="Document Number">{{
        document.doc_num
      }}</span
      ><br />
      DTG:
      <span class="subtitle_value" title="Date Time Group">{{
        document.dtg
      }}</span>
    </p>
    <p>
      <b>COUNTRY:</b
      ><span class="subtitle_value" title="Country">{{
        document.countries_fn ? document.countries_fn.join(", ") : ""
      }}</span
      ><br />
      <b>DOI:</b
      ><span class="subtitle_value" title="Date of Information">{{
        document.date_of_information
      }}</span
      ><br />
      <b>TOPIC:</b
      ><span class="subtitle_value" title="Topic">{{
        document.topics ? document.topics.join(", ") : ""
      }}</span
      ><br />
      <b>ACQ:</b
      ><span class="subtitle_value" title="Date of Acquisition">{{
        document.date_of_acquisition
      }}</span>
    </p>
  </div>
</template>

<script>
export default {
  name: "CablePrintHeader",
  props: {
    document: {
      type: Object,
      required: true,
    },
    nonFintelWarning: {
      type: String,
      required: true,
    },
  },
};
</script>
