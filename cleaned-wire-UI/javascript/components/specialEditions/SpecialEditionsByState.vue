<template>
  <b-col class="editionCol">
    <h2 class="separator mt-6">{{ state }}</h2>
    <div v-if="specialEditions.length > 0">
      <div
        v-for="(concept, i) in specialEditions"
        :key="state.toLowerCase() + i"
      >
        <router-link :to="'/special_editions/' + concept.id">
          <b-row class="mb-6">
            <b-col cols="6">
              <img :src="concept.image_path" class="mr-3" _temp_20="presentation" />
            </b-col>
            <b-col>{{ concept.name }}</b-col>
          </b-row>
        </router-link>
      </div>
    </div>
    <div v-else class="text-danger">No Special Editions.</div>
  </b-col>
</template>

<script>
export default {
  name: "SpecialEditionsByState",
  props: {
    specialEditions: {
      type: Array,
      required: true,
    },
    state: {
      type: String,
      default: "",
    },
  },
  // component is not included in jest coverage when data block is not present
  data() {
    return {};
  },
};
</script>

<style scoped lang="scss">
.separator {
  border-bottom: 1px solid $alt-400;
  margin-bottom: 16px;
}
</style>
