<template>
  <p
    class="
      font-semibold
      text-2xl
      py-4
      border-b-2 border-slate-900/10
      dark:border-slate-50/[0.06]
      energy:border-gray-700/25
    "
  >
    Edit Document
  </p>
  <form ref="publishingForm">
    <div class="flex flex-col lg:flex-row gap-6 lg:gap-3 mt-4">
      <!-- Left Container -->
      <BaseCard class="flex flex-col lg:w-8/12 p-6 space-y-6 h-fit">
        <div class="md:flex md:space-x-4 space-y-4 md:space-y-0">
          <div class="basis-1/2 space-y-4">
            <BaseListbox
              v-model="selectedCountries"
              :label="'Countries'"
              :items="countries"
              multiple
            />
            <input
              type="checkbox"
              id="worldwide"
              name="worldwide"
              value="Worldwide"
              v-model="worldwide"
            />
            <label for="worldwide" class="ml-2 text-sm">Worldwide</label>
          </div>
          <div class="basis-1/2">
            <BaseListbox
              v-model="selectedTopics"
              :label="'Topics'"
              :items="topics"
              multiple
            />
          </div>
        </div>
        <div class="md:flex">
          <div class="basis-full space-y-4">
            <BaseListbox
              v-model="selectedActors"
              :label="'Non-State Actors'"
              :items="actors"
              multiple
            />
            <div>
              <input
                type="checkbox"
                id="allOrgs"
                name="allOrgs"
                v-model="checkAllOrgs"
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
                  <div class="grid grid-cols-3 md:grid-cols-5 gap-3 mt-4">
                    <div v-for="(org, index) in dissemOrgs" :key="index">
                      <input
                        type="checkbox"
                        v-model="dissemOrgs[index].model"
                        class="mt-2"
                      />
                      <label :for="org.name" class="text-sm ml-1">
                        {{ org.name }}
                      </label>
                    </div>
                  </div>
                </DisclosurePanel>
              </transition>
            </Disclosure>
          </div>
        </div>
        <div class="md:flex md:space-x-4 space-y-4 md:space-y-0">
          <div class="basis-2/3">
            <BaseInput v-model="event.title" label="Title" type="text" />
          </div>
          <div class="basis-1/3">
            <BaseInput
              v-model="event.titlePM"
              label="Title PM (required)"
              type="text"
            />
          </div>
        </div>
        <div class="md:flex md:space-x-4 space-y-4 md:space-y-0">
          <div class="basis-2/3">
            <BaseTextarea
              maxlength="4000"
              rows="6"
              v-model="event.summary"
              label="Summary"
            ></BaseTextarea>
          </div>
          <div class="basis-1/3">
            <BaseInput
              v-model="event.summaryPM"
              label="Summary PM (required)"
              type="text"
            />
          </div>
        </div>
        <div>
          <label for="body" class="font-medium text-sm">Body</label>
          <div class="mt-1">
            <ckeditor
              :editor="editor"
              v-model="editorData"
              :config="editorConfig"
              id="body"
            ></ckeditor>
          </div>
        </div>
        <div>
          <!-- <p
            class="
              text-lg
              border-b-2 border-slate-900/10
              dark:border-slate-50/[0.06]
              energy:border-gray-700/25
              pb-2
            "
          >
            Source Citations
          </p>
          <ol class="list-decimal list-inside ml-4 mt-4 space-y-2">
            <div v-for="source in articlesData[0].sources" :key="source.name">
              <li class="text-sm">
                <router-link to="#" class="hover:underline">
                  {{ source.name }}
                </router-link>
              </li>
            </div>
          </ol> -->
        </div>
      </BaseCard>
      <!-- Right Container -->
      <BaseCard class="lg:w-4/12 p-6">
        <div class="flex flex-col space-y-6">
          <p
            class="
              text-lg
              font-medium
              pb-2
              border-b-2 border-slate-900/10
              dark:border-slate-50/[0.06]
              energy:border-gray-700/25
            "
          >
            Classification
          </p>
          <div>
            <BaseInput
              v-model="event.classification"
              label="Document Classification (required)"
              type="text"
            />
          </div>
          <div class="text-sm">
            <p>Classified By: <span id="classifiedBy"></span></p>
            <p>Derived From: Channel News Asia</p>
            <p>Declassify On: Jun 26, 2032</p>
          </div>
          <p
            class="
              text-lg
              font-medium
              pb-2
              border-b-2 border-slate-900/10
              dark:border-slate-50/[0.06]
              energy:border-gray-700/25
            "
          >
            Attachments
          </p>
          <div>
            <label class="block mb-2" for="attachment_input"
              >Upload attachment files</label
            >
            <PublishFileUploader
              id="attachment_input"
              @drop.prevent="attachmentDrop"
              @change="attachmentSelectedFile"
            >
              <button
                @click.prevent="attachmentFileInputButton.click()"
                class="
                  bg-slate-100
                  hover:bg-slate-200/80
                  dark:bg-slate-700 dark:hover:bg-slate-700/80
                  energy:bg-gray-700 energy:hover:bg-gray-700/80
                  border border-slate-300
                  p-2
                  rounded
                  shadow
                  text-sm
                "
              >
                Select File
              </button>
              <input
                type="file"
                id="attachmentDropzoneFile"
                class="attachmentDropzoneFile hidden"
                multiple
                ref="attachmentFileInputButton"
              />
            </PublishFileUploader>
          </div>
          <div
            class="
              border-b-2 border-slate-900/10
              dark:border-slate-50/[0.06]
              energy:border-gray-700/25
              pb-2
            "
          >
            <h2 class="text-lg font-medium">Article Images</h2>
          </div>
          <div
            class="
              border-b-2 border-slate-900/10
              dark:border-slate-50/[0.06]
              energy:border-gray-700/25
              pb-2
            "
          >
            <h2 class="text-lg font-medium">Supporting Attachments</h2>
          </div>
          <div
            class="
              border-b-2 border-slate-900/10
              dark:border-slate-50/[0.06]
              energy:border-gray-700/25
              pb-2
            "
          >
            <h2 class="text-lg font-medium">Details</h2>
          </div>
          <div>
            <BaseInput
              v-model="event.docNum"
              label="Doc Num (Permalink)"
              type="text"
            />
          </div>
          <div>
            <BaseInput
              v-model="event.publicationNumber"
              label="Publication Number"
              type="text"
            />
          </div>
          <div>
            <BaseInput
              v-model="event.publicationDate"
              label="Publication Date"
              type="text"
            />
          </div>
          <div>
            <BaseTextarea
              maxlength="4000"
              rows="4"
              v-model="event.pocInfo"
              label="POC Info"
            ></BaseTextarea>
          </div>
          <div>
            <BaseListbox
              v-model="selectedOffice"
              :label="'Producing Office'"
              :items="producingOffices"
              multiple
            />
          </div>
          <div>
            <BaseListbox
              v-model="selectedAnalysisType"
              :label="'Analysis Type'"
              :items="analysisTypes"
            />
          </div>
        </div>
      </BaseCard>
    </div>
    <div class="flex my-4">
      <div class="flex flex-wrap gap-4">
        <BaseButton @click.prevent>Publish</BaseButton>
        <BaseButton @click.prevent>Save and Generate PDF</BaseButton>
        <BaseButton @click.prevent>Preview</BaseButton>
        <BaseButton @click.prevent>Cancel</BaseButton>
        <BaseButton @click.prevent type="danger" disabled>Delete</BaseButton>
        <div class="self-center">
          <input
            type="checkbox"
            id="revision"
            name="revision"
            value="Revision"
          />
          <label for="revision" class="text-sm">
            This edit is a substantive revision</label
          >
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { ref } from "vue";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/solid";
import { articles, countries } from "@/data";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import PublishFileUploader from "@/components/PublishFileUploader";

