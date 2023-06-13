<template>
  <div v-if="name" class="ml-auto mr-3">
    <b-button
      v-b-modal.social-subscribe-edition
      data-usage="daily-subscription"
    >
      <template v-if="is_subscribed">
        <span class="fa fa-star mr-2"></span> Unsubscribe<span class="sr-only">
          from {{ this.agency }} {{ this.name }} front page _temp_37
          notifications</span
        >
      </template>
      <template v-else>
        <span class="fa fa-star-o mr-2"></span> Subscribe<span class="sr-only">
          to {{ this.agency }} {{ this.name }} front page _temp_37
          notifications</span
        >
      </template>
    </b-button>
    <b-modal
      id="social-subscribe-edition"
      :ok-title="button_text"
      size="sm"
      :title="modal_title"
      title-class="modal-header-title"
      @ok="toggleSubscription"
    >
      <div id="subscribe-modal-text" v-html="subscribe_text"></div>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
import { mapState, mapMutations } from "vuex";

export default {
  name: "Subscribe",
  methods: {
    ...mapMutations("user", ["updateSubscription"]),
    toggleSubscription() {
      axios.patch("/my_wire/subscription").then((response) => {
        this.updateSubscription();
      });
    },
  },

  computed: {
    ...mapState("user", ["user", "loading"]),
    ...mapState("metadata", ["agency", "name"]),
    modal_title() {
      if (this.name) {
        return this.name + " Product Subscriptions";
      }
    },
    subscribe_text() {
      if (!this.loading) {
        const button_action = this.is_subscribed
          ? "stop receiving "
          : "receive ";
        return (
          "<p>_temp_37 subscribers receive a daily table of contents with links " +
          "to featured products published in the last 24 hours.</p><p>" +
          'Choose the "' +
          this.button_text +
          '" button below to ' +
          button_action +
          "_temp_37 at <span class='text-bold'>" +
          this.user._temp_37 +
          "</span></p>"
        );
      }
    },
    button_text() {
      return this.is_subscribed ? "Unsubscribe Me" : "Subscribe Me";
    },
    is_subscribed() {
      return this.user.wire_subscriber;
    },
  },
};
</script>
<style scoped lang="scss">
.fa-star-o {
  font-size: $font-size-3;
}
::v-deep .modal-header-title {
  color: $pri-800;
  font-size: $font-size-5;
}
</style>
