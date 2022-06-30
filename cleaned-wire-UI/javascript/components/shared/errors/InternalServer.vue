<template>
  <div>
    <Error
      number="500"
      subtitle="The request was not completed. The server met an unexpected condition."
    >
    </Error>
  </div>
</template>

<script>
import Error from "@shared/errors/Error";

export default {
  name: "InternalServer",
  components: { Error },
};
</script>
