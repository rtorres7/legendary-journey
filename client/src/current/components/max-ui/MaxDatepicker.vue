<template>
  <!-- For configurable options, see https://vue3datepicker.com/ -->
  <!-- Do not use Vue Datepicker's Light/Dark mode feature, see styling below -->
  <Datepicker
    :id="uuid"
    :clearable="false"
    :input-class-name="customStyle ? 'dp-custom-input' : ''"
  >
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </Datepicker>
</template>

<script>
import Datepicker from "@vuepic/vue-datepicker";
import uniqueID from "@/current/composables//uniqueID";
import "@vuepic/vue-datepicker/dist/main.css";

export default {
  components: {
    Datepicker,
  },
  props: {
    customStyle: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const uuid = uniqueID().getID();
    return {
      uuid,
    };
  },
};
</script>
<style lang="scss">
// We're overriding the Datepicker's theme using Tailwind CSS variables. No need to use light/dark mode prop on Datepicker.
.dp__today {
  border-width: 2px;
}

.dp__input {
  font-family: "Inter", "system-ui";
  font-size: 0.9rem;
}

.dp__input_icons {
  font-size: 0.9rem;
}

.dp-custom-input {
  border: transparent;
  cursor: default;
}

.dp__menu {
  font-family: "Inter", "system-ui";
  font-size: 0.9rem;
}

.dp__now_button {
  font-size: 0.9rem;
}

.dp__calendar_wrap {
  font-family: "Inter", "system-ui";
}

.dp__overlay {
  font-family: "Inter", "system-ui";
}

.dp__time_input {
  font-family: "Inter", "system-ui";
}

.dp__main {
  font-family: "Inter", "system-ui";
  > div {
    display: flex;
  }
}

.dp__theme_light {
  --dp-background-color: #ffffff;
  --dp-text-color: var(--color-slate-900);
  --dp-hover-color: var(--color-slate-200);
  --dp-hover-text-color: var(--color-slate-900);
  --dp-hover-icon-color: var(--color-slate-900);
  --dp-primary-color: rgb(3 85 166); // mission-light-blue
  --dp-primary-text-color: #f8f5f5;
  --dp-secondary-color: var(--color-slate-500);
  --dp-border-color: var(--color-gray-200);
  --dp-menu-border-color: var(--color-gray-200);
  --dp-border-color-hover: #aaaeb7;
  --dp-disabled-color: #f6f6f6;
  --dp-scroll-bar-background: #f3f3f3;
  --dp-scroll-bar-color: #959595;
  --dp-success-color: rgb(3 85 166); // mission-light-blue
  --dp-success-color-disabled: var(--color-green-500);
  --dp-icon-color: var(--color-slate-900);
  --dp-danger-color: #ff6f60;
  --dp-highlight-color: rgba(25, 118, 210, 0.1);
}

.dark .dp__theme_light {
  --dp-background-color: var(--color-slate-800);
  --dp-text-color: var(--color-slate-300);
  --dp-hover-color: var(--color-slate-800);
  --dp-hover-text-color: var(--color-slate-300);
  --dp-hover-icon-color: var(--color-slate-300);
  --dp-primary-color: var(--color-teal-700);
  --dp-primary-text-color: var(--color-slate-100);
  --dp-secondary-color: var(--color-slate-400);
  --dp-border-color: var(--color-slate-800);
  --dp-menu-border-color: var(--color-slate-800);
  --dp-border-color-hover: var(--color-slate-300);
  --dp-disabled-color: #f6f6f6;
  --dp-scroll-bar-background: var(--color-slate-800);
  --dp-scroll-bar-color: var(--color-slate-300);
  --dp-success-color: var(--color-teal-400);
  --dp-success-color-disabled: var(--color-green-200);
  --dp-icon-color: var(--color-slate-300);
  --dp-danger-color: #ff6f60;
  --dp-highlight-color: rgba(25, 118, 210, 0.1);
}

.energy .dp__theme_light {
  --dp-background-color: var(--color-zinc-800);
  --dp-text-color: var(--color-zinc-300);
  --dp-hover-color: var(--color-zinc-700);
  --dp-hover-text-color: var(--color-zinc-300);
  --dp-hover-icon-color: var(--color-zinc-300);
  --dp-primary-color: rgb(198 169 57); //darker shade of energy-yellow
  --dp-primary-text-color: var(--color-zinc-900);
  --dp-secondary-color: var(--color-zinc-400);
  --dp-border-color: var(--color-zinc-800);
  --dp-menu-border-color: var(--color-zinc-800);
  --dp-border-color-hover: var(--color-zinc-300);
  --dp-disabled-color: #f6f6f6;
  --dp-scroll-bar-background: var(--color-zinc-700);
  --dp-scroll-bar-color: var(--color-zinc-300);
  --dp-success-color: rgb(239 208 85); // energy-yellow
  --dp-success-color-disabled: var(--color-emerald-200);
  --dp-icon-color: var(--color-zinc-300);
  --dp-danger-color: #ff6f60;
  --dp-highlight-color: rgba(25, 118, 210, 0.1);
}
</style>
