<template>
  <div class="mx-auto w-3/5 h-screen my-6 text-lg text-center">
    <p class="text-4xl font-semibold">
      Error
      <span
        class="text-mission-blue dark:text-teal-400 energy:text-energy-yellow"
        >404</span
      >
      Oops! Something went wrong.
    </p>
    <p class="font-light mt-6">
      The page you were looking for appears to have been moved, deleted or does
      not exist. If you typed the URL into your browser, check that you entered
      it correctly. If you reached this page from another part of the site,
      please contact us so we can correct the problem.
    </p>
    <p class="font-light mt-6">
      <em>Need Help?</em> Submit a ticket to
      <a
        :href="`${metadata.user_support.help_url}`"
        class="text-mission-light-blue dark:text-teal-400 energy:text-energy-yellow flex items-center hover:underline w-fit m-0 md:m-auto"
      >
        NCTC {{ metadata.application_name }} Online User Support
        <HelpIcon class="h-5 w-5 m1-1" aria-hidden="true" />
      </a>
    </p>
    <p class="font-light mt-6">
      <em>Access Issues?</em> NCTC {{ metadata.application_name }}
      {{ metadata.user_support.access_text }}
      <a
        :href="`${metadata.user_support.access_url}`"
        class="text-mission-light-blue dark:text-teal-400 energy:text-energy-yellow flex items-center hover:underline w-fit m-0 md:m-auto"
      >
        Request Enterprise Entitlements
        <HelpIcon class="h-5 w-5 m1-1" aria-hidden="true" />
      </a>
    </p>
  </div>
</template>

<script>
import { inject } from "vue";
export default {
  name: "NotFound",
  setup() {
    const metadata = inject("metadata");
    return {
      metadata,
    };
  },
};
</script>

<style></style>
