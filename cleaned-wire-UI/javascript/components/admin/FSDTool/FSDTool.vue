<template>
  <div class="mt-6 pb-6 standard-page-margin">
    <vanity-title title="Admin FSD" />
    <b-container fluid>
      <b-row>
        <div class="mt-6">
          Search for a user on the
          <a target="blank" href="_temp_525icwhitepages.intelink._temp_0/"
            >White Pages</a
          >. Then click Display in base64 format under the Signing Certificate,
          copy and paste the results in the large box, or copy a users DN or CN
          into the small box below.
        </div>

        <b-col cols="24" lg="8" class="mt-6 mr-8">
          <b-form @submit.prevent="onSubmit">
            <b-form-group>
              <label>CN or DN</label>
              <b-input aria-label="CN or DN" v-model="cn" autofocus />
            </b-form-group>
            <b-form-group>
              <label>Base 64 Certificate</label>
              <b-form-textarea
                aria-live="polite"
                v-model="b64Cert"
                class="form-control"
                rows="10"
              ></b-form-textarea>
            </b-form-group>
            <b-btn variant="primary" type="submit">Submit</b-btn>
            <b-btn variant="secondary" class="ml-2" @click="clearForm()"
              >Clear</b-btn
            >
          </b-form>
        </b-col>

        <b-col>
          <div v-if="fsdResults">
            <h2 class="separator mt-6">Results</h2>
            <label class="mb-4" v-if="fsdResults.Error">
              {{ errorString }}
            </label>
            <div class="mb-6" v-else>
              <div
                v-for="(item, key) in fsdResults"
                v-bind:key="key"
                class="mb-2 separator mr-7"
              >
                <b-row align-h="start" class="align-items-center">
                  <b-col class="authentication-subhead" cols="6">{{
                    key
                  }}</b-col>
                  <b-col>{{ item.join(", ") }}</b-col>
                </b-row>
              </div>
            </div>
            <div>
              <a
                href="_temp_525intellipedia.intelink._temp_0/wiki/FSD_schema"
                target="_blank"
                >FSD Schema</a
              >
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
import { isEmpty } from "lodash";

export default {
  name: "FSDTool",
  props: {},
  components: {
    VanityTitle,
  },
  data() {
    return {
      cn: "",
      b64Cert: "",
      fsdResults: null,
    };
  },
  computed: {
    errorString() {
      return this.fsdResults.Error.join("<br>");
    },
  },
  mounted() {
    if (this.$route.params) {
      this.cn = this.$route.params.cn;
      this.b64Cert = this.$route.params.cert;
      if (!isEmpty(this.cn) || !isEmpty(this.b64Cert)) {
        this.onSubmit();
      }
    }
  },
  methods: {
    clearForm() {
      this.cn = "";
      this.b64Cert = "";
    },
    onSubmit() {
      axios
        .post("/admin/fsd/query.json", { cert: this.b64Cert, cn: this.cn })
        .then((response) => {
          this.fsdResults = response.data;
        });
    },
    formatTimeStamp(dateTime) {
      return this.$moment(dateTime, "YYYY/MM/DD hh:mm:ss ZZ").format(
        "YYYY-MM-DD HH:mm"
      );
    },
  },
};
</script>
<style scoped lang="scss">
label {
  color: $alt-800;
  font-style: italic;
  justify-content: left;
}
.separator {
  border-bottom: 1px solid $alt-400;
  margin-bottom: 5px;
}
.header {
  text-transform: uppercase;
}
.authentication-subhead {
  color: $alt-800;
  text-transform: uppercase;
  background-color: $alt-200;
  padding: 0.5rem 0.5rem 0.5rem;
  margin-right: 1rem;
}
</style>
