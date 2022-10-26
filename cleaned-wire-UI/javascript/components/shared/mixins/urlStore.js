import { remove, uniq } from "lodash";

export default {
  props: ["query", "queryValue"],

  methods: {
    removeSearchIdIfNecessary(criteria = this.query) {
      if (criteria === "page") {
        return;
      }
      this.$store.commit("search/clearSearchId");
    },

    addToQueryParams(criteria = this.query, code = this.queryValue) {
      let query = Object.assign({}, this.$route.query);

      if (query[criteria] && criteria !== "text" && criteria !== "title") {
        // There is at least one of this type already selected
        if (Array.isArray(query[criteria])) {
          query[criteria] = query[criteria].concat([code]);
        } else {
          query[criteria] = [query[criteria], code];
        }
      } else {
        query[criteria] = [code];
      }
      if (criteria !== "page") {
        delete query["page"];
        // saved searches can put the search id in the query, this should never stick around
        //   if we are making changes to the query
        delete query.id;
      }

      this.removeSearchIdIfNecessary(criteria);

      // remove any duplicate values in criteria
      query[criteria] = uniq(query[criteria]);

      this.$nextTick(() => {
        this.$router.push({ query }).catch(() => {});
      });
    },

    removeFromQueryParams() {
      // Need to remove the value from query string
      let query = Object.assign({}, this.$route.query);
      if (Array.isArray(query[this.query])) {
        if (query[this.query].includes(this.queryValue)) {
          if (
            this.queryValue == query["search_title"] ||
            (query["selected_for[]"] &&
              this.query["search_title"] == query["selected_for[]"][0]) ||
            (query["search_reporting_type"] != undefined &&
              this.queryValue == query["search_reporting_type"])
          ) {
            delete query["search_title"];
          }

          query[this.query] = remove(query[this.query], (n) => {
            return n !== this.queryValue;
          });
        }
      } else if (this.query === "dateRange") {
        delete query["start_date"];
        delete query["end_date"];
      } else {
        delete query[this.query];
        delete query["search_title"];
      }

      delete query["page"];
      delete query["id"];

      this.removeSearchIdIfNecessary();
      this.$nextTick(() => {
        this.$router.push({ query });
      });
    },
  },
};
