<template>
  <form class="mb-8 text-left" @submit.prevent="onSubmit">
    <label for="comment" class="inline-block font-semibold pb-4">Leave a Comment:</label>
    <textarea
      id="comment"
      v-model="comment"
      class="
        bg-transparent
        border-2 border-slate-400
        block
        mb-4
        p-2
        resize-none
        w-full
      "
      maxlength="4000"
      required
      rows="2"
    />
    <input
      id="acknowledgement"
      v-model="acknowledgement"
      class="cursor-pointer"
      required
      type="checkbox"
    >
    <label for="acknowledgement" class="p-2 text-sm">I acknowledge that my comment is professional in nature and adheres to
      the commenting guidelines.</label>
    <select
      id="classification"
      v-model="classification"
      aria-label="Please select classification for your comment."
      class="
        block
        bg-transparent
        border-b-2 border-slate-400
        cursor-pointer
        mt-8
        text-sm
      "
      required
    >
      <option value="" disabled hidden>
        Please Classify...
      </option>
      <option value="U" class="dark:text-black energy:text-black">
        Unclassified
      </option>
      <option value="notU" class="dark:text-black energy:text-black">
        Not Unclassified
      </option>
    </select>
    <input
      type="submit"
      value="Submit Comment"
      class="
        bg-mission-blue
        dark:bg-slate-700/80
        energy:bg-zinc-700/80
        cursor-pointer
        hover:opacity-80
        mt-8
        p-2
        rounded-md
        shadow-md
        text-white text-sm
      "
    >
  </form>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const acknowledgement = ref(false);
    const comment = ref();
    const classification = ref();

    return {
      acknowledgement,
      comment,
      classification,
    };
  },
  methods: {
    onSubmit() {
      if (
        this.comment === "" ||
        !this.acknowledgement ||
        this.classification === ""
      ) {
        return;
      }

      let productComment = {
        comment: this.comment,
        acknowledgement: this.acknowledgement,
        classification: this.classification,
      };
      this.$emit("comment-submitted", productComment);

      this.comment = "";
      this.acknowledgement = false;
      this.classification = "";
    },
  },
};
</script>

<style lang="scss">
</style>
