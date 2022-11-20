<template>
  <p class="
      font-semibold
      text-2xl
      py-4
      border-b-2 border-slate-900/10
      dark:border-slate-50/[0.06]
      energy:border-zinc-700/25
    ">
    Edit Document
  </p>
  <form ref="publishingForm">
    <div class="flex flex-col lg:flex-row gap-6 lg:gap-3 mt-4">
      <!-- Left Container -->
      <BaseCard class="flex flex-col lg:w-8/12 p-6 space-y-6">
        <div class="md:flex md:space-x-4 space-y-4 md:space-y-0">
          <div class="basis-1/2 space-y-4">
            <BaseListbox v-model="event.selectedCountries.model" :label="event.selectedCountries.label"
              :items="event.selectedCountries.items" multiple />
            <input type="checkbox" id="worldwide" name="worldwide" value="Worldwide" v-model="worldwide" />
            <label for="worldwide" class="ml-2 text-sm">Worldwide</label>
          </div>
          <div class="basis-1/2">
            <BaseListbox v-model="event.selectedTopics.model" :label="event.selectedTopics.label"
              :items="event.selectedTopics.items" multiple />
          </div>
        </div>
        <div class="md:flex">
          <div class="basis-full space-y-4">
            <BaseListbox v-model="event.selectedActors.model" :label="event.selectedActors.label"
              :items="event.selectedActors.items" multiple />
            <div>
              <input type="checkbox" id="allOrgs" name="allOrgs" v-model="checkAllOrgs" @click="toggleAllOrgs()" />
              <label for="allOrgs" class="ml-2 text-sm"> All Orgs</label>
            </div>
            <Disclosure v-slot="{ open }">
              <DisclosureButton class="flex text-sm items-center">
                <span>Show Dissem Orgs</span>
                <ChevronDownIcon class="h-4 w-4" :class="open ? 'transform rotate-180' : ''" />
              </DisclosureButton>
              <transition enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95">
                <DisclosurePanel>
                  <div class="grid grid-cols-3 md:grid-cols-5 gap-3 mt-4">
                    <div v-for="(org, index) in dissemOrgs" :key="index">
                      <input type="checkbox" v-model="dissemOrgs[index].model" class="mt-2" />
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
            <BaseInput v-model="event.titlePM" label="Title PM (required)" type="text" />
          </div>
        </div>
        <div class="md:flex md:space-x-4 space-y-4 md:space-y-0">
          <div class="basis-2/3">
            <BaseTextarea maxlength="4000" rows="6" v-model="event.summary" label="Summary"></BaseTextarea>
          </div>
          <div class="basis-1/3">
            <BaseInput v-model="event.summaryPM" label="Summary PM (required)" type="text" />
          </div>
        </div>
        <div>
          <label for="body" class="font-medium text-sm">Body</label>
          <div class="mt-1">
            <ckeditor :editor="editor" v-model="editorData" :config="editorConfig" id="body"></ckeditor>
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
          <p class="
              text-lg
              font-medium
              pb-2
              border-b-2 border-slate-900/10
              dark:border-slate-50/[0.06]
              energy:border-zinc-700/25
            ">
            Classification
          </p>
          <div>
            <BaseInput v-model="event.classification" label="Document Classification (required)" type="text" />
          </div>
          <div class="text-sm">
            <p>Classified By: <span id="classifiedBy"></span></p>
            <p>Derived From: Channel News Asia</p>
            <p>Declassify On: Jun 26, 2032</p>
          </div>
          <p class="
              text-lg
              font-medium
              pb-2
              border-b-2 border-slate-900/10
              dark:border-slate-50/[0.06]
              energy:border-zinc-700/25
            ">
            Attachments
          </p>
          <div>
            <label class="block mb-2" for="attachment_input">Upload attachment files</label>
            <PublishFileUploader id="attachment_input" @drop.prevent="attachmentDrop"
              @change="attachmentSelectedFile" />
          </div>
          <div class="
              border-b-2 border-slate-900/10
              dark:border-slate-50/[0.06]
              energy:border-zinc-700/25
              pb-2
            ">
            <h2 class="text-lg font-medium">Article Images</h2>
          </div>
          <div class="
              border-b-2 border-slate-900/10
              dark:border-slate-50/[0.06]
              energy:border-zinc-700/25
              pb-2
            ">
            <h2 class="text-lg font-medium">Supporting Attachments</h2>
          </div>
          <div class="
              border-b-2 border-slate-900/10
              dark:border-slate-50/[0.06]
              energy:border-zinc-700/25
              pb-2
            ">
            <h2 class="text-lg font-medium">Details</h2>
          </div>
          <div>
            <BaseInput v-model="event.docNum" label="Doc Num (Permalink)" type="text" />
          </div>
          <div>
            <BaseInput v-model="event.publicationNumber" label="Publication Number" type="text" />
          </div>
          <div>
            <BaseInput v-model="event.publicationDate" label="Publication Date" type="text" />
          </div>
          <div>
            <BaseTextarea maxlength="4000" rows="4" v-model="event.pocInfo" label="POC Info"></BaseTextarea>
          </div>
          <div>
            <BaseListbox v-model="event.selectedOffice.model" :label="event.selectedOffice.label"
              :items="event.selectedOffice.items" />
          </div>
          <div>
            <BaseListbox v-model="event.selectedAnalysisType.model" :label="event.selectedAnalysisType.label"
              :items="event.selectedAnalysisType.items" />
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
          <input type="checkbox" id="revision" name="revision" value="Revision" />
          <label for="revision" class="text-sm">
            This edit is a substantive revision</label>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import * as dayjs from "dayjs"
