<template>
  <p
    class="font-semibold text-2xl py-4 border-b-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25"
  >
    Edit Product
  </p>
  <template v-if="loadingMetadata || loadingDissemOrgs || loadingDocument">
    <div class="max-w-fit m-auto mt-[20vh]">
      <BaseLoadingSpinner class="h-24 w-24" />
    </div>
  </template>
  <template v-else>
    <BaseFormCard :saveState="savingDocument">
        <div
          class="lg:min-w-[215px] border-r border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25"
        >
          <div
            class="sticky top-[75px] lg:top-[125px] flex flex-col space-y-2 pr-6"
          >
            <template v-for="category in categories" :key="category">
              <div
                class="cursor-pointer inline-flex lg:w-[200px] rounded p-2 hover:bg-slate-100 dark:hover:bg-slate-800/75 energy:hover:bg-zinc-700/75"
                @click="
                  document
                    .getElementById(`${category.target}Section`)
                    .scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                      inline: 'nearest',
                    })
                "
              >
                <span class="sr-only">{{ category.name }}</span>
                <component :is="category.icon" class="h-6 w-6" /><span
                  class="hidden lg:block pl-4"
                  >{{ category.name }}</span
                >
              </div>
            </template>
          </div>
        </div>
        <div class="w-full px-8">
          <div class="flex flex-col space-y-8">
            <div
              id="productTypeSection"
              class="flex flex-col space-y-8 pb-8 border-b border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25"
            >
              <div>
                <h2 class="font-medium text-xl">Product Type</h2>
                <p
                  class="text-slate-600 dark:text-slate-400 energy:text-zinc-400 text-sm"
                >
                  Changing the product type will prepopulate existing fields so
                  be careful when changing it.
                </p>
              </div>
              <BaseListbox
                v-model="formData.selectedProductType.model"
                :label="formData.selectedProductType.label"
                :items="formData.selectedProductType.items"
                class="lg:w-1/3"
                @update:modelValue="updateField($event, 'product_type_id')"
              />
            </div>
            <div
              id="requiredSection"
              class="flex flex-col space-y-8 pb-8 border-b border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25"
            >
              <div>
                <h2 class="font-medium text-xl">Required</h2>
                <p
                  class="text-slate-600 dark:text-slate-400 energy:text-zinc-400 text-sm"
                >
                  This information is required in order to save the product.
                </p>
              </div>
              <div class="flex flex-col space-y-4">
                <div
                  class="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:space-x-4"
                >
                  <div class="lg:w-3/4">
                    <BaseInput
                      v-model="formData.title"
                      label="Title"
                      type="text"
                      required
                      @update:modelValue="updateField($event, 'title')"
                    />
                  </div>
                  <div class="lg:w-1/4">
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
                <div
                  class="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:space-x-4"
                >
                  <div class="lg:w-3/4">
                    <BaseTextarea
                      v-model="formData.summary"
                      maxlength="4000"
                      rows="6"
                      label="Summary"
                      required
                      @update:modelValue="updateField($event, 'summary')"
                    />
                  </div>
                  <div class="lg:w-1/4">
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
                <div class="lg:w-1/4">
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
                <div
                  class="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:space-x-4"
                >
                  <div class="lg:w-1/3 space-y-4">
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
                        @change="
                          updateField($event.target.checked, 'worldwide')
                        "
                      />
                      <label for="worldwide" class="ml-2 text-sm"
                        >Worldwide</label
                      >
                    </div>
                  </div>
                  <BaseListbox
                    v-model="formData.selectedTopics.model"
                    :label="formData.selectedTopics.label"
                    :items="formData.selectedTopics.items"
                    multiple
                    required
                    class="lg:w-1/3"
                    @update:modelValue="
                      updateField($event, 'topics', 'multiple')
                    "
                  />
                </div>
              </div>
            </div>
            <div
              id="additionalSection"
              class="flex flex-col space-y-8 pb-8 border-b border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25"
            >
              <div>
                <h2 class="font-medium text-xl">Additional</h2>
                <p
                  class="text-slate-600 dark:text-slate-400 energy:text-zinc-400 text-sm"
                >
                  Further enhance your product by adding more details.
                </p>
              </div>
              <div class="flex flex-col space-y-4">
                <div>
                  <label for="body" class="font-medium text-sm"
                    >Product Content</label
                  >
                  <div class="mt-1 w-[95%]">
                    <ckeditor
                      id="body"
                      v-model="formData.editorData"
                      :editor="editor"
                      :config="editorConfig"
                      @update:modelValue="updateField($event, 'html_body')"
                    ></ckeditor>
                  </div>
                </div>
                <BaseListbox
                  v-model="formData.selectedActors.model"
                  :label="formData.selectedActors.label"
                  :items="formData.selectedActors.items"
                  multiple
                  class="lg:w-1/2"
                  @update:modelValue="
                    updateField($event, 'non_state_actors', 'multiple')
                  "
                />
                <div class="lg:w-1/2">
                  <BaseTextarea
                    v-model="formData.pocInfo"
                    maxlength="4000"
                    rows="4"
                    label="POC Info"
                  ></BaseTextarea>
                </div>
                <div class="lg:w-1/3 space-y-4">
                  <BaseListbox
                    v-model="formData.selectedDissemOrgs.model"
                    :label="formData.selectedDissemOrgs.label"
                    :items="formData.selectedDissemOrgs.items"
                    multiple
                    @update:modelValue="
                      updateField($event, 'dissem_orgs', 'multiple')
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
                    <label for="allOrgs" class="ml-2 text-sm"
                      >Select All Orgs</label
                    >
                  </div>
                </div>
              </div>
            </div>
            <div
              id="attachmentsSection"
              class="flex flex-col space-y-8 pb-8 border-b border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25"
            >
              <div>
                <h2 class="font-medium text-xl">Attachments</h2>
                <p
                  class="text-slate-600 dark:text-slate-400 energy:text-zinc-400 text-sm"
                >
                  Attachments will be immediately saved upon upload.
                </p>
              </div>
              <div class="flex flex-col space-y-4">
                <DropZone
                  v-slot="{ dropZoneActive }"
                  class="lg:w-3/4 min-h-[8rem] flex justify-center items-center p-4 text-center border-2 border-gray-300 border-dashed rounded-md"
                  @files-dropped="onDrop"
                >
                  <label for="file-input" class="cursor-pointer">
                    <template v-if="dropZoneActive">
                      <p>Drop files here</p>
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
                <div v-if="formData.attachments?.length || files?.length">
                  <h2 class="font-medium">Uploaded Files</h2>
                  <ul>
                    <FilePreview
                      v-for="file of files"
                      :key="file.id"
                      :file="file"
                      tag="li"
                      @remove="removeFile"
                    />
                  </ul>
                  <ul
                    v-show="formData.attachments?.length"
                    id="attachment-list"
                  >
                    <li
                      v-for="(attachment, index) in formData.attachments"
                      :id="'attachment' + attachment.id"
                      :key="attachment"
                    >
                      <div class="flex space-x-2 pt-2 pb-2">
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
              </div>
            </div>
            <div
              id="classificationSection"
              class="flex flex-col space-y-8 pb-8"
            >
              <div>
                <h2 class="font-medium text-xl">Classification</h2>
                <p
                  class="text-slate-600 dark:text-slate-400 energy:text-zinc-400 text-sm"
                >
                  The product's classification should be classified at the
                  highest level.
                </p>
              </div>
              <div class="lg:w-1/2">
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
            </div>
          </div>
          <div class="flex my-4 mt-10">
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
                  <ProductView :doc_num="documentNumber" :wantsPreview="true" />
                </BaseDialog>
              </BaseButton>
              <BaseButton @click.prevent="cancel">Cancel</BaseButton>
              <BaseButton type="danger" @click.prevent="openDeleteDialog"
                >Delete</BaseButton
              >
            </div>
          </div>
        </div>
      </BaseFormCard>
   
    <BaseDialog
      :isOpen="isDeleteDialogOpen"
      :title="'Delete Product'"
      class="max-w-fit"
      @close="closeDeleteDialog"
    >
      <p class="py-4 pr-4">Are you sure you want to do this?</p>
      <template #actions>
        <BaseButton @click.prevent="closeDeleteDialog">Cancel</BaseButton>
        <BaseButton type="danger" @click.prevent="deleteDocument">
          Delete
        </BaseButton>
      </template>
    </BaseDialog>
  </template>
