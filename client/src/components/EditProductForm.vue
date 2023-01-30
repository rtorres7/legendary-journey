<template>
  <form ref="publishingForm">
    <BaseCard class="mt-4">
      <div class="flex">
        <div
          class="lg:min-w-[215px] p-6 border-r border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25"
        >
          <div
            class="sticky top-[75px] lg:top-[125px] flex flex-col space-y-2 pr-6"
          >
            <template v-for="category in categories" :key="category">
              <div
                class="cursor-pointer inline-flex lg:w-[200px] rounded p-2 hover:bg-slate-100 dark:hover:bg-slate-800/75 energy:hover:bg-zinc-700/75"
                @click="
                  document
                    .getElementById(`${category.target}-section`)
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
        <div class="w-full">
          <div class="flex flex-col">
            <div class="flex flex-col space-y-8 py-6 px-8">
              <EditProductFormSection
                id="product-type"
                title="Product Type"
                description="Changing the product type will prepopulate existing fields so be careful when changing it."
              >
                <BaseListbox
                  v-model="form.productType"
                  :label="'Product Type'"
                  :items="lists.productTypes"
                  class="lg:w-1/3"
                  @update:modelValue="updateField($event, 'product_type_id')"
                />
              </EditProductFormSection>
              <EditProductFormSection
                id="required"
                title="Required"
                description="This information is required in order to save the product."
              >
                <div class="flex flex-col space-y-4">
                  <div
                    class="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:space-x-4"
                  >
                    <div class="lg:w-3/4">
                      <BaseInput
                        v-model="form.title"
                        label="Title"
                        type="text"
                        required
                        @update:modelValue="updateField($event, 'title')"
                      />
                    </div>
                    <div class="lg:w-1/4">
                      <BaseClassifier
                        v-model="form.titleClassificationXML"
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
                        v-model="form.summary"
                        maxlength="4000"
                        rows="6"
                        label="Summary"
                        required
                        @update:modelValue="updateField($event, 'summary')"
                      />
                    </div>
                    <div class="lg:w-1/4">
                      <BaseClassifier
                        v-model="form.summaryClassificationXML"
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
                          v-model="form.publicationDate"
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
                        v-model="form.countries"
                        :label="'Countries'"
                        :items="lists.countries"
                        :disabled="form.worldwide"
                        multiple
                        required
                        @update:modelValue="
                          updateField($event, 'countries', 'multiple')
                        "
                      />
                      <div class="flex">
                        <input
                          id="worldwide"
                          v-model="form.worldwide"
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
                      v-model="form.topics"
                      :label="'Topics'"
                      :items="lists.topics"
                      multiple
                      required
                      class="lg:w-1/3"
                      @update:modelValue="
                        updateField($event, 'topics', 'multiple')
                      "
                    />
                  </div>
                </div>
              </EditProductFormSection>
              <EditProductFormSection
                id="additional"
                title="Additional"
                description="Further enhance your product by adding more details."
              >
                <div class="flex flex-col space-y-4">
                  <!-- <div>
                    <label class="text-sm font-medium">Thumbnail</label>
                    <div
                      class="w-fit mt-1 rounded shadow-sm text-xs md:text-sm bg-transparent border border-slate-900/10 dark:border-slate-50/[0.25] energy:border-zinc-50/25"
                    >
                      <label
                        for="image-input"
                        class="relative cursor-pointer focus-within:ring-2 font-medium"
                      >
                        <div class="px-2 md:px-4 py-2">Choose File</div>
                        <input
                          id="image-input"
                          name="image-input"
                          type="file"
                          class="sr-only"
                          accept=".jpeg,.png,.jpg"
                          @change="uploadThumbnail"
                        />
                      </label>
                    </div>
                  </div> -->
                  <div>
                    <BaseCkEditor
                      v-model="form.editorData"
                      :label="'Product Content'"
                      :extraConfig="extraConfig"
                      @update:modelValue="updateField($event, 'html_body')"
                    />
                  </div>
                  <div class="lg:w-1/2">
                    <BaseTextarea
                      v-model="form.pocInfo"
                      maxlength="4000"
                      rows="4"
                      label="POC Info"
                      @update:modelValue="updateField($event, 'poc_info')"
                    ></BaseTextarea>
                  </div>
                  <div class="lg:w-1/3 space-y-4">
                    <BaseListbox
                      v-model="form.dissemOrgs"
                      :label="'Dissem Orgs'"
                      :items="lists.dissemOrgs"
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
                        >Select All Orgs<span class="ml-2 italic"
                          >(includes NT50 Organizations)</span
                        ></label
                      >
                    </div>
                  </div>
                </div>
              </EditProductFormSection>
              <EditProductFormSection
                id="attachments"
                title="Attachments"
                description="Attachments will be immediately saved upon upload."
              >
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
                          <span class="font-semibold">click here</span> to
                          select files
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
                  <div v-if="form.attachments?.length || files?.length">
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
                    <ul v-show="form.attachments?.length" id="attachment-list">
                      <li
                        v-for="(attachment, index) in form.attachments"
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
                              removeDocument(
                                attachment.id,
                                documentNumber,
                                index
                              )
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
              </EditProductFormSection>
              <EditProductFormSection
                id="classification"
                title="Classification"
                description="The product's classification should be classified at the
                    highest level."
              >
                <div class="lg:w-1/2">
                  <BaseClassifier
                    v-model="form.classificationXML"
                    label="Document Classification"
                    required
                    showClassBlock
                    @update:classObj="
                      updateField($event, 'document', 'classification')
                    "
                  />
                </div>
              </EditProductFormSection>
            </div>
            <div
              class="flex flex-wrap gap-4 justify-end py-6 px-8 bg-slate-50 dark:bg-slate-800/75 energy:bg-zinc-700/25"
            >
              <BaseButton
                color="secondary"
                type="submit"
                :disabled="publishDisabled"
                @click.prevent="publishProduct"
              >
                Publish
              </BaseButton>
              <BaseButton color="secondary" @click.prevent="saveProduct"
                >Save</BaseButton
              >
              <BaseButton color="secondary" @click.prevent="openPreviewDialog"
                >Preview
                <BaseDialog
                  class="max-w-[1300px]"
                  :isOpen="isPreviewDialogOpen"
                  @close="closePreviewDialog"
                >
                  <ProductView :doc_num="documentNumber" :wantsPreview="true" />
                </BaseDialog>
              </BaseButton>
              <BaseButton color="secondary" @click.prevent="cancel"
                >Cancel</BaseButton
              >
              <BaseButton color="danger" @click.prevent="openDeleteDialog"
                >Delete</BaseButton
              >
            </div>
          </div>
        </div>
      </div>
    </BaseCard>
  </form>
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
  <BaseOverlay :show="savingProduct">
    <div class="max-w-xs inline-block">
      <p class="mb-4 font-semibold text-2xl">Saving Product...</p>
      <div class="w-fit m-auto">
        <BaseLoadingSpinner class="h-16 w-16" />
      </div>
    </div>
  </BaseOverlay>
  <BaseOverlay :show="publishingProduct">
    <div class="max-w-xs inline-block">
      <p class="mb-4 font-semibold text-2xl">Publishing Product...</p>
      <div class="w-fit m-auto">
        <BaseLoadingSpinner class="h-16 w-16" />
      </div>
    </div>
  </BaseOverlay>
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
import axios from "@/config/wireAxios";
import { metadata } from "@/config";
import { mockDocument } from "@/data";
import { getValueForCode } from "@/helpers";
import useFileList from "@/composables/file-list";
import createUploader from "@/composables/file-uploader";
import DropZone from "@/components/DropZone";
import FilePreview from "@/components/FilePreview";
import EditProductFormSection from "@/components/EditProductFormSection";
import ProductView from "@/views/ProductView";
import SimpleUploadAdapter from "@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter";

