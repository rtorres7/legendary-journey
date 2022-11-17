
<template>
  <BaseDialog :isOpen="isOpen" @close="closeDialog" class="max-w-[950px]"
    :title="`${editMode ? 'Edit' : 'Create'} Special Edition`">
    <form id="se_form" @submit.prevent="submit">
      <div class="block lg:flex my-4 lg:space-x-5">
        <div class="basis-1/2 flex flex-col space-y-4">
          <div>
            <BaseInputWIP label="Name" v-model="name" :error="errors.name" autocomplete="off" type="text" required />
          </div>
          <div>
            <BaseInput v-model="search_params" :error="errors.search_params" label="Search params" autocomplete="off"
              placeholder="Run a search, copy the URL, and paste it here." type="text" required />
          </div>
          <!-- <div>
            <BaseTextarea maxlength="4000" rows="5" v-model="key_readings" :error="errors.key_readings"
              label="Selected Readings" placeholder="One document number per line, ex: WIRe110416-02."
              v-model.trim="editionEvent.key_readings">
            </BaseTextarea>
          </div>
          <div>
            <BaseListbox :label="'State'" :items="stateOptions" v-model="state" :error="errors.state" required />
          </div> -->
        </div>
        <div class="basis-1/2 flex flex-col space-y-4">
          <!-- <div>
            <BaseListbox :label="'Order'" :items="orderOptions" v-model="position" :error="errors.position" />
          </div> -->
          <!-- <div class="flex flex-col">
            <BaseClassify :label="'Classification'" showSelection :selection="name_classification"
              :error="errors.name_classification" @classificationSelected="updateClassification" required />
          </div> -->
          <!-- <div>
            <BaseImageFileChooser :label="'File Attachment'" :binary="edition.icon" :file="file" :error="errors.file"
              @onImageAdded="updateImageFile" @onImageRemoved="removeImageFile" required />
          </div> -->
        </div>
      </div>
    </form>
    <template #actions>
      <BaseButton @click.prevent="closeDialog">Cancel</BaseButton>
      <BaseButton type="submit" form="se_form">{{
          editMode ? "Save" : "Create"
      }}</BaseButton>
    </template>
  </BaseDialog>
</template>

<script>
import BaseInputWIP from "@/components/base/BaseInputWIP"
import { ref, watch, computed } from "vue";
import { useStore } from "vuex";
//import axios from "@/config/wireAxios";
import { useField, useForm } from 'vee-validate'
import { object, string } from 'yup'; //mixed, number

const stateOptions = ["draft", "archived", "posted"];

export default {
  components: {
    BaseInputWIP
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
  emits: ["closeDialog", "specialEditionUpdated"],
  setup(props, { emit }) {
    const store = useStore();
    const loadingLinks = computed(() => store.state.specialEditions.loading);
    const links = computed(() => store.state.specialEditions.links);

    //const editionEvent = ref(Object.assign({}, props.edition));

    const validationSchema = object({
      name: string().required().min(2),
      search_params: string().required(),
      // key_readings: undefined,
      // state: string().required(),
      //position: number(),
      //name_classification: string().required(),
      //icon: mixed().required('File is required.')
    })

    const { handleSubmit, errors } = useForm({
      validationSchema,
      // initialValues: {
      //   position: 1,
      // }
    })

    const { value: name } = useField('name')
    const { value: search_params } = useField('search_params')
    // const { value: key_readings } = useField('key_readings')
    // const { value: state } = useField('state')
    //const { value: position } = useField('position')
    //const { value: name_classification } = useField('name_classification')
    //const { value: file } = useField('file')



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

    // const updateClassification = (payload) => {
    //   editionEvent.value.name_classification = payload.classification_string;
    //   editionEvent.value.name_classification_xml = payload.classification_xml;
    // };

    // const updateImageFile = (payload) => {
    //   editionEvent.value.icon = payload.binary;
    //   imageFile.value = payload.file;
    // };

    // const removeImageFile = () => {
    //   editionEvent.value.icon = null;
    //   imageFile.value = null;
    // };

    // const buildFormData = () => {
    //   const formData = new FormData();
    //   Object.keys(editionEvent.value).forEach((key) => {
    //     if (key === "icon") {
    //       if (imageFile.value) {
    //         formData.append(key, imageFile.value);
    //       }
    //     } else if (editionEvent.value[key]) {
    //       formData.append(key, editionEvent.value[key]);
    //     }
    //   });
    //   return formData;
    // };

    // const resetForm = () => {
    //   editionEvent.value = {
    //     icon: null,
    //     name: null,
    //     name_classification: null,
    //     search_params: null,
    //     state: null,
    //     position: 1,
    //     key_readings: null,
    //   }
    //   imageFile.value = null;
    // }

    /*
      The posted links needs to load first before building the order options.
    */
    watch([loadingLinks], () => {
      if (!loadingLinks.value) {
        orderOptions.value = buildOrderOptions();
      }
    });

    const submit = handleSubmit(values => {
      console.log('submit', values)
    })

    const submit2 = () => {
      console.log('submit2 clicked')
    }

    // const isDisabled = () => {
    //   return (
    //     !editionEvent.value.name ||
    //     !editionEvent.value.search_params ||
    //     !editionEvent.value.state ||
    //     !editionEvent.value.name_classification ||
    //     !editionEvent.value.icon
    //   );
    // };

    // const sendForm = () => {
    //   if (!isDisabled()) {
    //     let payload = {};
    //     for (const pair of buildFormData().entries()) {
    //       payload[pair[0]] = pair[1];
    //     }
    //     console.log("Sending form...(Payload below)");
    //     console.log(payload);
    //     if (process.env.NODE_ENV === "low") {
    //       if (props.editMode) {
    //         emit("specialEditionUpdated");
    //         closeDialog();
    //       } else {
    //         store.dispatch("specialEditions/loadConceptsLinks");
    //         resetForm();
    //         closeDialog();
    //       }
    //     } else {
    //       if (props.editMode) {
    //         axios
    //           .patch(
    //             "/special_editions/" + editionEvent.value.id,
    //             buildFormData()
    //           )
    //           .then((response) => {
    //             console.log(response);
    //             store.dispatch("specialEditions/loadConceptsLinks");
    //             emit("specialEditionUpdated");
    //             closeDialog();
    //           })
    //           .catch((err) => {
    //             console.error(err);
    //           });
    //       } else {
    //         axios
    //           .post("/special_editions", buildFormData())
    //           .then((response) => {
    //             console.log(response);
    //             store.dispatch("specialEditions/loadConceptsLinks");
    //             resetForm();
    //             closeDialog();
    //           })
    //           .catch((err) => {
    //             console.error(err);
    //             closeDialog();
    //           });
    //       }
    //     }
    //   } else {
    //     console.log(
    //       "Button clicked but form is still incomplete. Not sending anything."
    //     );
    //   }
    // };

    return {
      stateOptions,
      orderOptions,
      closeDialog,
      name,
      search_params,
      // key_readings,
      // state,
      //position,
      //name_classification,
      //file,
      submit,
      submit2,
      errors
    };
  },
};
</script>
<style lang="scss">
/* Empty on Purpose */
</style>
