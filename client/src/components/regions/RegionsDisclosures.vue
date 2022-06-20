 <template>
    <!-- mobile/tablet version-->
    <div>
        <Disclosure v-slot="{ open }">
            <DisclosureButton class="flex space-x-2">
                <span>Regions</span>
                <ChevronDownIcon class="h-4 w-4" :class='open ? "transform rotate-180" : ""' />
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
                    <div class="ml-4 space-y-4 text-sm">
                        <RegionsListBox 
                            class="
                                pt-4 pb-4
                                border-b border-slate-900/10
                                dark:border-slate-50/[0.06]
                                energy:border-gray-700/25
                            "
                        />
                        <div v-for="region in $store.state.regions" :key="region">
                            <Disclosure v-slot="{ open }">
                                <DisclosureButton class="flex space-x-2">
                                    <span>{{ region.name }}</span>
                                    <ChevronDownIcon class="h-3 w-3" :class='open ? "transform rotate-180" : ""' />
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
                                        <ul class="list-disc list-inside">
                                            <template v-for="subRegion in region.subRegions" :key="subRegion">
                                                <li v-if="subRegion.name != ''">
                                                    <router-link to="" class="hover:underline">{{ subRegion.name }}</router-link>
                                                </li>
                                            </template>
                                        </ul>
                                    </DisclosurePanel>
                                </transition>
                            </Disclosure>
                        </div>
                        <p class="  
                            pt-4
                            border-t border-slate-900/10
                            dark:border-slate-50/[0.06]
                            energy:border-gray-700/25
                            "
                        >
                            View a 
                            <button @click="openPDF" class="underline" aria-label="View a PDF document with a list of countries that fall under each region and subregion"> 
                                list of countries 
                            </button> 
                            that fall under each region and subregion
                        </p>
                    </div>
                </DisclosurePanel>
            </transition>
        </Disclosure>
    </div>
</template>

<script>
import RegionsListBox from "./RegionsListBox.vue";
import { ChevronDownIcon } from "@heroicons/vue/outline";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/vue";

export default {
    components: {
        RegionsListBox,
        ChevronDownIcon,
        Disclosure,
        DisclosureButton,
        DisclosurePanel,
    },
  
    methods: {
        openPDF() {
            window.open('/pdf/List-of-Countries-by-Region-UN-Annex-II.pdf');
        }
    },
};
</script>

<style lang="scss">
/* Empty on Purpose */
</style>