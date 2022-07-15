<template>
   <template v-if="routerError">
    <NotFound />
  </template>
  <template v-else>
    <form ref="publishingForm" class="mb-10 mt-10">
      <div>
        <label class="block mb-2" for="file_input">Upload a file to publish</label>
        <PublishViewFileUploader id="file_input" @drop.prevent="drop" @change="selectedFile">
          <label for="dropzoneFile" 
            class="
              bg-slate-100 hover:bg-slate-200/80 
              dark:bg-slate-700 dark:hover:bg-slate-700/80 
              energy:bg-gray-700 energy:hover:bg-gray-700/80 border 
              border-slate-300 
              p-2 
              rounded shadow
              text-sm
            "
          >
            Select File
          </label>
          <input type="file" id="dropzoneFile" class="dropzoneFile hidden" />
        </PublishViewFileUploader>
        <span>{{ dropzoneFile.name }}</span>
      </div>
      <div
        class="
          flex flex-wrap
          lg:flex-nowrap
          lg:gap-12
          mb-8 mt-20
          gap-y-20
        "
      >
        <div class="w-full xl:basis-9/12 lg:max-w-[620px] xl:max-w-[850px]">
          <div class="flex flex-col space-y-8">
            <div 
              class="
                border-b-2 border-slate-900/10
                dark:border-slate-50/[0.06]
                energy:border-gray-700/25 pb-4
              "
            >
              <h1 class="text-3xl">Edit Document</h1>
            </div>
            <div class="flex flex-wrap md:flex-nowrap gap-3"> 
              <div class="w-full md:max-w-[350px] lg:max-w-[300px] xl:max-w-[420px]">
                <label class="block mb-2" for="countriesListbox">Countries</label>
                <Listbox
                  id="countriesListbox"
                  v-model="selectedCountries"
                  name="countriesListbox"
                  multiple
                  aria-label="select a country from the dropdown"
                >
                  <div class="relative">
                    <ListboxButton
                      class="
                        flex
                        h-10
                        w-full
                        p-2
                        text-left
                        capitalize
                        text-slate-800
                        dark:text-gray-300
                        energy:text-gray-300
                        bg-slate-200
                        dark:bg-slate-800
                        energy:bg-gray-600
                        rounded-lg
                        shadow-md
                        cursor-default
                        focus:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-opacity-75
                        focus-visible:ring-offset-2
                      "
                    >
                      <span class="block truncate">{{
                        selectedCountries.map((country) => country.name).join(', ')
                      }}</span>
                      <span
                        class="
                          absolute
                          inset-y-0
                          right-0
                          flex
                          items-center
                          pr-2
                        "
                      >
                        <SelectorIcon
                          class="h-5 w-5"
                          aria-hidden="true"
                        />
                      </span>
                    </ListboxButton>
                    <transition
                      enter-active-class="transition ease-out duration-100"
                      enter-from-class="transform opacity-0 scale-95"
                      enter-to-class="transform opacity-100 scale-100"
                      leave-active-class="transition ease-in duration-75"
                      leave-from-class="transform opacity-100 scale-100"
                      leave-to-class="transform opacity-0 scale-95"
                    >
                      <ListboxOptions
                        class="
                          absolute
                          w-full
                          py-1
                          mt-1
                          overflow-auto
                          text-slate-800
                          dark:text-gray-300
                          energy:text-gray-300
                          bg-slate-200
                          dark:bg-slate-800
                          energy:bg-gray-600
                          rounded-md
                          shadow-lg
                          max-h-60
                          ring-1 ring-black ring-opacity-5
                          focus:outline-none
                          z-10
                        "
                      >
                        <ListboxOption
                          v-slot="{ active, selected }"
                          v-for="country in countries"
                          :key="country"
                          :value="country"
                          as="template"
                          class="capitalize px-2 py-1 cursor-pointer"
                        >
                          <li
                            :class="[
                              active
                                ? 'bg-slate-300 dark:bg-slate-700 energy:bg-gray-700'
                                : 'bg-none',
                            ]"
                          >
                            <div class="flex">
                              {{ country.name }}
                              <CheckIcon v-show="selected" class="h-5 w-5 ml-2"/>
                            </div>
                          </li>
                        </ListboxOption>
                      </ListboxOptions>
                    </transition>
                  </div>
                </Listbox>
                <input type="checkbox" id="worldwide" name="worldwide" value="Worldwide" class="mt-2">
                <label for="worldwide" class="text-sm"> Worldwide</label>
              </div>
              <div class="w-full md:max-w-[350px] lg:max-w-[300px] xl:max-w-[420px]">
                <label class="block mb-2" for="topicsListbox">Topics</label>
                <Listbox
                  id="topicsListbox"
                  v-model="selectedTopics"
                  name="topicsListbox"
                  multiple
                  aria-label="select a topic from the dropdown"
                >
                  <div class="relative">
                    <ListboxButton
                      class="
                        flex
                        h-10
                        w-full
                        p-2
                        text-left
                        capitalize
                        text-slate-800
                        dark:text-gray-300
                        energy:text-gray-300
                        bg-slate-200
                        dark:bg-slate-800
                        energy:bg-gray-600
                        rounded-lg
                        shadow-md
                        cursor-default
                        focus:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-opacity-75
                        focus-visible:ring-offset-2
                      "
                    >
                      <span class="block truncate">{{
                        selectedTopics.map((topic) => topic.title).join(', ')
                      }}</span>
                      <span
                        class="
                          absolute
                          inset-y-0
                          right-0
                          flex
                          items-center
                          pr-2
                        "
                      >
                        <SelectorIcon
                          class="h-5 w-5"
                          aria-hidden="true"
                        />
                      </span>
                    </ListboxButton>
                    <transition
                      enter-active-class="transition ease-out duration-100"
                      enter-from-class="transform opacity-0 scale-95"
                      enter-to-class="transform opacity-100 scale-100"
                      leave-active-class="transition ease-in duration-75"
                      leave-from-class="transform opacity-100 scale-100"
                      leave-to-class="transform opacity-0 scale-95"
                    >
                      <ListboxOptions
                        class="
                          absolute
                          w-full
                          py-1
                          mt-1
                          overflow-auto
                          text-slate-800
                          dark:text-gray-300
                          energy:text-gray-300
                          bg-slate-200
                          dark:bg-slate-800
                          energy:bg-gray-600
                          rounded-md
                          shadow-lg
                          max-h-60
                          ring-1 ring-black ring-opacity-5
                          focus:outline-none
                          z-10
                        "
                      >
                        <ListboxOption
                          v-slot="{ active, selected }"
                          v-for="topic in topics"
                          :key="topic"
                          :value="topic"
                          as="template"
                          class="capitalize px-2 py-1 cursor-pointer"
                        >
                          <li
                            :class="[
                              active
                                ? 'bg-slate-300 dark:bg-slate-700 energy:bg-gray-700'
                                : 'bg-none',
                            ]"
                          >
                            <div class="flex">
                              {{ topic.title }}
                              <CheckIcon v-show="selected" class="h-5 w-5 ml-2"/>
                            </div>
                          </li>
                        </ListboxOption>
                      </ListboxOptions>
                    </transition>
                  </div>
                </Listbox>
              </div>
            </div>
            <div>
              <label class="block mb-2" for="actorssListbox">Non-State Actors</label>
              <Listbox
                id="actorsListbox"
                v-model="selectedActors"
                name="actorsListbox"
                multiple
                aria-label="select a Non-State Actor from the dropdown"
              >
                <div class="relative">
                  <ListboxButton
                    class="
                      flex
                      h-10
                      w-full
                      p-2
                      text-left
                      capitalize
                      text-slate-800
                      dark:text-gray-300
                      energy:text-gray-300
                      bg-slate-200
                      dark:bg-slate-800
                      energy:bg-gray-600
                      rounded-lg
                      shadow-md
                      cursor-default
                      focus:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-opacity-75
                      focus-visible:ring-offset-2
                    "
                  >
                    <span class="block truncate">{{
                      selectedActors.map((actor) => actor.title).join(', ')
                    }}</span>
                    <span
                      class="
                        absolute
                        inset-y-0
                        right-0
                        flex
                        items-center
                        pr-2
                      "
                    >
                      <SelectorIcon
                        class="h-5 w-5"
                        aria-hidden="true"
                      />
                    </span>
                  </ListboxButton>
                  <transition
                    enter-active-class="transition ease-out duration-100"
                    enter-from-class="transform opacity-0 scale-95"
                    enter-to-class="transform opacity-100 scale-100"
                    leave-active-class="transition ease-in duration-75"
                    leave-from-class="transform opacity-100 scale-100"
                    leave-to-class="transform opacity-0 scale-95"
                  >
                    <ListboxOptions
                      class="
                        absolute
                        w-full
                        py-1
                        mt-1
                        overflow-auto
                        text-slate-800
                        dark:text-gray-300
                        energy:text-gray-300
                        bg-slate-200
                        dark:bg-slate-800
                        energy:bg-gray-600
                        rounded-md
                        shadow-lg
                        max-h-60
                        ring-1 ring-black ring-opacity-5
                        focus:outline-none
                        z-10
                      "
                    >
                      <ListboxOption
                        v-slot="{ active, selected }"
                        v-for="actor in actors"
                        :key="actor"
                        :value="actor"
                        as="template"
                        class="capitalize px-2 py-1 cursor-pointer"
                      >
                        <li
                          :class="[
                            active
                              ? 'bg-slate-300 dark:bg-slate-700 energy:bg-gray-700'
                              : 'bg-none',
                          ]"
                        >
                          <div class="flex">
                            {{ actor.title }}
                            <CheckIcon v-show="selected" class="h-5 w-5 ml-2"/>
                          </div>
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
              <div class="flex mt-6">
                <div>
                  <input type="checkbox" id="allOrgs" name="allOrgs" value="All Orgs" class="orgCheckbox" @click="toggle(this)">
                  <label for="allOrgs" class="text-sm"> All Orgs</label>
                </div>
                <div class="ml-8 self-center">
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
                          <div v-for="org in dissemOrgs" :key="org.name">
                            <input type="checkbox" id="dissemOrg" name="dissemOrg" value="Dissem Org" class="orgCheckbox mt-2">
                            <label for="dissemOrg" class="text-sm ml-1"> {{ org.name }} </label>
                          </div>
                        </div>
                      </DisclosurePanel>
                    </transition>
                  </Disclosure>
                </div>
              </div>
            </div>
            <div class="flex flex-wrap wrap md:flex-nowrap gap-3">
              <div class="w-full lg:basis-2/3">
                <label for="title" class="block mb-2">Title</label>
                <input type="text" id="title" 
                  class=" 
                    h-10
                    w-full
                    p-2
                    text-left
                    capitalize
                    text-slate-800
                    dark:text-gray-300
                    energy:text-gray-300
                    bg-slate-200
                    dark:bg-slate-800
                    energy:bg-gray-600
                    rounded-lg
                    shadow-md
                    cursor-default
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-opacity-75
                    focus-visible:ring-offset-2
                  " 
                />
              </div>
              <div class="w-full lg:basis-1/3">
                <label for="titlePM" class="block mb-2" required>Title PM (required)</label>
                <input type="text" id="titlePM" 
                  class=" 
                    w-full
                    p-2
                    text-left
                    capitalize
                    text-slate-800
                    dark:text-gray-300
                    energy:text-gray-300
                    bg-slate-200
                    dark:bg-slate-800
                    energy:bg-gray-600
                    rounded-lg
                    shadow-md
                    cursor-default
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-opacity-75
                    focus-visible:ring-offset-2
                  " 
                />
              </div>
            </div>
            <div class="flex flex-wrap wrap md:flex-nowrap gap-3">
              <div class="w-full lg:basis-2/3">
                <label for="summary" class="block mb-2">Summary</label>
                <textarea id="summary" maxlength="4000" rows="4"
                  class=" 
                    w-full
                    p-2
                    text-left
                    capitalize
                    text-slate-800
                    dark:text-gray-300
                    energy:text-gray-300
                    bg-slate-200
                    dark:bg-slate-800
                    energy:bg-gray-600
                    rounded-lg
                    shadow-md
                    cursor-default
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-opacity-75
                    focus-visible:ring-offset-2
                    resize-none
                  " 
                >
                </textarea>
              </div>
              <div class="w-full lg:basis-1/3">
                <label for="summaryPM" class="block mb-2" required>Summary PM (required)</label>
                <input type="text" id="summaryPM" 
                  class=" 
                    w-full
                    p-2
                    text-left
                    capitalize
                    text-slate-800
                    dark:text-gray-300
                    energy:text-gray-300
                    bg-slate-200
                    dark:bg-slate-800
                    energy:bg-gray-600
                    rounded-lg
                    shadow-md
                    cursor-default
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-opacity-75
                    focus-visible:ring-offset-2
                  " 
                />
              </div>
            </div>
            <div class="w-full"> 
              <label for="body" class="block mb-2">Body</label>
              <ckeditor :editor="editor" v-model="editorData" :config="editorConfig"></ckeditor>
            </div>
            <div> 
              <h2 class="text-xl border-b-2 border-slate-900/10
              dark:border-slate-50/[0.06]
              energy:border-gray-700/25
              pb-4">Source Citations</h2>
              <ol class="list-decimal list-inside ml-4 mt-4 space-y-2">
                <li>
                  A terrifying journey to a Russian prison and back
                </li>
                <li>
                  Isolated Russia divided over Ukraine offensive
                </li>
              </ol>
              <!-- <ol class="list-decimal list-inside ml-4 space-y-2">
                <div v-for="source in selectedArticle.sources" :key="source.name">
                  <li class="text-sm">
                    <router-link to="#" class="hover:underline">
                      {{ source.name }}
                    </router-link>
                  </li>
                </div>
              </ol> -->
            </div>
          </div>
        </div>
        <div class="w-full lg:basis-3/12">
          <div class="flex flex-col space-y-8">
            <div class="
              border-b-2 border-slate-900/10
              dark:border-slate-50/[0.06]
              energy:border-gray-700/25
              pb-4
              "
            >
              <h2 class="text-xl">Classification</h2>
            </div>
            <div>
              <label for="documentClass" class="block mb-2" required>Document Classification (required)</label>
              <input type="text" id="documentClass" 
                class=" 
                  w-full
                  p-2
                  text-left
                  capitalize
                  text-slate-800
                  dark:text-gray-300
                  energy:text-gray-300
                  bg-slate-200
                  dark:bg-slate-800
                  energy:bg-gray-600
                  rounded-lg
                  shadow-md
                  cursor-default
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-opacity-75
                  focus-visible:ring-offset-2
                " 
              />
            </div>
            <div class="font-semibold"> 
              <p>Classified By: </p>
              <p>Derived From: </p>
              <p>Declassify On: </p>
            </div>
            <div class="
              border-b-2 border-slate-900/10
              dark:border-slate-50/[0.06]
              energy:border-gray-700/25
              pb-4
              "
            >
              <h2 class="text-xl">Attachments</h2>
            </div>
            <div>
              <label class="block mb-2" for="attachment_input">Upload article files</label>
              <PublishViewFileUploader id="attachment_input" @drop.prevent="attachmentDrop" @change="attachmentSelectedFile">
                <label for="attachmentDropzoneFile" 
                  class="
                    bg-slate-100 hover:bg-slate-200/80 
                    dark:bg-slate-700 dark:hover:bg-slate-700/80 
                    energy:bg-gray-700 energy:hover:bg-gray-700/80 border 
                    border-slate-300 
                    p-2 
                    rounded shadow
                    text-sm
                  "
                >
                  Select File
                </label>
                <input type="file" id="attachmentDropzoneFile" class="attachmentDropzoneFile hidden" multiple />
              </PublishViewFileUploader>
            </div>
            <a href="" class="hover:underline">View ****</a>
            <div class="
              border-b-2 border-slate-900/10
              dark:border-slate-50/[0.06]
              energy:border-gray-700/25
              pb-4
              "
            >
              <h2 class="text-xl">Article Images</h2>
            </div>
            <div class="
              border-b-2 border-slate-900/10
              dark:border-slate-50/[0.06]
              energy:border-gray-700/25
              pb-4
              "
            >
              <h2 class="text-xl">Supporting Attachments</h2>
            </div>
            <span>{{ attachmentDropzoneFile.name }}</span>
            <div class="
              border-b-2 border-slate-900/10
              dark:border-slate-50/[0.06]
              energy:border-gray-700/25
              pb-4
              "
            >
              <h2 class="text-xl">Details</h2>
            </div>
            <div>
              <label for="docNum" class="block mb-2">Doc Num (Permalink)</label>
              <input type="text" id="docNum" 
                class=" 
                  w-full
                  p-2
                  text-left
                  capitalize
                  text-slate-800
                  dark:text-gray-300
                  energy:text-gray-300
                  bg-slate-200
                  dark:bg-slate-800
                  energy:bg-gray-600
                  rounded-lg
                  shadow-md
                  cursor-default
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-opacity-75
                  focus-visible:ring-offset-2
                " 
              />
            </div>
            <div>
              <label for="publicationNumber" class="block mb-2">Publication Number</label>
              <input type="text" id="publicationNumber" 
                class=" 
                  w-full
                  p-2
                  text-left
                  capitalize
                  text-slate-800
                  dark:text-gray-300
                  energy:text-gray-300
                  bg-slate-200
                  dark:bg-slate-800
                  energy:bg-gray-600
                  rounded-lg
                  shadow-md
                  cursor-default
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-opacity-75
                  focus-visible:ring-offset-2
                " 
              />
            </div>
            <div>
              <label for="datepicker" class="block mb-2">Publication Date</label>
              <input type="text" id="datepicker" v-model="dateValue" autocomplete="off"
                class=" 
                  w-full
                  p-2
                  text-left
                  capitalize
                  text-slate-800
                  dark:text-gray-300
                  energy:text-gray-300
                  bg-slate-200
                  dark:bg-slate-800
                  energy:bg-gray-600
                  rounded-lg
                  shadow-md
                  cursor-default
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-opacity-75
                  focus-visible:ring-offset-2
                " 
              />
            </div>
            <div>
                <label for="pocInfo" class="block mb-2">Poc Info</label>
                <textarea id="pocInfo" maxlength="4000" rows="4"
                  class=" 
                    w-full
                    p-2
                    text-left
                    capitalize
                    text-slate-800
                    dark:text-gray-300
                    energy:text-gray-300
                    bg-slate-200
                    dark:bg-slate-800
                    energy:bg-gray-600
                    rounded-lg
                    shadow-md
                    cursor-default
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-opacity-75
                    focus-visible:ring-offset-2
                    resize-none
                  " 
                >
                </textarea>
              </div>
              <div>
                <label class="block mb-2" for="officeListbox">Producing Office</label>
                <Listbox
                  id="officeListbox"
                  v-model="selectedOffice"
                  name="officeListbox"
                  aria-label="select a Producing Office from the dropdown"
                >
                  <div class="relative">
                    <ListboxButton
                      class="
                        flex
                        h-10
                        w-full
                        p-2
                        text-left
                        capitalize
                        text-slate-800
                        dark:text-gray-300
                        energy:text-gray-300
                        bg-slate-200
                        dark:bg-slate-800
                        energy:bg-gray-600
                        rounded-lg
                        shadow-md
                        cursor-default
                        focus:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-opacity-75
                        focus-visible:ring-offset-2
                      "
                    >
                      <span class="block truncate">{{
                        selectedOffice.name
                      }}</span>
                      <span
                        class="
                          absolute
                          inset-y-0
                          right-0
                          flex
                          items-center
                          pr-2
                        "
                      >
                        <SelectorIcon
                          class="h-5 w-5"
                          aria-hidden="true"
                        />
                      </span>
                    </ListboxButton>
                    <transition
                      enter-active-class="transition ease-out duration-100"
                      enter-from-class="transform opacity-0 scale-95"
                      enter-to-class="transform opacity-100 scale-100"
                      leave-active-class="transition ease-in duration-75"
                      leave-from-class="transform opacity-100 scale-100"
                      leave-to-class="transform opacity-0 scale-95"
                    >
                      <ListboxOptions
                        class="
                          absolute
                          w-full
                          py-1
                          mt-1
                          overflow-auto
                          text-slate-800
                          dark:text-gray-300
                          energy:text-gray-300
                          bg-slate-200
                          dark:bg-slate-800
                          energy:bg-gray-600
                          rounded-md
                          shadow-lg
                          max-h-60
                          ring-1 ring-black ring-opacity-5
                          focus:outline-none
                          z-10
                        "
                      >
                        <ListboxOption
                          v-slot="{ active, selected }"
                          v-for="office in producingOffices"
                          :key="office"
                          :value="office"
                          as="template"
                          class="capitalize px-2 py-1 cursor-pointer"
                          onchange="changePocInfo(selectedOffice)"
                        >
                          <li
                            :class="[
                              active
                                ? 'bg-slate-300 dark:bg-slate-700 energy:bg-gray-700'
                                : 'bg-none',
                            ]"
                          >
                            <div class="flex">
                              {{ office.name }}
                              <CheckIcon v-show="selected" class="h-5 w-5 ml-2"/>
                            </div>
                          </li>
                        </ListboxOption>
                      </ListboxOptions>
                    </transition>
                  </div>
                </Listbox>
              </div>
              <div>
              <label class="block mb-2" for="analysisListbox">Analysis Type</label>
              <Listbox
                id="analysisListbox"
                v-model="selectedAnalysisType"
                name="analysisListbox"
                aria-label="select an analysis type from the dropdown"
              >
                <div class="relative">
                  <ListboxButton
                    class="
                      flex
                      h-10
                      w-full
                      p-2
                      text-left
                      capitalize
                      text-slate-800
                      dark:text-gray-300
                      energy:text-gray-300
                      bg-slate-200
                      dark:bg-slate-800
                      energy:bg-gray-600
                      rounded-lg
                      shadow-md
                      cursor-default
                      focus:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-opacity-75
                      focus-visible:ring-offset-2
                    "
                  >
                    <span class="block truncate">{{
                      selectedAnalysisType.name
                    }}</span>
                    <span
                      class="
                        absolute
                        inset-y-0
                        right-0
                        flex
                        items-center
                        pr-2
                      "
                    >
                      <SelectorIcon
                        class="h-5 w-5"
                        aria-hidden="true"
                      />
                    </span>
                  </ListboxButton>
                  <transition
                    enter-active-class="transition ease-out duration-100"
                    enter-from-class="transform opacity-0 scale-95"
                    enter-to-class="transform opacity-100 scale-100"
                    leave-active-class="transition ease-in duration-75"
                    leave-from-class="transform opacity-100 scale-100"
                    leave-to-class="transform opacity-0 scale-95"
                  >
                    <ListboxOptions
                      class="
                        absolute
                        w-full
                        py-1
                        mt-1
                        overflow-auto
                        text-slate-800
                        dark:text-gray-300
                        energy:text-gray-300
                        bg-slate-200
                        dark:bg-slate-800
                        energy:bg-gray-600
                        rounded-md
                        shadow-lg
                        max-h-60
                        ring-1 ring-black ring-opacity-5
                        focus:outline-none
                        z-10
                      "
                    >
                      <ListboxOption
                        v-slot="{ active, selected }"
                        v-for="item in analysisTypes"
                        :key="item"
                        :value="item"
                        as="template"
                        class="capitalize px-2 py-1 cursor-pointer"
                      >
                        <li
                          :class="[
                            active
                              ? 'bg-slate-300 dark:bg-slate-700 energy:bg-gray-700'
                              : 'bg-none',
                          ]"
                        >
                          <div class="flex">
                            {{ item.name }}
                            <CheckIcon v-show="selected" class="h-5 w-5 ml-2"/>
                          </div>
                        </li>
                      </ListboxOption>
                    </ListboxOptions>
                  </transition>
                </div>
              </Listbox>
            </div>
          </div>
        </div>
      </div>
      <div class="flex gap-20 flex-wrap lg:flex-nowrap gap-y-8"> 
        <div class="flex gap-3"> 
          <button 
            class="
              bg-slate-100 hover:bg-slate-200/80 
              dark:bg-slate-700 dark:hover:bg-slate-700/80 
              energy:bg-gray-700 energy:hover:bg-gray-700/80 border 
              border-slate-300 
              p-2 
              rounded shadow
              text-sm
            "
          >
            Publish
          </button>
          <button 
            class="
              bg-slate-100 hover:bg-slate-200/80 
              dark:bg-slate-700 dark:hover:bg-slate-700/80 
              energy:bg-gray-700 energy:hover:bg-gray-700/80 border 
              border-slate-300 
              p-2 
              rounded shadow
              text-sm
            "
          >
            Save and Generate PDF
          </button>
          <button 
            class="
              bg-slate-100 hover:bg-slate-200/80 
              dark:bg-slate-700 dark:hover:bg-slate-700/80 
              energy:bg-gray-700 energy:hover:bg-gray-700/80 border 
              border-slate-300 
              p-2 
              rounded shadow
              text-sm
            "
          >
            Preview
          </button>
          <button 
            class="
              bg-slate-100 hover:bg-slate-200/80 
              dark:bg-slate-700 dark:hover:bg-slate-700/80 
              energy:bg-gray-700 energy:hover:bg-gray-700/80 border 
              border-slate-300 
              p-2 
              rounded shadow
              text-sm
            "
          >
            Cancel
          </button>
        </div>
        <div class="flex items-end gap-3">
          <button 
            class="
              bg-red-800 hover:bg-red-900 
              border border-slate-300 
              p-2 
              rounded shadow
              text-sm
              text-white
            "
          >
            Delete
          </button>
          <div class="flex gap-1">
            <input type="checkbox" id="revision" name="revision" value="Revision">
            <label for="revision" class="text-sm"> This edit is a substantive revision</label>
          </div>
        </div>
      </div>
    </form>
  </template>
