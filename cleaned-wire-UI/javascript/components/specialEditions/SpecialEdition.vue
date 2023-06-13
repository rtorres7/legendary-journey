<template>
  <div>
    <div v-if="notFound">
      <NotFound />
    </div>
    <div
      v-else-if="!edition"
      class="d-flex justify-content-center align-items-center loading-area"
    >
      <spinner />
    </div>
    <div v-else class="mt-6 mb-8 standard-page-margin">
      <vanity-title :title="edition.name" />
      <div class="d-flex justify-content-end">
        <b-btn
          id="se-edit-btn"
          class="mt-4 mr-4"
          v-if="edition.canEdit"
          :variant="confirmDelete ? 'danger' : 'secondary'"
          aria-label="Delete Special Edition"
          @click="
            confirmDelete ? deleteSpecialEdition() : (confirmDelete = true)
          "
          >{{ confirmDelete ? "Confirm deletion?" : "Delete" }}</b-btn
        >
        <b-button
          class="mt-4 mr-4"
          v-if="confirmDelete"
          variant="link"
          @click="confirmDelete = false"
        >
          Cancel
        </b-button>
        <b-btn
          class="mt-4"
          v-if="edition.canEdit"
          variant="primary"
          title="Edit"
          aria-label="Edit Special Edition"
          @click="showEditModal"
          >Edit</b-btn
        >
      </div>
      <div>
        <b-row class="mt-6">
          <b-col cols="16">
            <div
              v-if="loading"
              class="d-flex justify-content-center align-items-center loading-area"
            >
              <spinner />
            </div>
            <div v-else>
              <b-row class="separator pb-6">
                <b-col
                  cols="24"
                  md="12"
                  v-for="product in edition.products"
                  :key="product.id"
                  class="custom-gutter-col"
                >
                  <Card
                    :product="product"
                    section="featured"
                    :return-path="$route.fullPath"
                  ></Card>
                </b-col>
              </b-row>
              <b-row
                v-if="
                  edition.restrictedProducts &&
                  edition.restrictedProducts.length > 0
                "
              >
                <h2 class="pt-4 pb-6">Need More Access To View</h2>
                <b-row>
                  <b-col
                    cols="12"
                    v-for="product in edition.restrictedProducts"
                    :key="product.id"
                    class="custom-gutter-col"
                  >
                    <Card
                      :product="product"
                      section="featured"
                      :return-path="$route.fullPath"
                    ></Card>
                  </b-col>
                </b-row>
              </b-row>
            </div>
            <div class="overflow-auto text-center mt-5 pb-6" v-if="pages > 1">
              <div class="d-flex justify-content-center">
                <b-pagination-nav
                  :link-gen="paginationLink"
                  :number-of-pages="pages"
                  @change="loadSpecialEdition"
                  v-model="currentPage"
                ></b-pagination-nav>
              </div>
            </div>
          </b-col>

          <b-col class="pl-8">
            <b-row class="separator pb-6">
              <h2>Selected Readings</h2>
              <b-row v-for="reading in edition.readings" :key="reading.id">
                <DocumentLink
                  :document="reading"
                  section="featured"
                  class="pt-4 pb-4"
                />
              </b-row>
            </b-row>
            <h2 class="pt-4 pb-2">Key People</h2>
            <b-row
              class="pb-4 separator"
              v-for="person in edition.people"
              :key="person.id"
            >
              <b-col>
                <LeadershipCard :leader="person" />
              </b-col>
            </b-row>
            <div v-if="edition.reporting && edition.reporting.length > 0">
              <h2 class="pt-4">Reporting</h2>
              <div
                v-for="(report, index) in edition.reporting"
                :key="index"
                class="mt-6"
              >
                <div
                  v-if="report.docs && report.docs.length > 0"
                  class="d-flex separator"
                >
                  <b-btn
                    class="pl-0 reporting-title w-100"
                    variant="link"
                    v-b-toggle="'report-accordion-' + index"
                  >
                    <div class="d-flex">
                      {{ report.type }}
                      <WireBackgroundAsset
                        image-name="less-more.svg"
                        class="less-more-image ml-auto"
                        fill
                        :class="{ rotate: report.expanded }"
                      />
                    </div>
                  </b-btn>
                </div>
                <div class="mr-auto">
                  <b-collapse
                    :id="'report-accordion-' + index"
                    v-model="report.expanded"
                  >
                    <DocumentLink
                      v-for="doc in report.docs"
                      :key="doc.id"
                      :document="doc"
                      class="pt-4 pb-4"
                    />
                  </b-collapse>
                </div>
              </div>
            </div>
          </b-col>
        </b-row>
      </div>
    </div>
    <SpecialEditionAddEditModal
      ref="editModal"
      :editFlag="true"
      :specialEdition="edition"
      @specialEditionUpdated="specialEditionUpdated"
    />
  </div>
