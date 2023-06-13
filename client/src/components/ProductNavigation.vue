<template>
  <div
    class="no-print flex flex-wrap justify-between py-4 mb-4 border-b-2 border-slate-900/10 dark:border-slate-50/[0.06] energy:border-gray-700/25"
  >
    <div>
      <MaxButton tabIndex="0" @click="returnHome" @keyup.enter="returnHome">
        Home
      </MaxButton>
    </div>
    <div
      class="flex flex-wrap sm:absolute sm:space-x-4 sm:left-1/2 sm:-translate-x-1/2"
    >
      <div>
        <template v-if="!navigation.previousProduct">
          <MaxButton disabled> Previous </MaxButton>
        </template>
        <template v-else>
          <MaxButton
            tabIndex="0"
            @click="goToProduct(navigation.previousProduct)"
            @keyup.enter="goToProduct(navigation.previousProduct)"
          >
            Previous
          </MaxButton>
        </template>
      </div>
      <div class="hidden self-center truncate text-sm mr-2 md:block">
        Featured Product {{ navigation.currentProduct.position }} of
        {{ navigation.totalProducts }}
      </div>
      <div class="self-center truncate text-sm mx-2 md:hidden">
        {{ navigation.currentProduct.position }} of
        {{ navigation.totalProducts }}
      </div>
      <div>
        <template v-if="!navigation.nextProduct">
          <MaxButton disabled> Next </MaxButton>
        </template>
        <template v-else>
          <MaxButton
            tabIndex="0"
            @click="goToProduct(navigation.nextProduct)"
            @keyup.enter="goToProduct(navigation.nextProduct)"
          >
            Next
          </MaxButton>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";

export default {
  props: {
    navigation: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();

    console.log("navigation: ", props.navigation);

    const returnHome = () => {
      router.push({ name: "home" });
    };

    const goToProduct = ({ doc_num }) => {
      router.push({
        name: "product",
        params: {
          doc_num,
        },
      });
    };

    return {
      returnHome,
      goToProduct,
    };
  },
};
</script>

<style lang="scss"></style>
