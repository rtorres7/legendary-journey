<template>
  <template v-if="disabled">
    <span
      class="
        relative
        inline-flex
        items-center
        px-4
        py-2
        select-none        
        text-sm
        font-medium
        border
        border-gray-300
        dark:border-slate-300 
        energy:border-gray-300
        dark:border-slate-300/50
        energy:border-gray-300/50         
        bg-slate-50 
        dark:bg-slate-900 
        energy:bg-gray-900 
        text-gray-300 
        dark:text-slate-500 
        energy:text-gray-500
      "
    >
      <slot />
    </span>
  </template>

  <template v-else>
    <a
      class="
        relative
        inline-flex
        items-center
        px-4
        py-2
        cursor-pointer
        select-none        
        text-sm
        font-medium
        border 
        border-gray-400
        dark:border-slate-300/50
        energy:border-gray-300/50
        bg-white
        dark:bg-slate-800
        energy:bg-gray-800
        hover:bg-gray-50
        dark:hover:bg-slate-900/70
        energy:hover:bg-gray-900/70
        text-gray-500
        dark:text-slate-300
        energy:text-gray-300  
      "
    >
      <slot />
    </a>
  </template>
</template>

<script>
export default {
  components: {},
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  setup() {
    return {};
  },
};
</script>

<style scoped lang="scss"></style>
