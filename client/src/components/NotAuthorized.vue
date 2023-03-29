<template>
  <div class="mx-auto w-3/5 h-screen my-6 text-lg text-center">
    <p class="text-4xl font-semibold">
      Error
      <span
        class="text-mission-blue dark:text-teal-400 energy:text-energy-yellow"
        >403</span
      >
      You don't have access to this page.
    </p>
    <p class="font-light mt-6">
      The page you are attempting to access is limited to users
      {{ userAccess() }}. If you reached this page from another part of the
      site, please contact us to correct the problem.
    </p>
    <br />
    <p>NCTC/DI Managing Editor, NCTC Current</p>
    <p>
      U:
      <span
        class="text-mission-light-blue dark:text-teal-400 energy:text-energy-yellow"
        >(571)280-3627</span
      >
      S:
      <span
        class="text-mission-light-blue dark:text-teal-400 energy:text-energy-yellow"
        >93-24533</span
      >
    </p>
    <br />
    <p>ITS Help -24/7 Support</p>
    <a
      :href="`mailto:${metadata.footer_contact.email}`"
      class="text-mission-light-blue dark:text-teal-400 energy:text-energy-yellow flex items-center hover:underline w-fit m-0 md:m-auto"
    >
      {{ metadata.footer_contact.email }}
      <EnvelopeIcon class="h-5 w-5 m1-1" aria-hidden="true" />
    </a>
  </div>
</template>

<script>
import { metadata } from "@/config";
import { watch } from "vue";
import { useRoute } from "vue-router";
import { EnvelopeIcon } from "@heroicons/vue/24/outline";
import { hasProductAccess } from "@/helpers";

export default {
  components: {
    EnvelopeIcon,
  },
  props: {
    product: {
      type: Object,
      default: () => {},
    },
  },
  setup(props) {
    const route = useRoute();
    //const router = useRouter();
    const userAccess = () => {
      if (props.product.status === 403) {
        let document = props.product.document;
        return `affiliated with ${
          document.needed.orgs.slice(0, -1).join(", ") +
          " and " +
          document.needed.orgs.slice(-1)
        }`;
      }
      if (!hasProductAccess(props.product)) {
        return `affiliated with ${
          props.product.needed.orgs.slice(0, -1).join(", ") +
          " and " +
          props.product.needed.orgs.slice(-1)
        }`;
      }
      return "who have the required accesses";
    };

    //TODO: I'd label this is as a 'hack' that forces a reload when navigating via the browser's history to avoid a blank page
    // It's worth looking into this at some point in the future to evaluate.
    watch(
      () => route.query,
      () => {
        window.location.reload();
      }
    );

    return {
      metadata,
      userAccess,
    };
  },
};
</script>

<style></style>
