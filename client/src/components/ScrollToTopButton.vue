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
import { ChevronUpIcon } from "@heroicons/vue/outline";

export default {
  components: {
    ChevronUpIcon,
  },
  setup() {
    const scrollTopButton = ref(null);
    const hasStartedScrolling = ref(false);
    const currentScrollPosition = ref(0);
    const previousScrollPosition = ref(0);

    const handleScroll = () => {
      if (hasStartedScrolling.value) {
        previousScrollPosition.value = currentScrollPosition.value;
        currentScrollPosition.value = window.scrollY;

        if (currentScrollPosition.value === 0) {
          scrollTopButton.value.classList.add("invisible");
        } else {
          //Detecting scroll direction
          if (currentScrollPosition.value > previousScrollPosition.value) {
            scrollTopButton.value.classList.add("invisible");
          } else {
            scrollTopButton.value.classList.remove("invisible");
          }
        }
      } else {
        currentScrollPosition.value = window.scrollY;
        hasStartedScrolling.value = true;
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
