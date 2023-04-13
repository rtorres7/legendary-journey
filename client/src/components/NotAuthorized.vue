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
import { EnvelopeIcon } from "@heroicons/vue/24/outline";

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
    const userAccess = () => {
      if (props.product?.status === 403) {
        let document = props.product.document;
        return `affiliated with ${
          document.needed.orgs.slice(0, -1).join(", ") +
          " and " +
          document.needed.orgs.slice(-1)
        }`;
      } else if (props.product?.org_restricted) {
        return `affiliated with ${
          props.product.needed.orgs.slice(0, -1).join(", ") +
          " and " +
          props.product.needed.orgs.slice(-1)
        }`;
      }
      return "who have the required accesses";
    };

    return {
      metadata,
      userAccess,
    };
  },
};
</script>

<style></style>
