<template>
  <BaseCard class="h-36 px-4 py-4" hoverable :rounded="false">
    <template v-if="loading"> Loading Card... </template>
    <template v-else>
      <div class="flex flex-col h-full justify-between">
        <div>
          <div class="flex items-center text-sm mb-2">
            <span class="line-clamp-2">{{ item.product_type_name }}</span>
          </div>
          <div class="line-clamp-2 font-medium">
            {{ item.title }}
          </div>
        </div>
        <div
          class="text-slate-600 dark:text-slate-400 energy:text-zinc-400 text-sm"
        >
          Posted {{ item.date_published }}
        </div>
      </div>
    </template>
  </BaseCard>
</template>

<script>
export default {
  props: {
    sitrep: {
      type: Object,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
// Empty on Purpose
</style>
