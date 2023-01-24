<template>
  <div>
    <div v-if="saveState" class="backdrop-blur-sm fixed inset-0 w-full h-full text-lg z-10">
      <div class="flex flex-col items-center absolute bottom-1/2 left-1/2">
        <p class="pb-8">Saving changes...Please wait</p>
        <BaseLoadingSpinner class="h-16 w-16"/>
      </div>
    </div>
    <form>
      <BaseCard class="flex mt-4 p-6">
        <slot />
      </BaseCard>
    </form>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    saveState: {
      default: false,
      type: Boolean,
    },
  },
}
</script>
<style lang="scss"></style>
