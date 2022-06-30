<template>
  <div class="mt-6 standard-page-margin">
    <vanity-title title="Alerts"></vanity-title>
    <b-container fluid>
      <b-row>
        <b-col class="col-24 col-lg-12">
          <AlertForm :form="formData" ref="alertForm" />
        </b-col>
        <b-col>
          <div class="mt-6">
            <div>
              <AlertGroup
                v-if="allAlerts"
                title="Pending"
                :alerts="allAlerts.pending"
              />
            </div>
            <div>
              <AlertGroup
                v-if="allAlerts"
                title="Active"
                :alerts="allAlerts.active"
              />
            </div>
            <div class="mb-8">
              <AlertGroup
                v-if="allAlerts"
                title="Expired"
                :alerts="allAlerts.expired"
                :collapsed="true"
              />
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import VanityTitle from "../../vanity/VanityTitle";
import AlertForm from "./AlertForm";
import AlertGroup from "./AlertGroup";
import axios from "axios";

export default {
  name: "manageAlerts",
  components: {
    VanityTitle,
    AlertForm,
    AlertGroup,
  },
  data() {
    return {
      formData: null,
      allAlerts: null,
    };
  },
  mounted() {
    this.populateAlerts();
    this.resetFormData();
    this.$bus.$on("deleteAlertEvent", (alert) => {
      this.deleteAlert(alert.id);
    });
    this.$bus.$on("editAlertEvent", (alert) => {
      this.loadForm(alert);
    });
    this.$bus.$on("repopulateAlertEvent", () => {
      this.populateAlerts();
    });
  },
  methods: {
    populateAlerts() {
      axios.get("/alerts/").then((response) => {
        this.allAlerts = response.data;
      });
    },
    resetFormData() {
      this.formData = {
        id: 0,
        title: "System Alert",
        message: "",
        range: {
          start: null,
          end: null,
        },
      };
    },
    deleteAlert(id) {
      axios.delete("/alerts/" + id).then(() => {
        this.$wireNotification({
          title: "Alert Deleted",
          duration: 5000,
          text: "Alert deleted",
          type: "success",
        });
        this.populateAlerts();
        if (this.formData.id == id) {
          this.resetFormData();
        }
        this.$refs.alertForm.setFocus();
      });
    },
    loadForm(alert) {
      this.formData = {
        id: alert.id,
        title: alert.title,
        message: alert.message,
        range: {
          start: alert.start_at,
          end: alert.end_at,
        },
      };
      this.$refs.alertForm.setFocus();
    },
  },
};
</script>

<style scoped lang="scss"></style>
