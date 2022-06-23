<template>
  <div
    ref="scrollTopButton"
    class="
      invisible
      sticky
      w-full
      flex
      justify-end
      bottom-0
      pb-3
      pr-5
      lg:pr-16
      transition
    "
  >
    <button
      @click="scrollToTop"
      role="button"
      aria-label="scroll to the top of the page"
      title="scroll to the top of the page"
    >
      <ChevronUpIcon
        class="
          h-8
          w-8
          p-1
          bg-mission-blue
          dark:bg-slate-700
          energy:bg-gray-700
          text-mission-gray
          dark:text-teal-300
          energy:text-energy-yellow
          rounded-full
        "
      />
    </button>
  </div>
</template>

<script>
import { ChevronUpIcon } from "@heroicons/vue/outline";

export default {
  components: {
    ChevronUpIcon,
  },
  mounted() {
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    handleScroll() {
      const scrollBtn = this.$refs.scrollTopButton;

      if (window.scrollY > 0) {
        scrollBtn.classList.remove("invisible");
      } else {
        scrollBtn.classList.add("invisible");
      }
    },
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  },
};
</script>

<style scoped lang="scss">
</style>
