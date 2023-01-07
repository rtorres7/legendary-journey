<template>
  <p
    class="font-semibold text-2xl py-4 border-b-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25"
  >
    Edit Document
  </p>
  <template v-if="loadingMetadata || loadingDissemOrgs || loadingDocument">
    <div class="max-w-fit m-auto mt-[20vh]">
      <BaseLoadingSpinner class="h-24 w-24" />
    </div>
  </template>
  <template v-else>
    <form ref="publishingForm">
      <div class="w-[250px] mt-4">
        <BaseListbox
          v-model="formData.selectedProductType.model"
          :label="formData.selectedProductType.label"
          :items="formData.selectedProductType.items"
          @update:modelValue="updateField($event, 'product_type_id')"
          @clicked="openProductTypeDialog"
        />
      </div>
      <div class="flex flex-col lg:flex-row gap-6 lg:gap-3 mt-4">
        <!-- Left Container -->
        <BaseCard class="flex flex-col lg:w-8/12 p-6 space-y-6">
          <div class="md:flex md:space-x-4 space-y-4 md:space-y-0">
            <div class="basis-1/2 space-y-4">
              <BaseListbox
                v-model="formData.selectedCountries.model"
                :label="formData.selectedCountries.label"
                :items="formData.selectedCountries.items"
                :disabled="formData.worldwide"
                multiple
                required
                @update:modelValue="
                  updateField($event, 'countries', 'multiple')
                "
              />
              <div class="flex">
                <input
                  id="worldwide"
                  v-model="formData.worldwide"
                  type="checkbox"
                  name="worldwide"
                  value="Worldwide"
                  @change="updateField($event.target.checked, 'worldwide')"
                />
                <label for="worldwide" class="ml-2 text-sm">Worldwide</label>
              </div>
            </div>
            <div class="basis-1/2">
              <BaseListbox
                v-model="formData.selectedTopics.model"
                :label="formData.selectedTopics.label"
                :items="formData.selectedTopics.items"
                multiple
                required
                @update:modelValue="updateField($event, 'topics', 'multiple')"
              />
            </div>
          </div>
          <div class="md:flex">
            <div class="basis-full space-y-4">
              <BaseListbox
                v-model="formData.selectedActors.model"
                :label="formData.selectedActors.label"
                :items="formData.selectedActors.items"
                multiple
                @update:modelValue="
                  updateField($event, 'non_state-actors', 'multiple')
                "
              />
              <div class="flex">
                <input
                  id="allOrgs"
                  v-model="checkAllOrgs"
                  type="checkbox"
                  name="allOrgs"
                  @click="toggleAllOrgs()"
                />
                <label for="allOrgs" class="ml-2 text-sm"> All Orgs</label>
              </div>
              <Disclosure v-slot="{ open }">
                <DisclosureButton class="flex text-sm items-center">
                  <span>Show Dissem Orgs</span>
                  <ChevronDownIcon
                    class="h-4 w-4"
                    :class="open ? 'transform rotate-180' : ''"
                  />
                </DisclosureButton>
                <transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <DisclosurePanel>
                    <div class="grid grid-cols-3 md:grid-cols-6 gap-y-2">
                      <template
                        v-for="(org, index) in formData.selectedDissemOrgs
                          .items"
                        :key="index"
                      >
                        <div class="flex items-center">
                          <input
                            :id="org.name"
                            v-model="formData.selectedDissemOrgs.model"
                            type="checkbox"
                            :value="org"
                            class="ml-2"
                            @change="
                              updateField(
                                formData.selectedDissemOrgs.model,
                                'dissem_orgs',
                                'multiple'
                              )
                            "
                          />
                          <label
                            :for="org.name"
                            class="line-clamp-1 text-sm ml-1"
                          >
                            {{ org.name }}
                          </label>
                        </div>
                      </template>
                    </div>
                  </DisclosurePanel>
                </transition>
              </Disclosure>
            </div>
          </div>
          <div class="md:flex md:space-x-4 space-y-4 md:space-y-0">
            <div class="basis-2/3">
              <BaseInput
                v-model="formData.title"
                label="Title"
                type="text"
                required
                @update:modelValue="updateField($event, 'title')"
              />
            </div>
            <div class="basis-1/3">
              <BaseClassifier
                v-model="formData.titleClassificationXML"
                label="Title PM"
                required
                portionMark
                @update:classObj="
                  updateField($event, 'title', 'classification')
                "
              />
            </div>
          </div>
          <div class="md:flex md:space-x-4 space-y-4 md:space-y-0">
            <div class="basis-2/3">
              <BaseTextarea
                v-model="formData.summary"
                maxlength="4000"
                rows="6"
                label="Summary"
                required
                @update:modelValue="updateField($event, 'summary')"
              ></BaseTextarea>
            </div>
            <div class="basis-1/3">
              <BaseClassifier
                v-model="formData.summaryClassificationXML"
                label="Summary PM"
                required
                portionMark
                @update:classObj="
                  updateField($event, 'summary', 'classification')
                "
              />
            </div>
          </div>
          <div>
            <label for="body" class="font-medium text-sm">Body</label>
            <div class="mt-1">
              <ckeditor
                id="body"
                v-model="formData.editorData"
                :editor="editor"
                :config="editorConfig"
                @update:modelValue="updateField($event, 'html_body')"
              ></ckeditor>
            </div>
          </div>
        </BaseCard>
        <!-- Right Container -->
        <BaseCard class="lg:w-4/12 p-6">
          <div class="flex flex-col space-y-6">
            <p
              class="text-lg font-medium pb-2 border-b-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25"
            >
              Classification
            </p>
            <div>
              <BaseClassifier
                v-model="formData.classificationXML"
                label="Document Classification"
                required
                showClassBlock
                @update:classObj="
                  updateField($event, 'document', 'classification')
                "
              />
            </div>
            <p
              class="text-lg font-medium pb-2 border-b-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25"
            >
              Attachments
            </p>
            <DropZone
              v-slot="{ dropZoneActive }"
              class="w-full p-4 text-center shadow-md border dark:border-0 energy:border-0 border-gray-200 bg-white dark:bg-slate-700 energy:bg-zinc-600"
              @files-dropped="addFiles"
            >
              <label for="file-input" class="cursor-pointer">
                <template v-if="dropZoneActive">
                  <p>Drop them here to add them</p>
                </template>
                <template v-else>
                  <p>Drag your files here or</p>
                  <p>
                    <span class="font-semibold">click here</span> to select
                    files
                  </p>
                </template>
                <input
                  id="file-input"
                  type="file"
                  class="sr-only"
                  multiple
                  @change="onInputChange"
                />
              </label>
            </DropZone>
            <div
              class="border-b-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25 pb-2"
            >
              <h2 class="text-lg font-medium">Product Images</h2>
            </div>
            <div
              class="border-b-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25 pb-2"
            >
              <h2 class="text-lg font-medium">Supporting Attachments</h2>
              <ul v-show="files?.length" class="">
                <FilePreview
                  v-for="file of files"
                  :key="file.id"
                  :file="file"
                  tag="li"
                  @remove="removeFile"
                />
              </ul>
              <ul v-show="formData.attachments?.length" id="attachment-list">
                <li
                  v-for="(attachment, index) in formData.attachments"
                  :id="'attachment' + attachment.id"
                  :key="attachment"
                >
                  <div class="flex space-x-2 pb-2">
                    {{ attachment.file_name }} &nbsp;
                    <router-link
                      :to="
                        '/documents/' +
                        documentNumber +
                        '/attachments/' +
                        attachment.id
                      "
                      target="_blank"
                    >
                      <DocumentArrowDownIcon
                        class="h-5 w-5"
                        title="Download"
                        display="inline;"
                      />
                    </router-link>
                    <router-link
                      to=""
                      target="_blank"
                      @click.prevent="
                        removeDocument(attachment.id, documentNumber, index)
                      "
                    >
                      <DocumentMinusIcon
                        class="h-5 w-5"
                        title="Delete"
                        display="inline;"
                      />
                    </router-link>
                  </div>
                </li>
              </ul>
            </div>
            <div
              class="border-b-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25 pb-2"
            >
              <h2 class="text-lg font-medium">Details</h2>
            </div>
            <div>
              <BaseInput
                v-model="documentNumber"
                label="Doc Num (Permalink)"
                type="text"
                required
                disabled
              />
            </div>
            <div>
              <BaseDatepicker
                v-model="selectedPublicationDate"
                :enableTimePicker="false"
                week-start="0"
                auto-apply
                @update:modelValue="updateSelectedDate"
              >
                <template #trigger>
                  <BaseInput
                    v-model="formData.publicationDate"
                    label="Publication Date"
                    type="text"
                    required
                    disabled
                    :disabledColor="false"
                  />
                </template>
              </BaseDatepicker>
            </div>
            <div>
              <BaseTextarea
                v-model="formData.pocInfo"
                maxlength="4000"
                rows="4"
                label="POC Info"
              ></BaseTextarea>
            </div>
            <div>
              <BaseInput
                v-model="formData.producingOffice"
                label="Producing Office"
                type="text"
                disabled
              />
            </div>
          </div>
        </BaseCard>
      </div>
      <div class="flex my-4">
        <div class="flex flex-wrap gap-4">
          <BaseButton
            type="submit"
            :disabled="publishDisabled"
            @click.prevent="submit('publish')"
          >
            Publish
          </BaseButton>
          <BaseButton @click.prevent="submit('save')">Save</BaseButton>
          <BaseButton @click.prevent="openDialog"
            >Preview
            <BaseDialog
              class="max-w-[1300px]"
              :isOpen="isPreviewDialogOpen"
              @close="closePreviewDialog"
            >
              <ArticleView :doc_num="documentNumber" :wantsPreview="true" />
            </BaseDialog>
          </BaseButton>
          <BaseButton @click.prevent="cancel">Cancel</BaseButton>
        </div>
      </div>
    </form>
  </template>
  <!-- <BaseDialog
    :isOpen="isProductTypeDialogOpen"
    :title="'Product Type Change'"
    class="max-w-fit"
    @close="closeProductTypeDialog"
  >
    <p class="py-4 pr-4">
      Changing the product type will change some of the field values entered.
    </p>
    <template #actions>
      <BaseButton @click.prevent="closeProductTypeDialog">Okay</BaseButton>
    </template>
  </BaseDialog> -->
