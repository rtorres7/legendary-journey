<template>
  <div class="d-flex flex-column">
    <div>
      <b-form-input
        type="text"
        v-model="timestampEntry"
        aria-label="Date/Time input box, use format YYYY-MM-DD HH:mm"
        @change="entryChange()"
        :placeholder="'YYYY-MM-DD HH:mm'"
      >
      </b-form-input>
    </div>
    <div>
      <b-calendar
        width="320px"
        label-help="Tab to enter calendar, arrow keys to navigate, enter to select a date"
        v-model="theDate"
        :max="null"
        :min="null"
        hide-header
        @input="timestampChange()"
        @context="timestampChange()"
      ></b-calendar>
    </div>
    <div class="pt-2">
      <b-time
        v-model="theTime"
        locale="en"
        hide-header
        style="showmeridian: false"
        :value="timePart(timestamp)"
        @input="timestampChange()"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "UniversalDateTimePicker",
  props: ["timestamp"],
  components: {},
  data() {
    return {
      theDate: null,
      theTime: null,
      timestampEntry: null,
    };
  },
  computed: {},
  methods: {
    datePart(timestamp) {
      return this.$moment(timestamp).format("YYYY-MM-DD");
    },
    timePart(timestamp) {
      return this.$moment(timestamp).format("HH:mm");
    },
    currentStamp() {
      return this.theDate + " " + this.theTime.slice(0, 5);
    },
    // time will always be in the format HH:mm:_temp_568
    timestampChange() {
      this.timestampEntry = this.currentStamp();
    },
    entryChange() {
      let savedTimestamp = this.currentStamp();
      if (
        this.$moment(this.timestampEntry, "YYYY-MM-DD HH:mm", true).isValid()
      ) {
        this.theTime = this.$moment(
          this.timestampEntry,
          "YYYY-MM-DD HH:mm"
        ).format("HH:mm:_temp_568");
        this.theDate = this.$moment(
          this.timestampEntry,
          "YYYY-MM-DD HH:mm"
        ).format("YYYY-MM-DD");
      } else {
        this.theTime = this.$moment(savedTimestamp, "YYYY-MM-DD HH:mm").format(
          "HH:mm:_temp_568"
        );
        this.theDate = this.$moment(savedTimestamp, "YYYY-MM-DD HH:mm").format(
          "YYYY-MM-DD"
        );
      }
    },
  },
  mounted() {
    this.theTime = this.timePart(this.timestamp);
    this.theDate = this.datePart(this.timestamp);
    this.timestampChange();
  },
  watch: {
    timestampEntry() {
      this.$emit("newTimestamp", this.timestampEntry);
    },
  },
};
</script>

<style scoped lang="scss">
/deep/ .dropdown-toggle-no-caret::after {
  display: none;
}
</style>
