<template>
  <div id="page-date-title" class="align-self-center mr-auto">
    <div class="sr-only" aria-live="polite">
      You are reading WIRe for {{ date | moment("dddd, MMMM Do YYYY") }}
    </div>
    <div class="d-flex align-items-center">
      <h2 class="understated-title-text cursor-pointer font-size-2">
        {{ date | moment("dddd, MMMM Do YYYY") }}
      </h2>
      <b-btn
        class="ml-3 px-2"
        v-b-modal.front-page-date-selection-modal
        aria-label="Select a different days wire"
        v-if="featuresAvailable.showFrontPageDatePicker"
      >
        <img
          :src="require('@assets/calendar-icon.svg')"
          alt="calendar"
          class="calendar-icon"
        />
      </b-btn>
      <b-modal
        id="front-page-date-selection-modal"
        title="Select Desired Front Page Date"
        title-class="modal-header-title"
        @ok="visitDate"
      >
        <b-row>
          <b-col cols="14">
            <b-form-input
              v-model="inputDate"
              placeholder="YYYY-MM-DD"
              aria-label="WIRe date input box, use format YYYY-MM-DD"
              @change="
                () => {
                  this.selectedDate = this.inputDate;
                }
              "
            ></b-form-input>
          </b-col>
        </b-row>
        <b-calendar
          class="mt-6"
          width="320px"
          v-model="selectedDate"
          :max="Date.today()"
          @selected="
            () => {
              this.inputDate = this.selectedDate;
            }
          "
          :date-disabled-fn="validDate"
        ></b-calendar>
      </b-modal>
    </div>
  </div>
</template>

<script>
import frontPages from "@shared/mixins/frontPages";
import axios from "axios";
import { mapState } from "vuex";

export default {
  name: "DatePicker",
  mixins: [frontPages],
  data() {
    return {
      flatPickrConfig: {
        static: true,
      },
      selectedDate: null,
      inputDate: null,
      validDates: [],
    };
  },

  mounted() {
    this.getDates();
  },

  computed: {
    ...mapState("metadata", ["featuresAvailable"]),
    date: {
      get() {
        if (this.$route.params.date) {
          return this.$route.params.date;
        } else {
          this.selectedDate = this.inputDate = null;
          return new Date();
        }
      },
      set(val) {
        this.$router.push({
          name: "wires",
          params: {
            date: val,
          },
        });

        this.$store.dispatch("products/getOtherWire", val).catch(
          function (e) {
            this.handleMissingFrontPage(e, val);
          }.bind(this)
        );
      },
    },
  },

  methods: {
    visitDate() {
      this.$router.push({
        name: "wires",
        params: {
          date: this.selectedDate,
        },
      });

      this.$store.dispatch("products/getOtherWire", this.selectedDate).catch(
        function (e) {
          this.handleMissingFrontPage(e, this.selectedDate);
        }.bind(this)
      );
    },

    getDates() {
      axios.get("/wires/get_valid_dates").then((result) => {
        this.validDates = result.data.wires.map((wire) => {
          return Date.parse(wire.publication_date);
        });
      });
    },

    validDate(date) {
      const dateObj = Date.parse(date);
      if (moment(date).isBefore(moment().subtract(1, "years"))) {
        return false;
      }
      return !this.validDates.find(
        (validDate) => validDate.getTime() === dateObj.getTime()
      );
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .flatpickr-wrapper {
  position: absolute;
}
.cursor-pointer {
  cursor: pointer;
}
#page-date-title h2 {
  margin-bottom: 0;
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
.calendar-icon {
  height: 20px;
  width: 20px;
}
::v-deep .modal-header-title {
  color: $pri-800;
  font-size: $font-size-5;
}
</style>
