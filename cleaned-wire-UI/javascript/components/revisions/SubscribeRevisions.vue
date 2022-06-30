<template>
  <div v-if="!loading">
    <b-button v-b-modal.subscribe-revisions data-usage="daily-subscription">
      <template v-if="isSubscribed">
        <span class="fa fa-star mr-2"></span> Unsubscribe<span class="sr-only">
          from {{ this.name }} revision email notifications</span
        >
      </template>
      <template v-else>
        <span class="fa fa-star-o mr-2"></span> Subscribe<span class="sr-only">
          to {{ this.name }} revision email notifications</span
        >
      </template>
    </b-button>
    <b-modal
      id="subscribe-revisions"
      :ok-title="buttonText"
      size="sm"
      title="WIRe Revisions Subscription"
      title-class="modal-header-title"
      @ok="toggleSubscription"
    >
      <div id="subscribe-modal-text">
        <p>
          Email subscribers receive a notification when a new revision takes
          place.
        </p>
        <p>
          Choose the "{{ this.buttonText }}" button below to
          <span v-if="this.isSubscribed">stop receiving</span>
          <span v-else>receive</span>
          email at <span class="text-bold">{{ this.user.email }}</span>
        </p>
      </div>
    </b-modal>
  </div>
</template>

<script>
import axios from "axios";
import { mapState, mapMutations } from "vuex";

export default {
  name: "SubscribeRevisions",
  methods: {
    ...mapMutations("user", ["updateRevisionsSubscription"]),
    toggleSubscription() {
      axios.patch("/my_wire/revisions_subscription").then((response) => {
        this.updateRevisionsSubscription();
        this.$wireNotification({
          title: "Revisions Subscription Updated",
          duration: 5000,
          text: "Your subscription to the WIRe revisions has been updated.",
          type: "success",
        });
      });
    },
  },

  computed: {
    ...mapState("user", ["user", "loading"]),
    ...mapState("metadata", ["name"]),
    buttonText() {
      return this.isSubscribed ? "Unsubscribe Me" : "Subscribe Me";
    },
    isSubscribed() {
      return this.user.revisions_subscriber;
    },
  },
};
</script>
<style scoped lang="scss">
.fa-star-o {
  font-size: $font-size-3;
}
/deep/ .modal-header-title {
  color: $pri-800;
  font-size: $font-size-5;
}
</style>
