<template>
  <div class="pt-8" v-if="displayEvaluationLink">
    <h2 class="pri-800 separator pb-4">_temp_251 Evaluation</h2>

    <span class="portion_marked_field"> (_temp_52) </span>
    The National _temp_251 Enterprise (NHE) relies on its consumers to evaluate how
    effectively its reporting satisfies their priority _temp_536
    requirements. Please provide formal feedback through the
    <a class="link-in-article" :href="document.eval_form_url"
      >_temp_251 Evaluation Questions</a
    >.
  </div>
</template>

<script>
export default {
  name: "DocumentEvaluation",
  props: {
    document: {
      type: Object,
      required: true,
    },
  },
  computed: {
    displayEvaluationLink() {
      return (
        this.document.type === "NcsDocument" && this.document.eval_form_url
      );
    },
  },
};
</script>
