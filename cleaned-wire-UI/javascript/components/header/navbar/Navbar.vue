<template>
  <b-container fluid>
    <b-navbar
      id="headerNavigation"
      toggleable="md"
      type="dark"
      class="standard-page-margin"
    >
      <b-collapse is-nav id="navbarSupportedContent">
        <b-navbar-nav class="primary-nav mr-auto">
          <b-nav-item to="/" data-usage="nav-front-page">
            <div class="d-flex">
              <Logo v-if="$route.name !== 'home'" small />
              <div>Front Page</div>
            </div>
          </b-nav-item>
          <SavedSearches />
          <Regions />
          <Issues />
          <Concepts
            class="d-block d-md-none d-lg-block"
            v-if="featuresAvailable.concepts"
          />
          <Leadership
            class="d-block d-md-none d-xl-block"
            v-if="featuresAvailable.leadership"
          />
          <b-nav-item-dropdown
            text="more"
            class="d-none d-md-block d-xl-none"
            v-if="featuresAvailable.leadership && featuresAvailable.concepts"
          >
            <LeadershipInline v-if="featuresAvailable.leadership" />
            <ConceptsInline
              class="d-none d-md-block d-lg-none"
              v-if="featuresAvailable.concepts"
            />
          </b-nav-item-dropdown>
          <YouLink />
          <Admin />
        </b-navbar-nav>
        <div class="ml-4 search-border mr-2"></div>
        <Search :header="true" class="flex-grow-1" />
      </b-collapse>
      <b-navbar-toggle
        _temp_576="navbarSupportedContent"
        class="m-1 ml-auto"
      ></b-navbar-toggle>
    </b-navbar>
  </b-container>
</template>

<script>
import { mapState } from "vuex";

import Issues from "./Issues";
import IssuesInline from "./IssuesInline";
import Leadership from "./Leadership";
import NavLink from "./NavLink";
import Regions from "./Regions";
import Concepts from "./Concepts";
import ConceptsInline from "./ConceptsInline";
import SavedSearches from "./SavedSearches";
import YouLink from "./YouLink";
import Logo from "@shared/Logo";
import Search from "@shared/Search";
import LeadershipInline from "./LeadershipInline";
var Admin = () => import(/* webpackChunkName: "admin" */ "./Admin/Admin");

export default {
  name: "Navbar",
  components: {
    LeadershipInline,
    Search,
    Logo,
    Admin,
    SavedSearches,
    Issues,
    IssuesInline,
    Concepts,
    ConceptsInline,
    Leadership,
    NavLink,
    Regions,
    YouLink,
  },
  computed: {
    ...mapState("metadata", ["featuresAvailable"]),
  },
};
</script>

<style scoped lang="scss">
@import "../../../../assets/stylesheets/variables_and_mixins";
.navbar-dark .navbar-toggler {
  color: white;
  border-color: white;
}

/deep/ .nav-link {
  font-family: $headings-font-family;
}

/deep/ .navbar-collapse.collapse.show .navbar-nav {
  .nav-link {
    border-left: 4px solid $alt-700;
    border-top: unset;
    padding-left: 15px;
    &:active,
    &:hover,
    &:focus {
      border-left: 4px solid $sec-600 !important;
      border-top: unset !important;
    }
  }
  &.secondary-nav {
    .nav-link {
      border-left: 4px solid transparent;
    }
  }
  .dropdown-menu {
    border-radius: unset;
  }
}

.expanded {
  flex-direction: row;
}

/deep/ .navbar-nav {
  .nav-link {
    border-top: 5px solid $alt-700;
    height: 70px;
    padding: 20px 9px;
    &:active,
    &:hover,
    &:focus {
      border-top: 5px solid $sec-600 !important;
    }
  }
  &.secondary-nav {
    .nav-link {
      border-top: 5px solid transparent;
    }
  }

  .dropdown-menu {
    margin-top: 0;
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    box-shadow: $box-shadow;
    .indent {
      padding-left: 35px;
    }
  }
}

@media (min-width: $screen-md) and (max-width: $screen-xl) {
  /deep/ ul.dropdown-menu.show {
    max-height: 70vh;
    overflow-y: auto;
  }
}

/deep/ .navbar-nav {
  font-size: $font-size-large;
}

.search-border {
  border-left: 1px solid $alt-700;
  height: 40px;
}

/deep/ .logo {
  margin-top: -8px;
  margin-right: 15px;
}
</style>
