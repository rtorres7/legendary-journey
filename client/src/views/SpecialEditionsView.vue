<template>
  <div
    class="
      py-4
      border-b-2 border-slate-900/10
      dark:border-slate-50/[0.06]
      energy:border-zinc-700/50
    "
  >
    <p class="font-semibold text-2xl">Special Editions</p>
  </div>
  <div class="flex justify-end py-1 my-2">
    <div class="flex space-x-3">
      <template v-if="loading">
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
        <BaseButton @click.prevent="openDialog">Create</BaseButton>
      </template>
    </div>
  </div>
  <div class="py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
    <div>
      <p
        class="
          font-medium
          text-lg
          pb-2
          border-b border-slate-900/10
          dark:border-slate-50/[0.06]
          energy:border-zinc-700/50
        "
      >
        Posted
      </p>
      <div class="flex flex-col space-y-4 pt-4">
        <template v-if="loading">
          <template v-for="n in 3" :key="n">
            <div
              class="
                h-[70px]
                animate-pulse
                bg-white
                dark:bg-slate-800/50
                energy:bg-zinc-800
              "
            ></div>
          </template>
        </template>
        <template v-else>
          <template v-if="links.posted && links.posted.length > 0">
            <template v-for="link in links.posted" :key="link">
              <BaseCard hoverable :rounded="false">
                <SpecialEditionLink :link="link" />
              </BaseCard>
            </template>
          </template>
          <template v-else>
            <p class="italic">No Special Editions</p>
          </template>
        </template>
      </div>
    </div>
    <template v-if="canManageSpecialEditions">
      <div>
        <p
          class="
            font-medium
            text-lg
            pb-2
            border-b border-slate-900/10
            dark:border-slate-50/[0.06]
            energy:border-zinc-700/50
          "
        >
          Draft
        </p>
        <div class="flex flex-col space-y-4 pt-4">
          <template v-if="loading">
            <template v-for="n in 3" :key="n">
              <div
                class="
                  h-[70px]
                  animate-pulse
                  bg-white
                  dark:bg-slate-800/50
                  energy:bg-zinc-800
                "
              ></div>
            </template>
          </template>
          <template v-else>
            <template v-if="links.draft && links.draft.length > 0">
              <template v-for="link in links.draft" :key="link">
                <BaseCard hoverable :rounded="false">
                  <SpecialEditionLink :link="link" />
                </BaseCard>
              </template>
            </template>
            <template v-else>
              <p class="italic">No Special Editions</p>
            </template>
          </template>
        </div>
      </div>
      <div>
        <p
          class="
            font-medium
            text-lg
            pb-2
            border-b border-slate-900/10
            dark:border-slate-50/[0.06]
            energy:border-zinc-700/50
          "
        >
          Archived
        </p>
        <div class="flex flex-col space-y-4 pt-4">
          <template v-if="loading">
            <template v-for="n in 3" :key="n">
              <div
                class="
                  h-[70px]
                  animate-pulse
                  bg-white
                  dark:bg-slate-800/50
                  energy:bg-zinc-800
                "
              ></div>
            </template>
          </template>
          <template v-else>
            <template v-if="links.archived && links.archived.length > 0">
              <template v-for="link in links.archived" :key="link">
                <BaseCard hoverable :rounded="false">
                  <SpecialEditionLink :link="link" />
                </BaseCard>
              </template>
            </template>
            <template v-else>
              <p class="italic">No Special Editions</p>
            </template>
          </template>
        </div>
      </div>
    </template>
  </div>
  <SpecialEditionCreateEditDialog
    :isOpen="isDialogOpen"
    @closeDialog="closeDialog"
  />
</template>

<script>
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import SpecialEditionLink from "@/components/SpecialEditionLink";
import SpecialEditionCreateEditDialog from "@/components/SpecialEditionCreateEditDialog";

export default {
  components: {
    SpecialEditionLink,
    SpecialEditionCreateEditDialog,
  },
  setup() {
    const store = useStore();

    const loading = computed(() => store.state.specialEditions.loading);
    const links = computed(() => store.state.specialEditions.links);
    const canManageSpecialEditions = computed(
      () => store.getters["user/canManageSpecialEditions"]
    );

    onMounted(() => {
      store.dispatch("specialEditions/loadConceptsLinks");
    });

    const isDialogOpen = ref(false);

    const openDialog = () => {
      isDialogOpen.value = true;
    };

    const closeDialog = () => {
      isDialogOpen.value = false;
    };

    const getImgUrl = (link) => {
      if (process.env.NODE_ENV === "low") {
        return require("@/assets/ukraine_flag_70x70.png");
      }
      return link.image_path;
    };

    return {
      loading,
      links,
      canManageSpecialEditions,
      isDialogOpen,
      openDialog,
      closeDialog,
      getImgUrl,
    };
  },
};
</script>
<style scoped lang="scss">
</style>
