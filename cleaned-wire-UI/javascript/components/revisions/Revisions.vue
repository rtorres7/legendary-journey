<template>
  <div class="mt-6 standard-page-margin my-folders">
    <vanity-title title="Revisions" />
    <div>
      <b-row>
        <b-col class="mb-6 pr-6" cols="24" md="18">
          <b-row class="d-flex align-items-center separator mt-6 mb-6 pb-6">
            <b-col class="revision-subhead">Revision Date</b-col>
            <b-col class="revision-subhead"
              >WIRe Title (Publication Date)</b-col
            >
            <b-dropdown
              class="year"
              v-if="yearsLoaded"
              id="year-dd"
              :text="year"
            >
              <b-dropdown-item
                v-for="revisionYear in years"
                :key="revisionYear"
                :display="revisionYear"
                @click="yearChange(revisionYear)"
              >
                {{ revisionYear }}
              </b-dropdown-item>
            </b-dropdown>
            <SubscribeRevisions class="pl-3" />
          </b-row>

          <div class="results d-flex justify-content-center" aria-live="polite">
            <div v-if="loading">Loading results ...</div>
            <div v-else>{{ resultsDisplay() }}</div>
          </div>
          <div v-if="loading">
            <spinner />
          </div>
          <b-row
            class="mb-6 separator"
            :key="ind"
            v-for="(revision, ind) in revisions"
          >
            <b-card-body
              class="d-flex p-5"
              :class="{
                'secondary pt-6 position-relative locked': locked(
                  revision.article
                ),
              }"
            >
              <div class="col d-flex my-4">
                <Date fullDate :documentDate="revision.revision_date" />
                <div>
                  <DocumentLink
                    :document="revision.article"
                    :section="section"
                    :returnPath="returnPath"
                    :data-usage="dataUsage"
                    :afterLinkText="formatDate(revision.article.date_published)"
                    class="revision-title"
                  />
                </div>
              </div>
            </b-card-body>
          </b-row>
        </b-col>
        <b-col cols="24" md="6">
          <div class="pl-6 revision-policy">
            <h2 class="d-flex justify-content-center">Revision Policy</h2>
            <span class="d-flex justify-content-center">&mdash;</span>
            <p>
              Excellence and integrity are core _temp_6 values. If we fail to
              acknowledge and correct our mistakes, we harm the Agency's
              credibility as a trusted information provider. The WIRe staff is
              committed to—and accountable for—accuracy in our featured (front
              page) content. WIRe features reflect our best insights and
              judgments using the information available at the time of
              publication. When notified of a substantive error—one that changes
              the intended message—we will issue a substantive revision
              detailing the specific change made and, to the extent possible,
              the reason for the error. The revision notice will be placed at
              the top of the online article. We pledge to correct minor,
              non-substantive errors—for example, typos and misspellings—online
              in a timely fashion without regard to how long ago the error
              occurred.
            </p>
            <p>
              We welcome your assistance in identifying errors in our featured
              content; if you spot a mistake please use the private comment
              feature or
              <a class="contact-link" href="mailto:_temp_540-Mailbox@_temp_6._temp_0"
                >send us a note</a
              >.
            </p>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Spinner from "../shared/Spinner";
import SubscribeRevisions from "./SubscribeRevisions";
import Date from "../shared/Date";
import DocumentLink from "../shared/DocumentLink";
import VanityTitle from "../vanity/VanityTitle";
import SelectAll from "../selectWithinResults/SelectAll";
import { isEmpty } from "lodash";

export default {
  name: "Revisions",
  props: {
    returnPath: "returnPath",
    section: "section",
    dataUsage: "Revisions",
  },
  components: {
    SelectAll,
    VanityTitle,
    SubscribeRevisions,
    Spinner,
    Date,
    DocumentLink,
  },
  data() {
    return {
      loading: true,
      year: "",
      years: [],
      yearsLoaded: false,
      revisions: null,
    };
  },
  computed: {
    resultsCount() {
      return this.revisions ? this.revisions.length : 0;
    },
  },
  mounted() {
    this.year = this.$moment().format("YYYY");
    for (let d = parseInt(this.year); d > 2008; d--) {
      this.years.push(d);
    }
    this.yearsLoaded = true;
    this.getRevisions();
  },
  methods: {
    getRevisions() {
      this.revisions = [];
      this.loading = true;
      axios.get(`/revisions?year=${this.year}`).then((response) => {
        this.revisions = response.data.revisions;
        this.loading = false;
      });
    },
    yearChange(newYear) {
      this.year = newYear.toString();
      this.getRevisions();
    },
    formatDate(dateTime) {
      return this.$moment(dateTime).format("DD-MMM-YYYY");
    },
    locked(doc) {
      return !isEmpty(doc.needed);
    },
    resultsDisplay() {
      let display = this.resultsCount.toLocaleString() + " Result";
      if (this.resultsCount !== 1) {
        display += "s";
      }
      return display;
    },
  },
};
</script>
<style scoped lang="scss">
.results {
  color: $alt-800;
  line-height: 1;
  margin-bottom: unset;
}
.revision-policy {
  padding: 1.25rem;
  color: $pri-800;
  background-color: $alt-300;
}
.revision-date {
  color: $alt-800;
  font-weight: 400;
  line-height: 1.1rem;
  text-align: center;
}
.separator {
  border-bottom: 1px solid $alt-400;
  margin-bottom: 5px;
}
.contact-link {
  text-decoration: underline;
}
.revision-title {
  font-family: $heading-stylized;
  font-size: $font-size-4;
}
::v-deep .after-link-text {
  font-family: $font-family-heading;
  color: $pri-600;
  font-size: $font-size-4;
  white-space: normal;
  white-space: pre;
}
::v-deep .after-link-text-locked {
  font-family: $font-family-heading;
  color: $alt-900;
  font-size: $font-size-4;
  white-space: normal;
  white-space: pre;
}
::v-deep .locked {
  padding-left: 5px;
}
::v-deep .document_link {
  // for locked document link
  font-size: $font-size-4;
  padding-left: 5px;
}
.revision-subhead {
  color: $alt-800;
  text-transform: uppercase;
}
::v-deep .dropdown-menu {
  min-width: 0rem;
}
</style>
