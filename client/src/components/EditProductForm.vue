<template>
  <form ref="publishingForm">
    <MaxCard class="mt-4">
      <div class="flex">
        <div
          class="lg:min-w-[215px] p-6 border-r border-slate-900/10 dark:border-slate-700/75 energy:border-zinc-700/75"
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
                <MaxListbox
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
                      <MaxInput
                        v-model="form.title"
                        label="Title"
                        type="text"
                        required
                        @update:modelValue="updateField($event, 'title')"
                      />
                    </div>
                    <div class="lg:w-1/4">
                      <MaxClassifier
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
                      <MaxTextarea
                        v-model="form.summary"
                        maxlength="4000"
                        rows="6"
                        label="Summary"
                        required
                        @update:modelValue="updateField($event, 'summary')"
                      />
                    </div>
                    <div class="lg:w-1/4">
                      <MaxClassifier
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
                    <label class="text-sm font-medium"
                      >Publication Date
                      <span class="sr-only">Required</span>
                      <span class="pl-1 text-red-500">*</span>
                      <MaxDatepicker
                        v-model="selectedPublicationDate"
                        :enableTimePicker="false"
                        week-start="0"
                        auto-apply
                        customStyle
                        class="min-h-[2rem] flex w-full rounded-lg cursor-default px-2 mt-1 bg-transparent border border-gray-300 dark:border-slate-600 energy:border-zinc-600 focus-within:ring-2 focus-within:ring-offset-2"
                        @update:modelValue="updateSelectedDate"
                      >
                      </MaxDatepicker>
                    </label>
                  </div>
                  <div class="lg:w-1/2 space-y-4">
                    <MaxListbox
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
                    <div
                      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-2"
                    >
                      <div v-for="country in form.countries" :key="country">
                        <div
                          class="flex justify-between rounded-xl bg-slate-100 dark:bg-slate-700 energy:bg-zinc-600 p-2"
                        >
                          <div class="line-clamp-1 text-sm">
                            {{ country.name }}
                          </div>
                          <button
                            type="button"
                            class="w-5 h-5 flex items-center justify-center"
                            tabindex="0"
                            @click="removeItem(country.name, 'countries')"
                          >
                            <span class="sr-only">Remove country</span>
                            <XMarkIcon
                              class="h-5 w-5 text-mission-light-blue dark:text-teal-400 energy:text-energy-yellow"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
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
                  <div class="lg:w-1/2 space-y-4">
                    <MaxListbox
                      v-model="form.topics"
                      :label="'Topics'"
                      :items="lists.topics"
                      multiple
                      required
                      @update:modelValue="
                        updateField($event, 'topics', 'multiple')
                      "
                    />
                    <div
                      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-2"
                    >
                      <div v-for="topic in form.topics" :key="topic">
                        <div
                          class="flex justify-between rounded-xl bg-slate-100 dark:bg-slate-700 energy:bg-zinc-600 p-2"
                        >
                          <div class="line-clamp-1 text-sm">
                            {{ topic.name }}
                          </div>
                          <button
                            type="button"
                            class="w-5 h-5 flex items-center justify-center"
                            tabindex="0"
                            @click="removeItem(topic.name, 'topics')"
                          >
                            <span class="sr-only">Remove topic</span>
                            <XMarkIcon
                              class="h-5 w-5 text-mission-light-blue dark:text-teal-400 energy:text-energy-yellow"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </EditProductFormSection>
              <EditProductFormSection
                id="additional"
                title="Additional"
                description="Further enhance your product by adding more details."
              >
                <div class="flex flex-col space-y-4">
                  <div class="flex flex-col space-y-4">
                    <div>
                      <label class="text-sm font-medium"
                        >Thumbnail<span class="ml-2 italic font-normal"
                          >(Shown when the product is featured)</span
                        ></label
                      >
                      <div class="flex space-x-3">
                        <div
                          class="w-fit mt-1 rounded shadow-sm text-xs md:text-sm bg-transparent border border-slate-900/10 dark:border-slate-50/[0.25] energy:border-zinc-50/25"
                        >
                          <label
                            for="image-input"
                            class="relative cursor-pointer focus-within:ring-2 font-medium"
                          >
                            <div class="flex items-center px-2 md:px-6 py-3">
                              <template
                                v-if="thumbnailFile?.status === 'loading'"
                              >
                                <MaxLoadingSpinner class="h-5 w-5" />
                                Uploading...
                              </template>
                              <template v-else>
                                {{
                                  form.thumbnailImage ||
                                  (thumbnailBinary &&
                                    thumbnailFile?.status === true)
                                    ? "Change File"
                                    : "Choose File"
                                }}
                              </template>
                            </div>
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
                        <template v-if="thumbnailFile?.status === false">
                          <div
                            class="flex items-center text-red-700 dark:text-red-400 energy:text-red-400"
                          >
                            <ExclamationCircleIcon class="h-6 w-6 mr-2" />
                            Upload failed!
                          </div>
                        </template>
                      </div>
                    </div>
                    <div
                      v-if="
                        form.thumbnailImage ||
                        (thumbnailBinary && thumbnailFile?.status === true)
                      "
                      class="cursor-pointer relative h-full w-[200px]"
                      @click="openPreviewThumbnailDialog"
                    >
                      <img
                        class="w-full h-full"
                        :src="
                          thumbnailBinary
                            ? thumbnailBinary
                            : form.thumbnailImage
                        "
                        alt="Preview Image"
                      />
                      <div
                        class="absolute hover:bg-black/25 h-full w-full top-0 z-[3]"
                      />
                    </div>
                  </div>
                  <template
                    v-if="
                      environment != 'production' &&
                      environment != 'development'
                    "
                  >
                    <div class="lg:w-3/4">
                      <MaxInput
                        v-model="form.thumbnailCaption"
                        label="Thumbnail Caption"
                        type="text"
                        @update:modelValue="
                          updateField($event, 'thumbnailCaption')
                        "
                      />
                    </div>
                  </template>
                  <div>
                    <MaxCkEditor
                      v-model="form.editorData"
                      :label="'Product Content'"
                      :extraConfig="extraConfig"
                      @update:modelValue="updateField($event, 'html_body')"
                    />
                  </div>
                  <div class="lg:w-1/2">
                    <MaxTextarea
                      v-model="form.pocInfo"
                      maxlength="4000"
                      rows="4"
                      label="POC Info"
                      @update:modelValue="updateField($event, 'poc_info')"
                    ></MaxTextarea>
                  </div>
                  <div class="lg:w-1/2 space-y-4">
                    <MaxListbox
                      v-model="form.producing_offices"
                      :label="'Authored By Organizations'"
                      :items="lists.producing_offices"
                      multiple
                      required
                      @update:modelValue="
                        updateField($event, 'producing_offices', 'multiple')
                      "
                    />
                    <div
                      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-2"
                    >
                      <div v-for="org in form.producing_offices" :key="org">
                        <div
                          class="flex justify-between rounded-xl bg-slate-100 dark:bg-slate-700 energy:bg-zinc-600 p-2"
                        >
                          <div class="line-clamp-1 text-sm">
                            {{ org.name }}
                          </div>
                          <button
                            type="button"
                            class="w-5 h-5 flex items-center justify-center"
                            tabindex="0"
                            @click="removeItem(org.name, 'producing_offices')"
                          >
                            <span class="sr-only">Remove office</span>
                            <XMarkIcon
                              class="h-5 w-5 text-mission-light-blue dark:text-teal-400 energy:text-energy-yellow"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="lg:w-1/2 space-y-4">
                    <MaxListbox
                      v-model="form.coordinators"
                      :label="'Coordinated With Organizations'"
                      :items="lists.coordinators"
                      multiple
                      @update:modelValue="
                        updateField($event, 'coordinators', 'multiple')
                      "
                    />
                    <div
                      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-2"
                    >
                      <div v-for="org in form.coordinators" :key="org">
                        <div
                          class="flex justify-between rounded-xl bg-slate-100 dark:bg-slate-700 energy:bg-zinc-600 p-2"
                        >
                          <div class="line-clamp-1 text-sm">
                            {{ org.name }}
                          </div>
                          <button
                            type="button"
                            class="w-5 h-5 flex items-center justify-center"
                            tabindex="0"
                            @click="removeItem(org.name, 'coordinators')"
                          >
                            <span class="sr-only">Remove coordinator</span>
                            <XMarkIcon
                              class="h-5 w-5 text-mission-light-blue dark:text-teal-400 energy:text-energy-yellow"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="lg:w-1/2 space-y-4">
                    <MaxListbox
                      v-model="form.coauthors"
                      :label="'Co-Authored By Organizations'"
                      :items="lists.coauthors"
                      multiple
                      @update:modelValue="
                        updateField($event, 'coauthors', 'multiple')
                      "
                    />
                    <div
                      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-2"
                    >
                      <div v-for="org in form.coauthors" :key="org">
                        <div
                          class="flex justify-between rounded-xl bg-slate-100 dark:bg-slate-700 energy:bg-zinc-600 p-2"
                        >
                          <div class="line-clamp-1 text-sm">
                            {{ org.name }}
                          </div>
                          <button
                            type="button"
                            class="w-5 h-5 flex items-center justify-center"
                            tabindex="0"
                            @click="removeItem(org.name, 'coauthors')"
                          >
                            <span class="sr-only">Remove co-author</span>
                            <XMarkIcon
                              class="h-5 w-5 text-mission-light-blue dark:text-teal-400 energy:text-energy-yellow"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="lg:w-1/2 space-y-4">
                    <MaxListbox
                      v-model="form.dissemOrgs"
                      :label="'Restrict Dissemination by Organizations'"
                      :items="lists.dissemOrgs"
                      aria-label="No selection disseminates to all (includes NT-50 Organizations)."
                      multiple
                      @update:modelValue="
                        updateField($event, 'dissem_orgs', 'multiple')
                      "
                    />
                    <div
                      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-2"
                    >
                      <div v-for="org in form.dissemOrgs" :key="org">
                        <div
                          class="flex justify-between rounded-xl bg-slate-100 dark:bg-slate-700 energy:bg-zinc-600 p-2"
                        >
                          <div class="line-clamp-1 text-sm">
                            {{ org.name }}
                          </div>
                          <button
                            type="button"
                            class="w-5 h-5 flex items-center justify-center"
                            tabindex="0"
                            @click="removeItem(org.name, 'dissemOrgs')"
                          >
                            <span class="sr-only"
                              >Remove Dissemination org</span
                            >
                            <XMarkIcon
                              class="h-5 w-5 text-mission-light-blue dark:text-teal-400 energy:text-energy-yellow"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                    <p class="text-sm">
                      No selection disseminates to all
                      <span class="italic"
                        >(includes NT-50 Organizations).</span
                      >
                    </p>
                    <div class="flex">
                      <input
                        id="intelOrgs"
                        v-model="checkAllIntelOrgs"
                        type="checkbox"
                        name="intelOrgs"
                        @click="toggleAllIntelOrgs()"
                      />
                      <label for="intelOrgs" class="ml-2 text-sm"
                        >Restrict Dissemination to IC Members Only</label
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
                  <MaxClassifier
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
              class="flex flex-wrap gap-4 justify-end py-6 px-8 border-t border-slate-900/10 dark:border-slate-700/75 energy:border-zinc-700/75"
            >
              <MaxButton
                color="secondary"
                type="submit"
                :disabled="publishDisabled"
                @click.prevent="publishProduct"
              >
                Publish
              </MaxButton>
              <MaxButton color="secondary" @click.prevent="saveProduct"
                >Save</MaxButton
              >
              <MaxButton color="secondary" @click.prevent="openPreviewDialog"
                >Preview
                <MaxDialog
                  class="max-w-[1300px]"
                  :isOpen="isPreviewDialogOpen"
                  @close="closePreviewDialog"
                >
                  <template v-if="loadingPreview"
                    ><div class="max-w-fit m-auto">
                      <MaxLoadingSpinner class="h-20 w-20" /></div
                  ></template>
                  <template v-else>
                    <ProductContent :product="previewProduct" isPreview />
                  </template>
                </MaxDialog>
              </MaxButton>
              <MaxButton color="secondary" @click.prevent="cancel"
                >Cancel</MaxButton
              >
              <MaxButton color="danger" @click.prevent="openDeleteDialog"
                >Delete</MaxButton
              >
            </div>
          </div>
        </div>
      </div>
    </MaxCard>
  </form>
  <MaxDialog
    :isOpen="isDeleteDialogOpen"
    :title="'Delete Product'"
    class="max-w-fit"
    @close="closeDeleteDialog"
  >
    <p class="py-4 pr-4">Are you sure you want to do this?</p>
    <template #actions>
      <MaxButton color="secondary" @click.prevent="closeDeleteDialog"
        >Cancel</MaxButton
      >
      <MaxButton color="danger" @click.prevent="deleteDocument">
        Delete
      </MaxButton>
    </template>
  </MaxDialog>
  <MaxDialog
    :isOpen="isPreviewThumbnailDialogOpen"
    :title="'Thumbnail Preview'"
    class="max-w-fit"
    @close="closePreviewThumbnailDialog"
  >
    <div
      id="img-container"
      class="m-6 relative overflow-hidden w-[443px] h-[176px] border-8 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-zinc-700/25"
    >
      <div
        id="product-blur"
        class="h-full w-full absolute blur-lg opacity-60 bg-center bg-no-repeat bg-cover"
        :style="{
          background:
            'url(' + thumbnailBinary
              ? thumbnailBinary
              : form.thumbnailImage + ')',
        }"
      ></div>
      <img
        id="product-img"
        class="inset-x-0 absolute h-full mx-auto z-[3]"
        :src="thumbnailBinary ? thumbnailBinary : form.thumbnailImage"
        alt=""
      />
    </div>
    <p class="italic">
      Only shown when the product is featured on the front page.
    </p>
  </MaxDialog>
  <MaxOverlay :show="savingProduct">
    <div class="max-w-xs inline-block">
      <p class="mb-4 font-semibold text-2xl">Saving Product...</p>
      <div class="w-fit m-auto">
        <MaxLoadingSpinner class="h-16 w-16" />
      </div>
    </div>
  </MaxOverlay>
  <MaxOverlay :show="publishingProduct">
    <div class="max-w-xs inline-block">
      <p class="mb-4 font-semibold text-2xl">Publishing Product...</p>
      <div class="w-fit m-auto">
        <MaxLoadingSpinner class="h-16 w-16" />
      </div>
    </div>
  </MaxOverlay>
