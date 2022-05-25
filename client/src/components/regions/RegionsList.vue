<template>
    <div class="flex flex-wrap justify-between">
        <div v-for="region in regions" :key="region">
            <p class="text-lg">{{ region.name }}</p>
            <ul class="list-disc list-inside">
                <template v-for="subRegion in region.subRegions" :key="subRegion">
                    <li v-if="subRegion.name != ''">{{ subRegion.name }}</li>
                </template>
            </ul>
        </div>
    </div>
</template>

<script>

const regions = [
    {
        name: "Africa",
        subRegions: [
            { name: "Africa, Central" }, { name: "Africa, East" }, { name: "Africa, North" }, { name: "Africa, Southern" }, { name: "Africa, West" }
        ],
    },
    {
        name: "Americas",
        subRegions: [
            { name: "Americas, Caribbean" }, { name: "Americas, Central" }, { name: "Americas, North" }, { name: "Americas, South" }, { name: "Antarctica" }  
        ],
    },
    {
        name: "Asia",
        subRegions: [
            { name: "Asia, East" }, { name: "Asia, South" }, { name: "Asia, South East" }
        ],
    },
    {
        name: "Eurasia",
        subRegions: [
            { name: "Eurasia, Caucasus" }, { name: "Eurasia, Central" }, { name: "Eurasia, Western and Russia" }
        ],
    },
    {
        name: "Europe",
        subRegions: [
            { name: "Europe, Balkans" }, { name: "Europe, Central" }, { name: "Europe, North" }, { name: "Europe, South" }
        ],
    },
    {
        name: "Middle East",
        subRegions: [
            { name: "Middle East" }
        ],
    },
    {
        name: "Oceania",
        subRegions: [
            { name: "Oceania" }
        ],
    },
    {
        name: "Worldwide",
        subRegions: [
            { name: "" }
        ]
    },
];

export default {
    setup() {
        return {
            regions,
        };
    },
}
</script>

<style scoped lang="scss"></style>