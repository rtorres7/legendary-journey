<template>
  <div>
    <b-btn
      variant="outline"
      v-b-modal.date-range-modal
      aria-label="alert date/time range selector"
      class="p-0 px-2"
    >
      <WireBackgroundAsset
        class="calendar-icon"
        image-name="calendar-icon.svg"
      />
    </b-btn>

    <b-modal
      id="date-range-modal"
      title="Select Your Date/Time Range"
      title-class="modal-header-title"
      @ok="setDate()"
      :ok-disabled="!rangeValid"
    >
      <div class="d-flex flex-wrap flex-md-nowrap justify-content-around">
        <div class="b-col flex-grow-1 mx-8 my-5">
          <h6>Select Starting Date and Time</h6>
          <UniversalDateTimePicker
            :timestamp="this.range.start"
            @newTimestamp="startDateEvent"
          />
        </div>
        <div class="b-col flex-grow-1 mx-8 my-5">
          <h6>Select Ending Date and Time</h6>
          <UniversalDateTimePicker
            :timestamp="this.range.end"
            @newTimestamp="endDateEvent"
          />
        </div>
      </div>
      <div class="warning" v-if="!rangeValid">
        Ending time must be AFTER starting time.
      </div>
    </b-modal>
  </div>
</template>

<script>
import WireBackgroundAsset from "@shared/WireBackgroundAsset";
import UniversalDateTimePicker from "@shared/UniversalDateTimePicker";
import urlStore from "@shared/mixins/urlStore";

export default {
  name: "UniversalRangePicker",
  props: ["rangeIn"],
  components: { WireBackgroundAsset, UniversalDateTimePicker },
  mixins: [urlStore],
  data() {
    return {
      range: {},
    };
  },
  computed: {
    rangeValid() {
      return this.range.start < this.range.end;
    },
  },
  methods: {
    setDate() {
      this.$bus.$emit("rangeSetEvent", this.range);
    },
    startDateEvent(timestamp) {
      this.range.start = timestamp;
    },
    endDateEvent(timestamp) {
      this.range.end = timestamp;
    },
  },
  watch: {
    rangeIn: {
      deep: true,
      handler() {
        this.range = {
          start: this.rangeIn.start,
          end: this.rangeIn.end,
        };
      },
    },
  },
};
</script>

<style scoped lang="scss">
.calendar-icon {
  height: 30px;
  width: 30px;
}
::v-deep .dropdown-toggle-no-caret::after {
  display: none;
}

#date-range-modal {
  background-color: white;
}
::v-deep .modal-dialog {
  max-width: 60rem;
}
::v-deep .btn-outline-secondary {
  color: $text-dark;
}
.warning {
  text-align: right;
}
::v-deep .modal-header-title {
  color: $pri-800;
  font-size: $font-size-5;
}
</style>
