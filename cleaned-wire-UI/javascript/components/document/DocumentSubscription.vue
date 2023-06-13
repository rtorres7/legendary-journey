<template>
  <div v-if="!loading">
    <b-button v-b-modal.subscribe-product data-usage="daily-subscription">
      <template v-if="subscribed">
        <span class="fa fa-star mr-2"></span> Unsubscribe<span class="sr-only">
          from discussion</span
        >
      </template>
      <template v-else>
        <span class="fa fa-star-o mr-2"></span> Subscribe<span class="sr-only">
          to discussion</span
        >
      </template>
    </b-button>
    <b-modal
      id="subscribe-product"
      :ok-title="buttonText"
      size="md"
      title="Product Comment Subscription"
      title-class="modal-header-title"
      @ok="toggleSubscription"
    >
      <div id="subscribe-modal-text">
        <p v-if="!subscribed">
          If you would like to receive all public comments to this product,
          click the "{{ this.buttonText }}" button below.
        </p>
        <p>
          <span v-if="subscribed"
            >You are currently subscribed to receive all public comments to this
            product.</span
          >
          <span v-else
            >An _temp_37 will be sent to <b>{{ this.user._temp_37 }}</b> each
            time a public comment is added to this product.</span
          >
        </p>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "DocumentSubscription",
  props: {
    subscribed: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    ...mapState("user", ["user", "loading"]),
    buttonText() {
      return this.subscribed ? "Unsubscribe Me" : "Subscribe Me";
    },
  },

  methods: {
    toggleSubscription() {
      this.$store.dispatch("document/toggleSubscription", {
        docNum: this.$route.params["docNum"],
        caller: this,
      });
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