const categories = [
  {
    name: "Product Type",
    icon: "BriefcaseIcon",
    target: "product-type",
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
    EditProductFormSection,
    ProductView,
  },
  props: {
    product: {
      type: Object,
      required: true,
    },
    documentNumber: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const extraConfig = {
      plugins: [SimpleUploadAdapter],
      toolbar: {
        items: ["insertImage"],
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
          "/documents/" +
          props.documentNumber +
          "/attachments?is_visible=false",
        //Enable the XMLHttpRequest.withCredentials property.
        withCredentials: true,
        //Headers sent along with the XMLHttpRequest to the upload server.
        headers: {},
      },
    };
    const createNotification = inject("create-notification");
    const isCommunityExclusive = computed(
      () => store.getters["user/isCommunityExclusive"]
    );
    const { files, addFiles, removeFile } = useFileList();
    const { uploadFiles } = createUploader(
      "/documents/" + props.documentNumber + "/attachments/"
    );
    const product = ref(props.product);
    const savingProduct = ref(false);
    const publishingProduct = ref(false);
    const criteria = computed(() => store.state.metadata.criteria);
    const lists = {
      countries: criteria.value.countries.filter((a) => a.code !== "WW"),
      dissemOrgs: criteria.value.dissem_orgs,
      productTypes: isCommunityExclusive.value
        ? criteria.value.product_types
            .filter((product) => product.name === "Community Product")
            .filter((product) => product.publishable === true)
        : criteria.value.product_types.filter(
            (product) => product.publishable === true
          ),
      topics: criteria.value.topics,
    };
    const form = ref({
      attachments: [],
      classification: "",
      classificationXML: "",
      countries: [],
      dissemOrgs: [],
      editorData: "",
      pocInfo: "",
      productType: [],
      publicationDate: "",
      //producingOffice: "DNI/NCTC",
      summary: "",
      summaryClassificationXML: "",
      title: "",
      titleClassificationXML: "",
      topics: [],
      worldwide: null,
    });
    const payload = ref({});
    const checkAllOrgs = ref(false);
    const selectedPublicationDate = ref(null);
    const attachmentDropzoneFile = ref("");

    const attachmentDrop = (event) => {
      attachmentDropzoneFile.value = event.dataTransfer.files[0];
    };

    const attachmentSelectedFile = () => {
      attachmentDropzoneFile.value =
        document.querySelector(".fileUpload").files[0];
    };

    const toggleAllOrgs = () => {
      let payloadOrgs = [];
      form.value.dissemOrgs = [];
      if (!checkAllOrgs.value) {
        lists.dissemOrgs.forEach((org) => {
          form.value.dissemOrgs.push(org);
          payloadOrgs.push(org.code);
        });
      }
      payload.value["dissem_orgs"] = payloadOrgs;
    };

    const prepopulateFields = (model) => {
      const { payload } = metadata.product_types.find(
        ({ code }) => code === model.code
      );
      const product = { ...payload };
      if (product.title) {
        form.value.title = `${dayjs().format("DD MMMM YYYY")} ${product.title}`;
      }
      if (product.summary) {
        form.value.summary = product.summary;
      }
      if (product.poc_info) {
        form.value.pocInfo = product.poc_info;
      }
      const topics = product.topics ? product.topics : ["TERR"];
      const topicsToSelect = [];
      topics.forEach((topic) => {
        const topicValue = getValueForCode(lists.topics, topic);
        topicsToSelect.push(topicValue);
      });
      form.value.topics = topicsToSelect;
    };

    const updateField = (model, property, type) => {
      const codes = [];
      switch (type) {
        case "classification":
          switch (property) {
            case "document":
              payload.value.classification = model.name;
              payload.value.classification_xml = model.xml;
              payload.value.classification_decl_fmt = model.block
                ? `Classified By: ${model.block.classifiedBy}\nDerived From: ${model.block.derivedFrom}\nDeclassify On: ${model.block.declassOn}`
                : "";
              break;
            case "title":
              payload.value.title_classif = model.name;
              payload.value.title_classif_xml = model.xml;
              break;
            case "summary":
              payload.value.summary_classif = model.name;
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
            form.value.countries = [];
          }
          if (property === "html_body" && !model) {
            payload.value[property] = "<p></p>";
          }
      }
    };

    const updateSelectedDate = (model) => {
      form.value.publicationDate = dayjs(model).format("YYYY-MM-DD");
      payload.value.date_published = form.value.publicationDate;
    };

    const updatePayload = (updatedProduct) => {
      payload.value = Object.assign({}, updatedProduct);
      payload.value.countries = updatedProduct.countries.map(
        (country) => country.code
      );
      payload.value.topics = updatedProduct.topics.map((topic) => topic.code);
    };

    const updateForm = (updatedProduct) => {
      form.value.worldwide = updatedProduct.worldwide;
      if (!form.value.worldwide) {
        const countriesToSelect = [];
        updatedProduct.countries.forEach((countryFromBackend) => {
          let countryValue = getValueForCode(
            lists.countries,
            countryFromBackend.code
          );
          countriesToSelect.push(countryValue);
        });
        form.value.countries = countriesToSelect;
      }
      const topicsToSelect = [];
      updatedProduct.topics.forEach((topicFromBackend) => {
        let topicValue = getValueForCode(lists.topics, topicFromBackend.code);
        topicsToSelect.push(topicValue);
      });
      form.value.topics = topicsToSelect;
      const dissemsToSelect = [];
      updatedProduct.dissem_orgs.forEach((dissemFromBackend) => {
        let dissemValue = getValueForCode(lists.dissemOrgs, dissemFromBackend);
        dissemsToSelect.push(dissemValue);
      });
      if (dissemsToSelect.length !== lists.dissemOrgs.length) {
        checkAllOrgs.value = false;
      }
      form.value.dissemOrgs = dissemsToSelect;
      form.value.productType = lists.productTypes.find(
        (productFromBackend) =>
          productFromBackend.code === updatedProduct.product_type_id
      );
      form.value.publicationDate = updatedProduct.date_published;
      selectedPublicationDate.value = dayjs(
        product.value.date_published
      ).toDate();
      form.value.classificationXML = updatedProduct.classification_xml;
      form.value.pocInfo = updatedProduct.poc_info;
      form.value.title = updatedProduct.title;
      form.value.attachments = updatedProduct.attachments?.filter(
        (attachment) => attachment.visible === true
      );
      form.value.summary = updatedProduct.summary;
      form.value.summaryClassificationXML = updatedProduct.summary_classif_xml;
      form.value.titleClassificationXML = updatedProduct.title_classif_xml;
      form.value.summaryClassificationXML = updatedProduct.summary_classif_xml;
      form.value.editorData = updatedProduct.html_body;
    };

    onMounted(() => {
      updatePayload(product.value);
      updateForm(product.value);
    });

    const publishDisabled = computed(() => {
      return (
        (form.value.countries.length === 0 && !form.value.worldwide) ||
        form.value.topics.length === 0 ||
        !form.value.title ||
        !form.value.titleClassificationXML ||
        !form.value.summary ||
        !form.value.summaryClassificationXML ||
        !form.value.classificationXML ||
        !form.value.publicationDate
      );
    });

    //Dialogs
    const isDeleteDialogOpen = ref(false);
    const openDeleteDialog = () => {
      isDeleteDialogOpen.value = true;
    };
    const closeDeleteDialog = () => {
      isDeleteDialogOpen.value = false;
    };
    const isPreviewDialogOpen = ref(false);
    const closePreviewDialog = () => {
      isPreviewDialogOpen.value = false;
    };
    const openPreviewDialog = () => {
      isPreviewDialogOpen.value = true;
    };

    const uploadThumbnail = (event) => {
      const uploadedFile = event.target.files[0];
      let extension = uploadedFile.type.split("/").pop();
      extension = extension === "jpeg" ? "jpg" : extension;
      const changedFile = new File([uploadedFile], `article.${extension}`, {
        type: uploadedFile.type,
      });
      addFiles([changedFile]);
      event.target.value = null;
      uploadFiles(files.value);
    };

    watch([savingProduct], () => {
      if (!savingProduct.value) {
        updatePayload(product.value);
        updateForm(product.value);
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
          title: "Product Deleted",
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
                title: "Product Deleted",
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

    const publishProduct = () => {
      if (publishDisabled.value) {
        console.warn(
          "You're attempting to publish a product without the required fields."
        );
      } else {
        publishingProduct.value = true;
        if (process.env.NODE_ENV === "low") {
          setTimeout(() => {
            publishingProduct.value = false;
            createNotification({
              title: "Product Pulished",
              message: "Great job! You successfully published the product.",
              type: "success",
            });
            router.push({
              name: "product",
              params: { doc_num: route.params.doc_num },
            });
          }, 3000);
        } else {
          axios
            .post("/articles/processDocument", {
              document_action: "publish",
              // analysis_type_id: form.selectedProductType.id,
              analysis_type_id: 5,
              id: route.params.id,
              wire_id: route.params.date,
              producing_office: "DNI/NCTC",
              publication_date: route.params.date,
              ...payload.value,
            })
            .then((response) => {
              publishingProduct.value = false;
              if (response.data.error) {
                createNotification({
                  title: "Error",
                  message: response.data.error,
                  type: "error",
                  autoClose: false,
                });
              } else {
                createNotification({
                  title: "Product Published",
                  message: response.data.status,
                  type: "success",
                });
                router.push({
                  name: "product",
                  params: { doc_num: route.params.doc_num },
                });
              }
            });
        }
      }
    };

    const saveProduct = () => {
      savingProduct.value = true;
      if (process.env.NODE_ENV === "low") {
        setTimeout(() => {
          console.log("document/getDocument: ", mockDocument);
          product.value = mockDocument;
          savingProduct.value = false;
          createNotification({
            title: "Product Saved",
            message: "Great job! You successfully saved the product.",
            type: "success",
            autoClose: false,
          });
        }, 1000);
      } else {
        axios
          .post("/articles/processDocument", {
            document_action: "save",
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
              savingProduct.value = false;
              createNotification({
                title: "Error",
                message: response.data.error,
                type: "error",
                autoClose: false,
              });
            } else {
              axios
                .get(
                  "/wires/" +
                    route.params.date +
                    "/articles/" +
                    route.params.id +
                    "/getDocumentData",
                  {
                    date: route.params.date,
                    id: route.params.id,
                  }
                )
                .then((response) => {
                  savingProduct.value = false;
                  if (response.data) {
                    product.value = response.data;
                    createNotification({
                      title: "Product Saved",
                      message: response.data.status
                        ? response.data.status
                        : `Product ${props.documentNumber} has beeen successfully saved.`,
                      type: "success",
                    });
                  } else {
                    createNotification({
                      title: "Error",
                      message:
                        "There was an error retrieving the product data.",
                      type: "error",
                      autoClose: false,
                    });
                  }
                });
            }
          });
      }
    };

    const cancel = () => {
      router.push({ name: "publish", params: { date: route.params.date } });
    };

    return {
      document,
      categories,
      extraConfig,
      files,
      addFiles,
      removeFile,
      savingProduct,
      publishingProduct,
      lists,
      form,
      checkAllOrgs,
      selectedPublicationDate,
      attachmentDropzoneFile,
      attachmentDrop,
      attachmentSelectedFile,
      toggleAllOrgs,
      updateField,
      updateSelectedDate,
      publishDisabled,
      isDeleteDialogOpen,
      openDeleteDialog,
      closeDeleteDialog,
      isPreviewDialogOpen,
      closePreviewDialog,
      openPreviewDialog,
      uploadThumbnail,
      onInputChange,
      onDrop,
      removeDocument,
      deleteDocument,
      publishProduct,
      saveProduct,
      cancel,
    };
  },
};
</script>
