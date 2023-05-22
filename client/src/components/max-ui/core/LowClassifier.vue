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
    readonly
    :value="getClassificationName(modelValue)"
    class="min-h-[2rem] flex w-full rounded-lg cursor-default py-1 px-2 mt-1 bg-transparent disabled:bg-slate-200/50 disabled:dark:bg-slate-700 disabled:energy:bg-zinc-700 border border-gray-300 dark:border-slate-600 energy:border-zinc-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 placeholder:italic"
    @click="openClassifyDialog"
  />
  <MaxDialog
    class="max-w-[600px]"
    :isOpen="isClassifyDialogOpen"
    @close="closeClassifyDialog"
  >
    <div class="flex flex-col gap-y-4">
      <template v-for="classif in classifs" :key="classif">
        <div>
          <input
            :id="classif.name"
            :v-model="selectedClassif"
            type="checkbox"
            :value="classif.name"
            class="classifCheckbox"
            :checked="isChecked(classif)"
            @change="updateChecked(classif)"
          />
          <label :for="classif.name" class="ml-2 text-sm">{{
            classif.name
          }}</label>
        </div>
      </template>
    </div>
    <template #actions>
      <MaxButton
        color="secondary"
        @click="
          closeClassifyDialog();
          updateModels(checkedVal);
        "
      >
        Classify
      </MaxButton>
      <MaxButton color="secondary" @click="closeClassifyDialog"
        >Cancel</MaxButton
      >
    </template>
  </MaxDialog>
</template>
<script>
/* eslint-disable no-undef */
import uniqueID from "@/composables/uniqueID";
import { computed, ref } from "vue";
import { useStore } from "vuex";
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
  },
  emits: ["update:classObj", "update:modelValue"],
  setup(props, { emit }) {
    const uuid = uniqueID().getID();
    const store = useStore();
    const classifs = computed(
      () => store.state.metadata.criteria.classification
    );
    const selectedClassif = ref();
    const checkedVal = ref();

    const updateChecked = (val) => {
      checkedVal.value = val;
      //only select one checkbox for now. maybe we'll make it more complex/multiselect in the future to be more like cmt?
      Array.from(document.getElementsByClassName("classifCheckbox")).forEach(
        (checkbox) => {
          if (checkbox.value == val.name || checkbox.value == val.marking) {
            checkbox.checked = true;
          } else {
            checkbox.checked = false;
          }
        }
      );
    };

    const isChecked = (val) => {
      const inputValue = document.getElementById(uuid).value;
      if (inputValue == val.name || inputValue == val.marking) {
        return true;
      }
      return false;
    };

    const updateModels = (val) => {
      emit("update:modelValue", val.name);
      emit("update:classObj", {
        xml: val.xml,
        name: val.name,
        marking: val.marking,
        block: "",
      });
    };

    const isClassifyDialogOpen = ref(false);
    const openClassifyDialog = () => {
      isClassifyDialogOpen.value = true;
    };
    const closeClassifyDialog = () => {
      isClassifyDialogOpen.value = false;
    };

    const getClassificationName = (val) => {
      if (val) {
        const classif = classifs.value.find(
          (c) => c.xml == val || c.name == val
        );
        if (props.label == "Document Classification") {
          return classif?.name;
        } else {
          return classif?.marking;
        }
      }
      return "";
    };

    return {
      uuid,
      checkedVal,
      isChecked,
      updateChecked,
      updateModels,
      classifs,
      selectedClassif,
      isClassifyDialogOpen,
      openClassifyDialog,
      closeClassifyDialog,
      getClassificationName,
    };
  },
};
</script>
