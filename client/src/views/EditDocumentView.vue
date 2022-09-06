<template>
  <p
    class="
      font-semibold
      text-2xl
      py-4
      border-b-2 border-slate-900/10
      dark:border-slate-50/[0.06]
      energy:border-zinc-700/25
    "
  >
    Edit Document
  </p>
  <form ref="publishingForm">
    <div class="flex flex-col lg:flex-row gap-6 lg:gap-3 mt-4">
      <!-- Left Container -->
      <BaseCard class="flex flex-col lg:w-8/12 p-6 space-y-6">
        <div class="md:flex md:space-x-4 space-y-4 md:space-y-0">
          <div class="basis-1/2 space-y-4">
            <BaseListbox
              v-model="event.selectedCountries.model"
              :label="event.selectedCountries.label"
              :items="event.selectedCountries.items"
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
              v-model="event.selectedTopics.model"
              :label="event.selectedTopics.label"
              :items="event.selectedTopics.items"
              multiple
            />
          </div>
        </div>
        <div class="md:flex">
          <div class="basis-full space-y-4">
            <BaseListbox
              v-model="event.selectedActors.model"
              :label="event.selectedActors.label"
              :items="event.selectedActors.items"
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
              energy:border-zinc-700/25
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
              energy:border-zinc-700/25
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
            />
          </div>
          <div
            class="
              border-b-2 border-slate-900/10
              dark:border-slate-50/[0.06]
              energy:border-zinc-700/25
              pb-2
            "
          >
            <h2 class="text-lg font-medium">Article Images</h2>
          </div>
          <div
            class="
              border-b-2 border-slate-900/10
              dark:border-slate-50/[0.06]
              energy:border-zinc-700/25
              pb-2
            "
          >
            <h2 class="text-lg font-medium">Supporting Attachments</h2>
          </div>
          <div
            class="
              border-b-2 border-slate-900/10
              dark:border-slate-50/[0.06]
              energy:border-zinc-700/25
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
              v-model="event.selectedOffice.model"
              :label="event.selectedOffice.label"
              :items="event.selectedOffice.items"
            />
          </div>
          <div>
            <BaseListbox
              v-model="event.selectedAnalysisType.model"
              :label="event.selectedAnalysisType.label"
              :items="event.selectedAnalysisType.items"
            />
          </div>
        </div>
      </BaseCard>
    </div>
    <div class="flex my-4">
      <div class="flex flex-wrap gap-4">
        <BaseButton @click.prevent>Publish</BaseButton>
        <BaseButton @click.prevent>Save and Generate PDF</BaseButton>
        <BaseButton @click.prevent="populateFields">Preview</BaseButton>
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
import { useRoute } from "vue-router";

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
      var content = [];
      articles[0].content.forEach((item) => {
        content += item;
      });
      this.editorData = content;
    },
  },
  setup() {
    const event = ref({
      selectedCountries: {
        label: "Countries",
        model: [],
        items: countries,
      },
      selectedTopics: {
        label: "Topics",
        model: [],
        items: topics,
      },
      selectedActors: {
        label: "Non-State Actors",
        model: [],
        items: actors,
      },
      title: "",
      titlePm: "",
      summary: "",
      summaryPM: "",
      classification: "",
      classifiedBy: "",
      docNum: "",
      publicationNumber: "",
      publicationDate: "",
      pocInfo: "",
      selectedOffice: {
        label: "Producing Office",
        model: "",
        items: producingOffices,
      },
      selectedAnalysisType: {
        label: "Analysis Type",
        model: "",
        items: analysisTypes,
      },
    });
    const worldwide = ref(null);
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
      var selection = event.value.selectedOffice.model;
      event.value.pocInfo = selection.pocInfo;
    };

    const attachmentDrop = (event) => {
      attachmentDropzoneFile.value = event.dataTransfer.files[0];
    };

    const attachmentSelectedFile = () => {
      attachmentDropzoneFile.value =
        document.querySelector(".fileUpload").files[0];
    };

    const populateFields = () => {
      event.value.selectedCountries.model = [countries[35]];
      event.value.selectedTopics.model = [topics[2]];
      event.value.selectedActors.model = [actors[0], actors[1]];
      event.value.title = articles[0].title;
      event.value.titlePM = articles[0].classification;
      event.value.summaryPM = articles[0].classification;
      event.value.classification = articles[0].classification;
      event.value.summary = articles[0].content[0];
      event.value.docNum = articles[0].doc_num;
      event.value.publicationNumber = articles[0].doc_num;
      event.value.classifiedBy = articles[0].author;
    };

    return {
      event,
      worldwide,
      dissemOrgs,
      attachmentDropzoneFile,
      articlesData,
      checkAllOrgs,
      populateFields,
      toggleAllOrgs,
      changePocInfo,
      attachmentDrop,
      attachmentSelectedFile,
    };
  },
  mounted() {
    if (useRoute().name === "edit" && useRoute().params.id) {
      this.populateFields();
      this.populateCkEditor();
    }
  },
};
</script>

<style>
.ck-editor__editable_inline {
  height: 450px;
}
</style>
