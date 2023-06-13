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
              class="inline-block w-full min-w-[300px] sm:min-w-[400px] lg:min-w-[500px] max-w-xs p-6 my-8 text-left text-sm md:text-base align-middle transition-all transform text-slate-900 dark:text-slate-300 energy:text-zinc-300 bg-white dark:bg-slate-800 energy:bg-zinc-800 shadow-lg rounded-lg"
            >
              <div class="pt-6">
                <button
                  type="button"
                  class="absolute top-5 right-5 w-8 h-8 flex items-center justify-center"
                  tabindex="0"
                  @click="close"
                >
                  <span class="sr-only">Close navigation</span>
                  <XMarkIcon class="h-5 w-5" aria-hidden="true" />
                </button>
                <div class="py-4">
                  <p class="font-medium">Access Control</p>
                  <ul class="py-2 space-y-2">
                    <template
                      v-for="(authorization, index) in Object.keys(
                        userAuthorizations
                      )"
                      :key="index"
                    >
                      <SwitchGroup>
                        <div class="flex items-center justify-between">
                          <SwitchLabel class="mr-4">{{
                            authorization
                          }}</SwitchLabel>
                          <Switch
                            v-model="userAuthorizations[authorization]"
                            :class="
                              userAuthorizations[authorization]
                                ? 'bg-mission-blue dark:bg-slate-400 energy:bg-zinc-400'
                                : 'bg-mission-blue/30 dark:bg-slate-600 energy:bg-zinc-600'
                            "
                            class="relative inline-flex items-center h-6 transition-colors rounded-full w-11 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                          >
                            <span
                              :class="
                                userAuthorizations[authorization]
                                  ? 'translate-x-6'
                                  : 'translate-x-1'
                              "
                              class="inline-block w-4 h-4 transition-transform transform bg-white rounded-full"
                            />
                          </Switch>
                        </div>
                      </SwitchGroup>
                    </template>
                  </ul>
                </div>
                <div
                  class="py-4 border-t border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-500/50"
                >
                  <p class="font-medium">Site Options</p>
                  <ul class="py-2 space-y-2">
                    <SwitchGroup>
                      <div class="flex items-center justify-between">
                        <SwitchLabel class="mr-4"> Enable Alert </SwitchLabel>
                        <Switch
                          v-model="alertEnabled"
                          :class="
                            alertEnabled
                              ? 'bg-mission-blue dark:bg-slate-400 energy:bg-zinc-400'
                              : 'bg-mission-blue/30 dark:bg-slate-600 energy:bg-zinc-600'
                          "
                          class="relative inline-flex items-center h-6 transition-colors rounded-full w-11 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                        >
                          <span
                            :class="
                              alertEnabled ? 'translate-x-6' : 'translate-x-1'
                            "
                            class="inline-block w-4 h-4 transition-transform transform bg-white rounded-full"
                          />
                        </Switch>
                      </div>
                    </SwitchGroup>
                    <SwitchGroup>
                      <div class="flex items-center justify-between">
                        <SwitchLabel class="mr-4">
                          Enable Loading Metadata
                        </SwitchLabel>
                        <Switch
                          v-model="loadingMetadataEnabled"
                          :class="
                            loadingMetadataEnabled
                              ? 'bg-mission-blue dark:bg-slate-400 energy:bg-zinc-400'
                              : 'bg-mission-blue/30 dark:bg-slate-600 energy:bg-zinc-600'
                          "
                          class="relative inline-flex items-center h-6 transition-colors rounded-full w-11 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                        >
                          <span
                            :class="
                              loadingMetadataEnabled
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
                        <SwitchLabel class="mr-4">
                          Toggle Sample Product Image
                        </SwitchLabel>
                        <Switch
                          v-model="sampleImageEnabled"
                          :class="
                            sampleImageEnabled
                              ? 'bg-mission-blue dark:bg-slate-400 energy:bg-zinc-400'
                              : 'bg-mission-blue/30 dark:bg-slate-600 energy:bg-zinc-600'
                          "
                          class="relative inline-flex items-center h-6 transition-colors rounded-full w-11 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                        >
                          <span
                            :class="
                              sampleImageEnabled
                                ? 'translate-x-6'
                                : 'translate-x-1'
                            "
                            class="inline-block w-4 h-4 transition-transform transform bg-white rounded-full"
                          />
                        </Switch>
                      </div>
                    </SwitchGroup>
                    <div class="flex items-center justify-between">
                      <label id="product-input" class="mr-4"
                        >Upload Your Own Product Image</label
                      >
                      <div
                        class="rounded shadow-md text-xs md:text-sm bg-mission-blue/30 dark:bg-slate-600 energy:bg-zinc-600"
                      >
                        <label
                          for="image-input"
                          class="relative cursor-pointer focus-within:ring-2 font-medium"
                        >
                          <div
                            class="px-2 md:px-4 py-2 text-white dark:text-slate-300 energy:text-zinc-300"
                          >
                            Choose File
                          </div>
                          <input
                            id="image-input"
                            name="image-input"
                            type="file"
                            class="sr-only"
                            accept="image/jpeg, image/png, image/jpg"
                            @change="changeProductImage"
                          />
                        </label>
                      </div>
                    </div>
                    <div
                      v-show="uploadFileName"
                      class="flex flex-row-reverse items-center text-sm"
                    >
                      <button
                        type="button"
                        class="w-8 h-8 flex items-center justify-center"
                        tabindex="0"
                        @click="removeProductImage"
                      >
                        <span class="sr-only">Remove Current Image</span>
                        <XMarkIcon class="h-5 w-5" aria-hidden="true" />
                      </button>
                      <div class="line-clamp-1">
                        <span class="font-medium">Current File: </span
                        ><span
                          class="ml-1 text-slate-900 dark:text-slate-400 energy:text-zinc-400"
                          >{{ uploadFileName }}</span
                        >
                      </div>
                    </div>
                    <div class="flex items-center justify-between">
                      <label id="toast-toggle" class="mr-4"
                        >Notification Toast</label
                      >
                      <button
                        class="rounded shadow-md text-xs md:text-sm px-2 md:px-4 py-2 focus-within:ring-2 font-medium text-white dark:text-slate-300 energy:text-zinc-300 bg-mission-blue/30 dark:bg-slate-600 energy:bg-zinc-600"
                        @click="toggleNotificationToast"
                      >
                        Toggle
                      </button>
                    </div>
                  </ul>
                </div>
                <div
                  v-show="currentRoute === 'home'"
                  class="py-4 border-t border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-500/50"
                >
                  <p class="font-medium">Home Options</p>
                  <div class="py-2">
                    <div class="flex items-center justify-between mt-2">
                      <label id="product-counter" class="mr-4"
                        >Published Products (max. 5)</label
                      >
                      <div
                        class="inline-flex items-center rounded shadow-md bg-mission-blue/30 dark:bg-slate-600 energy:bg-zinc-600"
                      >
                        <button
                          class="rounded-l px-4 py-2 text-sm font-medium hover:bg-mission-blue/70 dark:hover:bg-slate-500 energy:hover:bg-zinc-500 text-gray-100 dark:text-slate-300 energy:text-zinc-300"
                          @click="
                            changePublishedProductCount(
                              publishedProductCountFromStore - 1
                            )
                          "
                        >
                          -
                        </button>
                        <div
                          class="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-slate-700 energy:bg-zinc-700"
                        >
                          {{ publishedProductCountFromStore }}
                        </div>
                        <button
                          class="rounded-r px-4 py-2 text-sm font-medium hover:bg-mission-blue/70 dark:hover:bg-slate-500 energy:hover:bg-zinc-500 text-gray-100 dark:text-slate-300 energy:text-zinc-300"
                          @click="
                            changePublishedProductCount(
                              publishedProductCountFromStore + 1
                            )
                          "
                        >
                          +
                        </button>
                      </div>
                    </div>
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
                        <SwitchLabel class="mr-4">
                          Enable Loading Situational Awareness
                        </SwitchLabel>
                        <Switch
                          v-model="loadingSituationalAwarenessEnabled"
                          :class="
                            loadingSituationalAwarenessEnabled
                              ? 'bg-mission-blue dark:bg-slate-400 energy:bg-zinc-400'
                              : 'bg-mission-blue/30 dark:bg-slate-600 energy:bg-zinc-600'
                          "
                          class="relative inline-flex items-center h-6 transition-colors rounded-full w-11 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                        >
                          <span
                            :class="
                              loadingSituationalAwarenessEnabled
                                ? 'translate-x-6'
                                : 'translate-x-1'
                            "
                            class="inline-block w-4 h-4 transition-transform transform bg-white rounded-full"
                          />
                        </Switch>
                      </div>
                    </SwitchGroup>
                  </div>
                </div>
                <div
                  v-show="
                    currentRoute === 'search' ||
                    currentRoute === 'countries' ||
                    currentRoute === 'regions' ||
                    currentRoute === 'subregions'
                  "
                  class="py-4 border-t border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-500/50"
                >
                  <p class="font-medium">Search Options</p>
                  <div class="py-2">
                    <SwitchGroup>
                      <div class="flex items-center justify-between mt-2">
                        <SwitchLabel class="mr-4">
                          Enable Loading Search Results
                        </SwitchLabel>
                        <Switch
                          v-model="loadingResultsEnabled"
                          :class="
                            loadingResultsEnabled
                              ? 'bg-mission-blue dark:bg-slate-400 energy:bg-zinc-400'
                              : 'bg-mission-blue/30 dark:bg-slate-600 energy:bg-zinc-600'
                          "
                          class="relative inline-flex items-center h-6 transition-colors rounded-full w-11 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
                        >
                          <span
                            :class="
                              loadingResultsEnabled
                                ? 'translate-x-6'
                                : 'translate-x-1'
                            "
                            class="inline-block w-4 h-4 transition-transform transform bg-white rounded-full"
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
import { inject, ref, watch, computed } from "vue";
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
import { XMarkIcon } from "@heroicons/vue/24/outline";

