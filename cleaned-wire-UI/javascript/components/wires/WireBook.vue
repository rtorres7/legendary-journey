<template>
  <div class="standard-page-margin" id="edit_wire" v-if="!loading">
    <vanity-title title="Table of Contents" />
    <div v-if="canManageWire" class="row wire-edit card-primary">
      <b-col cols="17" md="24" lg="17">
        <b-row class="mt-6">
          <b-col class="pt-3">
            <WireDatePicker :date="selectedDate" />
          </b-col>
          <b-col>
            <WireStatus :wire="wire" @wireUpdated="updateWire" />
          </b-col>
          <b-col class="ml-7">
            <WireNotifications :wire="wire" />
          </b-col>
        </b-row>
        <Spinner v-if="working" />
        <div v-else>
          <ArticlesForBook :wire="wire" />
        </div>
      </b-col>

      <b-col cols="7" md="24" lg="7">
        <div class="ml-7" id="sideBar">
          <WireArticleUploader />
          <AddExistingArticles />
          <PublishedArticles :wire="wire" />
        </div>
      </b-col>
    </div>
    <div v-else>
      <NotFound />
    </div>
  </div>
</template>

<script>
import AddExistingArticles from "./AddExistingArticles";
import ArticlesForBook from "./ArticlesForBook";
import PublishedArticles from "./PublishedArticles";
import WireArticleUploader from "./WireArticleUploader";
import WireDatePicker from "./WireDatePicker";
import WireNotifications from "./WireNotifications";
import WireStatus from "./WireStatus";
import NotFound from "@shared/errors/NotFound";
import Spinner from "../shared/Spinner";
import VanityTitle from "../vanity/VanityTitle";
import axios from "axios";
import { mapGetters } from "vuex";

export default {
  name: "WireBook",
  components: {
    Spinner,
    AddExistingArticles,
    ArticlesForBook,
    PublishedArticles,
    WireArticleUploader,
    WireDatePicker,
    WireNotifications,
    WireStatus,
    VanityTitle,
    NotFound,
  },
  data() {
    return {
      working: false,
      wire: {
        id: "",
        features: [],
        publication_date: "",
        state: "pending",
      },
    };
  },
  mounted() {
    this.wire.publication_date = this.selectedDate;
    this.loadWire();
  },
  destroyed() {
    this.$bus.$off("featureUpdated");
  },
  computed: {
    ...mapGetters("user", ["canManageWire", "loading"]),
    selectedDate() {
      return this.$route.query.date || this.$route.params.date;
    },
  },
  methods: {
    loadWire() {
      this.working = true;
      axios
        .get(this.$route.fullPath)
        .then((response) => {
          this.wire = response.data.wire;
          this.working = false;
          this.$nextTick(() => {
            if (document.querySelector("#wireDatePickerBtn")) {
              document.querySelector("#wireDatePickerBtn").focus();
            }
          });
          this.$bus.$off("featureUpdated");
          this.$bus.$on("featureUpdated", () => {
            this.loadWire();
          });
        })
        .catch((e) => {
          console.error(e);
          this.working = false;
        });
    },
    updateWire(updatedWire) {
      this.wire.state = updatedWire.state;
    },
  },
  watch: {
    $route() {
      this.loadWire();
    },
  },
};
</script>

<style scoped lang="scss">
.calendar-icon {
  height: 24px;
  width: 30px;
  &:hover {
    box-shadow: 0 5px 2px rgba(0, 0, 0, 0.25);
  }
}

::v-deep h1 {
  font-size: $font-size-9;
  color: $pri-900;
  margin-bottom: 0;
}

#sideBar {
  min-width: 365px;
}
</style>