</template>

<script>
import Card from "../home/featured/Card";
import DocumentLink from "../shared/DocumentLink";
import Spinner from "@shared/Spinner";
import LeadershipCard from "../vanity/LeadershipCard";
import NotFound from "@shared/errors/NotFound";
import SpecialEditionAddEditModal from "./SpecialEditionAddEditModal";
import SiteEnhancementCard from "../home/SiteEnhancementCard";
import VanityTitle from "../vanity/VanityTitle";
import WireBackgroundAsset from "@shared/WireBackgroundAsset";
import axios from "axios";

export default {
  name: "SpecialEdition",
  components: {
    Card,
    DocumentLink,
    LeadershipCard,
    SiteEnhancementCard,
    Spinner,
    VanityTitle,
    WireBackgroundAsset,
    NotFound,
    SpecialEditionAddEditModal,
  },
  data() {
    return {
      pages: 1,
      currentPage: 1,
      loading: true,
      edition: null,
      notFound: false,
      confirmDelete: false,
    };
  },
  mounted() {
    this.loadSpecialEdition();
  },
  watch: {
    $route() {
      this.loadSpecialEdition();
    },
  },
  methods: {
    loadSpecialEdition(pageNum) {
      this.loading = true;
      this.currentPage = pageNum || this.$route.query.page || 1;
      axios
        .get(`/special_editions/${this.$route.params.id}`, {
          params: { page: this.currentPage },
        })
        .then((response) => {
          if (response.data.notFound === true) {
            this.notFound = true;
          } else {
            this.pages = response.data.totalPages;
            this.edition = response.data;
            this.notFound = false;
            this.loading = false;
            this.$nextTick(() => {
              if (this.edition.canEdit) {
                document.querySelector("#se-edit-btn").focus();
              } else {
                document.querySelector(".document_link").parentElement.focus();
              }
            });
          }
        })
        .catch(() => {
          this.notFound = true;
          this.$wireNotification({
            title: "System Alert",
            duration: 5000,
            text: "Unable to load Special Edition",
            type: "error",
          });
        });
    },
    paginationLink(pageNum) {
      return {
        query: { page: pageNum },
      };
    },
    showEditModal() {
      this.$refs.editModal.showModal = true;
    },
    specialEditionUpdated() {
      this.loadSpecialEdition();
    },
    deleteSpecialEdition() {
      axios
        .delete(`/special_editions/${this.edition.id}`)
        .then(() => {
          this.$router.push({ name: "specialEditions" });
        })
        .catch(() => {
          this.notFound = true;
          this.$wireNotification({
            title: "System Alert",
            duration: 5000,
            text: "Unable to delete Special Edition",
            type: "error",
          });
        });
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
.reporting-title {
  font-family: $heading-stylized;
  font-size: $font-size-4;
}
.separator {
  border-bottom: 1px solid $alt-400;
  margin-bottom: 5px;
}
.less-more-image {
  height: 24px;
  width: 14px;
  transform: rotate(270deg);
}
.rotate {
  transform: rotate(360deg);
}
.custom-gutter-col {
  padding-bottom: 2.4rem;
  padding-left: 1.2rem;
  padding-right: 1.2rem;
}
</style>
