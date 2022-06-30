<template>
  <div>
    <Error
      number="502"
      subtitle="The request was not completed. The server received an invalid response from the upstream server."
    >
    </Error>
  </div>
</template>

<script>
import Error from "@shared/errors/Error";

export default {
  name: "BadGateway",
  components: { Error },
};
</script>
