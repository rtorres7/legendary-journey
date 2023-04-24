<template>
  <div class="d-flex flex-column">
    <div>
      <b-form-input
        v-if="includeTime"
        type="text"
        v-model="timestampEntry"
        :aria-label="`Date/Time input box, use format ${timestampFormat}`"
        @change="entryChange()"
        :placeholder="timestampFormat"
      >
      </b-form-input>
      <b-form-input
        v-else
        type="text"
        v-model="theDate"
        :aria-label="`Date input box, use format ${dateFormat}`"
        @change="entryChange()"
        :placeholder="dateFormat"
      >
      </b-form-input>
    </div>
    <div>
      <b-calendar
        block
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
        v-if="includeTime"
        v-model="theTime"
        locale="en"
        hide-header
        style="showmeridian: false"
        :value="formattedTime"
        @input="timestampChange()"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "UniversalDateTimePicker",
  props: {
    timestamp: {
      require: true,
    },
    includeTime: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      dateFormat: "YYYY-MM-DD",
      timeFormat: "HH:mm",
      timestampFormat: "YYYY-MM-DD HH:mm",
      theDate: null,
      theTime: null,
      timestampEntry: null,
    };
  },
  computed: {
    formattedDate() {
      return this.$moment(this.timestamp).format(this.dateFormat);
    },
    formattedTime() {
      return this.$moment(this.timestamp).format(this.timeFormat);
    },
  },
  methods: {
    currentStamp() {
      return this.theDate + " " + this.theTime.slice(0, 5);
    },
    // time will always be in the format HH:mm
    timestampChange() {
      this.timestampEntry = this.currentStamp();
    },
    entryChange() {
      let aTimestamp = this.$moment(
        this.timestampEntry,
        this.timestampFormat,
        true
      );
      if (!aTimestamp.isValid()) {
        aTimestamp = this.$moment(this.currentStamp(), this.timestampFormat);
      }

      this.theTime = aTimestamp.format(this.timeFormat);
      this.theDate = aTimestamp.format(this.dateFormat);
    },
  },
  mounted() {
    this.theTime = this.formattedTime;
    this.theDate = this.formattedDate;
    this.timestampChange();
  },
  watch: {
    timestampEntry() {
      let dateVal = this.includeTime ? this.timestampEntry : this.theDate;
      if (dateVal !== this.timestamp) {
        this.$emit("newTimestamp", dateVal);
      }
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .dropdown-toggle-no-caret::after {
  display: none;
}

::v-deep .btn-outline-secondary {
  color: $text-dark;
}
</style>
