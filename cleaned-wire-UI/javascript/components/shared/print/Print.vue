<template>
  <div>
    <b-button
      v-if="button"
      v-b-modal.social-print-edition
      @click="loadModal"
      data-usage="print-edition"
    >
      <img :src="require('@assets/select.svg')" class="mr-2" /> Select to Print
    </b-button>
    <b-dd-item-button
      v-else
      v-b-modal.social-print-edition
      @click="loadModal"
      data-usage="print-edition"
    >
      <img :src="require('@assets/select.svg')" class="mr-2" /> Select to Print
    </b-dd-item-button>
  </div>
</template>

<script>
import PrintModal from "./PrintModal";
import printMixin from "./printMixin";

export default {
  name: "Print",
  components: { PrintModal },
  props: ["button"],
  mixins: [printMixin],
};
</script>

<style scoped lang="scss">
img {
  height: 16px;
  width: 16px;
}
</style>
