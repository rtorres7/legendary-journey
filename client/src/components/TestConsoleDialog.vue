
<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="close">
      <div class="fixed inset-0 z-20 overflow-y-auto w-full">
        <div class="min-h-screen px-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black/25" />
          </TransitionChild>
          <span class="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="
                inline-block
                w-full
                min-w-[300px]
                sm:min-w-[400px]
                max-w-xs
                p-6
                my-8
                text-left
                align-middle
                transition-all
                transform
                text-slate-700
                dark:text-slate-300
                energy:text-gray-300
                bg-slate-100
                dark:bg-slate-700
                energy:bg-gray-700
                shadow-lg
                rounded-lg
              "
            >
              <div class="pt-6">
                <button
                  type="button"
                  class="
                    absolute
                    top-5
                    right-5
                    w-8
                    h-8
                    flex
                    items-center
                    justify-center
                  "
                  tabindex="0"
                  @click="close"
                >
                  <span class="sr-only">Close navigation</span
                  ><XIcon class="h-5 w-5" aria-hidden="true" />
                </button>
                <div class="py-4">
                  <p class="font-medium">Site Options</p>
                  <ul class="py-2 space-y-2">
                    <SwitchGroup>
                      <div class="flex items-center justify-between">
                        <SwitchLabel class="mr-4">Enable Alert</SwitchLabel>
                        <Switch
                          v-model="alertEnabled"
                          :class="
                            alertEnabled
                              ? 'bg-mission-blue dark:bg-dark-navy energy:bg-slate-800'
                              : 'bg-mission-blue/30 dark:bg-dark-navy/30 energy:bg-slate-800/30'
                          "
                          class="
                            relative
                            inline-flex
                            items-center
                            h-6
                            transition-colors
                            rounded-full
                            w-11
                            focus:outline-none
                            focus:ring-2
                            focus:ring-offset-2
                            focus:ring-slate-500
                          "
                        >
                          <span
                            :class="
                              alertEnabled ? 'translate-x-6' : 'translate-x-1'
                            "
                            class="
                              inline-block
                              w-4
                              h-4
                              transition-transform
                              transform
                              bg-white
                              rounded-full
                            "
                          />
                        </Switch>
                      </div>
                    </SwitchGroup>
                    <SwitchGroup>
                      <div class="flex items-center justify-between">
                        <SwitchLabel class="mr-4">Enable Admin</SwitchLabel>
                        <Switch
                          v-model="adminEnabled"
                          :class="
                            adminEnabled
                              ? 'bg-mission-blue dark:bg-dark-navy energy:bg-slate-800'
                              : 'bg-mission-blue/30 dark:bg-dark-navy/30 energy:bg-slate-800/30'
                          "
                          class="
                            relative
                            inline-flex
                            items-center
                            h-6
                            transition-colors
                            rounded-full
                            w-11
                            focus:outline-none
                            focus:ring-2
                            focus:ring-offset-2
                            focus:ring-slate-500
                          "
                        >
                          <span
                            :class="
                              adminEnabled ? 'translate-x-6' : 'translate-x-1'
                            "
                            class="
                              inline-block
                              w-4
                              h-4
                              transition-transform
                              transform
                              bg-white
                              rounded-full
                            "
                          />
                        </Switch>
                      </div>
                    </SwitchGroup>
                    <!-- <SwitchGroup>
                      <div class="flex items-center justify-between">
                        <SwitchLabel class="mr-4"
                          >Enable API 2000ms Delay</SwitchLabel
                        >
                        <Switch
                          v-model="delayEnabled"
                          :class="
                            delayEnabled
                              ? 'bg-mission-blue dark:bg-dark-navy energy:bg-slate-800'
                              : 'bg-mission-blue/30 dark:bg-dark-navy/30 energy:bg-slate-800/30'
                          "
                          class="
                            relative
                            inline-flex
                            items-center
                            h-6
                            transition-colors
                            rounded-full
                            w-11
                            focus:outline-none
                            focus:ring-2
                            focus:ring-offset-2
                            focus:ring-slate-500
                          "
                        >
                          <span
                            :class="
                              delayEnabled ? 'translate-x-6' : 'translate-x-1'
                            "
                            class="
                              inline-block
                              w-4
                              h-4
                              transition-transform
                              transform
                              bg-white
                              rounded-full
                            "
                          />
                        </Switch>
                      </div>
                    </SwitchGroup> -->
                  </ul>
                </div>
                <div
                  class="
                    py-4
                    border-t border-slate-900/10
                    dark:border-slate-50/[0.06]
                    energy:border-gray-700/25
                  "
                  v-show="currentRoute === 'home'"
                >
                  <p class="font-medium">Home Options</p>
                  <div class="py-2">
                    <SwitchGroup>
                      <div class="flex items-center justify-between mt-2">
                        <SwitchLabel class="mr-4"
                          >Enable Loading Articles</SwitchLabel
                        >
                        <Switch
                          v-model="loadingArticlesEnabled"
                          :class="
                            loadingArticlesEnabled
                              ? 'bg-mission-blue dark:bg-dark-navy energy:bg-slate-800'
                              : 'bg-mission-blue/30 dark:bg-dark-navy/30 energy:bg-slate-800/30'
                          "
                          class="
                            relative
                            inline-flex
                            items-center
                            h-6
                            transition-colors
                            rounded-full
                            w-11
                            focus:outline-none
                            focus:ring-2
                            focus:ring-offset-2
                            focus:ring-slate-500
                          "
                        >
                          <span
                            :class="
                              loadingArticlesEnabled
                                ? 'translate-x-6'
                                : 'translate-x-1'
                            "
                            class="
                              inline-block
                              w-4
                              h-4
                              transition-transform
                              transform
                              bg-white
                              rounded-full
                            "
                          />
                        </Switch>
                      </div>
                    </SwitchGroup>
                  </div>
                </div>
                <div
                  class="
                    py-4
                    border-t border-slate-900/10
                    dark:border-slate-50/[0.06]
                    energy:border-gray-700/25
                  "
                  v-show="currentRoute === 'search'"
                >
                  <p class="font-medium">Search Options</p>
                  <div class="py-2">
                    <SwitchGroup>
                      <div class="flex items-center justify-between mt-2">
                        <SwitchLabel class="mr-4"
                          >Enable Loading Search Results</SwitchLabel
                        >
                        <Switch
                          v-model="loadingResultsEnabled"
                          :class="
                            loadingResultsEnabled
                              ? 'bg-mission-blue dark:bg-dark-navy energy:bg-slate-800'
                              : 'bg-mission-blue/30 dark:bg-dark-navy/30 energy:bg-slate-800/30'
                          "
                          class="
                            relative
                            inline-flex
                            items-center
                            h-6
                            transition-colors
                            rounded-full
                            w-11
                            focus:outline-none
                            focus:ring-2
                            focus:ring-offset-2
                            focus:ring-slate-500
                          "
                        >
                          <span
                            :class="
                              loadingResultsEnabled
                                ? 'translate-x-6'
                                : 'translate-x-1'
                            "
                            class="
                              inline-block
                              w-4
                              h-4
                              transition-transform
                              transform
                              bg-white
                              rounded-full
                            "
                          />
                        </Switch>
                      </div>
                    </SwitchGroup>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script>
