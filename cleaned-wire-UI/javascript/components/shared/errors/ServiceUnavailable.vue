<template>
  <div>
    <Error
      number="503"
      subtitle="The request was not completed. The server is temporarily overloading or down."
    >
    </Error>
  </div>
</template>

<script>
import Error from "@shared/errors/Error";

export default {
  name: "ServiceUnavailable",
  components: { Error },
};
</script>
