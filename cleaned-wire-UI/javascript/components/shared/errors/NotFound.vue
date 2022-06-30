<template>
  <div>
    <Error
      number="404"
      subtitle="The page you were looking for appears to have been moved, deleted or does not exist."
    >
    </Error>
  </div>
</template>

<script>
import Error from "@shared/errors/Error";

export default {
  name: "NotFound",
  components: { Error },
};
</script>
