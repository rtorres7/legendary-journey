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
    hideForFSS: {
      default: false,
    },
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
        if (!this.hideForFSS) {
          options.push({
            value: issue.code,
            text: issue.name,
            type: "issues[]",
            children: true,
          });
        } else {
          options.push({
            text: issue.name,
            value: "",
            header: true,
          });
        }
        issue.topics.forEach((topic) =>
          options.push({
            value: topic.codes[0],
            text: topic.name,
            type: "topics[]",
            indent: true,
          })
        );
      });
      options.push({
        text: "Not Available",
        value: "XXXX",
        type: "topics[]",
        children: true,
      });
      return options;
    },
  },
};
</script>

<style scoped lang="scss"></style>
