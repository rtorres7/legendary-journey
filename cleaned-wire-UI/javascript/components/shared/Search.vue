<template>
  <div class="flex-grow-1">
    <b-input-group
      class="advanced-search-link align-items-center"
      :class="{ header, 'header-search-container': header }"
      @keyup.enter="selectKeyword"
    >
      <router-link v-if="header" :to="{ name: 'search' }">
        <img
          :src="require('@assets/site-search.svg')"
          alt="Advanced Search"
          class="search-icon ml-4 mr-4"
        />
      </router-link>
      <vue-typeahead-bootstrap
        v-model="keyword"
        v-on:input="checkForDocNum"
        :data="typeAheadHits"
        :serializer="(s) => s.findable"
        :screen-reader-text-serializer="
          (s) =>
            s.screen_reader_text ||
            `${s.findable} ${s.filter_display_type} filter`
        "
        @hit="typeAheadHit($event)"
        placeholder="search for keywords, documents, or pages"
        :aria-label="
          header
            ? 'search for keywords, documents, or pages'
            : 'Keyword Search or filter'
        "
        ref="search"
        input-class="nav-omni-input"
        v-shortkey="{ sr: ['alt', 's'], noSr: ['s'] }"
        @shortkey.native="focusSearch()"
        class="flex-grow-1 omni-search"
        :class="{ 'nav-omni': header, 'criteria-omni': !header }"
      >
        <template v-if="!header" slot="prepend">
          <WireBackgroundAsset
            class="search-icon-bar"
            image-name="search-icon.svg"
            fill
          />
        </template>
        <template slot="suggestion" slot-scope="{ data, htmlText }">
          <div
            :data-usage="`omni-search-${data.filterable ? 'filter' : 'link'}-${
              data.kind
            }-${data.code}(${data.findable})`"
          >
            <div v-if="data.kind === 'keyword'">
              <KeywordResult :htmlText="htmlText" ref="keywordResult" />
            </div>
            <div v-else-if="data.kind === 'title'">
              <TitleResult :htmlText="htmlText" />
            </div>
            <div v-else-if="data.kind === 'doc_num'">
              <DocNumResult :htmlText="htmlText" />
            </div>
            <div v-else-if="data.filterable === true">
              <FilterableResult :htmlText="htmlText" :data="data" />
            </div>
            <div v-else>
              <PageResult :htmlText="htmlText" />
            </div>
          </div>
        </template>
      </vue-typeahead-bootstrap>
    </b-input-group>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { concat, debounce } from "lodash";
import axios from "axios";
import urlStore from "./mixins/urlStore";
import DocNumResult from "./omniSearchResultTypes/DocNumResult";
import FilterableResult from "./omniSearchResultTypes/FilterableResult";
import KeywordResult from "./omniSearchResultTypes/KeywordResult";
import PageResult from "./omniSearchResultTypes/PageResult";
import TitleResult from "./omniSearchResultTypes/TitleResult";
import WireBackgroundAsset from "./WireBackgroundAsset";

axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

export default {
  name: "Search",
  components: {
    DocNumResult,
    FilterableResult,
    KeywordResult,
    PageResult,
    TitleResult,
    WireBackgroundAsset,
  },
  mixins: [urlStore],
  props: {
    header: {
      default: false,
    },
  },

  data() {
    return {
      keyword: "",
      docNumTypeAhead: [],
      railsTypeAhead: [],
    };
  },

  mounted() {
    if (!this.header) {
      this.$bus.$on("editKeyword", (keyword) => {
        this.keyword = keyword;
      });
    }
  },

  methods: {
    ...mapMutations("criteria", ["addCriteria"]),
    linkParams(keyword) {
      return {
        name: "search",
        query: { text: keyword.split(" ").join("+") },
      };
    },
    checkForDocNum() {
      const trimmedKeyword = this.keyword.trim();

      const wireDocNumRegExp = "wire[0-9]{4}-[0-9a-z]{4,}"; //WIRe2020-01469, WIRe2020-01468a
      const oseDocNumRegExp = "[a-z]{3}[0-9]{15,17}"; //SAW2020021758249098
      const daDocNumRegExp = "_temp_28-[a-z]{2,3}-(.*?-)?[0-9]{4}-[0-9a-z]{4,}"; //_temp_28-DA-2020-00042, _temp_28-DA-MFAC-2020-00042
      const doDocNumRegExp = "tdx?-[0-9]{2,4}[!\/][0-9]{6,}-?[0-9]*"; //TDX-335/001835-20, TD-335/001835-20
      const fbiDocNumRegExp = "FBI-[A-Z]{2,}-[0-9]{4}-[0-9]{5,}-?[A-Z]?"; // FBI-DDBX-2022-66796, FBI-DDBX-2022-66793-A

      const docNumRegExp = new RegExp(
        "^(" +
          wireDocNumRegExp +
          "|" +
          daDocNumRegExp +
          "|" +
          doDocNumRegExp +
          "|" +
          oseDocNumRegExp +
          "|" +
          fbiDocNumRegExp +
          ")$",
        "i"
      );
      if (docNumRegExp.test(trimmedKeyword)) {
        axios
          .get("/documents/" + trimmedKeyword.replace("/", "!") + "/accessible")
          .then((response) => {
            this.docNumTypeAhead = [
              {
                findable: trimmedKeyword,
                screen_reader_text: `Jump to document ${trimmedKeyword}`,
                code: response.data.doc_num,
                kind: "doc_num",
                filterable: false,
              },
            ];
          })
          .catch(() => (this.docNumTypeAhead = []));
      }
    },

    runTypeAhead: debounce(function () {
      if (this.keyword.length > 2) {
        axios
          .get(
            "/type_ahead?text=" + this.keyword + "&filterable=" + !this.header
          )
          .then((response) => {
            this.railsTypeAhead = response.data.type_ahead;
          });
      }
    }, 250),

    getQuery(kind) {
      if (kind === "country") {
        return "countries[]";
      } else if (kind === "region") {
        return "regions[]";
      } else if (kind === "subregion") {
        return "subregions[]";
      }
    },

    navToTypeAhead(value) {
      var page = "";
      var params = {};
      var query = {};

      if (value.kind === "country") {
        page = "countries";
        params["countryName"] = value.findable;
      } else if (value.kind === "region") {
        page = "regions";
        params["regionName"] = value.findable;
      } else if (value.kind === "subregion") {
        page = "subregions";
        params["subregionName"] = value.findable;
      } else if (value.kind === "doc_num" || value.kind === "leadership") {
        page = "document";
        params["docNum"] = value.code.replace("/", "!");
      } else if (value.kind === "keyword" || value.kind === "title") {
        let kind = value.kind.replace("keyword", "text");
        query[kind] = value.code.replace("/", "!");
        page = "search";
      } else if (value.kind === "issue") {
        page = "issues";
        params["issueName"] = value.findable;
      }
      this.$router.push({
        query: query,
        name: page,
        params: params,
      });
    },

    enableFilter(value) {
      let filterMap = {
        country: "countries[]",
        region: "regions[]",
        subregion: "subregions[]",
        title: "title",
        keyword: "text",
        product_type: "product_types[]",
        reporting_type: "reporting_types[]",
        issue: "issues[]",
        topic: "topics[]",
        non_state_actor: "non_state_actors[]",
        media: "media_tags[]",
        producing_office: "producing_offices[]",
        selected_for: "selected_for[]",
        domestic_region: "domestic_regions[]",
      };
      this.addToQueryParams(filterMap[value.kind], value.code);
    },

    typeAheadHit(value) {
      if (value.filterable) {
        this.enableFilter(value);
      } else {
        this.navToTypeAhead(value);
      }
      this.keyword = "";
    },

    selectKeyword() {
      if (this.keyword) {
        this.$refs.keywordResult.$el.click();
      }
    },

    focusSearch() {
      document.querySelector(".nav-omni-input").focus();
      this.keyword = "";
    },
  },

  computed: {
    keywordTypeAhead() {
      return [
        {
          findable: this.keyword,
          screen_reader_text: `${this.keyword} keyword search`,
          subtext: null,
          kind: "keyword",
          code: this.keyword,
          filterable: !this.header,
        },
      ];
    },
    titleTypeAhead() {
      if (this.header) {
        return [];
      }

      return [
        {
          findable: this.keyword,
          screen_reader_text: `${this.keyword} title search`,
          subtext: null,
          kind: "title",
          code: this.keyword,
          filterable: true,
        },
      ];
    },
    typeAheadHits() {
      var allTypeAheads = concat(
        this.docNumTypeAhead,
        this.railsTypeAhead,
        this.keywordTypeAhead,
        this.titleTypeAhead
      );

      return allTypeAheads;
    },
    dataUsage() {
      return this.header ? "nav-header-search" : "nav-keyword-search";
    },
  },

  watch: {
    keyword() {
      this.runTypeAhead();
    },
  },
};
</script>

<style scoped lang="scss">
/deep/ .search-omni input {
  border: none;
  height: calc(1.64844rem + 2px);
  border-bottom: 6px solid $alt-400;
}

/deep/ .omni-search {
  .omni-search-icon {
    height: 16px !important;
    width: 16px !important;
    fill: $pri-600;
  }

  .list-group {
    border-radius: 0.25rem;
    margin-top: 5px;
    padding-top: 0;
    background-color: $white;

    .list-group-item:first-child {
      padding-top: 10px;
    }

    .list-group-item:last-child {
      padding-bottom: 10px;
    }

    .list-group-item {
      padding: 12px;
      border: 1px solid $alt-300;
    }
  }

  &.criteria-omni input {
    border: none;
    height: calc(1.64844rem + 2px);
    border-bottom: 1px solid $alt-700;
    border-radius: unset;
  }

  &.nav-omni input {
    height: 2rem;
    border-radius: inherit;
    border: none;
    border-bottom: 1px solid $alt-700;
    background-color: transparent;
    color: $text-light;
    min-width: 100%;
    &::placeholder {
      color: $alt-400;
    }
  }

  input::placeholder {
    color: $text-light;
  }
}

.advanced-search-link {
  color: $text-light;
}

.btn,
.fa-lg {
  height: 100%;
}

.tiny-top-padding {
  //this feels awful, but for some reason an anchor tag using flexbox to vertically align
  //items inside it doesn't work when a button tag does. But, we need an anchor tag here because
  //clicking this takes you to a search result. Ugh.
  padding-top: 0.5rem;
}

.search-icon {
  height: 30px;
  width: 30px;
}

.search-icon-bar {
  border-bottom: 1px solid $alt-700;
  height: 24px;
  width: 24px;
}
</style>