</template>

<script>
import { ref, onMounted } from "vue";
import {
  // Dialog,
  // DialogOverlay,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { CheckIcon, ChevronDownIcon, SelectorIcon } from '@heroicons/vue/solid'
import { countries } from "@/data/regions.js";
import flatpickr from 'flatpickr';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { articles } from "@/data";
import PublishViewFileUploader from '@/components/PublishViewFileUploader';

const topics = [
  {title: "topic1"}, 
  {title: "topic2"},
  {title: "topic3"},
  {title: "topic4"},
];
const actors = [
  {title: "actor1"}, 
  {title: "actor2"},
  {title: "actor3"},
  {title: "actor4"},
];
const dissemOrgs = [
  {name: "Org1"},
  {name: "Org2"},
  {name: "Org3"},
  {name: "Org4"},
  {name: "Org5"},
  {name: "Org6"},
  {name: "Org7"},
  {name: "Org8"},
  {name: "Org9"},
  {name: "Org10"},
  {name: "Org11"},
  {name: "Org12"},
  {name: "Org13"},
  {name: "Org14"},
  {name: "Org15"},
  {name: "Org16"},
  {name: "Org17"},
  {name: "Org18"},
  {name: "Org19"},
  {name: "Org20"},
  {name: "Org21"},
  {name: "Org22"},
  {name: "Org23"},
  {name: "Org24"},
  {name: "Org25"},
  {name: "Org26"},
  {name: "Org27"},
  {name: "Org28"},
  {name: "Org29"},
  {name: "Org30"},
];
const producingOffices = [
  {name: "Office1", pocInfo:"Office1's address and phone number"},
  {name: "Office2", pocInfo:"Office2's address and phone number"},
  {name: "Office3", pocInfo:"Office3's address and phone number"},
  {name: "Office4", pocInfo:"Office4's address and phone number"},
];
const analysisTypes = [
  {name: "Type1"},
  {name: "Type2"},
  {name: "Type3"},
];

export default {
  components: {
    // Dialog,
    // DialogOverlay,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    CheckIcon,
    ChevronDownIcon,
    SelectorIcon,
    PublishViewFileUploader,
  },

  props: ["id", "title"],
  setup() {
    const selectedCountries = ref([countries[0]]);
    const selectedTopics = ref([topics[0]]);
    const selectedActors = ref([actors[0]]);
    const selectedOffice = ref([producingOffices[0]]);
    const selectedAnalysisType = ref([analysisTypes[0]]);
    const dropzoneFile = ref("");
    const attachmentDropzoneFile = ref("");

    const toggle = () => {
        var allInputs = document.getElementsByTagName('input');
        for (var i=0;i<allInputs.length;i++) {
             if (allInputs[i].type === 'checkbox' && allInputs[i].name === 'dissemOrg') { 
                  allInputs[i].checked = !allInputs[i].checked;
            }
        }
    };

    const changePocInfo = (value) => {
      // var dropdown = document.getElementById("officeListbox");
      // var selection = dropdown.value;
      // console.log("hello");
      // if (selection === 'Office1') {
      //   var pocInfoTextarea = document.getElementById("pocInfo");
      //   pocInfoTextarea.value = "hello";
      // }
      console.log(value);
    };

    const drop = (event) => {
      dropzoneFile.value = event.dataTransfer.files[0];
      populateFields();
    };

    const selectedFile = () => {
      dropzoneFile.value = document.querySelector('.dropzoneFile').files[0];
      populateFields();
    };

    const attachmentDrop = (event) => {
      attachmentDropzoneFile.value = event.dataTransfer.files[0];
    };

    const attachmentSelectedFile = () => {
      attachmentDropzoneFile.value = document.querySelector('.attachmentDropzoneFile').files[0];
    };

    const populateFields = () => {
      document.getElementById("title").value = articles[0].title;
      document.getElementById("titlePM").value = articles[0].classification;
      document.getElementById("summaryPM").value = articles[0].classification;
      document.getElementById("documentClass").value = articles[0].classification;
      document.getElementById("summary").value = articles[0].content[0];
      document.getElementById("docNum").value = articles[0].id;
      // editorData = articles[0].content;
    };

    onMounted(() => {
      flatpickr('#datepicker', {});
      require("flatpickr/dist/flatpickr.css");
    });
    
    return {
      countries,
      selectedCountries,
      topics,
      selectedTopics,
      actors,
      selectedActors,
      dissemOrgs,
      producingOffices,
      selectedOffice,
      analysisTypes,
      selectedAnalysisType,
      dropzoneFile,
      attachmentDropzoneFile,
      populateFields,
      toggle,
      changePocInfo,
      drop,
      selectedFile,
      attachmentDrop,
      attachmentSelectedFile,
      editor: ClassicEditor,
              editorData: "",
              editorConfig: {
                  // The configuration of the editor.
              }
    }
  }
}
</script>

<style lang="scss"></style>
