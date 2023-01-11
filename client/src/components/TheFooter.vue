<template>
  <div
    class="no-print max-w-8xl mx-auto bg-mission-blue dark:bg-dark-space-blue energy:bg-zinc-800 text-slate-200 dark:text-slate-300 energy:text-zinc-300"
  >
    <div class="border-b border-slate-700/50 energy:border-zinc-700/50">
      <div class="hidden max-w-fit mx-auto py-6 lg:grid grid-cols-3 gap-20">
        <template v-for="linkGroup in metadata.footer_links" :key="linkGroup">
          <div>
            <p class="font-semibold pb-4">
              {{ linkGroup.header }}
            </p>
            <ul
              class="flex flex-col space-y-3 text-sm text-slate-300 energy:text-zinc-300"
            >
              <template v-for="link in linkGroup.links" :key="link">
                <li class="hover:text-white">
                  <template v-if="link.href">
                    <a :href="link.href" target="_blank">{{ link.name }}</a>
                  </template>
                  <template v-else>
                    <a
                      role="button"
                      tabindex="0"
                      @click="openDialog(link.key)"
                      >{{ link.name }}</a
                    >
                  </template>
                </li>
              </template>
            </ul>
          </div>
        </template>
      </div>
      <template v-for="linkGroup in metadata.footer_links" :key="linkGroup">
        <Disclosure
          v-slot="{ open }"
          as="div"
          class="block lg:hidden px-4 border-b last:border-b-0 border-slate-700/50 energy:border-zinc-700/50"
        >
          <DisclosureButton class="py-4 w-full">
            <div class="flex justify-between items-center">
              <span class="font-semibold mr-2">{{ linkGroup.header }}</span>
              <ChevronUpIcon
                :class="open ? '' : 'rotate-180 transform'"
                class="text-amber-300 dark:text-teal-400 energy:text-energy-yellow h-5 w-5"
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
              <ul
                class="flex flex-col space-y-3 text-sm text-slate-300 energy:text-zinc-300"
              >
                <template v-for="link in linkGroup.links" :key="link">
                  <li class="hover:text-white">
                    <template v-if="link.href">
                      <a :href="link.href" target="_blank">{{ link.name }}</a>
                    </template>
                    <template v-else>
                      <a
                        role="button"
                        tabindex="0"
                        @click="openSecurityDialog"
                        >{{ link.name }}</a
                      >
                    </template>
                  </li>
                </template>
              </ul>
            </DisclosurePanel>
          </transition>
        </Disclosure>
      </template>
    </div>
    <div
      class="py-6 px-4 flex flex-col-reverse lg:flex-row justify-between items-center"
    >
      <div class="flex items-center pt-6 lg:pt-0">
        <router-link to="/">
          <img
            class="w-14"
            src="@/assets/nctc_seal_color.svg"
            alt="NCTC seal. Link to top of the homepage"
          />
        </router-link>
        <div class="ml-4">
          <div
            class="uppercase text-xl text-white dark:text-slate-200 energy:text-energy-yellow font-semibold tracking-[.05em]"
          >
            {{ metadata.application_name }}
          </div>
          <p class="text-slate-300 energy:text-zinc-300 text-sm italic">
            {{ metadata.footer_note }}
          </p>
        </div>
      </div>
      <div
        class="flex flex-col md:flex-row space-x-0 md:space-x-8 space-y-4 md:space-y-0 text-sm"
      >
        <div class="flex flex-col">
          <p class="mb-1">NCTC/DI Managing Editor, NCTC Current</p>
          <div class="flex space-x-4">
            <p>
              U:
              <span
                class="text-amber-300 dark:text-teal-400 energy:text-energy-yellow"
                >(571) 280-3627</span
              >
            </p>
            <p>
              S:
              <span
                class="text-amber-300 dark:text-teal-400 energy:text-energy-yellow"
                >93-14533</span
              >
            </p>
          </div>
        </div>
        <div class="flex flex-col">
          <p class="mb-1">ITS Help - 24/7 Support</p>
          <div class="flex space-x-4">
            <p>
              S:
              <span
                class="text-amber-300 dark:text-teal-400 energy:text-energy-yellow"
                >93-08900</span
              >
            </p>
            <p>
              Website:
              <span
                class="text-amber-300 dark:text-teal-400 energy:text-energy-yellow hover:underline w-fit m-0 md:m-auto lg:m-0"
              >
                <a :href="`${metadata.footer_contact.link.href}`">
                  {{ metadata.footer_contact.link.name }}
                </a>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div id="classification_banner">
      <p class="text-center text-xs uppercase">
        {{ metadata.system_classification }}
      </p>
    </div>
  </div>
  <BaseDialog
    class="max-w-[600px]"
    :isOpen="isMissionDialogOpen"
    @close="closeMissionDialog"
  >
    <div class="flex flex-col space-y-6">
      <template v-for="paragraph in metadata.footer_mission" :key="paragraph">
        <div>
          <p class="font-semibold mb-2">
            {{ paragraph.header }}
          </p>
          <p>{{ paragraph.content }}</p>
        </div>
      </template>
    </div>
  </BaseDialog>
  <BaseDialog
    class="max-w-[600px]"
    :isOpen="isSecurityDialogOpen"
    @close="closeSecurityDialog"
  >
    <div class="flex flex-col space-y-6">
      <template v-for="paragraph in metadata.footer_security" :key="paragraph">
        <div>
          <p class="font-semibold mb-2">
            {{ paragraph.header }}
          </p>
          <p>{{ paragraph.content }}</p>
        </div>
      </template>
    </div>
  </BaseDialog>
  <BaseDialog
    class="max-w-[600px]"
    :isOpen="isFAQDialogOpen"
    @close="closeFAQDialog"
  >
    <div class="flex flex-col space-y-6">
      <template v-for="paragraph in metadata.footer_faq" :key="paragraph">
        <div>
          <p class="font-semibold mb-2">
            {{ paragraph.header }}
          </p>
          <p>{{ paragraph.content }}</p>
        </div>
      </template>
    </div>
  </BaseDialog>
</template>
<script>
import { metadata } from "@/config";
import { ref } from "vue";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronUpIcon } from "@heroicons/vue/24/outline";

export default {
  components: {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    ChevronUpIcon,
  },
  setup() {
    const isMissionDialogOpen = ref(false);
    const isSecurityDialogOpen = ref(false);
    const isFAQDialogOpen = ref(false);

    const closeMissionDialog = () => {
      isMissionDialogOpen.value = false;
    };

    const closeSecurityDialog = () => {
      isSecurityDialogOpen.value = false;
    };

    const closeFAQDialog = () => {
      isFAQDialogOpen.value = false;
    };

    const openDialog = (key) => {
      switch (key) {
        case "mission":
          isMissionDialogOpen.value = true;
          break;
        case "security":
          isSecurityDialogOpen.value = true;
          break;
        case "faq":
          isFAQDialogOpen.value = true;
          break;
      }
    };

    return {
      metadata,
      isMissionDialogOpen,
      isSecurityDialogOpen,
      isFAQDialogOpen,
      closeMissionDialog,
      closeSecurityDialog,
      closeFAQDialog,
      openDialog,
    };
  },
};
</script>
<style lang="scss"></style>
