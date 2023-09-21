<template>
  <div class="flex flex-col p-4">
    <template
      v-for="({ displayName, rows, expand }, facetType, index) in facetsList"
      :key="index"
    >
      <div class="py-2">
        <span class="sr-only">Search facets</span>
        <p class="text-sm font-medium">{{ displayName }}</p>
        <div class="flex flex-col">
          <template v-for="(facet, facetIndex) in rows" :key="facet">
            <div :class="facetIndex > 4 && !expand ? 'hidden' : 'block'">
              <a
                :id="facet.key"
                class="cursor-pointer text-sm text-mission-light-blue dark:text-teal-400 energy:text-energy-yellow"
                tabindex="0"
                @click="filter(facetType, facet.key)"
              >
                {{ facet.name }}
              </a>
              <span class="text-sm"> ({{ facet.count }}) </span>
            </div>
          </template>
          <template v-if="rows.length > 5">
            <button
              class="max-w-fit ml-2 mt-2 cursor-pointer text-sm text-mission-light-blue dark:text-teal-400 energy:text-energy-yellow"
              @click="toggleExpand(facetType)"
            >
              <template v-if="expand"> Show Less... </template>
              <template v-else> Show More... </template>
            </button>
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
    facets: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();

    const facetsList = ref(props.facets);
    const toggleExpand = (key) => {
      facetsList.value[key].expand = !facetsList.value[key].expand;
      if (facetsList.value[key].expand) {
        const id = facetsList.value[key].rows[4].key;
        document.getElementById(id).focus();
      }
    };

    //TODO: This is copied from SearchView. Figure out a clean way to refactor this to avoid repeating code.
    const getBooleanMapping = (queryKey) => {
      if (queryKey === "product_types[]") {
        return false;
      } else {
        const bracketIndex = queryKey.indexOf("[]");
        if (bracketIndex !== -1) {
          return queryKey.slice(0, bracketIndex).concat("_bool");
        }
        return false;
      }
    };

    const filter = (facetType, code) => {
      let query = {
        ...route.query,
        page: 1,
      };
      const type = `${facetType}[]`;
      if (query[type]) {
        query[type] = Array.from(query[type]);
        query[type].push(code);
      } else {
        query[type] = [code];
      }
      //TODO: This is copied from SearchView. Figure out a clean way to refactor this to avoid repeating code.
      const booleanMapping = getBooleanMapping(type);
      if (booleanMapping) {
        const mappingFound = Object.keys(query).find(
          (queryKey) => queryKey === booleanMapping
        );
        if (!mappingFound && query[type] && query[type].length > 1) {
          query[booleanMapping] = "and";
        }
        if (mappingFound && query[type].length <= 1) {
          delete query[booleanMapping];
        }
      }
      console.log("query: ", query);
      router.push({
        name: "search",
        query,
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
<style scoped lang="scss"></style>
