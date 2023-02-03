<template>
  <div
    ref="scrollTopButton"
    class="invisible sticky w-full flex justify-end bottom-0 pb-3 transition"
  >
    <button
      role="button"
      aria-label="scroll to the top of the page"
      title="Back to Top"
      @click="scrollToTop"
    >
      <ChevronUpIcon
        class="h-8 w-8 p-1 bg-dark-space-blue dark:bg-slate-700 energy:bg-zinc-700 text-mission-gray dark:text-teal-300 energy:text-energy-yellow rounded-full"
      />
    </button>
  </div>
</template>
<script>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { ChevronUpIcon } from "@heroicons/vue/24/outline";

export default {
  components: {
    ChevronUpIcon,
  },
  setup() {
    const scrollTopButton = ref(null);
    const currentScrollPosition = ref(0);
    const previousScrollPosition = ref(0);
    const targetScrollPosition = ref(0);
    const resetTarget = ref(true);

    const handleScroll = () => {
      previousScrollPosition.value = currentScrollPosition.value;
      currentScrollPosition.value = window.scrollY;
      if (currentScrollPosition.value < previousScrollPosition.value) {
        // User is scrolling up
        if (resetTarget.value) {
          targetScrollPosition.value = window.scrollY - 500;
          resetTarget.value = false;
        }
        if (currentScrollPosition.value === 0) {
          scrollTopButton.value.classList.add("invisible");
        } else {
          if (currentScrollPosition.value < targetScrollPosition.value) {
            scrollTopButton.value.classList.remove("invisible");
          }
        }
      } else {
        // User is scrolling down
        scrollTopButton.value.classList.add("invisible");
        resetTarget.value = true;
      }
    };

    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    onMounted(() => {
      window.addEventListener("scroll", handleScroll);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("scroll", handleScroll);
    });

    return {
      scrollTopButton,
      scrollToTop,
    };
  },
};
</script>
<style scoped lang="scss"></style>
