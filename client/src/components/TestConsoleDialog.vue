
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
                lg:min-w-[500px]
                max-w-xs
                p-6
                my-8
                text-left text-sm
                md:text-base
                align-middle
                transition-all
                transform
                text-slate-700
                dark:text-slate-300
                energy:text-zinc-300
                bg-slate-100
                dark:bg-slate-700
                energy:bg-zinc-700
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
                    <SwitchGroup>
                      <div class="flex items-center justify-between mt-2">
                        <SwitchLabel class="mr-4"
                          >Toggle Sample Article Image</SwitchLabel
                        >
                        <Switch
                          v-model="sampleImageEnabled"
                          :class="
                            sampleImageEnabled
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
                              sampleImageEnabled
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
                    <div class="flex items-center justify-between">
                      <label id="article-counter" class="mr-4"
                        >Upload Your Own Article Image</label
                      >
                      <div
                        class="
                          rounded
                          shadow-md
                          text-xs
                          md:text-sm
                          bg-mission-blue/30
                          dark:bg-dark-navy/30
                          energy:bg-zinc-900/30
                        "
                      >
                        <label
                          for="image-input"
                          class="
                            relative
                            cursor-pointer
                            focus-within:ring-2
                            font-medium
                          "
                        >
                          <div
                            class="
                              px-2
                              md:px-4
                              py-2
                              text-white
                              dark:text-slate-300
                              energy:text-zinc-300
                            "
                          >
                            Choose File
                          </div>
                          <input
                            id="image-input"
                            name="image-input"
                            type="file"
                            class="sr-only"
                            accept="image/jpeg, image/png, image/jpg"
                            @change="changeArticleImage"
                          />
                        </label>
                      </div>
                    </div>
                    <div
                      v-show="uploadFileName"
                      class="flex flex-row-reverse text-sm"
                    >
                      <div class="line-clamp-1">
                        <span class="font-medium">Current File: </span
                        ><span
                          class="
                            ml-1
                            text-slate-900
                            dark:text-slate-400
                            energy:text-zinc-400
                          "
                          >{{ uploadFileName }}</span
                        >
                      </div>
                    </div>
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
                    energy:border-zinc-500/50
                  "
                  v-show="currentRoute === 'home'"
                >
                  <p class="font-medium">Home Options</p>
                  <div class="py-2">
                    <div class="flex items-center justify-between mt-2">
                      <label id="article-counter" class="mr-4"
                        >Published Articles (max. 5)</label
                      >
                      <div
                        class="
                          inline-flex
                          items-center
                          rounded
                          shadow-md
                          bg-mission-blue/30
                          dark:bg-dark-navy/30
                          energy:bg-zinc-900/30
                        "
                      >
                        <button
                          @click="
                            changePublishedArticleCount(
                              publishedArticleCountFromStore - 1
                            )
                          "
                          class="
                            rounded-l
                            px-4
                            py-2
                            text-sm
                            font-medium
                            hover:bg-mission-blue/70
                            dark:hover:bg-slate-900/70
                            energy:hover:bg-zinc-900/50
                            text-gray-100
                            dark:text-slate-300
                            energy:text-zinc-300
                          "
                        >
                          -
                        </button>
                        <div
                          class="
                            px-4
                            py-2
                            text-sm
                            font-medium
                            bg-gray-100
                            dark:bg-slate-700
                            energy:bg-zinc-700
                          "
                        >
                          {{ publishedArticleCountFromStore }}
                        </div>
                        <button
                          @click="
                            changePublishedArticleCount(
                              publishedArticleCountFromStore + 1
                            )
                          "
                          class="
                            rounded-r
                            px-4
                            py-2
                            text-sm
                            font-medium
                            hover:bg-mission-blue/70
                            dark:hover:bg-slate-900/70
                            energy:hover:bg-zinc-900/50
                            text-gray-100
                            dark:text-slate-300
                            energy:text-zinc-300
                          "
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div class="flex items-center justify-between mt-2">
                      <label id="article-counter" class="mr-4"
                        >Open Source Feeds (max. 4)</label
                      >
                      <div
                        class="
                          inline-flex
                          items-center
                          rounded
                          shadow-md
                          bg-mission-blue/30
                          dark:bg-dark-navy/30
                          energy:bg-zinc-900/30
                        "
                      >
                        <button
                          @click="changeFeedCount(feedCountFromStore - 1)"
                          class="
                            rounded-l
                            px-4
                            py-2
                            text-sm
                            font-medium
                            hover:bg-mission-blue/70
                            dark:hover:bg-slate-900/70
                            energy:hover:bg-zinc-900/50
                            text-gray-100
                            dark:text-slate-300
                            energy:text-zinc-300
                          "
                        >
                          -
                        </button>
                        <div
                          class="
                            px-4
                            py-2
                            text-sm
                            font-medium
                            bg-gray-100
                            dark:bg-slate-700
                            energy:bg-zinc-700
                          "
                        >
                          {{ feedCountFromStore }}
                        </div>
                        <button
                          @click="changeFeedCount(feedCountFromStore + 1)"
                          class="
                            rounded-r
                            px-4
                            py-2
                            text-sm
                            font-medium
                            hover:bg-mission-blue/70
                            dark:hover:bg-slate-900/70
                            energy:hover:bg-zinc-900/50
                            text-gray-100
                            dark:text-slate-300
                            energy:text-zinc-300
                          "
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <SwitchGroup>
                      <div class="flex items-center justify-between mt-2">
                        <SwitchLabel class="mr-4"
                          >Enable Loading Published Articles</SwitchLabel
                        >
                        <Switch
                          v-model="loadingPublishedArticlesEnabled"
                          :class="
                            loadingPublishedArticlesEnabled
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
                              loadingPublishedArticlesEnabled
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
                    <SwitchGroup>
                      <div class="flex items-center justify-between mt-2">
                        <SwitchLabel class="mr-4"
                          >Enable Loading Open Source Feeds</SwitchLabel
                        >
                        <Switch
                          v-model="loadingOseFeedsEnabled"
                          :class="
                            loadingOseFeedsEnabled
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
                              loadingOseFeedsEnabled
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
                    <SwitchGroup>
                      <div class="flex items-center justify-between mt-2">
                        <SwitchLabel class="mr-4"
                          >Enable Loading Demo Articles</SwitchLabel
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
                <!-- <div
                  class="
                    py-4
                    border-t border-slate-900/10
                    dark:border-slate-50/[0.06]
                    energy:border-zinc-500/50
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
                </div> -->
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
    const loadingPublishedArticlesEnabled = ref(false);
    const loadingOseFeedsEnabled = ref(false);
    const sampleImageEnabled = ref(false);
    const uploadFileName = ref(null);
    const adminEnabled = ref(false);

    const loadingArticlesFromStore = computed(
      () => store.state.articles.loading
    );
    const loadingResultsFromStore = computed(() => store.state.search.loading);
    const publishedArticleCountFromStore = computed(
      () => store.state.daniel.articles.length
    );
    const loadingPublishedArticlesFromStore = computed(
      () => store.state.daniel.loading
    );
    const loadingOseFeedsFromStore = computed(() => store.state.feeds.loading);
    const feedCountFromStore = computed(() => store.state.feeds.results.length);
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

    const changeArticleImage = (event) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        store.dispatch("testConsole/setUploadBinary", reader.result);
      });
      uploadFileName.value = event.target.files[0].name;
      reader.readAsDataURL(event.target.files[0]);
    };

    const changePublishedArticleCount = (count) => {
      store.dispatch("daniel/setDanielArticles", count);
    };

    const changeFeedCount = (count) => {
      store.dispatch("feeds/setFeeds", count);
    };

    watch(loadingPublishedArticlesEnabled, (enabled) => {
      store.dispatch("daniel/setLoading", enabled);
    });

    watch(loadingOseFeedsEnabled, (enabled) => {
      store.dispatch("feeds/setLoading", enabled);
    });

    watch(adminEnabled, (enabled) => {
      store.dispatch("testConsole/setAdmin", enabled);
    });

    watch(sampleImageEnabled, (enabled) => {
      store.dispatch("testConsole/setSampleImage", enabled);
    });

    watch(loadingArticlesFromStore, (loading) => {
      loadingArticlesEnabled.value = loading;
    });

    watch(loadingResultsFromStore, (loading) => {
      loadingResultsEnabled.value = loading;
    });

    watch(loadingPublishedArticlesFromStore, (loading) => {
      loadingPublishedArticlesEnabled.value = loading;
    });

    watch(loadingOseFeedsFromStore, (loading) => {
      loadingOseFeedsEnabled.value = loading;
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
      loadingArticlesEnabled,
      loadingResultsEnabled,
      publishedArticleCountFromStore,
      loadingPublishedArticlesEnabled,
      changeArticleImage,
      changePublishedArticleCount,
      feedCountFromStore,
      loadingOseFeedsEnabled,
      changeFeedCount,
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