const topics = [
  { name: "Russian Invasion" },
  { name: "Eastern Europe Geopolitics" },
  { name: "Economic Turmoil" },
  { name: "Ukraine War" },
  { name: "Energy Crisis" },
];
const actors = [
  { name: "Person1" },
  { name: "Person2" },
  { name: "Person3" },
  { name: "Person4" },
];
const producingOffices = [
  { name: "Office1", pocInfo: "Office1's address and phone number" },
  { name: "Office2", pocInfo: "Office2's address and phone number" },
  { name: "Office3", pocInfo: "Office3's address and phone number" },
  { name: "Office4", pocInfo: "Office4's address and phone number" },
];
const analysisTypes = [{ name: "Type1" }, { name: "Type2" }, { name: "Type3" }];

export default {
  components: {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    ChevronDownIcon,
    PublishFileUploader,
  },
  data() {
    return {
      editor: ClassicEditor,
      editorData: "",
      editorConfig: {},
    };
  },
  methods: {
    populateCkEditor() {
      this.editorData =
        "(U) There had been no major strikes on Kyiv since early June. In his nightly address, Ukraine President Volodymyr Zelenskyy said a wounded seven-year-old girl was pulled from the rubble of a nine-storey apartment block. The girls father was killed in the strike, he said. A Ukrainian air force spokesperson said the strike was carried out with 4-6 long-range missiles fired from Russian bombers more than 1,000km away in the southern Russian region of Astrakhan.";
    },
  },
  setup() {
    const event = ref({
      title: "",
      titlePm: "",
      summary: "",
      summaryPM: "",
      classification: "",
      docNum: "",
      publicationNumber: "",
      publicationDate: "",
      pocInfo: "",
      classifiedBy: "",
    });
    const selectedCountries = ref([]);
    const worldwide = ref(null);
    const selectedTopics = ref([]);
    const selectedActors = ref([]);
    const dateValue = ref(null);
    const selectedOffice = ref([]);
    const selectedAnalysisType = ref("");
    const fileInputButton = ref(null);
    const attachmentFileInputButton = ref(null);
    const dropzoneFile = ref("");
    const attachmentDropzoneFile = ref("");
    const articlesData = ref(articles);
    let checkAllOrgs = ref(false);
    const dissemOrgs = ref([
      { name: "Org 1", model: "" },
      { name: "Org 2", model: "" },
      { name: "Org 3", model: "" },
      { name: "Org 4", model: "" },
      { name: "Org 5", model: "" },
      { name: "Org 6", model: "" },
      { name: "Org 7", model: "" },
      { name: "Org 8", model: "" },
      { name: "Org 9", model: "" },
      { name: "Org 10", model: "" },
      { name: "Org 11", model: "" },
      { name: "Org 12", model: "" },
      { name: "Org 13", model: "" },
      { name: "Org 14", model: "" },
      { name: "Org 15", model: "" },
      { name: "Org 16", model: "" },
      { name: "Org 17", model: "" },
      { name: "Org 18", model: "" },
      { name: "Org 19", model: "" },
      { name: "Org 20", model: "" },
    ]);

    const toggleAllOrgs = () => {
      for (let i = 0; i < dissemOrgs.value.length; i++) {
        dissemOrgs.value[i].model = !checkAllOrgs.value;
      }
    };

    const changePocInfo = () => {
      var selection = selectedOffice.value;
      event.value.pocInfo = selection.pocInfo;
    };

    const drop = (event) => {
      dropzoneFile.value = event.dataTransfer.files[0];
      populateFields();
    };

    const selectedFile = () => {
      dropzoneFile.value = document.querySelector(".dropzoneFile").files[0];
      populateFields();
    };

    const attachmentDrop = (event) => {
      attachmentDropzoneFile.value = event.dataTransfer.files[0];
    };

    const attachmentSelectedFile = () => {
      attachmentDropzoneFile.value = document.querySelector(
        ".attachmentDropzoneFile"
      ).files[0];
    };

    const populateFields = () => {
      selectedCountries.value = [countries[144], countries[183]];
      selectedTopics.value = [topics[0], topics[1]];
      selectedActors.value = [actors[0], actors[1]];
      event.value.title = articles[0].title;
      event.value.titlePM = articles[0].classification;
      event.value.summaryPM = articles[0].classification;
      event.value.classification = articles[0].classification;
      event.value.summary = articles[0].content[0];
      event.value.docNum = articles[0].id;
      event.value.publicationNumber = articles[0].id;
      event.value.classifiedBy = articles[0].author;
    };

    return {
      event,
      countries,
      selectedCountries,
      worldwide,
      topics,
      selectedTopics,
      actors,
      selectedActors,
      dateValue,
      dissemOrgs,
      producingOffices,
      selectedOffice,
      analysisTypes,
      selectedAnalysisType,
      fileInputButton,
      attachmentFileInputButton,
      dropzoneFile,
      attachmentDropzoneFile,
      articlesData,
      checkAllOrgs,
      populateFields,
      toggleAllOrgs,
      changePocInfo,
      drop,
      selectedFile,
      attachmentDrop,
      attachmentSelectedFile,
    };
  },
};
</script>

<style>
.ck-editor__editable_inline {
  height: 500px;
}
</style>