</template>

<script>
import { computed, inject, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import * as dayjs from "dayjs";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import {
  ChevronDownIcon,
  DocumentArrowDownIcon,
  DocumentMinusIcon,
} from "@heroicons/vue/24/solid";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "@/config/wireAxios";
import { getValueForCode, getValueForName } from "@/helpers";
import DropZone from "@/components/DropZone";
import FilePreview from "@/components/FilePreview";
import useFileList from "@/composables/file-list";
import createUploader from "@/composables/file-uploader";
import ArticleView from "@/views/ArticleView";

export default {
  components: {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    ChevronDownIcon,
    DocumentArrowDownIcon,
    DocumentMinusIcon,
    DropZone,
    FilePreview,
    ArticleView,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const createNotification = inject("create-notification");
    const documentNumber = route.params.doc_num;

    const loadingMetadata = computed(() => store.state.metadata.loading);
    const criteria = computed(() => store.state.metadata.criteria);
    const loadingDocument = computed(() => store.state.document.loading);
    const documentData = computed(() => store.state.document.data);
    const dissemOrgs = computed(
      () => store.state.formMetadata.dissem_orgs.items
    );
    const loadingDissemOrgs = computed(
      () => store.state.formMetadata.dissem_orgs.loading
    );
    // const productTypes = computed(
    //   () => store.state.formMetadata.product_types.items
    // );
    // const loadingProductTypes = computed(
    //   () => store.state.formMetadata.product_types.loading
    // );
    const editor = ClassicEditor;
    const editorConfig = ref({});
    const { files, addFiles, removeFile } = useFileList();
    const { uploadFiles } = createUploader(
      "/documents/" + documentNumber + "/attachments/"
    );
    const isProductTypeDialogOpen = ref(false);
    const openProductTypeDialog = () => {
      isProductTypeDialogOpen.value = true;
    };
    const closeProductTypeDialog = () => {
      isProductTypeDialogOpen.value = false;
    };

    const buildFormData = () => {
      return {
        attachments: [],
        classification: "",
        classificationXML: "",
        publicationDate: "",
        editorData: "",
        pocInfo: "",
        producingOffice: "DNI/NCTC",
        productType: "Current",
        selectedActors: {
          label: "Non State Actors",
          model: [],
          items: criteria.value.non_state_actors,
        },
        selectedCountries: {
          label: "Countries",
          model: [],
          //Omit Worldwide for the Dropdown Options
          items: criteria.value.countries.filter((a) => a.code !== "WW"),
        },
        selectedDissemOrgs: {
          label: "Dissem Orgs",
          model: [],
          items: dissemOrgs.value,
        },
        selectedProductType: {
          label: "Product Type",
          model: [],
          items: criteria.value.product_types,
        },
        selectedTopics: {
          label: "Topics",
          model: [],
          items: criteria.value.topics,
        },
        summary: "",
        summaryClassificationXML: "",
        title: "",
        titleClassificationXML: "",
        worldwide: null,
      };
    };

    const selectedPublicationDate = ref(null);
    const formData = ref(buildFormData());
    const payload = ref({});

    const attachmentDropzoneFile = ref("");
    let checkAllOrgs = ref(false);

    const toggleAllOrgs = () => {
      dissemOrgs.value.forEach((org) => {
        if (!checkAllOrgs.value) {
          if (!formData.value.selectedDissemOrgs.includes(org)) {
            formData.value.selectedDissemOrgs.push(org);
          }
        } else {
          formData.value.selectedDissemOrgs.push(org);
        }
      });
    };

    const attachmentDrop = (event) => {
      attachmentDropzoneFile.value = event.dataTransfer.files[0];
    };

    const attachmentSelectedFile = () => {
      attachmentDropzoneFile.value =
        document.querySelector(".fileUpload").files[0];
    };

    const updateField = (model, property, type) => {
      const codes = [];
      switch (type) {
        case "classification":
          switch (property) {
            case "document":
              payload.value.classification = model.marking;
              payload.value.classification_xml = model.xml;
              payload.value.classification_decl_fmt = model.block
                ? `Classified By: ${model.block.classifiedBy}\nDerived From: ${model.block.derivedFrom}\nDeclassify On: ${model.block.declassOn}`
                : "";
              break;
            case "title":
              payload.value.title_classif = model.marking;
              payload.value.title_classif_xml = model.xml;
              break;
            case "summary":
              payload.value.summary_classif = model.marking;
              payload.value.summary_classif_xml = model.xml;
              break;
          }
          break;
        case "multiple":
          model.forEach((option) => {
            codes.push(option.code);
          });
          payload.value[property] = codes;
          break;
        default:
          payload.value[property] =
            property === "product_type_id" ? model.id : model;
          if (property === "worldwide" && model) {
            payload.value.countries = [];
            formData.value.selectedCountries.model = [];
          }
          if (property === "html_body" && !model) {
            payload.value[property] = "<p></p>";
          }
      }
    };

    const updateSelectedDate = (model) => {
      formData.value.publicationDate = dayjs(model).format("YYYY-MM-DD");
      payload.value.date_published = formData.value.publicationDate;
    };

    const publishDisabled = computed(() => {
      return (
        (formData.value.selectedCountries.model.length === 0 &&
          !formData.value.worldwide) ||
        formData.value.selectedTopics.model.length === 0 ||
        !formData.value.title ||
        !formData.value.titleClassificationXML ||
        !formData.value.summary ||
        !formData.value.summaryClassificationXML ||
        !formData.value.classificationXML ||
        !formData.value.publicationDate
      );
    });

    const isPreviewDialogOpen = ref(false);
    const closePreviewDialog = () => {
      isPreviewDialogOpen.value = true;
    };
    const openDialog = () => {
      isPreviewDialogOpen.value = true;
    };

    const preloadPayload = (data) => {
      payload.value = Object.assign({}, data);
      payload.value.countries = data.countries.map((country) => country.code);
      payload.value.topics = data.topics.map((topic) => topic.code);
      payload.value.non_state_actors = data.non_state_actors.map(
        (nonStateActors) => nonStateActors.code
      );
    };

    onMounted(() => {
      store.dispatch("formMetadata/getDissemOrgs");
      store.dispatch("formMetadata/getProductTypes");
      store.dispatch("document/getDocument", {
        date: route.params.date,
        id: route.params.id,
      });
    });

    watch([loadingMetadata, loadingDissemOrgs], () => {
      if (!loadingMetadata.value && !loadingDissemOrgs.value) {
        formData.value = buildFormData();
      }
    });

    watch([loadingDocument], () => {
      console.log("loading changed!: ", loadingDocument.value);
      if (!loadingDocument.value) {
        preloadPayload(documentData.value);

        formData.value.worldwide = documentData.value.worldwide;
        if (!formData.value.worldwide) {
          const countriesToSelect = [];
          documentData.value.countries.forEach((countryFromBackend) => {
            let countryValue = getValueForCode(
              formData.value.selectedCountries.items,
              countryFromBackend.code
            );
            countriesToSelect.push(countryValue);
          });
          formData.value.selectedCountries.model = countriesToSelect;
        }
        const topicsToSelect = [];
        documentData.value.topics.forEach((topicFromBackend) => {
          let topicValue = getValueForCode(
            formData.value.selectedTopics.items,
            topicFromBackend.code
          );
          topicsToSelect.push(topicValue);
        });
        formData.value.selectedTopics.model = topicsToSelect;
        const actorsToSelect = [];
        documentData.value.non_state_actors.forEach((actorFromBackend) => {
          let actorValue = getValueForName(
            formData.value.selectedActors.items,
            actorFromBackend.name
          );
          actorsToSelect.push(actorValue);
        });
        formData.value.selectedActors.model = actorsToSelect;
        const dissemsToSelect = [];
        documentData.value.dissem_orgs.forEach((dissemFromBackend) => {
          let dissemValue = getValueForCode(
            formData.value.selectedDissemOrgs.items,
            dissemFromBackend
          );
          dissemsToSelect.push(dissemValue);
        });
        formData.value.selectedDissemOrgs.model = dissemsToSelect;
        //formData.value.selectedOffice.model = producing_offices.value[0]
        formData.value.selectedProductType.model =
          formData.value.selectedProductType.items.find(
            (productFromBackend) =>
              productFromBackend.code === documentData.value.product_type_id
          );
        formData.value.publicationDate = documentData.value.date_published;
        selectedPublicationDate.value = dayjs(
          documentData.value.date_published
        ).toDate();
        formData.value.classificationXML =
          documentData.value.classification_xml;
        formData.value.pocInfo = documentData.value.poc_info;
        formData.value.title = documentData.value.title;
        formData.value.attachments = documentData.value.attachments;
        formData.value.summary = documentData.value.summary;
        formData.value.summaryClassificationXML =
          documentData.value.summary_classif_xml;
        formData.value.titleClassificationXML =
          documentData.value.title_classif_xml;
        formData.value.summaryClassificationXML =
          documentData.value.summary_classif_xml;
        formData.value.editorData = documentData.value.html_body;
      }
    });

    const onInputChange = (e) => {
      console.log("is this happening");
      addFiles(e.target.files);
      e.target.value = null;
      uploadFiles(files.value);
    };

    const removeDocument = (attachmentID, doc_num) => {
      fetch("/documents/" + doc_num + "/attachments/" + attachmentID, {
        method: "DELETE",
      })
        .then(() => {
          var ulElem = document.getElementById("attachment" + attachmentID);
          ulElem.parentNode.removeChild(ulElem);
        })
        .catch(console.log("Failed"));
    };

    const submit = (action) => {
      if (action === "publish" && publishDisabled.value) {
        console.warn(
          "You're attempting to publish an article without the required fields."
        );
      } else {
        axios
          .post("/articles/processDocument", {
            document_action: action,
            // analysis_type_id: form.selectedProductType.id,
            analysis_type_id: 5,
            id: route.params.id,
            wire_id: route.params.date,
            producing_office: "DNI/NCTC",
            publicationDate: route.params.date,
            ...payload.value,
          })
          .then((response) => {
            if (response.data.error) {
              createNotification({
                title: "Error",
                message: response.data.error,
                type: "error",
                autoClose: false,
              });
            } else {
              if (action === "publish") {
                createNotification({
                  title: "Successfully Published",
                  message: response.data.status,
                  type: "success",
                });
                router.push({
                  name: "article",
                  params: { doc_num: route.params.doc_num },
                });
              } else {
                store.dispatch("document/getDocument", {
                  date: route.params.date,
                  id: route.params.id,
                });
                createNotification({
                  title: "Successfully Saved",
                  message: response.data.status,
                  type: "success",
                });
              }
            }
          });
      }
    };

    const cancel = () => {
      router.push({ name: "publish", params: { date: route.params.date } });
    };

    return {
      loadingMetadata,
      loadingDocument,
      loadingDissemOrgs,
      editor,
      editorConfig,
      files,
      addFiles,
      removeFile,
      formData,
      selectedPublicationDate,
      document,
      attachmentDropzoneFile,
      checkAllOrgs,
      toggleAllOrgs,
      attachmentDrop,
      attachmentSelectedFile,
      isPreviewDialogOpen,
      closePreviewDialog,
      openDialog,
      onInputChange,
      removeDocument,
      publishDisabled,
      documentNumber,
      updateField,
      updateSelectedDate,
      submit,
      cancel,
      isProductTypeDialogOpen,
      openProductTypeDialog,
      closeProductTypeDialog,
    };
  },
};
</script>

<style>
.ck-editor__editable_inline {
  height: 450px;
}
</style>
