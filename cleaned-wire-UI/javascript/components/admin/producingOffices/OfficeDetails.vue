<template>
  <div class="mt-4">
    <h2 class="pri-800 separator pb-4 d-flex">
      {{ producingOfficeLabel }} Detail
    </h2>
    <div class="d-flex" v-if="selectedNode && officeOrDivision">
      <b-button
        class="ml-auto mr-2 mt-2 mb-2 edit-button btn-sm pa-2"
        v-if="officeOrDivision"
        variant="link"
        v-b-modal.edit-producing-office-details
      >
        <img :src="require('@assets/edit.svg')" alt="" class="edit-icon" /><span
          class="sr-only"
          >Edit {{ officeOrDivision.name }}</span
        ></b-button
      >
      <DeleteButton
        class="pt-2"
        v-if="canBeRemoved"
        :_temp_1="`/admin/producing_offices/${officeOrDivision.id}`"
        :label="`${officeOrDivision.name}`"
        :type="officeOrDivisionText"
        :caller="this"
      />
    </div>
    <b-card v-if="officeOrDivision">
      <div class="row">
        <div class="col-md-6">
          <label>Office Name</label>
        </div>
        <div class="col-md-16">
          {{ officeOrDivision.name }}
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <label>Office Acronym</label>
        </div>
        <div class="col-md-16">
          {{ officeOrDivision.acronym }}
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <label>Official Office Title</label>
        </div>
        <div class="col-md-16">{{ officeOrDivision.title }}</div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <label>POC Info</label>
        </div>
        <div class="col-md-16">{{ officeOrDivision.poc_info }}</div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <label>Legacy?</label>
        </div>
        <div class="col-md-16">
          {{ officeOrDivision.legacy ? "Yes" : "No" }}
        </div>
      </div>
      <div class="row">
        <div class="col-md-6">
          <label>Visible to Congress?</label>
        </div>
        <div class="col-md-16">
          {{ officeOrDivision.congress ? "Yes" : "No" }}
        </div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <label>User Label</label>
        </div>
        <div class="col-md-16">{{ officeOrDivision.user_label }}</div>
      </div>

      <div class="row">
        <div class="col-md-6">
          <label>Ingest Label</label>
        </div>
        <div class="col-md-16">{{ officeOrDivision.label }}</div>
      </div>
    </b-card>
    <div v-else>Select {{ officeOrDivisionText }}</div>
  </div>
</template>

<script>
import DeleteButton from "@shared/DeleteButton";
import { mapGetters, mapState } from "vuex";

export default {
  name: "OfficeDetails",
  components: {
    DeleteButton,
  },
  computed: {
    ...mapGetters("producingOffices", ["officeOrDivision"]),
    ...mapState("producingOffices", [
      "producingOfficeLabel",
      "selectedNode",
      "officeOrDivisionText",
    ]),
    canBeRemoved() {
      let children = this.selectedNode.children;
      return !Array.isArray(children) || children.length === 0;
    },
  },
  methods: {
    deleted() {
      this.$wireNotification({
        title: `${this.producingOfficeLabel} Deleted`,
        duration: 5000,
        text: `${this.officeOrDivision.name} has been deleted`,
        type: "success",
      });
      this.$emit("officeUpdated");
      this.$store.commit("producingOffices/setSelectedNode", null);
    },
    deletionFailed() {
      this.$wireNotification({
        title: `Removing ${this.producingOfficeLabel} Failed`,
        duration: 5000,
        text: `Failed to remove ${this.officeOrDivision.name}.`,
        type: "error",
      });
    },
  },
};
</script>

<style scoped lang="scss">
label {
  color: $pri-700;
  font-weight: bold;
  justify-content: left;
}
img.edit-icon {
  height: 16px;
  width: 16px;
}
.edit-button {
  &:focus {
    box-shadow: 0 0 0 0.2rem $alt-400;
  }
}
</style>
