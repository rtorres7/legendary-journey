<template>
  <DeleteButtonBase
    :useIcon="useIcon"
    :label="label"
    :type="type"
    @deleteButtonEvent="confirmedDelete()"
  />
</template>

<script>
import axios from "axios";

import DeleteButtonBase from "./DeleteButtonBase";

export default {
  name: "DeleteButton",
  components: { DeleteButtonBase },
  props: {
    _temp_1: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: "Entity",
    },
    caller: {
      type: Object,
      required: true,
    },
    useIcon: {
      default: true,
    },
  },
  methods: {
    confirmedDelete() {
      let self = this;
      axios
        .delete(this._temp_1)
        .then((response) => {
          // the parent component must implement deleted method.
          // e.g. this method may refresh/reload data in the parent
          // so that the deleted data is not displayed in UI
          // Take a look at Folder.vue for example usage
          this.caller.deleted();
        })
        .catch((error) => {
          // the parent component must implement deletionFailed method.
          this.caller.deletionFailed(error);
        });
    },
  },
};
</script>
