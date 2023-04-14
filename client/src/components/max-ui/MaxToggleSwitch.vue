<template>
  <SwitchGroup>
    <div class="flex flex-col gap-y-2">
      <SwitchLabel v-if="label" class="text-sm font-medium">
        {{ label }}
      </SwitchLabel>
      <Switch
        v-model="enabled"
        :class="
          enabled
            ? 'bg-green-400'
            : 'bg-slate-200 dark:bg-slate-600 energy:bg-zinc-600'
        "
        class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-offset-2"
      >
        <span
          :class="enabled ? 'translate-x-6' : 'translate-x-1'"
          class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
        />
      </Switch>
    </div>
  </SwitchGroup>
</template>

<script>
import { computed } from "vue";
import { Switch, SwitchGroup, SwitchLabel } from "@headlessui/vue";

export default {
  components: {
    Switch,
    SwitchGroup,
    SwitchLabel,
  },
  props: {
    label: {
      type: String,
      default: "",
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const enabled = computed({
      get: () => props.modelValue,
      set: (value) => {
        emit("update:modelValue", value);
      },
    });

    return {
      enabled,
    };
  },
};
</script>
