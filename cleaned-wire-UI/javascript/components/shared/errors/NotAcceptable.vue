<template>
  <div>
    <Error
      number="406"
      subtitle="The server can only generate a response that is not accepted by the client."
    >
    </Error>
  </div>
</template>

<script>
import Error from "@shared/errors/Error";

export default {
  name: "NotAcceptable",
  components: { Error },
};
</script>
