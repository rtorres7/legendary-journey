<template>
  <div v-if="agency">
    <h2 class="mt-5">Shortcuts</h2>
    In order to promote ease of use on the {{ this.agency }}
    {{ this.name }} website various shortcuts have been implemented.
    <div>
      Using a screen reader?
      <ToggleButton v-model="showSRShortcuts">
        Screen Reader Friendly Shortcuts
      </ToggleButton>
    </div>
    <b-row class="mt-5">
      <b-col cols="6" class="text-bold key"> Key Combo </b-col>
      <b-col> Action </b-col>
    </b-row>
    <b-row v-for="shortcut in shortcuts" :key="shortcut.action">
      <b-col cols="4" class="mt-5 text-bold key">
        <div v-if="!showSRShortcuts">
          {{ shortcut.key }}
        </div>
        <div class="d-flex justify-content-end" v-else>
          <div class="ml-2">alt</div>
          <div class="ml-2">{{ shortcut.key }}</div>
        </div>
      </b-col>
      <b-col class="mt-5" cols="8">
        {{ shortcut.action }}
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ToggleButton from "../shared/ToggleButton";
export default {
  name: "Shortcuts",
  components: { ToggleButton },
  computed: {
    ...mapState("metadata", ["agency", "name"]),
  },
  data() {
    return {
      showSRShortcuts: false,
      shortcuts: [
        { key: "s", action: "Jumps to main search bar" },
        { key: "1", action: "Jumps to first result" },
        { key: "2", action: "Jumps to second result" },
        { key: "3", action: "Jumps to third result" },
        { key: "4", action: "Jumps to fourth result" },
        { key: "5", action: "Jumps to fifth result" },
        { key: "6", action: "Jumps to sixth result" },
        { key: "7", action: "Jumps to seventh result" },
        { key: "8", action: "Jumps to eighth result" },
        { key: "9", action: "Jumps to ninth result" },
      ],
    };
  },
};
</script>

<style scoped lang="scss">
.key {
  text-align: right;
  padding-right: 20px;
}
</style>
