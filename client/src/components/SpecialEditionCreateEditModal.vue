
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
            <div class="fixed inset-0 bg-black/30" />
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
                lg:min-w-[800px]
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
              <div
                class="
                  pb-4
                  border-b border-slate-900/10
                  dark:border-slate-50/[0.06]
                  energy:border-zinc-500/50
                "
              >
                {{ editMode ? "Edit" : "Create" }} Special Edition
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
              </div>
              <form @submit.prevent="sendForm">
                <div class="block lg:flex my-4 lg:space-x-5">
                  <div class="basis-1/2 flex flex-col space-y-4">
                    <div>
                      <BaseInput
                        v-model="editionEvent.name"
                        label="Name (required)"
                        autocomplete="off"
                        type="text"
                      />
                    </div>
                    <div>
                      <BaseInput
                        v-model="editionEvent.search_params"
                        label="Search params (required)"
                        autocomplete="off"
                        type="text"
                      />
                    </div>
                    <div>
                      <BaseTextarea
                        maxlength="4000"
                        rows="5"
                        v-model="editionEvent.key_readings"
                        label="Selected Readings"
                        v-model.trim="editionEvent.key_readings"
                      ></BaseTextarea>
                    </div>
                    <div>
                      <BaseListbox
                        v-model="editionEvent.state"
                        :label="'State (required)'"
                        :items="stateOptions"
                      />
                    </div>
                  </div>
                  <div class="basis-1/2 flex flex-col space-y-4">
                    <div>
                      <BaseListbox
                        v-model="editionEvent.position"
                        :label="'Order'"
                        :items="orderOptions"
                      />
                    </div>
                    <div class="flex flex-col">
                      <BaseClassify
                        :label="'Classification (required)'"
                        showSelection
                        :selection="editionEvent.name_classification"
                        @classificationSelected="updateClassification"
                      />
                    </div>
                    <div>
                      <BaseImageFileChooser
                        :label="'File Attachment (required)'"
                        :binary="editionEvent.icon"
                        :file="imageFile"
                        @onImageAdded="updateImageFile"
                        @onImageRemoved="removeImageFile"
                      />
                    </div>
                  </div>
                </div>
                <div class="flex justify-end">
                  <div class="flex space-x-3">
                    <BaseButton @click.prevent="close">Cancel</BaseButton>
                    <BaseButton :disabled="isDisabled()" type="submit">{{
                      editMode ? "Save" : "Create"
                    }}</BaseButton>
                  </div>
                </div>
              </form>
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
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { XIcon } from "@heroicons/vue/outline";
import axios from "@/config/wireAxios";

const stateOptions = ["draft", "archived", "posted"];

export default {
  components: {
    Dialog,
    DialogPanel,
    TransitionChild,
    TransitionRoot,
    XIcon,
  },
  props: {
    isOpen: {
      type: Boolean,
    },
    editMode: {
      type: Boolean,
      default: false,
    },
    edition: {
      type: Object,
      default() {
        return {
          icon: null,
          name: null,
          name_classification: null,
          search_params: null,
          state: null,
          position: 1,
          key_readings: null,
        };
      },
    },
  },
  emits: ["close", "specialEditionUpdated"],
  setup(props, { emit }) {
    const store = useStore();
    const loadingLinks = computed(() => store.state.specialEditions.loading);
    const links = computed(() => store.state.specialEditions.links);

    const editionEvent = ref(Object.assign({}, props.edition));
    const imageFile = ref(null);

    const buildOrderOptions = () => {
      let options = [];
      if (links.value.posted) {
        for (let i = 0; i < links.value.posted.length + 1; i++) {
          options.push(i + 1);
        }
      }
      return options;
    };

    const orderOptions = ref(buildOrderOptions());

    const updateClassification = (payload) => {
      editionEvent.value.name_classification = payload.classification_string;
      editionEvent.value.name_classification_xml = payload.classification_xml;
    };

    const updateImageFile = (payload) => {
      editionEvent.value.icon = payload.binary;
      imageFile.value = payload.file;
    };

    const removeImageFile = () => {
      editionEvent.value.icon = null;
      imageFile.value = null;
    };

    const buildFormData = () => {
      const formData = new FormData();
      Object.keys(editionEvent.value).forEach((key) => {
        if (key === "icon") {
          formData.append(key, imageFile.value);
        } else if (editionEvent.value[key]) {
          formData.append(key, editionEvent.value[key]);
        }
      });
      return formData;
    };

    /*
      The posted links needs to load first before building the order options.
    */
    watch([loadingLinks], () => {
      if (!loadingLinks.value) {
        orderOptions.value = buildOrderOptions();
      }
    });

    const isDisabled = () => {
      return (
        !editionEvent.value.name ||
        !editionEvent.value.search_params ||
        !editionEvent.value.state ||
        !editionEvent.value.name_classification ||
        !editionEvent.value.icon
      );
    };

    const close = () => {
      emit("close");
    };

    const sendForm = () => {
      if (!isDisabled()) {
        let payload = {};
        for (const pair of buildFormData().entries()) {
          payload[pair[0]] = pair[1];
        }
        console.log("Sending form...(Payload below)");
        console.log(payload);
        if (process.env.NODE_ENV === "low") {
          if (props.editMode) {
            emit("specialEditionUpdated");
          } else {
            store.dispatch("specialEditions/loadConceptsLinks");
          }
          close();
        } else {
          if (props.editMode) {
            axios
              .patch(
                "/special_editions/" + editionEvent.value.id,
                buildFormData()
              )
              .then((response) => {
                console.log(response);
                store.dispatch("specialEditions/loadConceptsLinks");
                emit("specialEditionUpdated");
                close();
              })
              .catch((err) => {
                this.showErrorMsg(err);
              });
          } else {
            axios
              .post("/special_editions", buildFormData())
              .then((response) => {
                console.log(response);
                store.dispatch("specialEditions/loadConceptsLinks");
                close();
              })
              .catch((err) => {
                console.error(err);
                close();
              });
          }
        }
      } else {
        console.log(
          "Button clicked but form is still incomplete. Not sending anything."
        );
      }
    };

    return {
      stateOptions,
      editionEvent,
      imageFile,
      orderOptions,
      updateClassification,
      updateImageFile,
      removeImageFile,
      isDisabled,
      close,
      sendForm,
    };
  },
};
</script>
<style lang="scss">
/* Empty on Purpose */
</style>
