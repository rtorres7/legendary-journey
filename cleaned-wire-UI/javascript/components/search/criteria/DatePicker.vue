<template>
  <div>
    <label class="d-block pl-0">{{ title }}</label>
    <b-btn
      @click="$bvModal.show(uniqueModalId)"
      aria-label="search date range selector"
      class="p-0 px-2"
    >
      <WireBackgroundAsset
        class="calendar-icon"
        image-name="calendar-icon.svg"
        fill
      />
    </b-btn>

    <b-modal
      :id="uniqueModalId"
      class="search-date-modal"
      title="Select Your Date Range"
      title-class="modal-header-title"
      @ok="setDate()"
      @cancel="getSetDate"
    >
      <div class="d-flex flex-wrap flex-md-nowrap justify-content-around">
        <div class="d-flex flex-column quick-links">
          <b-button
            class="mt-3"
            variant="link"
            @click="past24"
            @mouseover="mouseOver24"
            @mouseout="getSetDate"
            >Past 24 Hours</b-button
          >
          <b-button
            class="mt-3"
            variant="link"
            @click="pastWeek"
            @mouseover="mouseOverWeek"
            @mouseout="getSetDate"
            >Past Week</b-button
          >
          <b-button
            class="mt-3"
            variant="link"
            @click="pastMonth"
            @mouseover="mouseOverMonth"
            @mouseout="getSetDate"
            >Past Month</b-button
          >
          <b-button
            class="mt-3"
            variant="link"
            @click="past6Months"
            @mouseover="mouseOver6Months"
            @mouseout="getSetDate"
            >Past 6 Months</b-button
          >
          <b-button
            class="mt-3"
            variant="link"
            @click="pastYear"
            @mouseover="mouseOverYear"
            @mouseout="getSetDate"
            >Past Year</b-button
          >
        </div>
        <div class="d-flex flex-wrap">
          <div>
            <h6>Select Start Date</h6>
            <b-form-input
              type="text"
              v-model="startDateEntry"
              aria-label="Start date input box, use format YYYY-MM-DD"
              @change="
                () => {
                  this.startDate = this.startDateEntry;
                }
              "
              :placeholder="startDateEntry || 'YYYY-MM-DD'"
            >
            </b-form-input>
            <b-calendar
              width="310px"
              label-help="Tab to enter calendar, arrow keys to navigate, enter to select a date"
              v-model="startDate"
              @selected="
                () => {
                  this.startDateEntry = this.startDate;
                }
              "
              :max="endDate || Date.today()"
              hide-header
            ></b-calendar>
          </div>
          <div class="ml-3">
            <h6>Select End Date</h6>
            <b-form-input
              type="text"
              v-model="endDateEntry"
              aria-label="End date input box, use format YYYY-MM-DD"
              @change="
                () => {
                  this.endDate = this.endDateEntry;
                }
              "
              :placeholder="endDateEntry || 'YYYY-MM-DD'"
            >
            </b-form-input>
            <b-calendar
              width="310px"
              label-help="Tab to enter calendar, arrow keys to navigate, enter to select a date"
              v-model="endDate"
              :max="Date.today()"
              :min="startDate"
              hide-header
              @selected="
                () => {
                  this.endDateEntry = this.endDate;
                }
              "
            ></b-calendar>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";
import WireBackgroundAsset from "@shared/WireBackgroundAsset";
import urlStore from "@shared/mixins/urlStore";
import navigationErrorHandlerMixin from "@shared/mixins/navigationErrorHandlerMixin";

export default {
  name: "DatePicker",
  components: { WireBackgroundAsset },
  mixins: [urlStore, navigationErrorHandlerMixin],
  props: {
    title: {
      default: "Date",
      type: String,
    },
  },
  data() {
    return {
      // we need start and end date entry in order to support text fields
      // having them use startDate, and endDate directly causes a strange bug where
      // the calendar tries to update the date at the same time and you can't get past
      // the first date of a month
      startDate: null,
      startDateEntry: null,
      endDate: null,
      endDateEntry: null,
      flatPickrConfig: {
        format: "Y-m-d",
        mode: "range",
        // showMonths: 2,
        inline: true,
      },
      uniqueModalId: "id" + Math.random().toString(16).slice(2),
    };
  },

  computed: {
    ...mapState("metadata", ["criteria"]),
  },

  methods: {
    ...mapMutations("criteria", ["addCriteria"]),

    dates24() {
      this.startDate = moment().subtract(24, "hours").format("YYYY-MM-DD");
      this.endDate = moment().format("YYYY-MM-DD");
    },

    mouseOver24() {
      this.dates24();
    },

    past24() {
      this.dates24();
      this.setDate();
    },

    datesWeek() {
      this.startDate = moment().subtract(7, "days").format("YYYY-MM-DD");
      this.endDate = moment().format("YYYY-MM-DD");
    },

    mouseOverWeek() {
      this.datesWeek();
    },

    pastWeek() {
      this.datesWeek();
      this.setDate();
    },

    datesMonth() {
      this.startDate = moment().subtract(1, "month").format("YYYY-MM-DD");
      this.endDate = moment().format("YYYY-MM-DD");
    },

    mouseOverMonth() {
      this.datesMonth();
    },

    pastMonth() {
      this.datesMonth();
      this.setDate();
    },

    dates6Months() {
      this.startDate = moment().subtract(6, "months").format("YYYY-MM-DD");
      this.endDate = moment().format("YYYY-MM-DD");
    },

    mouseOver6Months() {
      this.dates6Months();
    },

    past6Months() {
      this.dates6Months();
      this.setDate();
    },

    datesYear() {
      this.startDate = moment().subtract(1, "year").format("YYYY-MM-DD");
      this.endDate = moment().format("YYYY-MM-DD");
    },

    mouseOverYear() {
      this.datesYear();
    },

    pastYear() {
      this.datesYear();
      this.setDate();
    },

    setDate() {
      this.$emit("datesSelected", this.startDate, this.endDate);
      var query = Object.assign({}, this.$route.query);
      this.$router
        .push({
          query: {
            ...query,
            ...{
              start_date: this.startDate,
              end_date: this.endDate,
            },
          },
        })
        .catch((failure) => {
          this.handleNavigationErrors(failure);
        });
    },

    getSetDate() {
      this.startDate = this.$route.query["start_date"];
      this.startDateEntry = this.$route.query["start_date"];
      this.endDate = this.$route.query["end_date"];
      this.endDateEntry = this.$route.query["end_date"];
    },
  },

  mounted() {
    this.getSetDate();
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
#search-date-range-picker {
  background-color: white;
  width: 200px;
  color: $text-dark;
  &::placeholder {
    color: $text-dark;
  }
}
.search-date-modal {
  /*width: 90vw;*/
  background-color: white;
}
::v-deep .modal-dialog {
  max-width: 60rem;
}
.btn-secondary {
  background-color: unset;
  border: unset;
  padding-top: 0;
  padding-bottom: 0;
  &:hover,
  &:focus {
    box-shadow: 0 0 0 0.2rem $alt-500;
  }
}
::v-deep .btn-outline-secondary {
  color: $text-dark;
}
.quick-links {
  min-width: 125px;
}
::v-deep .modal-header-title {
  color: $pri-800;
  font-size: $font-size-5;
}
</style>
