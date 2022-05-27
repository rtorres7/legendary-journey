<template>
  <b-col v-bind="sizes">
    <WireSelect :options="options" :label="label" />
  </b-col>
</template>

<script>
import WireSelect from "./WireSelect";
import { mapState } from "vuex";
export default {
  name: "IssuesTopics",
  components: { WireSelect },
  props: {
    label: {
      type: String,
      default: "Issues & Topics",
    },
    sizes: {
      type: Object,
      required: false,
    },
  },
  computed: {
    ...mapState("metadata/criteria/issues", { issues: "values" }),
    options() {
      let options = [];
      this.issues.forEach((issue) => {
        options.push({
          value: issue.code,
          text: issue.name,
          type: "issues[]",
          children: true,
        });
        issue.topics.forEach((topic) =>
          options.push({
            value: topic.codes[0],
            text: topic.name,
            type: "topics[]",
            indent: true,
          })
        );
      });
      return options;
    },
  },
};
</script>

<style scoped lang="scss"></style>
