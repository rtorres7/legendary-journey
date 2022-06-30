<template>
  <div class="d-flex align-items-center ml-auto text-nowrap">
    <span v-if="showLabel" class="text-bold pr-2">Readership Date Range: </span>
    <b-form-datepicker
      v-model="readershipStartDate"
      class="w-50 ml-2"
      no-close-on-select
      :date-format-options="dateFormatOptions"
      :min="min"
      :max="today"
      :hide-header="hideHeader"
      placeholder="Select start date"
      @input="updateDateRange"
    ></b-form-datepicker>
    <span class="px-4">to</span>
    <b-form-datepicker
      v-model="readershipEndDate"
      class="w-50 ml-2"
      no-close-on-select
      :date-format-options="dateFormatOptions"
      :min="min"
      :max="today"
      :hide-header="hideHeader"
      placeholder="Select end date"
      @input="updateDateRange"
    ></b-form-datepicker>
  </div>
</template>

<script>
export default {
  name: "DateRangePicker",
  data() {
    return {
      today: "",
      dateFormatOptions: { year: "numeric", month: "short", day: "2-digit" },
      hideHeader: true,
      readershipStartDate: "",
      readershipEndDate: "",
    };
  },
  props: {
    startDate: {
      type: String,
    },
    endDate: {
      type: String,
    },
    minDate: {
      required: false,
    },
    showLabel: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    this.today = this.$moment().format("YYYY-MM-DD");
    this.readershipStartDate = this.startDate;
    this.readershipEndDate = this.endDate;
  },
  computed: {
    min() {
      return this.minDate ? this.minDate : this.startDate;
    },
  },
  methods: {
    updateDateRange() {
      this.$emit(
        "dateRangeUpdated",
        this.readershipStartDate,
        this.readershipEndDate
      );
    },
  },
  watch: {
    startDate() {
      this.readershipStartDate = this.startDate;
    },
    endDate() {
      this.readershipEndDate = this.endDate;
    },
  },
};
</script>

<style scoped lang="scss">
/deep/ .btn,
.btn:focus {
  border-radius: unset;
}
.btn-group {
  padding-left: 2rem;
}
.form-group {
  margin: 0;
}
/deep/ .b-calendar {
  background-color: $pri-800;
}
</style>
