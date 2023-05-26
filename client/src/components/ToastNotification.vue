<!-- TODO: Style this better -->
<template>
  <div
    class="relative max-w-[450px] min-h-[4rem] text-slate-900 dark:text-slate-300 energy:text-zinc-300 bg-white dark:bg-slate-700 energy:bg-zinc-700 shadow-lg px-5 py-[1.1rem] transition duration-300 ease-in-out"
    :style="`--toast-duration: ${duration}s`"
  >
    <button
      v-if="canClose"
      class="absolute top-4 right-4 flex items-center justify-center cursor-pointer"
      title="Close"
      @click="close"
    >
      <XMarkIcon class="h-5 w-5" aria-hidden="true" />
    </button>
    <div class="flex gap-4 place-items-center">
      <div
        id="icon-container"
        class="flex items-center h-12 pr-4 border-r border-slate-700/50 energy:border-zinc-700/50"
      >
        <component :is="toastIcon" :class="['h-8 w-8', toastColor]" />
      </div>
      <div class="flex flex-col gap-3">
        <div v-show="title" class="font-semibold">
          <span class="sr-only">New notification from Current</span>
          {{ title }}
        </div>
        <p>
          {{ message }}
        </p>
      </div>
    </div>
    <div
      v-if="autoClose"
      class="animate-progress absolute bottom-0 left-0 w-full h-1.5 bg-blue-500"
    />
  </div>
</template>
<script>
import { computed, onMounted, ref } from "vue";
import {
  CheckCircleIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";

export default {
  components: {
    CheckCircleIcon,
    InformationCircleIcon,
    ExclamationCircleIcon,
    XCircleIcon,
    XMarkIcon,
  },
  props: {
    type: {
      type: String,
      default: "info",
      required: false,
    },
    title: {
      type: String,
      default: null,
      required: false,
    },
    message: {
      type: String,
      default: null,
      required: false,
    },
    autoClose: {
      type: Boolean,
      default: true,
      required: false,
    },
    canClose: {
      type: Boolean,
      default: true,
      required: false,
    },
    duration: {
      type: Number,
      default: 5,
      required: false,
    },
  },
  emits: ["close"],
  setup(props, { emit }) {
    const timer = ref(-1);
    const startedAt = ref(0);
    const delay = ref(0);

    onMounted(() => {
      if (props.autoClose) {
        startedAt.value = Date.now();
        delay.value = props.duration * 1000;
        timer.value = setTimeout(close, delay.value);
      }
    });

    const toastIcon = computed(() => {
      switch (props.type) {
        case "error":
          return "XCircleIcon";
        case "warning":
          return "ExclamationCircleIcon";
        case "success":
          return "CheckCircleIcon";
        default:
          return "InformationCircleIcon";
      }
    });

    const toastColor = computed(() => {
      switch (props.type) {
        case "error":
          return "text-red-500";
        case "warning":
          return "text-yellow-500";
        case "success":
          return "text-green-500";
        default:
          return "text-blue-500";
      }
    });

    const close = () => {
      emit("close");
    };

    return {
      toastIcon,
      toastColor,
      close,
    };
  },
};
</script>
<style lang="scss" scoped>
.animate-progress {
  animation: progress var(--toast-duration) ease-in-out forwards;
}
@keyframes progress {
  to {
    width: 0;
  }
}
</style>