import { ref, watch, computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import {
  Dialog,
  DialogPanel,
  Switch,
  SwitchGroup,
  SwitchLabel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XIcon } from "@heroicons/vue/outline";

export default {
  components: {
    Dialog,
    DialogPanel,
    Switch,
    SwitchGroup,
    SwitchLabel,
    TransitionChild,
    TransitionRoot,
    XIcon,
  },
  props: {
    isOpen: Boolean,
    alert: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:alert"],
  setup(props, { emit }) {
    const store = useStore();
    const route = useRoute();

    const currentRoute = ref(route.name);

    const close = () => {
      emit("close");
    };

    const alertEnabled = computed({
      get: () => props.alert,
      set: (value) => {
        emit("update:alert", value);
      },
    });

    const loadingArticlesEnabled = ref(false);
    const loadingResultsEnabled = ref(false);
    const adminEnabled = ref(false);
    const delayEnabled = ref(false);

    const loadingArticlesFromStore = computed(
      () => store.state.articles.loading
    );

    const loadingResultsFromStore = computed(() => store.state.search.loading);
    const adminFromStore = computed(() => store.state.admin);
    const delayFromStore = computed(() => store.state.delay);

    watch(
      () => route.name,
      () => {
        currentRoute.value = route.name;
      }
    );

    watch(loadingArticlesEnabled, (enabled) => {
      if (enabled) {
        store.dispatch("articles/removeHomeArticles");
      } else {
        store.dispatch("articles/getHomeArticles");
      }
    });

    watch(loadingResultsEnabled, (enabled) => {
      if (enabled) {
        store.dispatch("search/removeSearch");
      } else {
        store.dispatch("search/search");
      }
    });

    watch(adminEnabled, (enabled) => {
      if (enabled) {
        store.dispatch("addAdmin");
      } else {
        store.dispatch("removeAdmin");
      }
    });

    watch(delayEnabled, (enabled) => {
      if (enabled) {
        store.dispatch("delay");
      } else {
        store.dispatch("removeDelay");
      }
    });

    watch(loadingArticlesFromStore, (loading) => {
      loadingArticlesEnabled.value = loading;
    });

    watch(loadingResultsFromStore, (loading) => {
      loadingResultsEnabled.value = loading;
    });

    watch(adminFromStore, (status) => {
      adminEnabled.value = status;
    });

    watch(delayFromStore, (status) => {
      delayEnabled.value = status;
    });

    return {
      currentRoute,
      close,
      alertEnabled,
      loadingArticlesEnabled,
      loadingResultsEnabled,
      adminEnabled,
      delayEnabled,
    };
  },
};
</script>
<style lang="scss">
/* Empty on Purpose */
</style>
