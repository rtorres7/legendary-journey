<template>
  <div class="flex flex-col p-4">
    <template
      v-for="({ displayName, rows, expand }, facetType, index) in facetsList"
      :key="index"
    >
      <div class="py-2">
        <p class="text-sm font-medium">{{ displayName }}</p>
        <div class="flex flex-col">
          <template v-for="(facet, index) in rows" :key="facet">
            <div :class="index > 4 && !expand ? 'hidden' : 'block'">
              <a
                class="
                  cursor-pointer
                  text-sm text-mission-light-blue
                  dark:text-teal-400
                  energy:text-energy-yellow
                "
                @click="filter(facetType, facet.key)"
                >{{ facet.name }}
              </a>
              <span class="text-sm"> ({{ facet.count }}) </span>
            </div>
          </template>
          <template v-if="rows.length > 5">
            <span
              @click="toggleExpand(facetType)"
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
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

export default {
  props: {
    facets: Object,
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();

    const facetsList = ref(props.facets);

    const toggleExpand = (key) => {
      facetsList.value[key].expand = !facetsList.value[key].expand;
    };

    const filter = (type, code) => {
      let query = {
        ...route.query,
      };
      query[`${type}[]`] = code;
      router.push({
        query: query,
      });
    };

    return {
      facetsList,
      toggleExpand,
      filter,
    };
  },
};
</script>
<style scoped lang="scss">
</style>