</template>

<script>
import { computed, inject, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import * as dayjs from "dayjs";
import {
  DocumentArrowDownIcon,
  DocumentMinusIcon,
} from "@heroicons/vue/24/solid";
import {
  BriefcaseIcon,
  KeyIcon,
  PlusCircleIcon,
  PaperClipIcon,
  LockClosedIcon,
} from "@heroicons/vue/24/outline";
import { metadata } from "@/config";
import axios from "@/config/wireAxios";
import { getValueForCode, getValueForName } from "@/helpers";
import DropZone from "@/components/DropZone";
import FilePreview from "@/components/FilePreview";
import useFileList from "@/composables/file-list";
import createUploader from "@/composables/file-uploader";
import ProductView from "@/views/ProductView";
//ckEditor
import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import EssentialsPlugin from "@ckeditor/ckeditor5-essentials/src/essentials";
import BoldPlugin from "@ckeditor/ckeditor5-basic-styles/src/bold";
import ItalicPlugin from "@ckeditor/ckeditor5-basic-styles/src/italic";
import Font from "@ckeditor/ckeditor5-font/src/font";
import LinkPlugin from "@ckeditor/ckeditor5-link/src/link";
import Heading from "@ckeditor/ckeditor5-heading/src/heading";
import ParagraphPlugin from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import DocumentListProperties from "@ckeditor/ckeditor5-list/src/documentlistproperties";
import Image from "@ckeditor/ckeditor5-image/src/image";
import ImageInsert from "@ckeditor/ckeditor5-image/src/imageinsert";
import ImageToolbar from "@ckeditor/ckeditor5-image/src/imagetoolbar";
import ImageCaption from "@ckeditor/ckeditor5-image/src/imagecaption";
import ImageStyle from "@ckeditor/ckeditor5-image/src/imagestyle";
import ImageResize from "@ckeditor/ckeditor5-image/src/imageresize";
import ImageLink from "@ckeditor/ckeditor5-link/src/linkimage";
import SimpleUploadAdapter from "@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter";

const categories = [
  {
    name: "Product Type",
    icon: "BriefcaseIcon",
    target: "productType",
  },
  {
    name: "Required",
    icon: "KeyIcon",
    target: "required",
  },
  {
    name: "Additional",
    icon: "PlusCircleIcon",
    target: "additional",
  },
  {
    name: "Attachments",
    icon: "PaperClipIcon",
    target: "attachments",
  },
  {
    name: "Classification",
    icon: "LockClosedIcon",
    target: "classification",
  },
];

export default {
  components: {
    BriefcaseIcon,
    KeyIcon,
    PlusCircleIcon,
    PaperClipIcon,
    LockClosedIcon,
    DocumentArrowDownIcon,
    DocumentMinusIcon,
    DropZone,
    FilePreview,
    ProductView,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const createNotification = inject("create-notification");
    const documentNumber = route.params.doc_num;
    const isCommunityExclusive = computed(
      () => store.getters["user/isCommunityExclusive"]
    );
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
    const editor = ClassicEditor;
    const editorConfig = ref({
      plugins: [
        EssentialsPlugin,
        BoldPlugin,
        ItalicPlugin,
        Font,
        LinkPlugin,
        Heading,
        ParagraphPlugin,
        DocumentListProperties,
        Image,
        ImageInsert,
        ImageToolbar,
        ImageCaption,
        ImageStyle,
        ImageResize,
        ImageLink,
        SimpleUploadAdapter,
      ],
      toolbar: {
        items: [
          "heading",
          "|",
          "bold",
          "italic",
          "|",
          "fontSize",
          "fontFamily",
          "fontColor",
          "|",
          "numberedList",
          "bulletedList",
          "|",
          "link",
          "insertImage",
          "|",
          "undo",
          "redo",
          "|",
        ],
      },
      list: {
        properties: {
          styles: true,
          startIndex: true,
          reversed: true,
        },
      },
      image: {
        styles: ["full", "side", "alignLeft", "alignRight"],
        toolbar: [
          "resizeImage:original",
          "resizeImage:50",
          "resizeImage:75",
          "|",
          "imageStyle:block",
          "imageStyle:alignRight",
          "imageStyle:alignLeft",
          "|",
          "toggleImageCaption",
          "imageTextAlternative",
          "|",
          "linkImage",
        ],
      },
      simpleUpload: {
        //the URL that images are uploaded to.
        uploadUrl:
          "/documents/" + documentNumber + "/attachments?is_visible=false",
        //Enable the XMLHttpRequest.withCredentials property.
        withCredentials: true,
        //Headers sent along with the XMLHttpRequest to the upload server.
        headers: {},
      },
    });
    const { files, addFiles, removeFile } = useFileList();
    const { uploadFiles } = createUploader(
      "/documents/" + documentNumber + "/attachments/"
    );
    const isDeleteDialogOpen = ref(false);
    const openDeleteDialog = () => {
      isDeleteDialogOpen.value = true;
    };
    const closeDeleteDialog = () => {
      isDeleteDialogOpen.value = false;
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
          items: isCommunityExclusive.value
            ? criteria.value.product_types.filter(
                (product) => product.name === "Community Product"
              )
            : criteria.value.product_types,
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
          if (!formData.value.selectedDissemOrgs.model.includes(org)) {
            formData.value.selectedDissemOrgs.model.push(org);
          }
        } else {
          formData.value.selectedDissemOrgs.model = [];
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

    const prepopulateFields = (model) => {
      const { payload } = metadata.product_types.find(
        ({ code }) => code === model.code
      );
      const product = { ...payload };
      if (product.title) {
        formData.value.title = `${dayjs().format("DD MMMM YYYY")} ${
          product.title
        }`;
      }
      if (product.summary) {
        formData.value.summary = product.summary;
      }
      if (product.poc_info) {
        formData.value.pocInfo = product.poc_info;
      }
      const topics = product.topics ? product.topics : ["TERR"];
      const topicsToSelect = [];
      topics.forEach((topic) => {
        const topicValue = getValueForCode(
          formData.value.selectedTopics.items,
          topic
        );
        topicsToSelect.push(topicValue);
      });
      formData.value.selectedTopics.model = topicsToSelect;
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
          if (property === "product_type_id") {
            prepopulateFields(model);
          }
          payload.value[property] =
            property === "product_type_id" ? model.code : model;
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
      isPreviewDialogOpen.value = false;
    };
    const openDialog = () => {
      isPreviewDialogOpen.value = true;
    };

    const preloadPayload = (data) => {
      payload.value = Object.assign({}, data);
      payload.value.countries = data.countries.map((country) => country.code);
      payload.value.topics = data.topics.map((topic) => topic.code);
      payload.value.non_state_actors = data.non_state_actors.map(
        (nonStateActors) => nonStateActors.name
      );
    };

    onMounted(() => {
      store.dispatch("formMetadata/getDissemOrgs");
      store.dispatch("formMetadata/getProductTypes");
    });

    watch([loadingMetadata, loadingDissemOrgs], () => {
      if (!loadingMetadata.value && !loadingDissemOrgs.value) {
        store.dispatch("document/getDocument", {
          date: route.params.date,
          id: route.params.id,
        });
      }
    });

    watch([loadingMetadata, loadingDissemOrgs, loadingDocument], () => {
      if (
        !loadingMetadata.value &&
        !loadingDissemOrgs.value &&
        !loadingDocument.value
      ) {
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
      addFiles(e.target.files);
      e.target.value = null;
      uploadFiles(files.value);
    };

    const onDrop = (file) => {
      addFiles(file);
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

    const deleteDocument = () => {
      if (process.env.NODE_ENV === "low") {
        createNotification({
          title: "Successfully Deleted",
          message: "The product has been deleted successfully.",
          type: "success",
        });
        router.push({
          name: "publish",
          params: { date: route.params.date },
        });
      } else {
        axios
          .post("/documents/" + route.params.doc_num + "/deleteMe")
          .then((response) => {
            if (response.data.error) {
              createNotification({
                title: "Error",
                message: response.data.error,
                type: "error",
                autoClose: false,
              });
            } else {
              createNotification({
                title: "Successfully Deleted",
                message: response.data.status,
                type: "success",
              });
              router.push({
                name: "publish",
                params: { date: route.params.date },
              });
            }
          });
      }
    };

    const savingDocument = ref(false);

    const submit = (action) => {
      if (action === "publish" && publishDisabled.value) {
        console.warn(
          "You're attempting to publish an article without the required fields."
        );
      } else {
        savingDocument.value = true;
        axios
          .post("/articles/processDocument", {
            document_action: action,
            // analysis_type_id: form.selectedProductType.id,
            analysis_type_id: 5,
            id: route.params.id,
            wire_id: route.params.date,
            producing_office: "DNI/NCTC",
            publication_date: route.params.date,
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
          if (process.env.NODE_ENV === "low") {
            setTimeout(() => {
              savingDocument.value = false;
              createNotification({
                    message: "Successfully Saved",
                    type: "success",
                  });
            }, 3000)
          } else {
            savingDocument.value = false;
          }
      }
    };

    const cancel = () => {
      router.push({ name: "publish", params: { date: route.params.date } });
    };

    return {
      categories,
      loadingMetadata,
      loadingDocument,
      loadingDissemOrgs,
      editor,
      editorConfig,
      isDeleteDialogOpen,
      openDeleteDialog,
      closeDeleteDialog,
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
      onDrop,
      removeDocument,
      deleteDocument,
      publishDisabled,
      documentNumber,
      updateField,
      updateSelectedDate,
      submit,
      savingDocument,
      cancel,
    };
  },
};
</script>

<style>
.ck-editor__editable_inline {
  height: 450px;
}
.ck.ck-content ul,
.ck.ck-content ul li {
  list-style-type: inherit;
}
.ck.ck-content ol,
.ck.ck-content ul {
  padding-left: 40px;
}
.ck.ck-content h2 {
  font-size: 1.5em;
}
.ck.ck-content h3 {
  font-size: 1.3em;
}
.ck.ck-content h4 {
  font-size: 1.1em;
}
.ck.ck-content p {
  font-size: 0.9em;
}
</style>
