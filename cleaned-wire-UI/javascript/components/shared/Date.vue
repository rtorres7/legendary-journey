<template>
  <div class="pr-5">
    <div class="wire-date pl-3" v-if="date">
      <div class="days pb-1 pt-1">{{ date | moment("DD") }}</div>
      <div class="months">{{ date | moment("MMM") }}</div>
      <div class="years" v-if="fullDate">{{ date | moment("YYYY") }}</div>
    </div>
    <div class="wire-date" v-else>&nbsp;</div>
  </div>
</template>

<script>
import { isEmpty } from "lodash";
export default {
  name: "Date",
  props: {
    fullDate: {
      type: Boolean,
    },
    documentDate: {},
  },
  computed: {
    date() {
      if (isEmpty(this.documentDate)) {
        return;
      }
      return this.$moment(this.documentDate);
    },
  },
};
</script>

<style scoped lang="scss">
div {
  color: $alt-800;
  font-weight: 400;
  line-height: 1.1rem;
  text-align: center;
}
.wire-date {
  border-left: solid 3px $alt-600;
  font-weight: 500;
}
.days {
  font-size: $font-size-6;
}

.months {
  font-size: $font-size-3;
}

.years {
  font-size: $font-size-2;
}
</style>
