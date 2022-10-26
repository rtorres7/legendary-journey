<template>
  <div class="mt-6 mr-7">
    <h2 class="info-title">{{ headingText }}</h2>
    <p class="form-directions">
      Enter the message you would like displayed to users. The message will be
      displayed throughout the time range in priority order.
    </p>
    <b-form @submit.prevent="onSubmit">
      <b-row class="mb-8">
        <b-col class="pr-4 pb-4" cols="24">
          <b-form-group
            class="label"
            label="Title"
            aria-live="polite"
            :invalid-feedback="invalidTitleFeedback"
            aria-label="Alert title, cannot be blank"
          >
            <b-input
              ref="titleInput"
              :maxLength="titleMaxLength + 1"
              :state="notBlank($v.workingForm.title)"
              v-model="$v.workingForm.title.$model"
            />
          </b-form-group>
        </b-col>
        <b-col class="pr-4 pb-4" cols="24">
          <b-form-group
            class="label"
            label="Message"
            aria-label="Message text, cannot be blank"
            aria-live="polite"
            :invalid-feedback="invalidMessageFeedback"
          >
            <b-form-textarea
              aria-live="polite"
              :state="notBlank($v.workingForm.message)"
              :maxLength="messageMaxLength + 1"
              v-model="$v.workingForm.message.$model"
              class="form-control"
              rows="8"
            ></b-form-textarea>
          </b-form-group>
        </b-col>
        <b-col class="pr-4 pb-1" cols="24">
          <b-form-group class="label separator" label="Timeframe">
            <b-row align-v="center">
              <b-col class="pr-4" cols="auto">
                <UniversalRangePicker
                  aria-label="Alert timeframe, select to change."
                  v-model="this.workingForm.range"
                  :rangeIn="this.workingForm.range"
                />
              </b-col>
              <b-col class="pt-4 pr-4" cols="auto">
                <label>Start</label>
                <span id="timestamp-start">{{ startStamp }}</span>
              </b-col>
              <b-col class="pt-4 pr-4">
                <label>End</label>
                <span id="timestamp-end">{{ endStamp }}</span>
              </b-col>
            </b-row>
            <b-form-valid-feedback :state="true">
              This alert will last for {{ rangeDays }} days.
            </b-form-valid-feedback>
          </b-form-group>
        </b-col>
        <b-col class="d-flex justify-content-end pr-4">
          <b-btn
            class="mr-2"
            variant="secondary"
            @click="
              reloadForm();
              setFocus();
            "
            >Cancel</b-btn
          >
          <b-btn
            id="submit-button"
            variant="primary"
            type="submit"
            :disabled="$v.$invalid"
            >{{ buttonText }}</b-btn
          >
        </b-col>
      </b-row>
    </b-form>
  </div>
</template>

<script>
import UniversalRangePicker from "@shared/UniversalRangePicker";
import axios from "axios";
import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";

