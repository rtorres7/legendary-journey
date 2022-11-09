<template>
  <div
    class="
      py-4
      border-b-2 border-slate-900/10
      dark:border-slate-50/[0.06]
      energy:border-zinc-700/50
    "
  >
    <template v-if="loadingSpecialEdition">
      <div
        class="
          h-[32px]
          w-64
          animate-pulse
          bg-white
          dark:bg-slate-800/50
          energy:bg-zinc-800
          rounded
        "
      ></div>
    </template>
    <template v-else>
      <p class="font-semibold text-2xl">
        {{ specialEdition.name }}
      </p>
    </template>
  </div>
  <div class="flex justify-end py-1 my-2">
    <div class="flex space-x-3">
      <template v-if="loadingSpecialEdition">
        <div
          class="
            h-[38px]
            w-40
            animate-pulse
            bg-white
            dark:bg-slate-800/50
            energy:bg-zinc-800
            rounded
          "
        ></div>
      </template>
      <template v-else>
        <BaseButton @click.prevent="openDeleteModal" type="danger"
          >Delete</BaseButton
        >
        <BaseButton @click.prevent="openEditModal">Edit</BaseButton>
      </template>
    </div>
  </div>
  <div class="flex flex-col lg:flex-row py-4">
    <div
      class="
        basis-2/3
        lg:pr-4 lg:border-r
        pb-4
        lg:pb-0
        border-b
        lg:border-b-0
        border-slate-900/10
        dark:border-slate-50/[0.06]
        energy:border-zinc-700/25
      "
    >
      <div class="pb-4 flex justify-center">
        <template v-if="loadingSpecialEdition">
          <div
            class="
              h-[38px]
              w-56
              animate-pulse
              bg-white
              dark:bg-slate-800/50
              energy:bg-zinc-800
              rounded
            "
          ></div>
        </template>
        <template v-else>
          <Pagination
            :currentPage="currentPage"
            :pages="specialEdition.totalPages"
          />
        </template>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <template v-if="loadingSpecialEdition">
          <template v-for="n in 6" :key="n">
            <div
              class="
                h-[200px]
                animate-pulse
                bg-white
                dark:bg-slate-800/50
                energy:bg-zinc-800
                rounded
              "
            ></div>
          </template>
        </template>
        <template v-else>
          <template
            v-for="article in specialEdition.articles"
            :key="article.id"
          >
            <BaseCard class="h-full" hoverable :rounded="false">
              <ArticleCard :article="article" />
            </BaseCard>
          </template>
        </template>
      </div>
      <template v-if="!loadingSpecialEdition">
        <template
          v-if="
            specialEdition.restrictedArticles &&
            specialEdition.restrictedArticles.length > 0
          "
        >
          <p class="font-medium text-lg py-4">Need More Access to View</p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <template
              v-for="article in specialEdition.restrictedArticles"
              :key="article.id"
            >
              <BaseCard class="h-full" hoverable :rounded="false">
                <ArticleCard :article="article" />
              </BaseCard>
            </template>
          </div>
        </template>
      </template>
    </div>
    <div class="basis-1/3 pl-0 lg:pl-4 pt-4 lg:pt-0">
      <div class="flex flex-col space-y-3">
        <div
          class="
            border-b border-slate-900/10
            dark:border-slate-50/[0.06]
            energy:border-zinc-700/25
            pb-4
          "
        >
          <template v-if="loadingSpecialEdition">
            <div
              class="
                h-[28px]
                w-40
                mb-4
                animate-pulse
                bg-white
                dark:bg-slate-800/50
                energy:bg-zinc-800
                rounded
              "
            ></div>
          </template>
          <template v-else>
            <p class="font-medium text-lg pb-4">Selected Readings</p>
          </template>
          <div class="flex flex-col space-y-3">
            <template v-if="loadingSpecialEdition">
              <div
                class="
                  h-[200px]
                  animate-pulse
                  bg-white
                  dark:bg-slate-800/50
                  energy:bg-zinc-800
                  rounded
                "
              ></div>
            </template>
            <template v-else>
              <template
                v-for="reading in specialEdition.readings"
                :key="reading.id"
              >
                <router-link
                  :to="{
                    name: 'article',
                    params: { doc_num: reading.doc_num },
                  }"
                  class="hover:underline"
                >
                  {{ `(${reading.title_classification}) ${reading.title}` }}
                </router-link>
              </template>
            </template>
          </div>
        </div>
        <template v-if="loadingSpecialEdition">
          <div
            class="
              h-[415px]
              animate-pulse
              bg-white
              dark:bg-slate-800/50
              energy:bg-zinc-800
              rounded
            "
          ></div>
        </template>
        <template v-else>
          <div
            v-if="
              specialEdition.reporting && specialEdition.reporting.length > 0
            "
          >
            <p class="font-medium text-lg pb-2">Reporting</p>
            <template
              v-for="(report, index) in specialEdition.reporting"
              :key="index"
            >
              <template v-if="report.docs && report.docs.length > 0">
                <div
                  class="
                    border-b border-slate-900/10
                    dark:border-slate-50/[0.06]
                    energy:border-zinc-700/50
                    last:border-none
                  "
                >
                  <Disclosure v-slot="{ open }" defaultOpen>
                    <DisclosureButton class="py-4 w-full">
                      <div class="flex justify-between items-center">
                        <span
                          class="
                            text-mission-light-blue
                            dark:text-teal-400
                            energy:text-energy-yellow
                            mr-2
                            inline-block
                          "
                        >
                          {{ report.type }}
                        </span>
                        <ChevronUpIcon
                          :class="open ? '' : 'rotate-180 transform'"
                          class="
                            text-mission-light-blue
                            dark:text-teal-400
                            energy:text-energy-yellow
                            h-5
                            w-5
                            inline-block
                          "
                        />
                      </div>
                    </DisclosureButton>
                    <transition
                      enter-active-class="transition duration-100 ease-out"
                      enter-from-class="transform scale-95 opacity-0"
                      enter-to-class="transform scale-100 opacity-100"
                      leave-active-class="transition duration-75 ease-out"
                      leave-from-class="transform scale-100 opacity-100"
                      leave-to-class="transform scale-95 opacity-0"
                    >
                      <DisclosurePanel class="pb-4">
                        <div class="flex flex-col space-y-3">
                          <template
                            v-for="article in report.docs"
                            :key="article.id"
                          >
                            <router-link
                              :to="{
                                name: 'article',
                                params: { doc_num: article.doc_num },
                              }"
                              class="hover:underline text-md lg:text-sm"
                            >
                              {{
                                `(${article.title_classification}) ${article.title}`
                              }}
                            </router-link>
                          </template>
                        </div>
                      </DisclosurePanel>
                    </transition>
                  </Disclosure>
                </div>
              </template>
            </template>
          </div>
        </template>
      </div>
    </div>
  </div>
  <template v-if="!loadingSpecialEdition">
    <SpecialEditionCreateEditModal
      editMode
      :edition="specialEdition"
      :isOpen="isEditModalOpen"
      @close="closeEditModal"
      @specialEditionUpdated="reloadSpecialEdition"
    />
    <SpecialEditionConfirmDialog
      :header="'Delete Special Edition'"
      :isOpen="isDeleteModalOpen"
      @close="closeDeleteModal"
      @onConfirmAction="deleteSpecialEdition"
    />
  </template>
