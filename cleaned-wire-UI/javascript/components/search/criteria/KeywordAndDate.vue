<template>
  <b-col v-bind="sizes">
    <div class="d-flex align-items-center">
      <div class="flex-grow-1 mr-5">
        <label>{{ label }}</label>
        <Search class="mb-2" />
      </div>
      <div class="align-items-center">
        <DatePicker />
      </div>
    </div>
  </b-col>
</template>

<script>
import DatePicker from "./DatePicker";
import Search from "@shared/Search";
import WireBackgroundAsset from "../../shared/WireBackgroundAsset";

export default {
  name: "KeywordAndDate",
  components: { WireBackgroundAsset, DatePicker, Search },
  props: {
    label: {
      type: String,
      default: "Keyword Search or Filter",
    },
    sizes: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      dateFocused: false,
    };
  },
  methods: {
    focusDate() {
      this.dateFocused = !this.dateFocused;
    },
  },
};
</script>

<style scoped lang="scss">
.calendar-icon {
  height: 28px;
  width: 34px;
  &.focused,
  &:hover {
    box-shadow: 0 5px 2px rgba(0, 0, 0, 0.25);
  }
}
</style>
