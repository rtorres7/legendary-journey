<template>
  <section
    :id="`${id}-section`"
    class="flex flex-col space-y-8 pb-8 border-b border-slate-900/10 dark:border-slate-700/50 energy:border-zinc-700/50"
  >
    <div>
      <p class="font-medium text-xl">{{ title }}</p>
      <p
        class="text-slate-600 dark:text-slate-400 energy:text-zinc-400 text-sm"
      >
        {{ description }}
      </p>
    </div>
    <slot />
  </section>
</template>
<script>
export default {
  components: {},
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
  },
  setup() {
    return {};
  },
};
</script>