import { computed, ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex"
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/solid";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import DropZone from "@/components/DropZone"
import FilePreview from "@/components/FilePreview"
import useFileList from "@/compositions/file-list"
import createUploader from "@/compositions/file-uploader"

export default {
  components: {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    ChevronDownIcon,
    DropZone,
    FilePreview
  },
  data() {
    return {
      classifiedBy: null,
      derivedFrom: null,
      reason: null,
      declassOn: null,
    }
  },
  methods: {
    onInputChange(e) {
      this.addFiles(e.target.files);
      e.target.value = null;
    },
    classify() {
      if (!this.classification_xml) {
        classification.clear();
      } else {
        classification.setClassificationXML(this.classification_xml)
      }
      window.storeClassificationXML = (xmlVal) =>
        this.storeClassificationXML(xmlVal);

      launchAcgWindow('/classGuide.html')
    },
    portionMark(fieldName) {
      if (!this[fieldName + '_xml']) {
        classification.clear()
      } else {
        classification.setClassificationXML(this[fieldName + '_xml'])
      }

      window.storePortionMarkingXML = (xmlVal) =>
        this.storePortionMarkingXML(fieldName, xmlVal);

      launchAcgPortionMarkingWindow('/classGuide.html')
    },
    created() {
      handleLoad();
    },
    storePortionMarkingXML(fieldName, xmlVal) {
      if (classification) {
        var test = fieldName + '_input';
        this.document.getElementsByName(test)[0].value = classification.getHeader().getBanner();
        this[fieldName + '_xml'] = classification.getClassificationXML();
      }
    },
    storeClassificationXML(xmlVal) {
      this.classification_xml = xmlVal;
      let header = classification.getHeader()
      if (header) {
        this.document.getElementsByName('classification_header')[0].value = header.getBanner();
      } else {
        this.classificationMarkings = null;
      }
      let block = classification.getBlock();
      if (block) {
        this.classifiedBy = block.getCLBy();
        this.derivedFrom = block.getDrvFrom();
        this.declassOn = block.getDeclOn();
      } else {
        this.classifiedBy = null;
        this.derivedFrom = null;
        this.declassOn = null;
      }
      closeAcgWindow();
    },
    beforeDestroy() {
      destroyAcgWindow();
      destroyAcgPortionMarkingWindow();
    }
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const loadingMetadata = computed(() => store.state.metadata.loading)
    const criteria = computed(() => store.state.metadata.criteria)
    const loadingDocumentData = computed(() => store.state.kevin.loadingDocument)
    const documentData = computed(() => store.state.kevin.data)
    const editor = ClassicEditor
    const editorData = ref("")
    const editorConfig = ref({})
    const dissem_orgs = computed(() => store.state.kevin.dissem_orgs)
    const product_types = computed(() => store.state.kevin.product_types)
    const { files, addFiles, removeFile } = useFileList();
    //TODO: Verify this looks right
    const { uploadFiles } = createUploader('/documents/' + route.params.doc_num + '/attachments/')
    const selectedDate = ref();

    const buildFormData = () => {
      return {
        selectedCountries: {
          label: 'Countries',
          model: [],
          items: criteria.value.countries
        },
        selectedTopics: {
          label: 'Topics',
          model: [],
          items: criteria.value.topics
        },
        selectedActors: {
          label: 'Non State Actors',
          model: [],
          items: criteria.value.non_state_actors
        },
        dissem_orgs: [],
        selectedProductTypes: {
          label: 'Product Types',
          model: [],
          items: product_types.value
        },
        html_body: '',
        classification: '',
        classification_xml: '',
        title_classif: '',
        title_classif_xml: '',
        summary_classif: '',
        summary_classif_xml: '',
        selectedOffice: {
          label: 'Producing Office',
          model: producing_offices.value[0],
          items: producing_offices.value
        }
      }
    }

    const sampleFormData = ref(buildFormData());

    const event = ref({
      selectedCountries: {
        label: "Countries",
        model: [],
        items: criteria.value.countries,
      },
      selectedTopics: {
        label: "Topics",
        model: [],
        items: criteria.value.topics,
      },
      selectedActors: {
        label: "Non-State Actors",
        model: [],
        items: criteria.value.non_state_actors,
      },
      dissem_orgs: [],
      title: '',
      title_classif: '',
      title_classif_xml: '',
      summary: '',
      summary_classif: '',
      summary_classif_xml: '',
      html_body: '',
      classification: '',
      classification_xml: '',
      classification_decl_fmt: '',
      doc_num: route.params.doc_num,
      publication_number: '',
      date_published: '',
      poc_info: '',
      worldwide: null,
      selectedOffice: {
        label: "Producing Office",
        model: producing_offices.value[0],
        items: producing_offices.value,
      },
      selectedProductType: {
        label: 'Product Type',
        model: [],
        items: product_types.value
      },
    });

    const attachmentDropzoneFile = ref("");
    const articlesData = ref(articles);
    let checkAllOrgs = ref(false);

    const toggleAllOrgs = () => {
      dissem_orgs.value.forEach(org => {
        if (!checkAllOrgs.value) {
          if (!sampleFormData.value.dissem_orgs.includes(org)) {
            sampleFormData.value.dissem_orgs.push(org)
          } else {
            sampleFormData.value.dissem_orgs.pop(org);
          }
        }
      })
    }

    const changePocInfo = () => {
      const selection = event.value.selectedOffice.model;
      event.value.pocInfo = selection.pocInfo;
    }

    const attachmentDrop = (event) => {
      attachmentDropzoneFile.value = event.dataTransfer.files[0]
    }

    const attachmentSelectedFile = () => {
      attachmentDropzoneFile.value = document.querySelector(".fileUpload").files[0]
    }

    const printCodes = (item) => {
      return [item.code].join(", ");
    }

    let formData = event.value

    const selectDate = () => {
      formData.date_published = dayjs(selectedDate.value).format("YYYYY-MM-DD")
    }

    const populate = () => {
      formData.selectedCountries.codes = sampleFormData.value.selectedCountries.model.map(printCodes)
      formData.selectedTopics.codes = sampleFormData.value.selectedTopics.model.map(printCodes)
      formData.selectedActors.codes = sampleFormData.value.selectedActors.model.map(printCodes)
      formData.html_body = document.getElementsByClassName("ck-content")[0].innerHTML;
      formData.date_published = dayjs(selectedDate.value).format("YYYY-MM-DD")
      formData.classification_xml = classification.getClassificationXML();
      formData.classification = document.getElementsByName("classification_header")[0].value;
      formData.title_classif = document.getElementsByName("title_classif_input")[0].value;
      formData.title_classif_xml = document.getElementById("title_classif_xml").value;
      formData.summary_classif = document.getElementsByName("summary_classif_input")[0].value;
      formData.summary_classif_xml = document.getElementById("summary_classif_xml").value;

      if (formData.title === 'Draft Document') formData.title = 'Test Document'

      if (formData.classification.startsWith('UNCLASSIFIED')) {
        formData.classification_decl_fmt = ''
      } else {
        let classifiedBy = document.getElementsByTagName("td")[0].innerHTML
        let derivedFrom = document.getElementsByTagName("td")[1].innerHTML
        let declassifyOn = document.getElementsByTagName("td")[2].innerHTML;
        formData.classification_decl_fmt = 'TODO: NEED FULL STRING OF THIS'
      }
    }

    const articleProps = {
      date: route.params.date,
      id: route.params.id
    }



    const worldwide = ref(null);
    //const attachmentDropzoneFile = ref("");
    //const articlesData = ref(articles);
    //let checkAllOrgs = ref(false);
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

    // const toggleAllOrgs = () => {
    //   for (let i = 0; i < dissemOrgs.value.length; i++) {
    //     dissemOrgs.value[i].model = !checkAllOrgs.value;
    //   }
    // };

    // const changePocInfo = () => {
    //   var selection = event.value.selectedOffice.model;
    //   event.value.pocInfo = selection.pocInfo;
    // };

    // const attachmentDrop = (event) => {
    //   attachmentDropzoneFile.value = event.dataTransfer.files[0];
    // };

    // const attachmentSelectedFile = () => {
    //   attachmentDropzoneFile.value =
    //     document.querySelector(".fileUpload").files[0];
    // };

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