export default {
  name: "AlertForm",
  mixins: [validationMixin],
  components: { UniversalRangePicker },
  props: ["form"],
  data() {
    return {
      workingForm: {
        title: "",
        message: "",
      },
    };
  },
  computed: {
    startStamp() {
      if (this.workingForm.range) {
        return this.$moment(this.workingForm.range.start).format(
          "YYYY-MM-DD HH:mm"
        );
      }
    },
    rangeDays() {
      if (this.workingForm.range) {
        return this.$moment(this.workingForm.range.end).diff(
          this.$moment(this.workingForm.range.start),
          "days"
        );
      } else {
        return 0;
      }
    },
    endStamp() {
      if (this.workingForm.range) {
        return this.$moment(this.workingForm.range.end).format(
          "YYYY-MM-DD HH:mm"
        );
      }
    },
    buttonText() {
      if (this.workingForm.id) {
        return "Update";
      } else {
        return "Create";
      }
    },
    headingText() {
      if (this.workingForm.id) {
        return "Edit an Alert";
      } else {
        return "Create an Alert";
      }
    },
    invalidMessageFeedback() {
      return this.invalidFeedback(
        this.workingForm.message.length,
        this.messageMaxLength,
        "Message"
      );
    },
    invalidTitleFeedback() {
      return this.invalidFeedback(
        this.workingForm.title.length,
        this.titleMaxLength,
        "Title"
      );
    },
    titleMaxLength() {
      return this.$v.workingForm.title.$params.maxLength.max;
    },
    messageMaxLength() {
      return this.$v.workingForm.message.$params.maxLength.max;
    },
  },
  validations: {
    workingForm: {
      title: {
        required,
        maxLength: maxLength(30),
      },
      message: {
        required,
        maxLength: maxLength(4000),
      },
    },
  },
  methods: {
    notBlank(item) {
      const { $dirty, $error } = item;
      return $dirty ? !$error : null;
    },
    formatDateTime(dateTime) {
      return this.$moment(dateTime, "YYYY-MM-DD HH:mm").format(
        "YYYY-MM-DD HH:mm"
      );
    },
    defaultStart() {
      return this.$moment().set({ hour: 6, minute: 0, second: 0 });
    },
    defaultEnd() {
      return this.$moment()
        .add(7, "days")
        .set({ hour: 23, minute: 59, second: 0 });
    },
    invalidFeedback(fieldLength, fieldMax, fieldName) {
      if (fieldLength > fieldMax) {
        return `${fieldName} cannot exceed ${fieldMax} characters.`;
      }
      if (fieldLength === 0) {
        return `${fieldName} cannot be blank.`;
      }
    },
    setFocus() {
      this.$refs.titleInput.focus();
    },
    handleError(action, text) {
      this.$wireNotification({
        duration: 5000,
        title: `Error ${action} alert`,
        text: text
          ? text
          : `Unexpected error occurred.  Please refresh page and retry action.`,
        type: "error",
      });
    },
    createAlert() {
      axios
        .post("/alerts", {
          start_at: this.workingForm.range.start,
          stop_at: this.workingForm.range.end,
          title: this.workingForm.title,
          message: this.workingForm.message,
        })
        .then((response) => {
          if (response.data.success === true) {
            this.$wireNotification({
              title: "Create Alert",
              duration: 5000,
              text: "Alert successfully created",
              type: "success",
            });
            this.$nextTick(() => {
              this.$bus.$emit("repopulateAlertEvent");
              this.reloadForm(null);
              this.setFocus();
            });
          } else {
            this.handleError("creating", response.data.details);
          }
        })
        .catch(() => {
          this.handleError("creating");
        });
    },
    updateAlert() {
      axios
        .patch("/alerts/" + this.workingForm.id, {
          id: this.workingForm.id,
          start_at: this.workingForm.range.start,
          stop_at: this.workingForm.range.end,
          title: this.workingForm.title,
          message: this.workingForm.message,
        })
        .then((response) => {
          if (response.data.success === true) {
            this.$wireNotification({
              title: "Update Alert",
              duration: 5000,
              text: "Alert successfully Updated",
              type: "success",
            });
            this.$nextTick(() => {
              this.$bus.$emit("repopulateAlertEvent");
              this.reloadForm(null);
            });
          } else {
            this.handleError("updating", response.data.details);
          }
        })
        .catch(() => {
          this.handleError("updating");
        });
    },
    onSubmit(evt) {
      evt.preventDefault();
      if (this.workingForm.id) {
        this.updateAlert();
      } else {
        this.createAlert();
      }
    },
    reloadForm() {
      this.workingForm = {
        id: null,
        title: "System Alert",
        message: "",
        range: {
          start: this.formatDateTime(this.defaultStart()),
          end: this.formatDateTime(this.defaultEnd()),
        },
      };
    },
  },
  mounted() {
    this.reloadForm();
    this.$bus.$on("rangeSetEvent", (newRange) => {
      this.workingForm.range.start = newRange.start;
      this.workingForm.range.end = newRange.end;
    });
  },
  created() {
    this.$nextTick(() => {
      this.$v.$touch();
    });
  },
  watch: {
    form: {
      deep: true,
      handler() {
        let safeStart = this.form.range.start
          ? this.form.range.start
          : this.defaultStart();
        let safeEnd = this.form.range.end
          ? this.form.range.end
          : this.defaultEnd();
        this.workingForm = {
          id: this.form.id,
          title: this.form.title,
          message: this.form.message,
          range: {
            start: safeStart,
            end: safeEnd,
          },
        };
      },
    },
  },
};
</script>

<style scoped lang="scss">
.info-title {
  font-family: $font-family-heading;
  font-size: $font-size-6;
  color: $pri-600;
  line-height: 1.5;
}
.form-directions {
  color: $alt-800;
}
.label,
label {
  color: $alt-800;
  font-style: italic;
  justify-content: left;
}
.separator {
  border-bottom: 1px solid $alt-400;
  margin-bottom: 5px;
}
</style>
