<template>
  <div>
    <Error
      number="408"
      subtitle="The request took longer than the server was prepared to wait."
    >
    </Error>
  </div>
</template>

<script>
import Error from "@shared/errors/Error";

export default {
  name: "RequestTimeout",
  components: { Error },
};
</script>
