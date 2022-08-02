<template>
  <div class="flex flex-col p-4">
    <template
      v-for="({ displayName, rows, expand }, index) in facets"
      :key="index"
    >
      <div class="py-2">
        <p class="text-sm font-medium">{{ displayName }}</p>
        <div class="flex flex-col">
          <template v-for="(facet, index) in rows" :key="facet">
            <div :class="index > 4 && !expand ? 'hidden' : 'block'">
              <span
                class="
                  cursor-pointer
                  text-sm text-mission-light-blue
                  dark:text-teal-400
                  energy:text-energy-yellow
                "
                >{{ facet.name }}
              </span>
              <span class="text-sm"> ({{ facet.count }}) </span>
            </div>
          </template>
          <template v-if="rows.length > 5">
            <span
              @click="toggleExpand(index)"
              class="
                max-w-fit
                ml-2
                mt-2
                cursor-pointer
                text-sm text-mission-light-blue
                dark:text-teal-400
                energy:text-energy-yellow
              "
            >
              <template v-if="expand"> Show Less... </template>
              <template v-else> Show More... </template>
            </span>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, watch } from "vue";
export default {
  props: {
    facets: Object,
  },
  setup(props) {
    const facetsList = ref(props.facets);

    const toggleExpand = (key) => {
      facetsList.value[key].expand = !facetsList.value[key].expand;
    };

    watch(props.facets, () => {
      facetsList.value = props.facets;
    });

    return {
      facetsList,
      toggleExpand,
    };
  },
};
</script>
<style scoped lang="scss">
</style>
