<template>
  <span>
    press
    <span class="sr-only">alt</span>
    {{ hotkey }} to {{ description }}
  </span>
</template>

<script>
export default {
  name: "HotkeyText",
  props: ["hotkey", "description"],
};
</script>

<style scoped></style>
