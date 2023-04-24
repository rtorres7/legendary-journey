<template>
  <div class="d-flex">
    <div>
      <img :src="require('@assets/filter.svg')" class="omni-search-icon" />
    </div>
    <div class="ml-4 flex-grow-1 row">
      <div class="col-17">
        <span v-html="htmlText"></span>
        <div class="pl-3">
          <em><span v-html="data.subtext" /></em>
        </div>
      </div>
      <div class="col-7 text-right">
        <em><span v-html="data.filter_display_type" /></em>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "FilterableResult",
  props: ["htmlText", "data"],
};
</script>
