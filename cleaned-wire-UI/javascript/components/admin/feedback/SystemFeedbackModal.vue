<template>
  <b-modal
    v-model="showModal"
    :title="`Reviewing Feedback ID: ${feedback.id}`"
    title-class="modal-header-title"
    hide-footer
    static
  >
    <b-container fluid>
      <b-row>
        <b-col>
          <b-row>
            <b-col><label>Date Posted</label></b-col>
            <b-col>{{ formatTimeStamp(feedback.createdAt) }}</b-col>
          </b-row>
          <b-row>
            <b-col><label>Posted By</label></b-col>
            <b-col>{{ feedback.name }}</b-col>
          </b-row>
          <b-row>
            <b-col><label>_temp_36</label></b-col>
            <b-col>{{ feedback._temp_36 }}</b-col>
          </b-row>
        </b-col>
        <b-col>
          <b-row>
            <b-col><label>Classification</label></b-col>
            <b-col>{{ feedback.classification }}</b-col>
          </b-row>
          <b-row>
            <b-col><label>Organization</label></b-col>
            <b-col>{{ feedback.organization }}</b-col>
          </b-row>
          <b-row>
            <b-col><label>_temp_37</label></b-col>
            <b-col>
              <a :href="`mailto:${feedback._temp_37}`">{{ feedback._temp_37 }}</a>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <hr />
      <b-row>
        <b-col><label>Message</label></b-col>
      </b-row>
      <b-row>
        <b-col>{{ feedback.body }}</b-col>
      </b-row>
      <hr />
      <div v-if="feedback.state === 'pending'">
        <div v-if="updateAccess" class="assignAndRefer">
          <b-row>
            <b-col><label>Assign feedback to:</label></b-col>
            <b-col><label>Refer feedback to:</label></b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-form-group invalid-feedback="Cannot be blank">
                <b-select
                  :options="feedbackUsers"
                  v-model="assignedTo"
                  aria-label="assign feedback to"
                  :state="!$v.assignedTo.$invalid"
                />
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group invalid-feedback="Cannot be blank">
                <b-input
                  v-model="referredTo"
                  aria-label="refer feedback to"
                  :state="!$v.referredTo.$invalid"
                />
              </b-form-group>
            </b-col>
          </b-row>
          <b-row>
            <b-col>
              <b-btn
                variant="primary"
                @click="transitionFeedback('Assign')"
                :disabled="$v.assignedTo.$invalid"
                >Assign</b-btn
              >
            </b-col>
            <b-col>
              <b-btn
                variant="primary"
                @click="transitionFeedback('Refer')"
                :disabled="$v.referredTo.$invalid"
                >Refer</b-btn
              >
            </b-col>
          </b-row>
        </div>
      </div>
      <div v-else>
        <b-col>
          <b-row>
            <label>{{ feedbackData.heading }}</label>
          </b-row>
          <b-row v-for="item in feedbackData.items" :key="item.label">
            <b-col>{{ item.label }}</b-col>
            <b-col>{{ item.value }}</b-col>
          </b-row>
        </b-col>
        <b-col>
          <b-row v-if="feedback.state == 'assigned' && updateAccess">
            <b-btn
              class="mt-6"
              variant="primary"
              @click="transitionFeedback('Complete')"
              >Complete</b-btn
            >
          </b-row>
        </b-col>
      </div>
    </b-container>
  </b-modal>
</template>

<script>
import { capitalize } from "lodash";
import { required } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

export default {
  name: "SystemFeedbackModalX",
  mixins: [validationMixin],
  props: {
    updateAccess: {
      type: Boolean,
      required: true,
      default: false,
    },
    feedbackUsers: {
      type: Array,
      required: true,
      default: [],
    },
  },
  components: {},
  data() {
    return {
      assignedTo: null,
      referredTo: null,
      showModal: false,
      feedback: false,
      feedbackData: { heading: "", items: [] },
    };
  },
  validations: {
    referredTo: { required },
    assignedTo: { required },
  },
  computed: {},
  mounted() {
    this.$bus.$on("show-systemfeedback-modal", this.startModal);
  },
  methods: {
    addItem(label, value, isTime = false) {
      if (value) {
        if (isTime) {
          value = this.formatTimeStamp(value);
        }
        this.feedbackData.items.push({ label: label, value: value });
      }
    },
    feedbackState() {
      return this.feedback.state == "referred" ? "Referred" : "Assigned";
    },
    setFeedbackData() {
      this.feedbackData.heading = capitalize(this.feedback.state) + " Feedback";
      this.feedbackData.items = [];
      if (this.feedback.referredTo) {
        this.feedbackData.items.push({
          label: "Referred To",
          value: this.feedback.referredTo,
        });
      }
      this.addItem("Assigned To", this.feedback.assignedTo);
      this.feedbackData.items.push({
        label: this.feedbackState() + " By",
        value: this.feedback.assignedBy,
      });
      this.feedbackData.items.push({
        label: this.feedbackState() + " At",
        value: this.formatTimeStamp(this.feedback.assignedAt),
      });
      this.addItem("Completed By", this.feedback.completedBy);
      this.addItem("Completed At", this.feedback.completedAt, true);
    },
    startModal(feedback) {
      this.feedback = feedback;
      this.setFeedbackData();
      this.showModal = true;
    },
    formatTimeStamp(dateTime) {
      return this.$moment(dateTime, "YYYY/MM/DD hh:mm:ss ZZ").format(
        "YYYY-MM-DD HH:mm"
      );
    },
    transitionFeedback(transition) {
      let evtData = {
        id: this.feedback.id,
        commit: transition,
        assignedTo: this.assignedTo,
        referredTo: this.referredTo,
      };
      this.$emit("feedback-update", evtData);
      this.showModal = false;
    },
  },
};
</script>
<style scoped lang="scss">
label {
  color: $alt-800;
  font-style: italic;
  justify-content: left;
}
::v-deep .modal-header-title {
  color: $pri-800;
  font-size: $font-size-5;
}
</style>
