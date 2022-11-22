
<template>
  <BaseDialog
    :is-open="isOpen" class="max-w-[950px]" :title="`${editMode ? 'Edit' : 'Create'} Special Edition`"
    @close="closeDialog"
  >
    <form id="se_form" @submit.prevent="sendForm">
      <div class="block lg:flex my-4 lg:space-x-5">
        <div class="basis-1/2 flex flex-col space-y-4">
          <div>
            <BaseInput
              v-model="editionEvent.name" label="Name" autocomplete="off" type="text"
              required
            />
          </div>
          <div>
            <BaseInput
              v-model="editionEvent.search_params" label="Search params" autocomplete="off"
              placeholder="Run a search, copy the URL, and paste it here." type="text" required
            />
          </div>
          <div>
            <BaseTextarea
              v-model="editionEvent.key_readings" v-model.trim="editionEvent.key_readings" maxlength="4000" rows="5"
              label="Selected Readings" placeholder="One document number per line, ex: WIRe110416-02."
            />
          </div>
          <div>
            <BaseListbox v-model="editionEvent.state" :label="'State'" :items="stateOptions" required />
          </div>
        </div>
        <div class="basis-1/2 flex flex-col space-y-4">
          <div>
            <BaseListbox v-model="editionEvent.position" :label="'Order'" :items="orderOptions" />
          </div>
          <div class="flex flex-col">
            <BaseClassify
              :label="'Classification'" show-selection :selection="editionEvent.name_classification"
              required @classificationSelected="updateClassification"
            />
          </div>
          <div>
            <BaseImageFileChooser
              :label="'File Attachment'" :binary="editionEvent.icon" :file="imageFile"
              required @onImageAdded="updateImageFile" @onImageRemoved="removeImageFile"
            />
          </div>
        </div>
      </div>
    </form>
    <template #actions>
      <BaseButton @click.prevent="closeDialog">
        Cancel
      </BaseButton>
      <BaseButton :disabled="isDisabled()" type="submit" form="se_form">
        {{
          editMode ? "Save" : "Create"
        }}
      </BaseButton>
    </template>
  </BaseDialog>
</template>

<script>
import { ref, watch, computed } from "vue";
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
        };
      },
    },
  },
  emits: ["closeDialog", "specialEditionUpdated"],
  setup(props, { emit }) {
    const store = useStore();
    const loadingLinks = computed(() => store.state.specialEditions.loading);
    const links = computed(() => store.state.specialEditions.links);

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
      }
      imageFile.value = null;
    }

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
                closeDialog();
              })
              .catch((err) => {
                console.error(err);
              });
          } else {
            axios
              .post("/special_editions", buildFormData())
              .then((response) => {
                console.log(response);
                store.dispatch("specialEditions/loadConceptsLinks");
                resetForm();
                closeDialog();
              })
              .catch((err) => {
                console.error(err);
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
