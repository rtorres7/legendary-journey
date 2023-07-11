<template>
  <div class="h-full flex flex-col md:flex-row">
    <StudioNavigation />
    <div class="flex flex-col grow min-h-screen h-full">
      <div class="relative grow bg-slate-50">
        <!-- Content Area -->
        <div
          class="flex flex-col text-gray-900 w-full min-h-[calc(100vh-4rem)] h-full items-center"
        >
          <div
            class="max-w-[475px] sm:max-w-[768px] xl:max-w-[1600px] w-full p-6 md:p-8"
          >
            <!-- Home -->
            <div :class="isActivePage('#home') ? 'block' : 'hidden'">
              <div
                class="flex space-x-1 justify-center xl:justify-start text-2xl py-8"
              >
                <div class="text-gray-700 font-bold uppercase tracking-wider">
                  Current
                </div>
                <div class="text-gray-500 font-medium">Issue</div>
              </div>
              <div class="">
                <MockLiveIssueCard :issue="issues[0]" />
                <div
                  class="py-8 flex justify-center xl:justify-between items-center"
                >
                  <div class="text-2xl font-bold text-gray-700">
                    Coming Soon
                  </div>
                  <a
                    class="hidden xl:block text-gray-500 hover:text-gray-700 text-sm font-medium"
                    href="/studio#issues"
                  >
                    See All
                  </a>
                </div>
                <div
                  class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center"
                >
                  <MockIssueCard :issue="issues[1]" />
                  <MockIssueCard :issue="issues[2]" />
                  <MockIssueCard :issue="issues[3]" class="hidden xl:flex" />
                </div>
                <a
                  class="block xl:hidden text-end py-8 text-gray-500 hover:text-gray-700 text-sm font-medium"
                  href="/studio#issues"
                >
                  See All
                </a>
                <!-- <div
                class="text-xl font-bold text-gray-700 uppercase tracking-wider py-8"
              >
                Analytics
                top authors
                total issues created
                longest running issue
              </div> -->
              </div>
            </div>
            <!-- Live Content-->
            <div :class="isActivePage('#live') ? 'block' : 'hidden'">
              <!-- <div class="text-2xl text-gray-700">Responsive Check</div>
              <div class="text-gray-400 text-sm">
                <p class="hidden 3xl:block">3XL Mode 1800px</p>
                <p class="hidden 2xl:block 3xl:hidden">2XL Mode 1536px</p>
                <p class="hidden xl:block 2xl:hidden">XL Mode 1280px</p>
                <p class="hidden lg:block xl:hidden">L Mode 1024px</p>
                <p class="hidden md:block lg:hidden">MD Mode 768px</p>
                <p class="hidden sm:block md:hidden">SM Mode 640px</p>
                <p class="block sm:hidden">Less than SM mode</p>
              </div> -->
              <div class="max-w-[1480px] flex space-x-4 justify-end pt-8">
                <a
                  class="flex space-x-2 min-h-[2.125rem] items-center text-sm rounded-md px-4 transition-colors text-gray-50 bg-blue-700 hover:border-blue-600 active:bg-blue-800 active:text-gray-200/80"
                  href="/studio#edit-issue"
                >
                  <span>Edit</span>
                  <PencilSquareIcon class="h-5 w-5" />
                </a>
                <button
                  class="flex space-x-2 min-h-[2.125rem] items-center text-sm rounded-md px-4 border border-gray-300"
                >
                  <span>Preview</span>
                  <DocumentMagnifyingGlassIcon class="h-5 w-5" />
                </button>
              </div>
              <div class="py-8">
                <div class="text-blue-600 font-medium text-sm">
                  Changes in 4 days
                </div>
                <div class="text-5xl py-2 font-bold">
                  {{ issues[0].title }}
                </div>
                <div class="flex flex-col py-2 space-y-2 font-medium text-sm">
                  <p>By {{ issues[0].author }}</p>
                  <p class="text-gray-400">
                    Updated {{ issues[0].last_updated }}
                  </p>
                </div>
              </div>
              <div class="pb-6 font-semibold text-gray-700">
                Featured Products
              </div>
              <div class="max-w-[1500px] grid grid-cols-1 xl:grid-cols-3 gap-2">
                <template
                  v-for="product in issues[0].featured.slice(0, 3)"
                  :key="product"
                >
                  <div
                    class="flex flex-col max-w-[768px] xl:max-w-[480px] px-6 py-4 bg-white rounded-md shadow-sm hover:shadow-md border border-slate-200 cursor-pointer"
                  >
                    <div class="max-h-[432px] xl:max-h-[270px] cursor-pointer">
                      <img
                        :src="getImg(product.src)"
                        class="rounded-md"
                        alt=""
                      />
                    </div>
                    <div class="h-full flex flex-col justify-between">
                      <div class="py-4">
                        <p
                          class="font-semibold text-lg line-clamp-2 xl:line-clamp-3"
                        >
                          <span class="text-gray-500">{{
                            product.classification
                          }}</span>
                          {{ product.title }}
                        </p>
                      </div>
                      <div class="flex space-x-2 font-medium text-sm">
                        <div class="text-blue-700">{{ product.type }}</div>
                        <div>•</div>
                        <div class="text-gray-500">
                          {{ product.date_posted }}
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
              </div>
              <div class="font-semibold text-gray-700 py-6">More Products</div>
              <div
                class="max-w-[800px] bg-white rounded-md border border-slate-200"
              >
                <ul>
                  <template
                    v-for="product in issues[0].featured.slice(3)"
                    :key="product"
                  >
                    <li class="px-6 border-b border-gray-200 cursor-pointer">
                      <div class="py-4">
                        <p class="font-semibold text-lg line-clamp-2">
                          <span class="text-gray-500">{{
                            product.classification
                          }}</span>
                          {{ product.title }}
                        </p>
                      </div>
                      <div class="pb-4 flex space-x-2 font-medium text-sm">
                        <div class="text-blue-700">{{ product.type }}</div>
                        <div>•</div>
                        <div class="text-gray-500">
                          {{ product.date_posted }}
                        </div>
                      </div>
                    </li>
                  </template>
                </ul>
              </div>
            </div>
            <!-- Issues -->
            <div :class="isActivePage('#issues') ? 'block' : 'hidden'">
              <div class="pt-8 pb-6">
                <div class="flex justify-between pb-8">
                  <div
                    class="text-3xl font-semibold text-gray-700 lg:max-w-none"
                  >
                    Issues
                  </div>
                  <button
                    class="inline-flex items-center justify-center rounded-lg border py-[calc(theme(spacing.2)-1px)] px-[calc(theme(spacing.3)-1px)] text-sm outline-2 outline-offset-2 transition-colors text-gray-50 bg-blue-700 hover:border-blue-600 active:bg-blue-800 active:text-gray-200/80 cursor-pointer"
                    @click="openEdit"
                  >
                    <PlusIcon class="h-4 w-4" />
                    <span class="ml-2.5">New Issue</span>
                  </button>
                </div>
                <div class="flex justify-between items-center">
                  <div class="text-gray-500 font-medium">6 issues</div>
                  <div class="flex space-x-4">
                    <Listbox
                      v-model="selectedSort"
                      as="div"
                      class="min-w-[260px] hidden md:inline-flex items-center text-gray-700"
                    >
                      <div>
                        <ListboxLabel
                          class="text-sm line-clamp-1 xl:line-clamp-none w-max"
                        >
                          Sort By
                        </ListboxLabel>
                      </div>
                      <div class="w-full relative items-center ml-3">
                        <ListboxButton
                          class="relative w-full min-h-[2.125rem] rounded cursor-default pl-3 pr-10 text-left border border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-offset-2"
                        >
                          <span class="text-sm block truncate capitalize">{{
                            selectedSort.name
                          }}</span>
                          <span
                            class="absolute inset-y-0 right-0 flex items-center pr-2"
                          >
                            <ChevronDownIcon
                              class="h-4 w-4"
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
                            class="absolute w-full py-1 mt-1 overflow-auto text-gray-900 bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none z-[5]"
                          >
                            <ListboxOption
                              v-for="item in sortOptions"
                              v-slot="{ active, selected }"
                              :key="item.name"
                              :value="item"
                              as="template"
                            >
                              <li
                                :class="[
                                  active ? 'bg-gray-100  ' : 'bg-none',
                                  'relative cursor-default select-none py-2 pl-10 pr-4',
                                ]"
                              >
                                <span
                                  :class="[
                                    selected ? 'font-medium' : 'font-normal',
                                    'block truncate text-sm',
                                  ]"
                                  >{{ item.name }}</span
                                >
                                <span
                                  v-if="selected"
                                  class="absolute inset-y-0 left-0 flex items-center pl-3"
                                >
                                  <CheckIcon
                                    class="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              </li>
                            </ListboxOption>
                          </ListboxOptions>
                        </transition>
                      </div>
                    </Listbox>
                    <button
                      class="flex space-x-2 text-sm border border-gray-300 min-h-[2.125rem] items-center rounded px-3"
                    >
                      <span class="hidden md:block">Filters</span>
                      <span class="block md:hidden">Filters / Sort</span>
                      <AdjustmentsHorizontalIcon class="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
              <div
                class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center"
              >
                <template v-for="n in issues" :key="n">
                  <MockIssueCard :issue="n" />
                </template>
              </div>
            </div>
            <!-- Edit Sample -->
            <div :class="isActivePage('#edit-issue') ? 'block' : 'hidden'">
              <div
                class="flex justify-between items-center pt-8 pb-2 md:pb-8 max-w-[1000px]"
              >
                <div class="text-3xl font-semibold text-gray-700">
                  Issue Details
                </div>
                <div class="hidden md:flex space-x-4 items-center text-sm">
                  <div
                    class="tracking-tight uppercase font-medium text-gray-400"
                  >
                    Undo Changes
                  </div>
                  <button
                    class="rounded-md px-4 py-2 transition-colors text-gray-50 bg-blue-700 hover:border-blue-600 active:bg-blue-800 active:text-gray-200/80"
                  >
                    Save
                  </button>
                  <button class="text-gray-500 hover:text-gray-700">
                    <span class="sr-only">User Menu</span>
                    <EllipsisVerticalIcon class="h-6 w-6" />
                  </button>
                </div>
              </div>
              <div
                class="flex justify-end md:hidden space-x-4 items-center text-sm py-4"
              >
                <div class="tracking-tight uppercase font-medium text-gray-400">
                  Undo Changes
                </div>
                <button
                  class="rounded-md px-4 py-2 transition-colors text-gray-50 bg-blue-700 hover:border-blue-600 active:bg-blue-800 active:text-gray-200/80"
                >
                  Save
                </button>
                <button class="text-gray-500 hover:text-gray-700">
                  <span class="sr-only">User Menu</span>
                  <EllipsisVerticalIcon class="h-6 w-6" />
                </button>
              </div>
              <div
                class="flex flex-col space-y-8 bg-white rounded-md border border-slate-200 p-10 max-w-[1000px]"
              >
                <div class="flex flex-col space-y-6">
                  <div>
                    <div class="font-medium">Basics</div>
                    <div class="text-sm text-gray-600">
                      The information below will feature on the main page.
                    </div>
                  </div>
                  <div class="flex flex-col space-y-6">
                    <div class="max-w-[600px]">
                      <label class="text-sm font-medium">Title</label>
                      <input
                        type="text"
                        aria-labelledby="4"
                        autocomplete="off"
                        value="Russo-Ukrainan War"
                        class="min-h-[2rem] flex w-full rounded-lg cursor-default py-1 px-2 mt-2 bg-transparent border border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-offset-2"
                      />
                    </div>
                    <div class="flex space-x-6">
                      <div class="max-w-[250px]">
                        <label id="2" class="text-sm font-medium"
                          >Start Date</label
                        >
                        <div
                          class="flex items-center min-h-[2rem] mt-2 py-1 px-4 rounded-lg border border-gray-300"
                        >
                          <CalendarIcon class="h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            aria-labelledby="2"
                            autocomplete="off"
                            value="07-12-23 09:00"
                            class="flex w-full cursor-default px-4 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div class="max-w-[250px]">
                        <label id="3" class="text-sm font-medium"
                          >Expires On</label
                        >
                        <div
                          class="flex items-center min-h-[2rem] mt-2 py-1 px-4 rounded-lg border border-gray-300"
                        >
                          <CalendarIcon class="h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            aria-labelledby="3"
                            autocomplete="off"
                            value="07-16-23 11:00"
                            class="flex w-full cursor-default px-4 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col space-y-6">
                  <div>
                    <div class="font-medium">Content</div>
                    <div class="text-sm text-gray-600">
                      The top three products are shown with their thumbnails.
                    </div>
                  </div>
                  <div class="flex flex-col space-y-8">
                    <div class="text-sm">
                      <div class="font-medium">Breaking Product</div>
                      <Switch
                        v-model="breakingEnabled"
                        :class="breakingEnabled ? 'bg-blue-700' : 'bg-gray-300'"
                        class="relative inline-flex mt-3 h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                      >
                        <span class="sr-only">Use setting</span>
                        <span
                          aria-hidden="true"
                          :class="
                            breakingEnabled ? 'translate-x-9' : 'translate-x-0'
                          "
                          class="pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                        />
                      </Switch>
                      <div class="mt-2 text-gray-600">
                        Only the first product will have a breaking label.
                      </div>
                    </div>
                    <div>
                      <div class="font-medium text-sm">Products</div>
                      <div class="flex mt-3">
                        <ul
                          class="w-full rounded-md max-w-[900px] border border-dashed border-gray-400"
                        >
                          <template
                            v-for="product in issues[0].featured"
                            :key="product"
                          >
                            <li
                              class="px-6 border-b border-gray-200 cursor-pointer h-[100px] flex flex-col justify-between"
                            >
                              <div class="py-4">
                                <p class="font-semibold line-clamp-1">
                                  <span class="text-gray-500">{{
                                    product.classification
                                  }}</span>
                                  {{ product.title }}
                                </p>
                              </div>
                              <div
                                class="pb-4 flex space-x-2 font-medium text-xs"
                              >
                                <div class="text-blue-700">
                                  {{ product.type }}
                                </div>
                                <div>•</div>
                                <div class="text-gray-500">
                                  {{ product.date_posted }}
                                </div>
                              </div>
                            </li>
                          </template>
                        </ul>
                        <ul class="">
                          <li
                            class="flex items-center w-full max-w-[100px] h-[100px] p-4"
                          >
                            <div class="flex flex-col space-y-1">
                              <button
                                type="button"
                                class="max-w-xs rounded-full flex items-center p-1 text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-not-allowed"
                                @click="open"
                              >
                                <span class="sr-only">Move down</span>
                                <ChevronUpIconSolid
                                  class="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </button>
                              <button
                                class="max-w-xs rounded-full flex items-center hover:bg-gray-50 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                              >
                                <span class="sr-only">Move up</span>
                                <ChevronDownIconSolid class="h-5 w-5" />
                              </button>
                            </div>
                          </li>
                          <li
                            class="flex items-center w-full max-w-[100px] h-[100px] p-4"
                          >
                            <div class="flex flex-col space-y-1">
                              <button
                                type="button"
                                class="max-w-xs rounded-full flex items-center hover:bg-gray-50 p-1 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                @click="open"
                              >
                                <span class="sr-only">Move down</span>
                                <ChevronUpIconSolid
                                  class="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </button>
                              <button
                                class="max-w-xs rounded-full flex items-center hover:bg-gray-50 p-1 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
                              >
                                <span class="sr-only">Move up</span>
                                <ChevronDownIconSolid class="h-5 w-5" />
                              </button>
                            </div>
                          </li>
                          <li
                            class="flex items-center w-full max-w-[100px] h-[100px] p-4"
                          >
                            <div class="flex flex-col space-y-1">
                              <button
                                type="button"
                                class="max-w-xs rounded-full flex items-center hover:bg-gray-50 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                @click="open"
                              >
                                <span class="sr-only">Move down</span>
                                <ChevronUpIconSolid
                                  class="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </button>
                              <button
                                class="max-w-xs rounded-full flex items-center hover:bg-gray-50 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                              >
                                <span class="sr-only">Move up</span>
                                <ChevronDownIconSolid class="h-5 w-5" />
                              </button>
                            </div>
                          </li>
                          <li
                            class="flex items-center w-full max-w-[100px] h-[100px] p-4"
                          >
                            <div class="flex flex-col space-y-1">
                              <button
                                type="button"
                                class="max-w-xs rounded-full flex items-center hover:bg-gray-50 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                @click="open"
                              >
                                <span class="sr-only">Move down</span>
                                <ChevronUpIconSolid
                                  class="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </button>
                              <button
                                class="max-w-xs rounded-full flex items-center hover:bg-gray-50 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                              >
                                <span class="sr-only">Move up</span>
                                <ChevronDownIconSolid class="h-5 w-5" />
                              </button>
                            </div>
                          </li>
                          <li
                            class="flex items-center w-full max-w-[100px] h-[100px] p-4"
                          >
                            <div class="flex flex-col space-y-1">
                              <button
                                type="button"
                                class="max-w-xs rounded-full flex items-center hover:bg-gray-50 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                @click="open"
                              >
                                <span class="sr-only">Move down</span>
                                <ChevronUpIconSolid
                                  class="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </button>
                              <button
                                class="max-w-xs rounded-full flex items-center hover:bg-gray-50 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                              >
                                <span class="sr-only">Move up</span>
                                <ChevronDownIconSolid class="h-5 w-5" />
                              </button>
                            </div>
                          </li>
                          <li
                            class="flex items-center w-full max-w-[100px] h-[100px] p-4"
                          >
                            <div class="flex flex-col space-y-1">
                              <button
                                type="button"
                                class="max-w-xs rounded-full flex items-center hover:bg-gray-50 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                @click="open"
                              >
                                <span class="sr-only">Move down</span>
                                <ChevronUpIconSolid
                                  class="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </button>
                              <button
                                class="max-w-xs rounded-full flex items-center hover:bg-gray-50 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                              >
                                <span class="sr-only">Move up</span>
                                <ChevronDownIconSolid class="h-5 w-5" />
                              </button>
                            </div>
                          </li>
                          <li
                            class="flex items-center w-full max-w-[100px] h-[100px] p-4"
                          >
                            <div class="flex flex-col space-y-1">
                              <button
                                type="button"
                                class="max-w-xs rounded-full flex items-center hover:bg-gray-50 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                @click="open"
                              >
                                <span class="sr-only">Move down</span>
                                <ChevronUpIconSolid
                                  class="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </button>
                              <button
                                class="max-w-xs rounded-full flex items-center hover:bg-gray-50 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                              >
                                <span class="sr-only">Move up</span>
                                <ChevronDownIconSolid class="h-5 w-5" />
                              </button>
                            </div>
                          </li>
                          <li
                            class="flex items-center w-full max-w-[100px] h-[100px] p-4"
                          >
                            <div class="flex flex-col space-y-1">
                              <button
                                type="button"
                                class="max-w-xs rounded-full flex items-center hover:bg-gray-50 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                @click="open"
                              >
                                <span class="sr-only">Move down</span>
                                <ChevronUpIconSolid
                                  class="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </button>
                              <button
                                class="max-w-xs rounded-full flex items-center hover:bg-gray-50 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                              >
                                <span class="sr-only">Move up</span>
                                <ChevronDownIconSolid class="h-5 w-5" />
                              </button>
                            </div>
                          </li>
                          <li
                            class="flex items-center w-full max-w-[100px] h-[100px] p-4"
                          >
                            <div class="flex flex-col space-y-1">
                              <button
                                type="button"
                                class="max-w-xs rounded-full flex items-center hover:bg-gray-50 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                @click="open"
                              >
                                <span class="sr-only">Move down</span>
                                <ChevronUpIconSolid
                                  class="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </button>
                              <button
                                class="mmax-w-xs rounded-full flex items-center p-1 text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-not-allowed"
                              >
                                <span class="sr-only">Move up</span>
                                <ChevronDownIconSolid class="h-5 w-5" />
                              </button>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Metrics Sample -->
            <div :class="isActivePage('#issue-metrics') ? 'block' : 'hidden'">
              <div class="flex items-center justify-center min-h-[75vh]">
                <div class="flex flex-col space-y-4">
                  <div class="text-6xl font-semibold">Coming Soon</div>
                  <div class="text-2xl text-gray-400">
                    Don't get too excited, the preview for this feature isn't
                    ready just yet.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <TransitionRoot appear :show="isEditOpen" as="template">
    <Dialog as="div" @close="closeEdit">
      <div class="fixed inset-0 z-20 overflow-y-auto w-full">
        <div class="min-h-screen px-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black/25" />
          </TransitionChild>
          <span class="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="inline-block w-full min-w-[300px] sm:min-w-[600px] lg:min-w-[900px] h-[90vh] max-w-sm p-8 my-8 text-left overflow-auto align-middle transition-all transform text-gray-900 bg-white shadow-lg rounded-lg"
            >
              <button
                type="button"
                class="absolute top-5 right-5 w-8 h-8 flex items-center justify-center"
                tabindex="0"
                @click="closeEdit"
              >
                <span class="sr-only">Close navigation</span>
                <XMarkIcon class="h-5 w-5" aria-hidden="true" />
              </button>
              <div class="text-3xl font-semibold text-gray-700 py-8">
                New Issue
              </div>
              <div class="flex flex-col space-y-8">
                <div class="flex flex-col space-y-6">
                  <div>
                    <div class="font-medium">Basics</div>
                    <div class="text-sm text-gray-600">
                      The information below will feature on the main page.
                    </div>
                  </div>
                  <div class="flex flex-col space-y-6">
                    <div class="max-w-[600px]">
                      <label class="text-sm font-medium">Title</label>
                      <input
                        type="text"
                        aria-labelledby="4"
                        autocomplete="off"
                        class="min-h-[2rem] flex w-full rounded-lg cursor-default py-1 px-2 mt-2 bg-transparent border border-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-offset-2"
                      />
                    </div>
                    <div class="flex space-x-6">
                      <div class="max-w-[250px]">
                        <label id="2" class="text-sm font-medium"
                          >Start Date</label
                        >
                        <div
                          class="flex items-center min-h-[2rem] mt-2 py-1 px-4 rounded-lg border border-gray-300"
                        >
                          <CalendarIcon class="h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            aria-labelledby="2"
                            autocomplete="off"
                            class="flex w-full cursor-default px-4 focus:outline-none"
                          />
                        </div>
                      </div>
                      <div class="max-w-[250px]">
                        <label id="3" class="text-sm font-medium"
                          >Expires On</label
                        >
                        <div
                          class="flex items-center min-h-[2rem] mt-2 py-1 px-4 rounded-lg border border-gray-300"
                        >
                          <CalendarIcon class="h-5 w-5 text-gray-400" />
                          <input
                            type="text"
                            aria-labelledby="3"
                            autocomplete="off"
                            class="flex w-full cursor-default px-4 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex flex-col space-y-6">
                  <div>
                    <div class="font-medium">Content</div>
                    <div class="text-sm text-gray-600">
                      The top three products are shown with their thumbnails.
                    </div>
                  </div>
                  <div class="flex flex-col space-y-8">
                    <div class="text-sm">
                      <div class="font-medium">Breaking Product</div>
                      <Switch
                        v-model="breakingEnabled"
                        :class="breakingEnabled ? 'bg-blue-700' : 'bg-gray-300'"
                        class="relative inline-flex mt-3 h-[28px] w-[64px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                      >
                        <span class="sr-only">Use setting</span>
                        <span
                          aria-hidden="true"
                          :class="
                            breakingEnabled ? 'translate-x-9' : 'translate-x-0'
                          "
                          class="pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out"
                        />
                      </Switch>
                      <div class="mt-2 text-gray-600">
                        Only the first product will have a breaking label.
                      </div>
                    </div>
                    <div>
                      <div class="font-medium text-sm">Products</div>
                      <div class="flex mt-3">
                        <ul
                          class="w-full rounded-md max-w-[800px] border border-dashed border-gray-400"
                        >
                          <li
                            class="flex justify-center items-center h-[100px] border-b border-dashed border-gray-400"
                          >
                            <div class="flex flex-col space-y-2">
                              <div
                                class="text-lg text-center font-bold text-gray-400/50 uppercase tracking-wide"
                              >
                                Top Featured
                              </div>
                              <div class="text-sm text-gray-500">
                                <span
                                  class="text-blue-700 font-semibold cursor-pointer"
                                  >Search for a product</span
                                >
                                to add.
                              </div>
                            </div>
                          </li>
                          <li
                            class="flex justify-center items-center h-[100px] border-b border-dashed border-gray-400"
                          >
                            <div class="flex flex-col space-y-2">
                              <div
                                class="text-lg text-center font-bold text-gray-400/50 uppercase tracking-wide"
                              >
                                Featured
                              </div>
                              <div class="text-sm text-gray-500">
                                <span
                                  class="text-blue-700 font-semibold cursor-pointer"
                                  >Search for a product</span
                                >
                                to add.
                              </div>
                            </div>
                          </li>
                          <li
                            class="flex justify-center items-center h-[100px] border-b border-dashed border-gray-400"
                          >
                            <div class="flex flex-col space-y-2">
                              <div
                                class="text-lg text-center font-bold text-gray-400/50 uppercase tracking-wide"
                              >
                                Featured
                              </div>
                              <div class="text-sm text-gray-500">
                                <span
                                  class="text-blue-700 font-semibold cursor-pointer"
                                  >Search for a product</span
                                >
                                to add.
                              </div>
                            </div>
                          </li>
                          <li
                            class="flex justify-center items-center h-[100px] border-b border-dashed border-gray-400"
                          >
                            <div class="text-sm text-gray-500">
                              <span
                                class="text-blue-700 font-semibold cursor-pointer"
                                >Search for a product</span
                              >
                              to add.
                            </div>
                          </li>
                          <li
                            class="flex justify-center items-center h-[100px] border-b border-dashed border-gray-400"
                          >
                            <div class="text-sm text-gray-500">
                              <span
                                class="text-blue-700 font-semibold cursor-pointer"
                                >Search for a product</span
                              >
                              to add.
                            </div>
                          </li>
                          <li
                            class="flex justify-center items-center h-[100px] border-b border-dashed border-gray-400"
                          >
                            <div class="text-sm text-gray-500">
                              <span
                                class="text-blue-700 font-semibold cursor-pointer"
                                >Search for a product</span
                              >
                              to add.
                            </div>
                          </li>
                          <li
                            class="flex justify-center items-center h-[100px] border-b border-dashed border-gray-400"
                          >
                            <div class="text-sm text-gray-500">
                              <span
                                class="text-blue-700 font-semibold cursor-pointer"
                                >Search for a product</span
                              >
                              to add.
                            </div>
                          </li>
                          <li
                            class="flex justify-center items-center h-[100px] border-b border-dashed border-gray-400"
                          >
                            <div class="text-sm text-gray-500">
                              <span
                                class="text-blue-700 font-semibold cursor-pointer"
                                >Search for a product</span
                              >
                              to add.
                            </div>
                          </li>
                          <li
                            class="flex justify-center items-center h-[100px]"
                          >
                            <div class="text-sm text-gray-500">
                              <span
                                class="text-blue-700 font-semibold cursor-pointer"
                                >Search for a product</span
                              >
                              to add.
                            </div>
                          </li>
                        </ul>
                        <ul class="">
                          <li
                            class="flex items-center w-full max-w-[100px] h-[100px] p-4"
                          >
                            <div class="flex flex-col space-y-1">
                              <button
                                type="button"
                                class="max-w-xs rounded-full flex items-center p-1 text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-not-allowed"
                                @click="open"
                              >
                                <span class="sr-only">Move down</span>
                                <ChevronUpIconSolid
                                  class="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </button>
                              <button
                                class="max-w-xs rounded-full flex items-center hover:bg-gray-50 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                              >
                                <span class="sr-only">Move up</span>
                                <ChevronDownIconSolid class="h-5 w-5" />
                              </button>
                            </div>
                          </li>
                          <li
                            class="flex items-center w-full max-w-[100px] h-[100px] p-4"
                          >
                            <div class="flex flex-col space-y-1">
                              <button
                                type="button"
                                class="max-w-xs rounded-full flex items-center hover:bg-gray-50 p-1 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                @click="open"
                              >
                                <span class="sr-only">Move down</span>
                                <ChevronUpIconSolid
                                  class="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </button>
                              <button
                                class="max-w-xs rounded-full flex items-center hover:bg-gray-50 p-1 text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-400"
                              >
                                <span class="sr-only">Move up</span>
                                <ChevronDownIconSolid class="h-5 w-5" />
                              </button>
                            </div>
                          </li>
                          <li
                            class="flex items-center w-full max-w-[100px] h-[100px] p-4"
                          >
                            <div class="flex flex-col space-y-1">
                              <button
                                type="button"
                                class="max-w-xs rounded-full flex items-center hover:bg-gray-50 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                @click="open"
                              >
                                <span class="sr-only">Move down</span>
                                <ChevronUpIconSolid
                                  class="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </button>
                              <button
                                class="max-w-xs rounded-full flex items-center hover:bg-gray-50 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                              >
                                <span class="sr-only">Move up</span>
                                <ChevronDownIconSolid class="h-5 w-5" />
                              </button>
                            </div>
                          </li>
                          <li
                            class="flex items-center w-full max-w-[100px] h-[100px] p-4"
                          >
                            <div class="flex flex-col space-y-1">
                              <button
                                type="button"
                                class="max-w-xs rounded-full flex items-center hover:bg-gray-50 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                @click="open"
                              >
                                <span class="sr-only">Move down</span>
                                <ChevronUpIconSolid
                                  class="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </button>
                              <button
                                class="max-w-xs rounded-full flex items-center hover:bg-gray-50 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                              >
                                <span class="sr-only">Move up</span>
                                <ChevronDownIconSolid class="h-5 w-5" />
                              </button>
                            </div>
                          </li>
                          <li
                            class="flex items-center w-full max-w-[100px] h-[100px] p-4"
                          >
                            <div class="flex flex-col space-y-1">
                              <button
                                type="button"
                                class="max-w-xs rounded-full flex items-center hover:bg-gray-50 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                @click="open"
                              >
                                <span class="sr-only">Move down</span>
                                <ChevronUpIconSolid
                                  class="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </button>
                              <button
                                class="max-w-xs rounded-full flex items-center hover:bg-gray-50 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                              >
                                <span class="sr-only">Move up</span>
                                <ChevronDownIconSolid class="h-5 w-5" />
                              </button>
                            </div>
                          </li>
                          <li
                            class="flex items-center w-full max-w-[100px] h-[100px] p-4"
                          >
                            <div class="flex flex-col space-y-1">
                              <button
                                type="button"
                                class="max-w-xs rounded-full flex items-center hover:bg-gray-50 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                @click="open"
                              >
                                <span class="sr-only">Move down</span>
                                <ChevronUpIconSolid
                                  class="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </button>
                              <button
                                class="max-w-xs rounded-full flex items-center hover:bg-gray-50 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                              >
                                <span class="sr-only">Move up</span>
                                <ChevronDownIconSolid class="h-5 w-5" />
                              </button>
                            </div>
                          </li>
                          <li
                            class="flex items-center w-full max-w-[100px] h-[100px] p-4"
                          >
                            <div class="flex flex-col space-y-1">
                              <button
                                type="button"
                                class="max-w-xs rounded-full flex items-center hover:bg-gray-50 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                @click="open"
                              >
                                <span class="sr-only">Move down</span>
                                <ChevronUpIconSolid
                                  class="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </button>
                              <button
                                class="max-w-xs rounded-full flex items-center hover:bg-gray-50 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                              >
                                <span class="sr-only">Move up</span>
                                <ChevronDownIconSolid class="h-5 w-5" />
                              </button>
                            </div>
                          </li>
                          <li
                            class="flex items-center w-full max-w-[100px] h-[100px] p-4"
                          >
                            <div class="flex flex-col space-y-1">
                              <button
                                type="button"
                                class="max-w-xs rounded-full flex items-center hover:bg-gray-50 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                @click="open"
                              >
                                <span class="sr-only">Move down</span>
                                <ChevronUpIconSolid
                                  class="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </button>
                              <button
                                class="max-w-xs rounded-full flex items-center hover:bg-gray-50 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                              >
                                <span class="sr-only">Move up</span>
                                <ChevronDownIconSolid class="h-5 w-5" />
                              </button>
                            </div>
                          </li>
                          <li
                            class="flex items-center w-full max-w-[100px] h-[100px] p-4"
                          >
                            <div class="flex flex-col space-y-1">
                              <button
                                type="button"
                                class="max-w-xs rounded-full flex items-center hover:bg-gray-50 p-1 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                                @click="open"
                              >
                                <span class="sr-only">Move down</span>
                                <ChevronUpIconSolid
                                  class="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </button>
                              <button
                                class="mmax-w-xs rounded-full flex items-center p-1 text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-not-allowed"
                              >
                                <span class="sr-only">Move up</span>
                                <ChevronDownIconSolid class="h-5 w-5" />
                              </button>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="flex justify-end items-center space-x-6 mt-8 pt-8 border-t border-gray-200"
              >
                <button
                  class="rounded-md px-4 py-2 transition-colors text-gray-50 bg-blue-700 hover:border-blue-600 active:bg-blue-800 active:text-gray-200/80"
                >
                  Save
                </button>
                <button class="font-medium text-blue-700" @click="closeEdit">
                  Close
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
<script>
import dayjs from "dayjs/esm/index.js";
import { issues } from "../data";
import { onMounted, ref } from "vue";
import {
  Dialog,
  DialogPanel,
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
  Switch,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import {
  AdjustmentsHorizontalIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  DocumentMagnifyingGlassIcon,
  EllipsisVerticalIcon,
  PencilSquareIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/vue/24/outline";
import {
  ChevronUpIcon as ChevronUpIconSolid,
  ChevronDownIcon as ChevronDownIconSolid,
} from "@heroicons/vue/24/solid";
import MockIssueCard from "@/demo-studio/components/MockIssueCard.vue";
import MockLiveIssueCard from "@/demo-studio/components/MockLiveIssueCard.vue";
import StudioNavigation from "@/demo-studio/components/StudioNavigation.vue";
const themeOptions = ["light", "dark", "system"];
export default {
  components: {
    Dialog,
    DialogPanel,
    Listbox,
    ListboxLabel,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    AdjustmentsHorizontalIcon,
    CalendarIcon,
    CheckIcon,
    ChevronDownIcon,
    ChevronDownIconSolid,
    ChevronUpIconSolid,
    DocumentMagnifyingGlassIcon,
    EllipsisVerticalIcon,
    PencilSquareIcon,
    PlusIcon,
    XMarkIcon,
    MockIssueCard,
    MockLiveIssueCard,
    StudioNavigation,
    Switch,
    TransitionChild,
    TransitionRoot,
  },
  setup() {
    const currentHash = ref(window.location.hash || "#dashboard");
    const sortOptions = [
      { name: "Start Date: Recent" },
      { name: "Start Date: Last" },
    ];
    const breakingEnabled = ref(false);
    const isEditOpen = ref(false);
    const selectedSort = ref(sortOptions[0]);

    onMounted(() => {
      window.location.hash = window.location.hash || "#home";
    });

    window.addEventListener("hashchange", ({ target }) => {
      currentHash.value = target.location.hash;
    });

    const isActivePage = (hash) => {
      return hash === currentHash.value;
    };

    const getImg = (src) => {
      return new URL("../../assets/mocks/" + src, import.meta.url).href;
    };

    const closeEdit = () => {
      isEditOpen.value = false;
    };

    const openEdit = () => {
      isEditOpen.value = true;
    };

    return {
      dayjs,
      themeOptions,
      sortOptions,
      breakingEnabled,
      isEditOpen,
      selectedSort,
      issues,
      isActivePage,
      getImg,
      closeEdit,
      openEdit,
    };
  },
};
</script>
<style lang="scss"></style>
