<template>
  <div class="border-top emulation-type pt-3 mt-2 px-6">
    <b-form-group label="Emulation Type">
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
        value="fbi"
        >FBI</b-form-radio
      >
      <b-form-radio v-model="selected" value="normal">Normal</b-form-radio>
    </b-form-group>
    <b-button
      size="sm"
      @click="applyEmulator"
      :disabled="selected === null"
      class="w-100"
      variant="secondary"
      >Apply</b-button
    >
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
      location.reload();
    },
  },
};
</script>

<style scoped>
.form-group {
  margin-bottom: 0.75rem;
}
</style>
