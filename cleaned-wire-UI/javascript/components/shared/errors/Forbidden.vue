<template>
  <div>
    <Error number="403" subtitle="Access is forbidden to the requested page.">
    </Error>
  </div>
</template>

<script>
import Error from "@shared/errors/Error";

export default {
  name: "Forbidden",
  components: { Error },
};
</script>
