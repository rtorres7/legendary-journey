<template>
  <span>
    <b-button
      :aria-label="'delete ' + label"
      @click="requestConfirm"
      v-if="!confirm && useIcon"
      size="sm"
      class="delete-button"
      ><span><img :src="resetImage" :alt="`delete ${type}`" /></span>
      <span class="sr-only">Delete {{ label }}</span>
    </b-button>
    <b-btn
      class="ml-auto p-0"
      variant="link"
      type="submit"
      @click="requestConfirm"
      v-if="!confirm && !useIcon"
      >Delete <span class="sr-only">{{ label }}</span></b-btn
    >
    <b-button
      :aria-label="`are you sure you want to delete ${label} ${type}`"
      @click="sendDelete"
      variant="danger"
      ref="confirmDeleteButton"
      v-if="confirm"
      >Confirm deletion?
    </b-button>
    <b-button
      class="mx-0"
      size="sm"
      v-if="confirm"
      variant="link"
      @click="confirm = false"
    >
      Cancel<span class="sr-only">{{ " " + label + " " + type }} deletion</span>
    </b-button>
  </span>
</template>

<script>
import Reset from "@/assets/reset.svg";

export default {
  name: "DeleteButtonBase",
  props: {
    type: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: "Entity",
    },
    useIcon: {
      default: true,
    },
  },
  data() {
    return {
      confirm: false,
      resetImage: Reset,
    };
  },

  methods: {
    requestConfirm() {
      this.confirm = true;
      this.$nextTick(
        function () {
          this.$refs.confirmDeleteButton.focus();
        }.bind(this)
      );
    },
    sendDelete() {
      this.$emit("deleteButtonEvent");
      this.confirm = false;
    },
  },
};
</script>

<style scoped>
img {
  height: 16px;
  width: 16px;
}

.delete-button {
  background-color: white;
  border-color: white;
}
</style>
