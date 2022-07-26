<template>
  <form ref="publishingForm" class="mb-10 mt-10">
    <div>
      <label class="block mb-2" for="dropzoneFile">Upload a file to publish</label>
      <PublishViewFileUploader @drop.prevent="drop(); populateCkEditor()" @change="selectedFile(); populateCkEditor()">
        <button @click.prevent="fileInputButton.click()"
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
        </button>
        <input type="file" id="dropzoneFile" class="dropzoneFile hidden" ref="fileInputButton" />
      </PublishViewFileUploader>
      <span>{{ dropzoneFile.name }}</span>
    </div>
    <div class="mt-4 p-4 rounded-lg shadow-md bg-white dark:bg-slate-800 energy:bg-gray-800">
      <div
        class="
          flex flex-wrap
          lg:flex-nowrap
          lg:gap-12
          mb-8 mt-8
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
              <h1 class="text-2xl">Edit Document</h1>
            </div>
            <div class="flex flex-wrap md:flex-nowrap gap-3"> 
              <div class="w-full md:max-w-[350px] lg:max-w-[300px] xl:max-w-[420px]">
                <label class="block mb-2" for="countriesListbox">Countries</label>
                <Listbox
                  id="countriesListbox"
                  v-model="selectedCountries"
                  name="countriesListbox"
                  multiple
                  aria-label="select countries from the dropdown"
                >
                  <div class="relative">
                    <ListboxButton
                      aria-label="countries"
                      class="
                      min-h-[2rem]
                      flex
                      relative
                      w-full
                      py-1
                      px-2
                      text-left
                      bg-white
                      dark:bg-slate-700
                      energy:bg-gray-700
                      border-t border-t-gray-100
                      dark:border-t-slate-800
                      energy:border-t-gray-800
                      rounded-lg
                      shadow-md
                      cursor-default
                      focus:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-opacity-75
                      focus-visible:ring-offset-2
                      "
                    >
                      <span class="block truncate pr-4">{{
                        selectedCountries.map((country) => country.name).join(' √ ')
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
                          bg-white
                          dark:bg-slate-700
                          energy:bg-gray-700
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
                          v-for="country in countriesData"
                          :key="country"
                          :value="country"
                          as="template"
                          class="capitalize px-2 py-1 cursor-pointer"
                        >
                          <li
                            :class="[
                              active
                                ? 'bg-slate-200/80 dark:bg-slate-600 energy:bg-gray-600'
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
                <input type="checkbox" id="worldwide" name="worldwide" value="Worldwide" v-model="worldwide" class="mt-6">
                <label for="worldwide" class="text-sm"> Worldwide</label>
              </div>
              <div class="w-full md:max-w-[350px] lg:max-w-[300px] xl:max-w-[420px]">
                <label class="block mb-2" for="topicsListbox">Topics</label>
                <Listbox
                  id="topicsListbox"
                  v-model="selectedTopics"
                  name="topicsListbox"
                  multiple
                  aria-label="select topics from the dropdown"
                >
                  <div class="relative">
                    <ListboxButton
                      aria-label="topics"
                      class="
                        min-h-[2rem]
                        flex
                        relative
                        w-full
                        py-1
                        px-2
                        text-left
                        bg-white
                        dark:bg-slate-700
                        energy:bg-gray-700
                        border-t border-t-gray-100
                        dark:border-t-slate-800
                        energy:border-t-gray-800
                        rounded-lg
                        shadow-md
                        cursor-default
                        focus:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-opacity-75
                        focus-visible:ring-offset-2
                      "
                    >
                      <span class="block truncate pr-4">{{
                        selectedTopics.map((topic) => topic.title).join(' √ ')
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
                          bg-white
                          dark:bg-slate-700
                          energy:bg-gray-700
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
                                ? 'bg-slate-200/80 dark:bg-slate-600 energy:bg-gray-600'
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
              <label class="block mb-2" for="actorsListbox">Non-State Actors</label>
              <Listbox
                id="actorsListbox"
                v-model="selectedActors"
                name="actorsListbox"
                multiple
                aria-label="select Non-State Actors from the dropdown"
              >
                <div class="relative">
                  <ListboxButton
                    aria-label="non-state actors"
                    class="
                    min-h-[2rem]
                    flex
                    relative
                    w-full
                    py-1
                    px-2
                    text-left
                    bg-white
                    dark:bg-slate-700
                    energy:bg-gray-700
                    border-t border-t-gray-100
                    dark:border-t-slate-800
                    energy:border-t-gray-800
                    rounded-lg
                    shadow-md
                    cursor-default
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-opacity-75
                    focus-visible:ring-offset-2
                    "
                  >
                    <span class="block truncate pr-4">{{
                      selectedActors.map((actor) => actor.title).join(' √ ')
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
                        bg-white
                        dark:bg-slate-700
                        energy:bg-gray-700
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
                              ? 'bg-slate-200/80 dark:bg-slate-600 energy:bg-gray-600'
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
                  <input type="checkbox" id="allOrgs" name="allOrgs" v-model="checkAllOrgs" @click="toggleAllOrgs()" >
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
                          <div v-for="(org, index) in dissemOrgs" :key="index">
                            <input type="checkbox"  v-model="dissemOrgs[index].model" class="mt-2">
                            <label :for="org.name" class="text-sm ml-1"> {{ org.name }} </label>
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
                    min-h-[2rem]
                    w-full
                    py-1
                    px-2
                    text-left
                    bg-white
                    dark:bg-slate-700
                    energy:bg-gray-700
                    border-t border-t-gray-100
                    dark:border-t-slate-800
                    energy:border-t-gray-800
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
                    min-h-[2rem]
                    w-full
                    py-1
                    px-2
                    text-left
                    bg-white
                    dark:bg-slate-700
                    energy:bg-gray-700
                    border-t border-t-gray-100
                    dark:border-t-slate-800
                    energy:border-t-gray-800
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
                    min-h-[2rem]
                    w-full
                    py-1
                    px-2
                    text-left
                    bg-white
                    dark:bg-slate-700
                    energy:bg-gray-700
                    border-t border-t-gray-100
                    dark:border-t-slate-800
                    energy:border-t-gray-800
                    rounded-lg
                    shadow-md
                    cursor-default
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-opacity-75
                    focus-visible:ring-offset-2
                    resize-none
                  " 
                ></textarea>
              </div>
              <div class="w-full lg:basis-1/3">
                <label for="summaryPM" class="block mb-2" required>Summary PM (required)</label>
                <input type="text" id="summaryPM" 
                  class=" 
                    min-h-[2rem]
                    w-full
                    py-1
                    px-2
                    text-left
                    bg-white
                    dark:bg-slate-700
                    energy:bg-gray-700
                    border-t border-t-gray-100
                    dark:border-t-slate-800
                    energy:border-t-gray-800
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
              <ckeditor :editor="editor" v-model="editorData" :config="editorConfig" id="body"></ckeditor>
            </div>
            <div> 
              <h2 class="text-xl border-b-2 border-slate-900/10
              dark:border-slate-50/[0.06]
              energy:border-gray-700/25
              pb-4">Source Citations</h2>
              <ol class="list-decimal list-inside ml-4 mt-2 space-y-2">
                <div v-for="source in articlesData[0].sources" :key="source.name">
                  <li class="text-sm">
                    <router-link to="#" class="hover:underline">
                      {{ source.name }}
                    </router-link>
                  </li>
                </div>
              </ol>
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
                  min-h-[2rem]
                  w-full
                  py-1
                  px-2
                  text-left
                  bg-white
                  dark:bg-slate-700
                  energy:bg-gray-700
                  border-t border-t-gray-100
                  dark:border-t-slate-800
                  energy:border-t-gray-800
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
              <p>Classified By: <span id="classifiedBy"></span></p>
              <p>Derived From: Channel News Asia</p>
              <p>Declassify On: Jun 26, 2032</p>
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
              <label class="block mb-2" for="attachment_input">Upload attachment files</label>
              <PublishViewFileUploader id="attachment_input" @drop.prevent="attachmentDrop" @change="attachmentSelectedFile">
                <button @click.prevent="attachmentFileInputButton.click()"
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
                </button>
                <input type="file" id="attachmentDropzoneFile" class="attachmentDropzoneFile hidden" multiple ref="attachmentFileInputButton" />
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
                  min-h-[2rem]
                  w-full
                  py-1
                  px-2
                  text-left
                  bg-white
                  dark:bg-slate-700
                  energy:bg-gray-700
                  border-t border-t-gray-100
                  dark:border-t-slate-800
                  energy:border-t-gray-800
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
                  min-h-[2rem]
                  w-full
                  py-1
                  px-2
                  text-left
                  bg-white
                  dark:bg-slate-700
                  energy:bg-gray-700
                  border-t border-t-gray-100
                  dark:border-t-slate-800
                  energy:border-t-gray-800
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
                  min-h-[2rem]
                  w-full
                  py-1
                  px-2
                  text-left
                  bg-white
                  dark:bg-slate-700
                  energy:bg-gray-700
                  border-t border-t-gray-100
                  dark:border-t-slate-800
                  energy:border-t-gray-800
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
                <label for="pocInfo" class="block mb-2" aria-hidden="true">Poc Info</label>
                <textarea id="pocInfo" maxlength="4000" rows="4" aria-label="p o c info"
                  class=" 
                    min-h-[2rem]
                    w-full
                    py-1
                    px-2
                    text-left
                    bg-white
                    dark:bg-slate-700
                    energy:bg-gray-700
                    border-t border-t-gray-100
                    dark:border-t-slate-800
                    energy:border-t-gray-800
                    rounded-lg
                    shadow-md
                    cursor-default
                    focus:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-opacity-75
                    focus-visible:ring-offset-2
                    resize-none
                  " 
                ></textarea>
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
                      aria-label="producing office"
                      class="
                        min-h-[2rem]
                        flex
                        relative
                        w-full
                        py-1
                        px-2
                        text-left
                        bg-white
                        dark:bg-slate-700
                        energy:bg-gray-700
                        border-t border-t-gray-100
                        dark:border-t-slate-800
                        energy:border-t-gray-800
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
                          bg-white
                          dark:bg-slate-700
                          energy:bg-gray-700
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
                          @click="changePocInfo()"
                        >
                          <li
                            :class="[
                              active
                                ? 'bg-slate-200/80 dark:bg-slate-600 energy:bg-gray-600'
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
              <PublishingFormListbox v-model="selectedAnalysisType.model" :items="analysisTypes" id="analysisListbox" name="analysisListbox" 
                aria-label="select an analysis type from the dropdown"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="flex gap-20 flex-wrap lg:flex-nowrap gap-y-8 mb-8"> 
        <div class="flex gap-3"> 
          <button type="submit"
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
    </div>
  </form>
</template>

<script>
import { ref, onMounted } from "vue";
import {
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
import PublishingFormListbox from '@/components/base/PublishingFormListbox.vue';

const topics = [
  {title: "International War"}, 
  {title: "Politics"},
  {title: "Climate Change"},
  {title: "Space Tourism"},
];
const actors = [
  {title: "Person1"}, 
  {title: "Person2"},
  {title: "Person3"},
  {title: "Person4"},
];
const producingOffices = [
  {name: "Office1", pocInfo:"Office1's address and phone number"},
  {name: "Office2", pocInfo:"Office2's address and phone number"},
  {name: "Office3", pocInfo:"Office3's address and phone number"},
  {name: "Office4", pocInfo:"Office4's address and phone number"},
];
const analysisTypes = [
  "Type1",
  "Type2",
  "Type3",
];

export default {
  components: {
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
    PublishingFormListbox,
  },
  data() {
    return {
        editor: ClassicEditor,
        editorData: '',
         editorConfig: {
                }
    };
  },
  methods: {
    populateCkEditor() {
        this.editorData = '(U) There had been no major strikes on Kyiv since early June. In his nightly address, Ukraine President Volodymyr Zelenskyy said a wounded seven-year-old girl was pulled from the rubble of a nine-storey apartment block. The girls father was killed in the strike, he said. A Ukrainian air force spokesperson said the strike was carried out with 4-6 long-range missiles fired from Russian bombers more than 1,000km away in the southern Russian region of Astrakhan.';
    },
    },
  setup() {
    const countriesData = ref(countries);
    const selectedCountries = ref([countriesData]);
    const worldwide = ref(null);
    const selectedTopics = ref([topics]);
    const selectedActors = ref([actors]);
    const dateValue = ref(null);
    const selectedOffice = ref([producingOffices[0]]);
    const selectedAnalysisType = ref([analysisTypes[0]]);
    const fileInputButton = ref(null);
    const attachmentFileInputButton = ref(null);
    const dropzoneFile = ref("");
    const attachmentDropzoneFile = ref("");
    const articlesData = ref(articles);
    let checkAllOrgs = ref(false);
    const dissemOrgs = ref([
      {name: "Org1", model:""},
      {name: "Org2", model:""},
      {name: "Org3", model:""},
      {name: "Org4", model:""},
      {name: "Org5", model:""},
      {name: "Org6", model:""},
      {name: "Org7", model:""},
      {name: "Org8", model:""},
      {name: "Org9", model:""},
      {name: "Org10", model:""},
      {name: "Org11", model:""},
      {name: "Org12", model:""},
      {name: "Org13", model:""},
      {name: "Org14", model:""},
      {name: "Org15", model:""},
      {name: "Org16", model:""},
      {name: "Org17", model:""},
      {name: "Org18", model:""},
      {name: "Org19", model:""},
      {name: "Org20", model:""},
      {name: "Org21", model:""},
      {name: "Org22", model:""},
      {name: "Org23", model:""},
      {name: "Org24", model:""},
      {name: "Org25", model:""},
      {name: "Org26", model:""},
      {name: "Org27", model:""},
      {name: "Org28", model:""},
      {name: "Org29", model:""},
      {name: "Org30", model:""},
    ]);
    
    const toggleAllOrgs = () => {
        for(let i = 0; i < dissemOrgs.value.length; i++){
          dissemOrgs.value[i].model = !checkAllOrgs.value;
      }
    };

    const changePocInfo = () => {
      var selection = selectedOffice.value;
      document.getElementById("pocInfo").value = selection.pocInfo;
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
      selectedCountries.value = [countriesData.value[144],countriesData.value[183]];
      selectedTopics.value = [topics[0],topics[1]];
      selectedActors.value = [actors[0],actors[1]];
      document.getElementById("title").value = articles[0].title;
      document.getElementById("titlePM").value = articles[0].classification;
      document.getElementById("summaryPM").value = articles[0].classification;
      document.getElementById("documentClass").value = articles[0].classification;
      document.getElementById("summary").value = articles[0].content[0];
      document.getElementById("docNum").value = articles[0].id;
      document.getElementById("publicationNumber").value = articles[0].id;
      document.getElementById("classifiedBy").innerHTML = articles[0].author;
    };

    onMounted(() => {
      flatpickr('#datepicker', {});
      require("flatpickr/dist/flatpickr.css");
    });
    
    return {
      countriesData,
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
    }
  }
}
</script>

<style lang="scss">
.ck-content {
    color: black;
}
</style>
