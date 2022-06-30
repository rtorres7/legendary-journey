<template>
  <div>
    <SectionHeader
      :title="name + ' WIRe Feeds'"
      description="Create and display a custom feed from our suggestions, or any WIRe search"
      class="section-heading standard-page-margin"
    >
      <template v-slot:editButton>
        <b-button
          v-if="!showPersonalize"
          variant="link"
          @click="togglePersonalize"
          class="ml-6 _temp_488-6 mb-1"
        >
          <div class="font-size-2">
            <img
              :src="require('@assets/edit.svg')"
              alt="add a feed"
              class="edit-icon mr-1 mb-2"
            />
            Add a feed
          </div>
        </b-button>
        <b-button
          v-else
          variant="link"
          @click="resetFeedForm"
          class="ml-6 _temp_488-6 mb-1"
        >
          <div class="font-size-2">Close</div>
        </b-button>
      </template>
    </SectionHeader>
    <div class="alt-200-bg mb-7">
      <b-collapse
        class="standard-page-margin"
        v-model="showPersonalize"
        id="personalize-collapse"
      >
        <Personalize />
      </b-collapse>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import SectionHeader from "../SectionHeader";
import Personalize from "./personalize/Personalize";

export default {
  name: "FeedHeader",
  components: { SectionHeader, Personalize },
  data() {
    return {
      showPersonalize: false,
    };
  },
  computed: {
    ...mapState("user", ["user"]),

    name() {
      let lastLetter = this.user.name.charAt(this.user.name.length - 1);
      let possessivized =
        lastLetter === "s" ? `${this.user.name}\'` : `${this.user.name}\'s`;
      return possessivized;
    },
  },

  methods: {
    togglePersonalize() {
      this.showPersonalize = !this.showPersonalize;
    },
    resetFeedForm() {
      this.$bus.$emit("reset_portlet_form");
    },
  },

  mounted() {
    this.$bus.$on(
      "reset_portlet_form",
      function () {
        this.showPersonalize = false;
      }.bind(this)
    );
  },
};
</script>

<style scoped lang="scss">
button {
  border-left: 1px solid $alt-600;
}

img.edit-icon {
  height: 16px;
  width: 16px;
}
</style>