</template>
<script>
import { productDetails } from "@/data";
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
  ExclamationCircleIcon,
  KeyIcon,
  PlusCircleIcon,
  PaperClipIcon,
  LockClosedIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import axios from "@/config/wireAxios";
import { metadata } from "@/config";
import { mockDocument } from "@/data";
import {
  UploadableFile,
  getValueForCode,
  hasProductImage,
  getProductImageUrl,
} from "@/helpers";
import SimpleUploadAdapter from "@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter";
import useFileList from "@/composables/file-list";
import createUploader from "@/composables/file-uploader";
import DropZone from "@/components/DropZone.vue";
import FilePreview from "@/components/FilePreview.vue";
import EditProductFormSection from "@/components/EditProductFormSection.vue";
import ProductContent from "@/components/ProductContent.vue";

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
    ExclamationCircleIcon,
    KeyIcon,
    PlusCircleIcon,
    PaperClipIcon,
    LockClosedIcon,
    XMarkIcon,
    DocumentArrowDownIcon,
    DocumentMinusIcon,
    DropZone,
    FilePreview,
    EditProductFormSection,
    ProductContent,
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
    const environment = ref(import.meta.env.MODE);
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
    const thumbnailFile = ref(null);
    const thumbnailBinary = ref(null);
    const { uploadFile, uploadFiles } = createUploader(
      "/documents/" + props.documentNumber + "/attachments/"
    );
    const product = ref(props.product);
    const savingProduct = ref(false);
    const savingSucceed = ref(true);
    const publishingProduct = ref(false);
    const loadingPreview = ref(true);
    const previewProduct = ref(null);
    const criteria = computed(() => store.state.metadata.criteria);
    const lists = {
      countries: criteria.value.countries.filter((a) => a.code !== "WW"),
      dissemOrgs: criteria.value.dissem_orgs,
      producing_offices: criteria.value.producing_offices,
      coordinators: criteria.value.coordinators,
      coauthors: criteria.value.coauthors,
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
      coordinators: [],
      coauthors: [],
      producing_offices: [],
      editorData: "",
      pocInfo: "",
      productType: [],
      publicationDate: "",
      //producing_office: "DNI/NCTC",
      summary: "",
      summaryClassificationXML: "",
      title: "",
      titleClassificationXML: "",
      topics: [],
      thumbnailImage: false,
      thumbnailCaption: "",
      worldwide: null,
    });
    const payload = ref({});
    const checkAllIntelOrgs = ref(false);
    const selectedPublicationDate = ref(null);
    const attachmentDropzoneFile = ref("");

    const attachmentDrop = (event) => {
      attachmentDropzoneFile.value = event.dataTransfer.files[0];
    };

    const attachmentSelectedFile = () => {
      attachmentDropzoneFile.value =
        document.querySelector(".fileUpload").files[0];
    };

    const toggleAllIntelOrgs = () => {
      let payloadOrgs = [];
      form.value.dissemOrgs = [];
      if (!checkAllIntelOrgs.value) {
        lists.dissemOrgs.forEach((org) => {
          if (org.category == "IC") {
            form.value.dissemOrgs.push(org);
            payloadOrgs.push(org.code);
          }
        });
      }
      payload.value["dissem_orgs"] = payloadOrgs;
    };

    const updateToggleAllIntelOrgs = () => {
      const allIntelOrgs = lists.dissemOrgs.filter(
        (org) => org.category == "IC"
      );
      const isAllIntel = allIntelOrgs.every((org) =>
        form.value.dissemOrgs.includes(org)
      );
      if (isAllIntel && form.value.dissemOrgs.length == allIntelOrgs.length) {
        checkAllIntelOrgs.value = true;
      } else {
        checkAllIntelOrgs.value = false;
      }
    };

    const removeItem = (name, formItem) => {
      console.log(formItem, "selection removed");
      if (formItem === "countries") {
        form.value.countries = form.value.countries.filter(
          (i) => i.name != name
        );
        updateField(form.value.countries, "countries", "multiple");
      } else if (formItem === "topics") {
        form.value.topics = form.value.topics.filter((i) => i.name != name);
        updateField(form.value.topics, "topics", "multiple");
      } else if (formItem === "dissemOrgs") {
        form.value.dissemOrgs = form.value.dissemOrgs.filter(
          (i) => i.name != name
        );
        updateToggleAllIntelOrgs();
        updateField(form.value.dissemOrgs, "dissem_orgs", "multiple");
      } else if (formItem === "coordinators") {
        form.value.coordinators = form.value.coordinators.filter(
          (i) => i.name != name
        );
        updateField(form.value.coordinators, "coordinators", "multiple");
      } else if (formItem === "coauthors") {
        form.value.coauthors = form.value.coauthors.filter(
          (i) => i.name != name
        );
        updateField(form.value.coauthors, "coauthors", "multiple");
      } else if (formItem === "producing_offices") {
        form.value.producing_offices = form.value.producing_offices.filter(
          (i) => i.name != name
        );
        updateField(
          form.value.producing_offices,
          "producing_offices",
          "multiple"
        );
      }
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
          if (property === "dissem_orgs") {
            updateToggleAllIntelOrgs();
          }
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
      payload.value.coordinators = updatedProduct.coordinators.map(
        (coordinator) => coordinator.code
      );
      payload.value.coauthors = updatedProduct.coauthors.map(
        (coauthors) => coauthors.code
      );
      payload.value.producing_offices = updatedProduct.producing_offices.map(
        (producing_office) => producing_office.code
      );
    };

    const updateForm = (updatedProduct) => {
      form.value.thumbnailImage = hasProductImage(updatedProduct)
        ? getProductImageUrl(updatedProduct.images, props.documentNumber)
        : false;
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
        //if statement is temporary until high side backend starts returning dissem orgs as an object
        if (
          import.meta.env.MODE !== "production" &&
          import.meta.env.MODE !== "development"
        ) {
          let dissemValue = getValueForCode(
            lists.dissemOrgs,
            dissemFromBackend.code
          );
          dissemsToSelect.push(dissemValue);
        } else {
          let dissemValue = getValueForCode(
            lists.dissemOrgs,
            dissemFromBackend
          );
          dissemsToSelect.push(dissemValue);
        }
      });
      const allIntelOrgs = lists.dissemOrgs.filter(
        (org) => org.category == "IC"
      );
      const isAllIntel = allIntelOrgs.every((org) =>
        dissemsToSelect.includes(org)
      );
      if (isAllIntel && dissemsToSelect.length == allIntelOrgs.length) {
        checkAllIntelOrgs.value = true;
      } else {
        checkAllIntelOrgs.value = false;
      }
      form.value.dissemOrgs = dissemsToSelect;
      const coordinatorsToSelect = [];
      updatedProduct.coordinators.forEach((coordinatorsFromBackend) => {
        let coordinatorsValue = getValueForCode(
          lists.coordinators,
          coordinatorsFromBackend.code
        );
        coordinatorsToSelect.push(coordinatorsValue);
      });
      form.value.coordinators = coordinatorsToSelect;
      const coauthorsToSelect = [];
      updatedProduct.coauthors.forEach((coauthorsFromBackend) => {
        let coauthorsValue = getValueForCode(
          lists.coauthors,
          coauthorsFromBackend.code
        );
        coauthorsToSelect.push(coauthorsValue);
      });
      form.value.coauthors = coauthorsToSelect;
      const producing_officesToSelect = [];
      updatedProduct.producing_offices.forEach(
        (producing_officesFromBackend) => {
          let producing_officesValue = getValueForCode(
            lists.producing_offices,
            producing_officesFromBackend.code
          );
          producing_officesToSelect.push(producing_officesValue);
        }
      );
      form.value.producing_offices = producing_officesToSelect;
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
      form.value.editorData = updatedProduct.html_body;
      form.value.thumbnailCaption = updatedProduct.thumbnailCaption;
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
        !form.value.publicationDate ||
        form.value.producing_offices.length === 0
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
    const isPreviewThumbnailDialogOpen = ref(false);
    const openPreviewThumbnailDialog = () => {
      isPreviewThumbnailDialogOpen.value = true;
    };
    const closePreviewThumbnailDialog = () => {
      isPreviewThumbnailDialogOpen.value = false;
    };
    const isPreviewDialogOpen = ref(false);
    const closePreviewDialog = () => {
      isPreviewDialogOpen.value = false;
    };
    const openPreviewDialog = () => {
      loadingPreview.value = true;
      if (import.meta.env.MODE === "offline") {
        let documentMatch = productDetails.find(
          ({ data }) => data.doc_num === route.params.doc_num
        );
        previewProduct.value = documentMatch.data;
        setTimeout(() => (loadingPreview.value = false), 750);
      } else {
        axios
          .get(`/documents/${route.params.doc_num}/preview.json`)
          .then((response) => {
            loadingPreview.value = false;
            previewProduct.value = response.data;
          });
      }
      isPreviewDialogOpen.value = true;
    };

    const uploadThumbnail = (event) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        thumbnailBinary.value = reader.result;
      });
      const uploadedFile = event.target.files[0];
      reader.readAsDataURL(uploadedFile);
      let extension = uploadedFile.type.split("/").pop();
      extension = extension === "jpeg" ? "jpg" : extension;
      thumbnailFile.value = new UploadableFile(
        new File([uploadedFile], `article.${extension}`, {
          type: uploadedFile.type,
        })
      );
      event.target.value = null;
      uploadFile(thumbnailFile.value);
    };

    watch([savingProduct], () => {
      if (!savingProduct.value && savingSucceed.value) {
        updatePayload(product.value);
        updateForm(product.value);
      } else {
        savingSucceed.value = true;
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
      if (import.meta.env.MODE === "offline") {
        router.push({
          name: "products",
          params: { date: route.params.date },
        });
        createNotification({
          title: "Product Deleted",
          message: "The product has been deleted successfully.",
          type: "success",
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
                message: `Product ${props.documentNumber} has been deleted.`,
                type: "success",
              });
              router.push({
                name: "products",
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
        if (import.meta.env.MODE === "offline") {
          setTimeout(() => {
            publishingProduct.value = false;
            router.push({
              name: "product",
              params: { doc_num: route.params.doc_num },
            });
            createNotification({
              title: "Product Published",
              message: "Great job! You successfully published the product.",
              type: "success",
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
              // producing_office: "DNI/NCTC",
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
                  message: `Product ${props.documentNumber} has been successfully published.`,
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
      if (import.meta.env.MODE === "offline") {
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
            // producing_office: "DNI/NCTC",
            publication_date: route.params.date,
            ...payload.value,
          })
          .then((response) => {
            if (response.data.error) {
              savingProduct.value = false;
              savingSucceed.value = false;
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
                        : `Product ${props.documentNumber} has been successfully saved.`,
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
      router.push({ name: "products", params: { date: route.params.date } });
    };

    return {
      document,
      categories,
      environment,
      extraConfig,
      thumbnailFile,
      files,
      addFiles,
      removeFile,
      thumbnailBinary,
      savingProduct,
      publishingProduct,
      loadingPreview,
      previewProduct,
      lists,
      form,
      checkAllIntelOrgs,
      selectedPublicationDate,
      attachmentDropzoneFile,
      attachmentDrop,
      attachmentSelectedFile,
      toggleAllIntelOrgs,
      updateToggleAllIntelOrgs,
      removeItem,
      updateField,
      updateSelectedDate,
      publishDisabled,
      isDeleteDialogOpen,
      openDeleteDialog,
      closeDeleteDialog,
      isPreviewThumbnailDialogOpen,
      openPreviewThumbnailDialog,
      closePreviewThumbnailDialog,
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
