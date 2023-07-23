<template>
  <label :for="uuid" class="inline-flex text-sm font-medium"
    >{{ label }}
    <template v-if="required">
      <span class="sr-only">Required</span>
      <span class="pl-1 text-red-500">*</span>
    </template></label
  >
  <div class="flex items-center">
    <MaxButton
      :id="uuid"
      v-bind="$attrs"
      class="max-w-fit mt-1"
      @click.prevent="classify"
      >Classify</MaxButton
    >
    <template v-if="showSelection && selection">
      <p class="ml-2">{{ selection }}</p>
    </template>
  </div>
</template>
<script>
import dayjs from "dayjs/esm/index.js";
import uniqueID from "@/current/composables//uniqueID";

export default {
  components: {},
  props: {
    label: {
      type: String,
      default: "Classification",
    },
    selection: {
      type: String,
      required: true,
    },
    showSelection: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["classificationSelected"],
  setup(props, { emit }) {
    const uuid = uniqueID().getID();

    const buildPayload = () => {
      const today = dayjs().format("YYYY-MM-DD");
      return {
        classification_string: "U",
        classification_xml: `<class:Classification xmlns:class="urn:us:gov:cia:enterprise:schema:Classification:2.3" xmlns="http://www.w3.org/1999/xhtml" dateClassified="${today}" portionMarking="true" caveat="false" tool="DHTML" toolVersion="202220"><class:ClassificationMarking type="USClassificationMarking" value="U"></class:ClassificationMarking><class:ClassifiedBy></class:ClassifiedBy><class:ClassificationHeader><class:ClassificationBanner>U</class:ClassificationBanner><class:SCICaveat></class:SCICaveat><class:DescriptiveMarkings></class:DescriptiveMarkings></class:ClassificationHeader><class:ClassificationFooter><class:ClassificationBanner>U</class:ClassificationBanner></class:ClassificationFooter></class:Classification>`,
      };
    };

    const classify = () => {
      emit("classificationSelected", buildPayload());
    };

    return {
      uuid,
      classify,
    };
  },
};
</script>
<style lang="scss">
/* Empty on Purpose */
</style>
