<template>
  <button v-bind="$attrs"
    class="select-none border border-gray-300 dark:border-slate-600 energy:border-zinc-600 shadow-lg rounded-md px-4 py-2 
      min-h-[2rem] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mission-blue dark:focus:ring-slate-300 energy:focus:ring-zinc-300"
    :class="computedClass">
    <slot />
  </button>
</template>
<script>
import { computed } from "vue";

export default {
  components: {},
  props: {
    type: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const computedClass = computed(() => {
      const classes = [];
      switch (props.type) {
        case 'danger':
          classes.push('')
          break;
      }
      // Object.keys(props).forEach(key => {
      //   if (props[key]) {
      //     classes.push(props[key])
      //   }
      // })
      // switch (props.type) {
      //   case "danger":
      //     classes.push(
      //       "text-white dark:text-slate-300 energy:text-gray-300 border-transparent"
      //     );
      //     if (props.disabled) {
      //       classes.push("bg-red-400/70");
      //     } else {
      //       classes.push(
      //         "bg-red-600 hover:bg-red-600/80 dark:bg-red-800 dark:hover:bg-red-700/70 energy:bg-red-800 energy:hover:bg-red-700/70"
      //       );
      //     }
      //     break;
      //   default:
      //     classes.push(
      //       "bg-white dark:bg-slate-800 energy:bg-zinc-800 hover:bg-slate-50/80 dark:hover:bg-slate-700/80 energy:hover:bg-zinc-700/80",
      //       "border border-gray-300 dark:border-slate-600 energy:border-zinc-600"
      //     );
      //     if (props.disabled) {
      //       classes.push(
      //         "text-gray-300 dark:text-slate-500 energy:text-zinc-500"
      //       );
      //     }
      // }
      return classes;
    });
    return {
      computedClass,
    };
  },
};
</script>
<style lang="scss" scoped>
/* Empty on Purpose */
</style>
