<template>
  <span>
    <b-button
      id="wireDatePickerBtn"
      size="xl"
      variant="secondary"
      @click="showDatePicker = !showDatePicker"
      title="Select a different date of a WIRe to edit"
    >
      <img
        :src="require('@assets/calendar-icon.svg')"
        alt="calendar"
        class="calendar-icon pr-2"
      />
      <div class="sr-only">WIRe Book</div>
      <span class="text-nowrap">{{ formattedDate }} </span>
    </b-button>

    <b-modal
      v-model="showDatePicker"
      title="Select Desired Wire Date"
      title-class="modal-header-title"
      @ok="updateWireBookDate"
    >
      <div class="mx-8">
        <UniversalDateTimePicker
          :timestamp="selectedDate"
          :includeTime="false"
          @newTimestamp="dateChanged"
        />
      </div>
    </b-modal>
  </span>
</template>

<script>
import UniversalDateTimePicker from "@shared/UniversalDateTimePicker";

export default {
  name: "WireDatePicker",
  components: {
    UniversalDateTimePicker,
  },
  data() {
    return {
      selectedDate: "",
      showDatePicker: false,
    };
  },
  props: {
    date: {
      type: String,
      required: true,
    },
  },
  mounted() {
    this.selectedDate = this.formattedDate;
  },
  computed: {
    featureDate() {
      return this.date === "recent" ? this.$moment() : this.$moment(this.date);
    },
    formattedDate() {
      return this.featureDate.format("YYYY-MM-DD");
    },
  },
  methods: {
    dateChanged(dateVal) {
      this.selectedDate = dateVal;
    },
    updateWireBookDate() {
      this.$router.push({
        path: `/wires/${this.selectedDate}/edit`,
      });
    },
  },
};
</script>

<style scoped lang="scss">
.calendar-icon {
  height: 30px;
  width: 30px;
}

.btn-xl {
  padding: 0.5rem 1rem;
  font-size: $font-size-8;
  line-height: 1.25;
  border-radius: 0.25rem;
  font-weight: 100;
}

::v-deep .modal-header-title {
  color: $pri-800;
  font-size: $font-size-5;
}
</style>
