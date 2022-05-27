import Vue from "vue";
import Router from "vue-router";

import Exports from "../components/exports/Exports";
import Accessibility from "../components/accessibility/Accessibility";
import RailsView from "../components/RailsView";
import Search from "../components/search/Search";
import Regions from "../components/vanity/Regions";
import Subregions from "../components/vanity/Subregions";
import Countries from "../components/vanity/Countries";
import Leadership from "../components/vanity/Leadership";
import Home from "../components/home/Home";
import Issues from "../components/vanity/Issues";
import NotFound from "../components/shared/errors/NotFound";
import Forbidden from "../components/shared/errors/Forbidden";
import NotAcceptable from "../components/shared/errors/NotAcceptable";
import RequestTimeout from "../components/shared/errors/RequestTimeout";
import InternalServer from "../components/shared/errors/InternalServer";
import BadGateway from "../components/shared/errors/BadGateway";
import ServiceUnavailable from "../components/shared/errors/ServiceUnavailable";
import NavModal from "../components/navmodal/NavModal";
import Folders from "../components/folders/Folders";
import MyTags from "../components/tags/MyTags";
import Tag from "../components/tags/Tag";
import Tags from "../components/tags/Tags";
import TagResults from "../components/tags/TagResults";
import UserSearch from "../components/users/UserSearch";
import UserDetails from "../components/users/UserDetails";
import UserRoles from "../components/users/UserRoles";
import Revisions from "../components/revisions/Revisions";
import ManageAlerts from "../components/admin/alerts/ManageAlerts";
import ContactUs from "../components/contactUs/ContactUs";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      metadata: {
        announce: "wire home",
      },
    },
    {
      path: "/wires/new",
      name: "new_wire",
      component: RailsView,
      metadata: {
        announce: "new wire",
      },
    },
    {
      path: "/wires/:date",
      name: "wires",
      props: true,
      component: Home,
      metadata: {
        announce: "previous wire home",
      },
    },
    {
      path: "/my_wire/access_request",
      name: "ntk",
      component: RailsView,
      metadata: {
        announce: "ntk request",
      },
      props: {
        path: "/my_wire/access_request",
      },
    },
    {
      path: "/revisions",
      name: "revisions",
      component: Revisions,
      meta: {
        title: (route) => {
          return "Revisions";
        },
      },
    },
    {
      path: "/my_wire/folders",
      name: "folders",
      component: Folders,
      meta: {
        title: (route) => {
          return "My Folders";
        },
      },
    },
    {
      path: "/my_wire/folders/:folderId",
      name: "folder",
      component: Folders,
      meta: {
        title: (route) => {
          return "My Folders";
        },
      },
    },
    {
      path: "/admin/users",
      name: "usersearch",
      component: UserSearch,
      meta: {
        title: (route) => {
          return "User Search";
        },
      },
    },
    {
      path: "/admin/users/:id",
      name: "userdetails",
      component: UserDetails,
      meta: {
        title: (route) => {
          return "User Details";
        },
      },
    },
    {
      path: "/admin/users/:id/roles",
      name: "userroles",
      component: UserRoles,
      meta: {
        title: (route) => {
          return "User Roles";
        },
      },
    },
    {
      path: "/alerts",
      name: "managealerts",
      component: ManageAlerts,
      meta: {
        title: (route) => {
          return "Manage Alerts";
        },
      },
    },
    {
      path: "/contact_us",
      name: "contact_us",
      component: ContactUs,
      meta: {
        title: (route) => {
          return "Contact Us";
        },
      },
    },
    {
      path: "/exports",
      name: "exports",
      component: Exports,
      meta: {
        title: (route) => {
          return "My Exports";
        },
      },
    },
    {
      path: "/my_wire/searches",
      name: "savedSearches",
      component: RailsView,
      metadata: {
        announce: "saved searches",
      },
    },
    {
      path: "/users/:id/tags",
      name: "myTags",
      component: MyTags,
      meta: {
        title: (route) => {
          if (route.query && route.query.user_name) {
            return `${route.query.user_name}'s Tags`;
          } else {
            return "My Tags";
          }
        },
      },
    },
    {
      path: "/tags",
      name: "allTags",
      component: Tags,
      meta: {
        title: (route) => {
          let tagGroup = route.query.text;
          if (tagGroup === undefined) {
            if (route.query.num !== undefined) {
              tagGroup = "a Number";
            } else if (route.query.sym !== undefined) {
              tagGroup = "a Symbol";
            } else {
              tagGroup = "A";
            }
          } else {
            tagGroup = tagGroup.toUpperCase();
          }

          return `All Tags Starting with ${tagGroup}`;
        },
      },
    },
    {
      path: "/tags/search",
      name: "searchTags",
      component: TagResults,
      meta: {
        title: (route) => {
          return `WIRe Tags containing ${route.query.text}`;
        },
      },
    },
    {
      path: "/tags/:tagName",
      name: "tag",
      component: Tag,
      meta: {
        title: (route) => {
          return `Documents Tagged with ${route.params.tagName}`;
        },
      },
    },

    {
      path: "/search",
      props: true,
      component: Search,
      name: "search",
      meta: {
        title: (route) => {
          return "Search";
        },
      },
    },
    {
      path: "/visuals",
      component: Search,
      redirect: { path: "search", query: { visuals: "visuals" } },
      name: "visuals",
    },
    {
      path: "/subregions/:subregionName",
      name: "subregions",
      component: Subregions,
      props: true,
      meta: {
        title: (route) => {
          return route.params.subregionName;
        },
      },
    },
    {
      path: "/regions/:regionName",
      name: "regions",
      component: Regions,
      props: true,
      meta: {
        title: (route) => {
          return route.params.regionName;
        },
      },
    },
    {
      path: "/countries/:countryName",
      name: "countries",
      component: Countries,
      props: true,
      meta: {
        title: (route) => {
          return route.params.countryName;
        },
      },
    },
    {
      path: "/issues/:issueName",
      name: "issues",
      component: Issues,
      props: true,
      meta: {
        title: (route) => {
          return route.params.issueName;
        },
      },
    },
    {
      path: "/leadership/:profileType",
      name: "leadership",
      component: Leadership,
      props: true,
      meta: {
        title: (route) => {
          return route.params.profileType;
        },
      },
    },
    {
      path: "/design",
      name: "design",
      component: () => import("../components/design/Design"),
      meta: {
        title: (route) => {
          return "WIRe Design System";
        },
      },
    },
    {
      path: "/advanced_tips",
      name: "advanced_tips",
      props: true,
      component: () => import("../components/shared/AdvancedTips"),
      metadata: {
        announce: "advanced tips",
      },
    },
    {
      path: "/app_usage_metrics",
      name: "app_usage_metrics",
      component: () => import("../components/appUsageMetrics/AppUsageMetrics"),
      metadata: {
        announce: "app usage metrics",
      },
    },
    {
      path: "/documents/:docNum/",
      name: "document",
      props: true,
      component: NavModal,
      meta: {
        title: (route) => {
          return "rails";
        },
      },
      pathToRegexpOptions: { strict: true },
    },
    {
      path: "/accessibility",
      name: "accessibility",
      component: Accessibility,
    },
    {
      path: "/not_found",
      name: "notFound",
      component: NotFound,
      metadata: {
        announce: "not found",
      },
    },
    {
      path: "/forbidden",
      name: "forbidden",
      component: Forbidden,
      metadata: {
        announce: "forbidden",
      },
    },
    {
      path: "/notacceptable",
      name: "notacceptable",
      component: NotAcceptable,
      metadata: {
        announce: "notacceptable",
      },
    },
    {
      path: "/requesttimeout",
      name: "requesttimeout",
      component: RequestTimeout,
      metadata: {
        announce: "requesttimeout",
      },
    },
    {
      path: "/internalserver",
      name: "internalserver",
      component: InternalServer,
      metadata: {
        announce: "internalserver",
      },
    },
    {
      path: "/badgateway",
      name: "badgateway",
      component: BadGateway,
      metadata: {
        announce: "badgateway",
      },
    },
    {
      path: "/serviceunavailable",
      name: "serviceunavailable",
      component: ServiceUnavailable,
      metadata: {
        announce: "serviceunavailable",
      },
    },
    {
      path: "*",
      component: RailsView,
      meta: {
        title: (route) => {
          return "rails";
        },
      },
      metadata: {
        announce: "new",
      },
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return {
        x: 0,
        y: 0,
      };
    }
  },
});
