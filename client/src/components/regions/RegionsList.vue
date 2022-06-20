<template>
    <div class="hidden lg:block">
        <div class="grid grid-cols-3 gap-6 pb-4" aria-label="select a region or subregion">
            <div v-for="region in $store.state.regions" :key="region">
                <router-link to="" class="lg:text-lg hover:underline">{{ region.name }}</router-link>
                <ul class="list-disc list-inside">
                    <template v-for="subRegion in region.subRegions" :key="subRegion">
                        <li v-if="subRegion.name != ''">
                            <router-link to="" class="hover:underline">{{ subRegion.name }}</router-link>
                        </li>
                    </template>
                </ul>
            </div>
        </div>
        <p 
            class="  
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
</template>

<script>
export default {
    methods: {
        openPDF() {
            window.open('/pdf/List-of-Countries-by-Region-UN-Annex-II.pdf');
        }
    }
}
</script>

<style scoped lang="scss"></style>