</template>

<script>
import { computed, ref, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronUpIcon } from "@heroicons/vue/outline";
import axios from "@/config/wireAxios";
import ArticleCard from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";
import SpecialEditionCreateEditModal from "@/components/SpecialEditionCreateEditModal";
import SpecialEditionConfirmDialog from "@/components/SpecialEditionConfirmDialog";

export default {
  components: {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    ChevronUpIcon,
    ArticleCard,
    Pagination,
    SpecialEditionCreateEditModal,
    SpecialEditionConfirmDialog,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const loadingSpecialEdition = computed(
      () => store.state.specialEdition.loading
    );
    const specialEdition = computed(() => store.state.specialEdition.edition);
    const currentPage = ref(parseInt(route.query.page) || 1);

    const isEditModalOpen = ref(false);

    const openEditModal = () => {
      isEditModalOpen.value = true;
    };

    const closeEditModal = () => {
      isEditModalOpen.value = false;
    };

    const isDeleteModalOpen = ref(false);

    const openDeleteModal = () => {
      isDeleteModalOpen.value = true;
    };

    const closeDeleteModal = () => {
      isDeleteModalOpen.value = false;
    };

    const deleteSpecialEdition = () => {
      if (process.env.NODE_ENV === "low") {
        router.push({ name: "specialEditions" });
      } else {
        axios
          .delete(`/special_editions/${specialEdition.value.id}`)
          .then(() => {
            router.push({ name: "specialEditions" });
          })
          .catch(() => {
            console.warn("Unable to delete Special Edition");
          });
      }
    };

    const reloadSpecialEdition = () => {
      if (route.query.page) {
        router.push({
          query: {},
        });
      } else {
        store.dispatch("specialEdition/getSpecialEdition");
      }
    };

    onMounted(() => {
      store.dispatch("specialEdition/getSpecialEdition");
    });

    watch(
      () => route.query,
      () => {
        if (route.name === "specialEdition") {
          console.log("route.query watcher triggered.");
          currentPage.value = parseInt(route.query.page) || 1;
          store.dispatch("specialEdition/getSpecialEdition");
        }
      }
    );

    return {
      loadingSpecialEdition,
      specialEdition,
      currentPage,
      isEditModalOpen,
      openEditModal,
      closeEditModal,
      isDeleteModalOpen,
      openDeleteModal,
      closeDeleteModal,
      deleteSpecialEdition,
      reloadSpecialEdition,
    };
  },
};
</script>
<style scoped lang="scss">
</style>
