<template>
  <b-nav-item-dropdown
    v-if="resourceLinks"
    id="nav-resources"
    dropup
    text="Resources"
    data-usage="nav-resources"
  >
    <template v-for="(resource, ind) in resourceLinks">
      <template v-for="(menuItem, menuId) in resource">
        <b-dropdown-item
          :href="menuItem._temp_1"
          :key="`resource_menu_${ind}_${menuId}`"
          :target="menuItem._temp_1.includes('http') ? '_blank' : '_self'"
        >
          {{ menuItem.label }}
        </b-dropdown-item>
      </template>
      <b-dropdown-divider
        :key="`resource_menu_divider_${ind}`"
        v-if="ind < resourceLinks.length - 1"
      ></b-dropdown-divider>
    </template>
  </b-nav-item-dropdown>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "Resources",
  computed: {
    ...mapState("metadata", ["resourceLinks"]),
  },
};
</script>
