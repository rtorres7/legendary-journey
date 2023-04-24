<template>
  <div class="mt-6 standard-page-margin failure-report">
    <vanity-title title="Authentication Failure Report"></vanity-title>

    <b-container v-if="!loading" fluid class="mt-4 mb-8">
      <b-row class="failure-date mt-6">
        {{ formatFailureStamp(report.failure.created_at) }}
      </b-row>
      <b-row class="pb-8">
        <span class="authen-status mt-3">
          <img
            v-if="report.can_authenticate"
            :src="require('@assets/check-icon.svg')"
            class="check-icon"
          />
          <img
            v-else
            :src="require('@assets/delete-icon-dark.svg')"
            class="check-icon"
          />
          {{ authenticateMessage }}
        </span>
      </b-row>

      <b-row>
        <b-col cols="24">
          <h2 class="failure-title row-separator pb-4 mr-7">
            Authentication Error Information
            <span class="failure-parens">(Presented in Request)</span>
          </h2>

          <div
            v-for="(authError, ind) in errorInfo"
            v-bind:key="ind"
            class="separator mr-7"
          >
            <b-row align-h="start" class="align-items-center">
              <b-col cols="5" class="authentication-subhead">{{
                authError.heading
              }}</b-col>
              <b-col>{{ authError.value }}</b-col>
            </b-row>
          </div>

          <div class="separator mr-7">
            <b-row align-h="start" class="align-items-center">
              <b-col cols="5" class="authentication-subhead">USER</b-col>
              <b-col v-if="report.user">
                <router-link :to="'/admin/users/' + report.failure.user_id">
                  {{ report.user }}
                </router-link></b-col
              >
              <b-col v-else
                >We were unable to locate a user for this request</b-col
              >
            </b-row>
          </div>

          <h2
            class="failure-title align-itms-center row-separator pb-4 mt-8 mr-7"
          >
            User Attributes in Request
          </h2>
          <div v-if="report.blank_attributes">
            No User Attributes Provided in This Request
          </div>
          <div v-else>
            <div
              v-for="(item, key) in report.user_attributes"
              v-bind:key="key"
              class="separator mr-7"
            >
              <b-row align-h="start" class="align-items-center">
                <b-col cols="5" class="authentication-subhead">{{
                  key.replace("_", " ")
                }}</b-col>
                <b-col>{{ item }}</b-col>
              </b-row>
            </div>
          </div>

          <h2
            class="failure-title align-itms-center row-separator pb-4 mt-8 mr-7"
          >
            Certificate in Request
          </h2>
          <div v-if="!report.certificate_present">
            No Certificate Provided in Request
          </div>
          <div v-else>
            <div
              v-for="(item, key) in report.certificate_info"
              v-bind:key="key"
              class="separator mr-7"
            >
              <b-row align-h="start" class="align-items-center">
                <b-col cols="5" class="authentication-subhead">{{
                  key.replace("_", " ")
                }}</b-col>
                <b-col
                  cols="8"
                  v-if="key == 'certificate'"
                  class="certificate"
                  >{{ item }}</b-col
                >
                <b-col v-else>{{ item }}</b-col>
              </b-row>
            </div>
          </div>
        </b-col>

        <b-col cols="24">
          <div class="d-flex failure-title row-separator mt-8 mr-7">
            <h2>
              Current LDAP Information from FSD
              <span class="failure-parens pl-1"> (Queried by CN)</span>
            </h2>
            <b-btn
              class="ml-auto mb-2"
              @click="
                fsdLookup(
                  report.failure.certificate,
                  report.failure.user_identifier
                )
              "
              variant="secondary"
              >Find in FSD</b-btn
            >
          </div>

          <div v-if="!report.subject_attributes_present">
            No Certificate Found for cn {{ report.failure.cn }}
          </div>
          <div v-else>
            <div
              v-for="(item, key) in report.subject_attributes"
              v-bind:key="key"
              class="separator mr-7"
            >
              <b-row align-h="start" class="align-items-center">
                <b-col cols="5" class="authentication-subhead">{{ key }}</b-col>
                <b-col v-if="key == 'valid_certificates'" class="certificate">{{
                  item.join(",")
                }}</b-col>
                <b-col v-else>{{ item.join(", ") }}</b-col>
              </b-row>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import axios from "axios";
import VanityTitle from "../../vanity/VanityTitle";

export default {
  name: "AuthenticationFailureDetails",
  components: {
    VanityTitle,
  },
  props: {
    failureID: null,
  },
  data() {
    return {
      report: {},
      loading: true,
    };
  },
  mounted() {
    axios
      .get(`/admin/authentication_failures/${this.$route.params.id}`)
      .then((response) => {
        this.report = response.data;
        this.loading = false;
      });
  },
  computed: {
    authenticateMessage() {
      let result = this.report.can_authenticate
        ? "Authenticated"
        : "Not authenticated";
      return `${result} as of ${this.$moment().format(
        "YYYY-MM-DD HH:mm:ss"
      )} with the original request data.`;
    },
    errorInfo() {
      return [
        { heading: "URI", value: this.report.failure.uri },
        {
          heading: "USER _temp_39",
          value: this.report.failure.user_identifier,
        },
        {
          heading: "SESSION _temp_39",
          value: this.report.failure.session_identifier,
        },
        { heading: "IP", value: this.report.failure.ip },
        {
          heading: "ERROR MESSAGES",
          value: this.report.failure.error_messages,
        },
      ];
    },
  },
  methods: {
    fsdLookup(cert, cn) {
      this.$router.push({ name: "FSDTool", params: { cn: cn, cert: cert } });
    },
    formatFailureStamp(dateTime) {
      return this.$moment(dateTime, "YYYY/MM/DD HH:mm:ss ZZ").format(
        "MMMM DD, YYYY HH:mm"
      );
    },
  },
};
</script>
<style scoped lang="scss">
.certificate {
  font-family: "Courier New", Courier, monospace;
  font-size: $font-size-1;
  color: $alt-700;
}
.failure-title {
  font-family: $font-family-heading;
  font-size: $font-size-6;
  color: $pri-600;
}
.failure-parens {
  font-family: $font-family-heading;
}
.row-separator {
  border-bottom: 2px solid $alt-400;
}
.separator {
  border-bottom: 1px solid $alt-400;
}
.failure-date {
  font-family: $font-family-heading;
  font-size: $font-size-6;
  color: $pri-600;
  font-weight: 300;
}
.authentication-subhead {
  color: $alt-800;
  text-transform: uppercase;
  background-color: $alt-200;
  padding: 0.5rem 0.5rem 0.5rem;
  margin-right: 1rem;
}
.check-icon {
  height: 14px;
  width: 14px;
}
.authen-status {
  color: $alt-800;
  font-style: italic;
}
</style>