export default {
  components: {
    Dialog,
    DialogPanel,
    Switch,
    SwitchGroup,
    SwitchLabel,
    TransitionChild,
    TransitionRoot,
    XMarkIcon,
  },
  props: {
    isOpen: Boolean,
    alert: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:alert", "close"],
  setup(props, { emit }) {
    const store = useStore();
    const route = useRoute();
    const createNotification = inject("create-notification");

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

    const loadingMetadataEnabled = ref(false);
    const loadingHomeProductsEnabled = ref(false);
    const loadingResultsEnabled = ref(false);
    const loadingPublishedProductsEnabled = ref(false);
    const sampleImageEnabled = ref(false);
    const uploadFileName = ref(null);
    const adminEnabled = ref(false);

    const userAuthorizations = computed(
      () => store.getters["user/authorizations"]
    );
    const loadingMetadataFromStore = computed(
      () => store.state.metadata.loading
    );
    const loadingHomeProductsFromStore = computed(
      () => store.state.features.loading
    );
    const loadingResultsFromStore = computed(() => store.state.search.loading);
    const publishedProductCountFromStore = computed(
      () => store.state.features.products.length
    );
    const loadingPublishedProductsFromStore = computed(
      () => store.state.features.loading
    );
    const adminFromStore = computed(() => store.state.testConsole.admin);
    const sampleImageFromStore = computed(
      () => store.state.testConsole.sampleImage
    );

    watch(
      () => route.name,
      () => {
        currentRoute.value = route.name;
      }
    );

    watch(loadingMetadataEnabled, (enabled) => {
      if (enabled) {
        store.dispatch("metadata/removeMetadata");
      } else {
        store.dispatch("metadata/loadMetadata");
      }
    });

    watch(loadingHomeProductsEnabled, (enabled) => {
      console.log("loadingHomeProductsEnabled: ", enabled);
      if (enabled) {
        store.dispatch("features/setLoading", true);
      } else {
        store.dispatch("features/setLoading", false);
      }
    });

    watch(loadingResultsEnabled, (enabled) => {
      store.dispatch("search/setLoading", enabled);
    });

    const removeProductImage = () => {
      store.dispatch("testConsole/setUploadBinary", null);
      uploadFileName.value = null;
    };

    const changeProductImage = (event) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        store.dispatch("testConsole/setUploadBinary", reader.result);
      });
      uploadFileName.value = event.target.files[0].name;
      reader.readAsDataURL(event.target.files[0]);
      event.target.value = null;
    };

    const toggleNotificationToast = () => {
      createNotification({
        title: "Notification Toast",
        message: `Your toast message goes here.`,
        type: "success",
      });
    };

    const changePublishedProductCount = (count) => {
      store.dispatch("features/setProducts", count);
    };

    watch(loadingPublishedProductsEnabled, (enabled) => {
      store.dispatch("features/setLoading", enabled);
    });

    watch(adminEnabled, (enabled) => {
      store.dispatch("testConsole/setAdmin", enabled);
    });

    watch(sampleImageEnabled, (enabled) => {
      store.dispatch("testConsole/setSampleImage", enabled);
    });

    watch(loadingMetadataFromStore, (loading) => {
      loadingMetadataEnabled.value = loading;
    });

    watch(loadingHomeProductsFromStore, (loading) => {
      loadingHomeProductsEnabled.value = loading;
    });

    watch(loadingResultsFromStore, (loading) => {
      console.log("loading results from store triggered: ", loading);
      loadingResultsEnabled.value = loading;
    });

    watch(loadingPublishedProductsFromStore, (loading) => {
      loadingPublishedProductsEnabled.value = loading;
    });

    watch(adminFromStore, (status) => {
      adminEnabled.value = status;
    });

    watch(sampleImageFromStore, (value) => {
      sampleImageEnabled.value = value;
    });

    return {
      currentRoute,
      close,
      alertEnabled,
      userAuthorizations,
      loadingMetadataEnabled,
      loadingHomeProductsEnabled,
      loadingResultsEnabled,
      publishedProductCountFromStore,
      loadingPublishedProductsEnabled,
      removeProductImage,
      changeProductImage,
      toggleNotificationToast,
      changePublishedProductCount,
      uploadFileName,
      adminEnabled,
      sampleImageEnabled,
    };
  },
};
</script>
<style lang="scss">
/* Empty on Purpose */
</style>
