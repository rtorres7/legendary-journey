<template>
  <div>
    <p class="font-medium">Dashboard Options</p>
    <ul class="py-2 space-y-2">
      <SwitchGroup>
        <div class="flex items-center justify-between mt-2">
          <SwitchLabel class="mr-4">
            Enable Loading Saved Products
          </SwitchLabel>
          <Switch
            v-model="loadingSavedProductsEnabled"
            :class="
              loadingSavedProductsEnabled
                ? 'bg-mission-blue dark:bg-slate-400 energy:bg-zinc-400'
                : 'bg-mission-blue/30 dark:bg-slate-600 energy:bg-zinc-600'
            "
            class="relative inline-flex items-center h-6 transition-colors rounded-full w-11 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
          >
            <span
              :class="
                loadingSavedProductsEnabled ? 'translate-x-6' : 'translate-x-1'
              "
              class="inline-block w-4 h-4 transition-transform transform bg-white rounded-full"
            />
          </Switch>
        </div>
      </SwitchGroup>
      <SwitchGroup>
        <div class="flex items-center justify-between mt-2">
          <SwitchLabel class="mr-4">
            Enable Loading Draft Products
          </SwitchLabel>
          <Switch
            v-model="loadingDraftProductsEnabled"
            :class="
              loadingDraftProductsEnabled
                ? 'bg-mission-blue dark:bg-slate-400 energy:bg-zinc-400'
                : 'bg-mission-blue/30 dark:bg-slate-600 energy:bg-zinc-600'
            "
            class="relative inline-flex items-center h-6 transition-colors rounded-full w-11 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
          >
            <span
              :class="
                loadingDraftProductsEnabled ? 'translate-x-6' : 'translate-x-1'
              "
              class="inline-block w-4 h-4 transition-transform transform bg-white rounded-full"
            />
          </Switch>
        </div>
      </SwitchGroup>
      <SwitchGroup>
        <div class="flex items-center justify-between mt-2">
          <SwitchLabel class="mr-4">
            Enable Loading Published Products
          </SwitchLabel>
          <Switch
            v-model="loadingPublishedProductsEnabled"
            :class="
              loadingPublishedProductsEnabled
                ? 'bg-mission-blue dark:bg-slate-400 energy:bg-zinc-400'
                : 'bg-mission-blue/30 dark:bg-slate-600 energy:bg-zinc-600'
            "
            class="relative inline-flex items-center h-6 transition-colors rounded-full w-11 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
          >
            <span
              :class="
                loadingPublishedProductsEnabled
                  ? 'translate-x-6'
                  : 'translate-x-1'
              "
              class="inline-block w-4 h-4 transition-transform transform bg-white rounded-full"
            />
          </Switch>
        </div>
      </SwitchGroup>
      <SwitchGroup>
        <div class="flex items-center justify-between mt-2">
          <SwitchLabel class="mr-4"> Enable Loading Stats </SwitchLabel>
          <Switch
            v-model="loadingStatsEnabled"
            :class="
              loadingStatsEnabled
                ? 'bg-mission-blue dark:bg-slate-400 energy:bg-zinc-400'
                : 'bg-mission-blue/30 dark:bg-slate-600 energy:bg-zinc-600'
            "
            class="relative inline-flex items-center h-6 transition-colors rounded-full w-11 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
          >
            <span
              :class="loadingStatsEnabled ? 'translate-x-6' : 'translate-x-1'"
              class="inline-block w-4 h-4 transition-transform transform bg-white rounded-full"
            />
          </Switch>
        </div>
      </SwitchGroup>
    </ul>
  </div>
</template>

<script>
import { ref, watch, computed } from "vue";
import { useStore } from "vuex";
import { Switch, SwitchGroup, SwitchLabel } from "@headlessui/vue";

export default {
  components: {
    Switch,
    SwitchGroup,
    SwitchLabel,
  },
  props: {
    isOpen: Boolean,
    alert: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const store = useStore();

    const loadingSavedProductsEnabled = ref(false);
    const loadingDraftProductsEnabled = ref(false);
    const loadingPublishedProductsEnabled = ref(false);
    const loadingStatsEnabled = ref(false);

    const loadingSavedProductsFromStore = computed(
      () => store.state.workspace.saved.loading
    );
    const loadingDraftProductsFromStore = computed(
      () => store.state.workspace.drafts.loading
    );
    const loadingPublishedProductsFromStore = computed(
      () => store.state.workspace.published.loading
    );
    const loadingStatsFromStore = computed(
      () => store.state.workspace.stats.loading
    );

    watch(loadingSavedProductsEnabled, (enabled) => {
      store.dispatch("workspace/setSavedLoading", enabled);
    });
    watch(loadingDraftProductsEnabled, (enabled) => {
      store.dispatch("workspace/setDraftsLoading", enabled);
    });
    watch(loadingPublishedProductsEnabled, (enabled) => {
      store.dispatch("workspace/setPublishedLoading", enabled);
    });
    watch(loadingStatsEnabled, (enabled) => {
      store.dispatch("workspace/setStatsLoading", enabled);
    });

    watch(loadingSavedProductsFromStore, (loading) => {
      loadingSavedProductsEnabled.value = loading;
    });
    watch(loadingDraftProductsFromStore, (loading) => {
      loadingDraftProductsEnabled.value = loading;
    });
    watch(loadingPublishedProductsFromStore, (loading) => {
      loadingPublishedProductsEnabled.value = loading;
    });
    watch(loadingStatsFromStore, (loading) => {
      loadingStatsEnabled.value = loading;
    });

    return {
      loadingSavedProductsEnabled,
      loadingDraftProductsEnabled,
      loadingPublishedProductsEnabled,
      loadingStatsEnabled,
    };
  },
};
</script>
<style lang="scss">
/* Empty on Purpose */
</style>
