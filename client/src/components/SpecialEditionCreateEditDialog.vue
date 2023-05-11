<template>
  <MaxDialog
    :is-open="isOpen"
    class="max-w-[950px]"
    :title="`${editMode ? 'Edit' : 'Create'} Special Edition`"
    @close="closeDialog"
  >
    <form id="se_form" @submit.prevent="sendForm">
      <div class="block lg:flex my-4 lg:space-x-5">
        <div class="basis-1/2 flex flex-col space-y-4">
          <div>
            <MaxInput
              v-model="editionEvent.name"
              label="Name"
              autocomplete="off"
              type="text"
              required
            />
          </div>
          <div>
            <MaxInput
              v-model="editionEvent.search_params"
              label="Search params"
              autocomplete="off"
              placeholder="Run a search, copy the URL, and paste it here."
              type="text"
              required
            />
          </div>
          <div>
            <MaxTextarea
              v-model="editionEvent.key_readings"
              v-model.trim="editionEvent.key_readings"
              maxlength="4000"
              rows="5"
              label="Selected Readings"
              placeholder="One document number per line, ex: WIRe110416-02."
            />
          </div>
          <div>
            <MaxListbox
              v-model="editionEvent.state"
              :label="'State'"
              :items="stateOptions"
              required
            />
          </div>
        </div>
        <div class="basis-1/2 flex flex-col space-y-4">
          <div>
            <MaxListbox
              v-model="editionEvent.position"
              :label="'Order'"
              :items="orderOptions"
            />
          </div>
          <div class="flex flex-col">
            <!-- <BaseClassify
              :label="'Classification'" show-selection :selection="editionEvent.name_classification"
              required @classificationSelected="updateClassification"
            /> -->
            <MaxClassifier
              v-model="editionEvent.name_classification_xml"
              label="Classification"
              required
              portionMark
              @update:classObj="updateClassification"
            />
          </div>
          <div>
            <MaxImageFileChooser
              :label="'File Attachment'"
              :binary="editionEvent.icon"
              :file="imageFile"
              required
              @onImageAdded="updateImageFile"
              @onImageRemoved="removeImageFile"
            />
          </div>
          <div>
            <span
              class="ml-1 text-slate-900 italic text-red-900"
              v-show="editionEvent.icon && !editionEvent.valid"
              >{{ editionEvent.error_msg }}</span
            >
          </div>
        </div>
      </div>
    </form>
    <template #actions>
      <MaxButton color="secondary" @click.prevent="closeDialog">
        Cancel
      </MaxButton>
      <MaxButton
        color="secondary"
        :disabled="isDisabled()"
        type="submit"
        form="se_form"
      >
        {{ editMode ? "Save" : "Create" }}
      </MaxButton>
    </template>
  </MaxDialog>
</template>

<script>
import { inject, ref, watch, computed } from "vue";
import { useStore } from "vuex";
import axios from "@/config/wireAxios";
// import { useField, userForm } from 'vee-validate'
// import { mixed, number, object, string } from 'yup';

const stateOptions = ["draft", "archived", "posted"];

