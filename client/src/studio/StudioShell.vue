<template>
  <div class="h-full flex flex-col md:flex-row">
    <StudioNavigation />
    <div class="flex h-screen grow flex-col overflow-hidden">
      <div class="flex min-h-0 flex-1">
        <div class="flex w-full">
          <div class="relative grow bg-slate-50 text-gray-900">
            <!-- Content Area -->
            <div
              class="top-0 bottom-0 flex flex-col w-full h-full items-center overflow-y-scroll"
            >
              <div
                class="max-w-[475px] sm:max-w-[768px] xl:max-w-[1600px] w-full p-6 md:p-8"
              >
                <router-view />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import StudioNavigation from "@/studio/components/StudioNavigation.vue";
export default {
  components: {
    StudioNavigation,
  },
  setup() {},
};
</script>
<style lang="scss"></style>
