<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <label v-if="label" :for="uuid" class="inline-flex text-sm font-medium">
    {{ label }}
    <template v-if="required">
      <span class="sr-only">Required</span>
      <span class="pl-1 text-red-500"> * </span>
    </template>
  </label>
  <input
    v-bind="$attrs"
    :id="uuid"
    autocomplete="off"
    :value="getClassificationName(modelValue)"
    class="min-h-[2rem] flex w-full rounded-lg cursor-default py-1 px-2 mt-1 bg-transparent disabled:bg-slate-200/50 disabled:dark:bg-slate-700 disabled:energy:bg-zinc-700 border border-gray-300 dark:border-slate-600 energy:border-zinc-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 placeholder:italic"
    @input="$emit('update:modelValue', $event.target.value)"
    @click="classify"
    @keyup.enter="classify"
  />
  <template v-if="showClassBlock && getClassificationBlock(modelValue)">
    <div class="mt-4 flex flex-col space-y-1 text-sm">
      <p>
        <span class="font-medium pr-2">Classified By:</span
        >{{ getClassificationBlock(modelValue).classifiedBy }}
      </p>
      <p>
        <span class="font-medium pr-2">Derived From:</span
        >{{ getClassificationBlock(modelValue).derivedFrom }}
      </p>
      <p>
        <span class="font-medium pr-2">Declassify On:</span
        >{{ getClassificationBlock(modelValue).declassOn }}
      </p>
    </div>
  </template>
</template>
<script>
/* eslint-disable no-undef */
import { onBeforeUnmount, ref } from "vue";
import uniqueID from "@current/composables/uniqueID";
export default {
  components: {},
  props: {
    label: {
      type: String,
      default: "",
    },
    modelValue: {
      type: String,
      default: "",
    },
    required: {
      type: Boolean,
      default: false,
    },
    portionMark: {
      type: Boolean,
      default: false,
    },
    showClassBlock: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:classObj", "update:modelValue"],
  setup(props, { emit }) {
    const uuid = uniqueID().getID();

    const classificationXml = ref(props.modelValue);
    const classificationName = ref("");
    const classificationBlock = ref(null);
    const classificationMarking = ref(null);

    //TODO: There could be potential issues if we don't default the ClassifiedBy using the Tool's API. We need to look at some identifier to base this on.

    const assignModels = (xmlVal) => {
      classification.setClassificationXML(xmlVal);
      classificationXml.value = xmlVal;
      classificationMarking.value = classification.getClassificationMarking();
      const { ClassificationHeader } = classification.getClassificationInJSON();
      classificationName.value = ClassificationHeader
        ? ClassificationHeader.ClassificationBanner.text
        : "";
      const block = classification.getBlock();
      classificationBlock.value = block
        ? {
            classifiedBy: block.getCLBy(),
            derivedFrom: block.getDrvFrom(),
            declassOn: block.getDeclOn(),
          }
        : null;
    };

    const handleLoad = () => {
      if (props.portionMark) {
        initAcgPortionMarking();
      } else {
        initAcg();
      }
      assignModels(props.modelValue);
    };

    handleLoad();

    onBeforeUnmount(() => {
      classification.clear();
      destroyAcgWindow();
    });

    const getClassificationName = (xmlVal) => {
      if (xmlVal) {
        classification.setClassificationXML(xmlVal);
        const { ClassificationHeader } =
          classification.getClassificationInJSON();
        return ClassificationHeader
          ? ClassificationHeader.ClassificationBanner.text
          : "";
      }
      return "";
    };

    const getClassificationBlock = (xmlVal) => {
      if (xmlVal) {
        classification.setClassificationXML(xmlVal);
        const block = classification.getBlock();
        return block
          ? {
              classifiedBy: block.getCLBy(),
              derivedFrom: block.getDrvFrom(),
              declassOn: block.getDeclOn(),
            }
          : null;
      }
      return null;
    };

    const updateModels = (xmlVal) => {
      assignModels(xmlVal);

      emit("update:modelValue", classificationXml.value);
      emit("update:classObj", {
        xml: classificationXml.value,
        name: classificationName.value,
        marking: classificationMarking.value,
        block: classificationBlock.value,
      });
    };

    /* Override the Tool's storeClassificationXML() & storePortionMarkingXML() functions.
     * This is the only way to store off the selected classification
     * in a way that can be used to persist the value internally.
     */

    const storeClassificationXML = (xmlVal) => {
      updateModels(xmlVal);
      closeAcgWindow();
    };

    const storePortionMarkingXML = (field, xmlVal) => {
      updateModels(xmlVal);
    };

    const classify = () => {
      if (!classificationXml.value) {
        classification.clear();
      } else {
        classification.setClassificationXML(classificationXml.value);
      }

      if (props.portionMark) {
        window.storePortionMarkingXML = (field, xmlVal) => {
          storePortionMarkingXML(field, xmlVal);
        };
        launchAcgPortionMarkingWindow("/classGuide.html");
      } else {
        window.storeClassificationXML = (xmlVal) => {
          storeClassificationXML(xmlVal);
        };
        launchAcgWindow("/classGuide.html");
      }
    };

    return {
      uuid,
      getClassificationName,
      getClassificationBlock,
      classify,
    };
  },
};
</script>
