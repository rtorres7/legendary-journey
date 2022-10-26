<template>
  <div class="border-top emulation-type">
    <b-dropdown-header>Emulation Type</b-dropdown-header>
    <b-form-group class="px-6 mb-2">
      <b-form-radio
        v-if="featuresAvailable.emulateCongressionalUser"
        v-model="selected"
        value="congress"
        >Congress</b-form-radio
      >
      <b-form-radio v-model="selected" value="no_ntk">No Access</b-form-radio>
      <b-form-radio
        v-if="featuresAvailable.emulateFbiUser"
        v-model="selected"
        value="_temp_537"
        >_temp_537</b-form-radio
      >
      <b-form-radio v-model="selected" value="normal">Normal</b-form-radio>
      <b-button
        size="sm"
        @click="applyEmulator"
        :disabled="selected === null"
        class="mt-4 w-100"
        variant="secondary"
        >Apply</b-button
      >
    </b-form-group>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "Pretend",

  data() {
    return {
      selected: null,
    };
  },
  computed: {
    ...mapState("metadata", ["featuresAvailable"]),
  },
  methods: {
    ...mapActions("user", ["pretendUser"]),

    applyEmulator() {
      this.pretendUser(this.selected);
    },
  },
};
</script>

<style scoped lang="scss">
.form-group {
  margin-bottom: 0.75rem;
}
</style>