export default {
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
          state: [],
          position: 1,
          key_readings: null,
          valid: true,
          error_msg: null,
        };
      },
    },
  },
  emits: ["closeDialog", "specialEditionUpdated"],
  setup(props, { emit }) {
    const store = useStore();
    const loadingLinks = computed(() => store.state.specialEditions.loading);
    const links = computed(() => store.state.specialEditions.links);
    const createNotification = inject("create-notification");

    const editionEvent = ref(Object.assign({}, props.edition));

    // const validationSchema = object({
    //   name: string().required(),
    //   search_params: string().required(),
    //   key_readers: undefined,
    //   state: string().required(),
    //   position: number(),
    //   name_classification: string().required,
    //   icon: mixed().required('File is required.')
    // })

    // const { handleSubmit, errors } = useForm({
    //   validationSchema,
    //   initialValues: {
    //     position: 1,
    //   }
    // })

    // const { value: category } = useField('name')
    // const { value: title } = useField('search_params')
    // const { value: description } = useField('key_readers')
    // const { value: location } = useField('state')
    // const { value: pets } = useField('position')
    // const { value: catering } = useField('name_classification')
    // const { value: music } = useField('icon')

    // // const { handleSubmit } = useForm({
    // //   validationSchema
    // // })

    const imageFile = ref(null);

    const closeDialog = () => {
      emit("closeDialog");
    };

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
      // editionEvent.value.name_classification = payload.classification_string;
      // editionEvent.value.name_classification_xml = payload.classification_xml;
      editionEvent.value.name_classification = payload.name;
    };

    const updateImageFile = (payload) => {
      editionEvent.value.icon = payload.binary;
      imageFile.value = payload.file;
      validateIcon(imageFile.value);
    };

    const removeImageFile = () => {
      editionEvent.value.icon = null;
      imageFile.value = null;
      editionEvent.value.valid = true;
    };

    const validateIcon = (img) => {
      console.log("validateIcon() called");
      const imageUrl = URL.createObjectURL(img);
      const image = new Image();
      image.onload = function () {
        const width = this.width;
        const height = this.height;
        console.log(`Dimensions: ${width} x ${height} px`);
        if (width != height || width < 300 || height < 300) {
          // removeImageFile();
          console.log("I should get in here if it fails");
          editionEvent.value.error_msg =
            "The icon must be square (height and width must be equal), and the resolution must be at least 300 x 300 px.";
          editionEvent.value.valid = false;
        } else {
          editionEvent.value.error_msg = "";
          editionEvent.value.valid = true;
        }
      };
      image.src = imageUrl;
      URL.revokeObjectURL(imageUrl);
    };

    const buildFormData = () => {
      const formData = new FormData();
      Object.keys(editionEvent.value).forEach((key) => {
        if (key === "icon") {
          if (imageFile.value) {
            formData.append(key, imageFile.value);
          }
        } else if (editionEvent.value[key]) {
          formData.append(key, editionEvent.value[key]);
        }
      });
      return formData;
    };

    const resetForm = () => {
      editionEvent.value = {
        icon: null,
        name: null,
        name_classification: null,
        search_params: null,
        state: null,
        position: 1,
        key_readings: null,
        valid: true,
        error_msg: null,
      };
      imageFile.value = null;
    };

    /*
      The posted links needs to load first before building the order options.
    */
    watch([loadingLinks], () => {
      if (!loadingLinks.value) {
        orderOptions.value = buildOrderOptions();
      }
    });

    watch([imageFile], () => {
      if (imageFile.value) {
        validateIcon(imageFile.value);
      }
    });

    const isDisabled = () => {
      if (editionEvent.value.valid === undefined) {
        editionEvent.value.valid = true;
      }
      return (
        !editionEvent.value.name ||
        !editionEvent.value.search_params ||
        !editionEvent.value.state ||
        !editionEvent.value.name_classification ||
        !editionEvent.value.icon ||
        !editionEvent.value.valid
      );
    };

    const sendForm = () => {
      if (!isDisabled()) {
        let payload = {};
        for (const pair of buildFormData().entries()) {
          payload[pair[0]] = pair[1];
        }
        console.log("Sending form...(Payload below)");
        console.log(payload);
        if (process.env.NODE_ENV === "offline") {
          if (props.editMode) {
            emit("specialEditionUpdated");
            createNotification({
              title: "Changes saved",
              message: `${props.edition?.name} Special Edition has been saved.`,
              type: "success",
              duration: 4,
            });
            closeDialog();
          } else {
            store.dispatch("specialEditions/loadConceptsLinks");
            resetForm();
            closeDialog();
          }
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
                createNotification({
                  title: "Changes saved",
                  message: `${props.edition?.name} Special Edition has been saved.`,
                  type: "success",
                  duration: 4,
                });
                closeDialog();
              })
              .catch((err) => {
                createNotification({
                  title: "Error editing the Special Edition",
                  message: JSON.stringify(err.response.data.errors),
                  type: "error",
                  autoClose: false,
                });
              });
          } else {
            axios
              .post("/special_editions", buildFormData())
              .then((response) => {
                console.log(response);
                store.dispatch("specialEditions/loadConceptsLinks");
                createNotification({
                  title: "Created",
                  message: `${editionEvent.value?.name} Special Edition has been created`,
                  type: "success",
                  duration: 4,
                });
                resetForm();
                closeDialog();
              })
              .catch((err) => {
                createNotification({
                  title: "Error creating the Special Edition",
                  message: JSON.stringify(err.response.data.errors),
                  type: "error",
                  autoClose: false,
                });
                closeDialog();
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
      closeDialog,
      sendForm,
    };
  },
};
</script>
<style lang="scss">
/* Empty on Purpose */
</style>
