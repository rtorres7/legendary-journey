import Vue from "vue";
import Router from "vue-router";

import RailsView from "../components/RailsView";
import Accessibility from "../components/accessibility/Accessibility";
import ContactUs from "../components/contactUs/ContactUs";
import DocumentPreview from "../components/document/DocumentPreview";
import ReviewDocumentFeedback from "../components/documentFeedback/ReviewDocumentFeedback";
import Exports from "../components/exports/Exports";
import Folders from "../components/folders/Folders";
import Home from "../components/home/Home";
import NavModal from "../components/navmodal/NavModal";
import Revisions from "../components/revisions/Revisions";
import Search from "../components/search/Search";
import BadGateway from "../components/shared/errors/BadGateway";
import Forbidden from "../components/shared/errors/Forbidden";
import InternalServer from "../components/shared/errors/InternalServer";
import NotAcceptable from "../components/shared/errors/NotAcceptable";
import NotFound from "../components/shared/errors/NotFound";
import RequestTimeout from "../components/shared/errors/RequestTimeout";
import ServiceUnavailable from "../components/shared/errors/ServiceUnavailable";
import MyTags from "../components/tags/MyTags";
import Tag from "../components/tags/Tag";
import Tags from "../components/tags/Tags";
import TagResults from "../components/tags/TagResults";
import UserDetails from "../components/users/UserDetails";
import UserRoles from "../components/users/UserRoles";
import UserSearch from "../components/users/UserSearch";
import Countries from "../components/vanity/Countries";
import Issues from "../components/vanity/Issues";
import Leadership from "../components/vanity/Leadership";
import Regions from "../components/vanity/Regions";
import Subregions from "../components/vanity/Subregions";
import ManageAlerts from "../components/admin/alerts/ManageAlerts";
import AuthenticationFailureDetails from "../components/admin/authenticationFailures/AuthenticationFailureDetails";
import AuthenticationFailures from "../components/admin/authenticationFailures/AuthenticationFailures";
import BackgroundJob from "../components/admin/BackgroundJob";
import BackgroundJobs from "../components/admin/BackgroundJobs";
import ProductTypes from "../components/admin/productTypes/ProductTypes";
import FSDTool from "../components/admin/FSDTool/FSDTool";
import RoleMembership from "../components/roles/RoleMembership";
import IngestStatus from "../components/admin/IngestStatus";
import Feeds from "../components/admin/feeds/Feeds";
import ProducingOffices from "../components/admin/producingOffices/ProducingOffices";
import SpecialEdition from "../components/specialEditions/SpecialEdition";
import SpecialEditions from "../components/specialEditions/SpecialEditions";
import SystemFeedback from "../components/admin/feedback/SystemFeedback";
import WireBook from "../components/wires/WireBook";

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
      component: WireBook,
      meta: {
        title: (route) => {
          return "Table of Contents";
        },
      },
    },
    {
      path: "/wires/:date/edit",
      name: "edit_wire",
      component: WireBook,
      meta: {
        title: (route) => {
          return `Table of Contents for ${route.params.date}`;
        },
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
      path: "/feedback_reviews",
      name: "feedback_reviews",
      component: ReviewDocumentFeedback,
      meta: {
        title: (route) => {
          return "Review Document Feedback";
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
      path: "/admin/authentication_failures",
      name: "authenticationFailures",
      component: AuthenticationFailures,
      meta: {
        title: (route) => {
          return "Review Authentication Failures";
        },
      },
    },
    {
      path: "/admin/authentication_failures/:id",
      name: "authenticationFailureDetails",
      component: AuthenticationFailureDetails,
      meta: {
        title: (route) => {
          return "Authentication Failure Report";
        },
      },
    },
    {
      path: "/admin/fsd",
      name: "FSDTool",
      component: FSDTool,
      meta: {
        title: (route) => {
          return "Admin FSD";
        },
      },
    },
    {
      path: "/admin/recommended_feeds",
      name: "feeds",
      component: Feeds,
      meta: {
        title: (route) => {
          return "Manage Recommended Feeds";
        },
      },
    },
    {
      path: "/admin/users",
      name: "usersearch",
      component: UserSearch,
      meta: {
        title: (route) => {
          return "Manage User Accounts";
        },
      },
    },
    {
      path: "/admin/users/:id",
      name: "userdetails",
      component: UserDetails,
      meta: {
        title: (route) => {
          return "Manage User Details";
        },
      },
    },
    {
      path: "/admin/users/:id/roles",
      name: "userroles",
      component: UserRoles,
      meta: {
        title: (route) => {
          return "Manage User Roles";
        },
      },
    },
    {
      path: "/admin/ingest",
      name: "ingestStatus",
      component: IngestStatus,
      meta: {
        title: (route) => {
          return "Ingest Status";
        },
      },
    },
    {
      path: "/admin/jobs",
      name: "backgroundJobs",
      component: BackgroundJobs,
      meta: {
        title: (route) => {
          return "Background Jobs Status";
        },
      },
    },
    {
      path: "/admin/jobs/:id",
      name: "jobDetails",
      component: BackgroundJob,
      meta: {
        title: (route) => {
          return "Background Job Details";
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
      path: "/admin/product_types",
      name: "productTypes",
      component: ProductTypes,
      meta: {
        title: (route) => {
          return "Manage Product Types";
        },
      },
    },
    {
      path: "/admin/producing_offices",
      name: "producingOffices",
      component: ProducingOffices,
      meta: {
        title: (route) => {
          return "Manage Producing Offices";
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
      path: "/admin/roles",
      name: "role_membership",
      component: RoleMembership,
      meta: {
        title: (route) => {
          return "Review _temp_20 Membership";
        },
      },
    },
    {
      path: "/system_feedback",
      name: "systemFeedback",
      component: SystemFeedback,
      meta: {
        title: (route) => {
          return "Review System Feedback";
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
      path: "/documents/:docNum/preview",
      name: "documentPreview",
      component: DocumentPreview,
      meta: {
        title: (route) => {
          return `Document Preview for ${route.params.docNum}`;
        },
      },
    },
    {
      path: "/documents/:docNum/preview.html",
      //redirect: to => { return "/documents/:docNum/preview" },
      name: "icpsDocPreview",
      component: DocumentPreview,
      meta: {
        title: (route) => {
          return `Document Preview for ${route.params.docNum}`;
        },
      },
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
        announce: "not found error",
      },
    },
    {
      path: "/forbidden",
      name: "forbidden",
      component: Forbidden,
      metadata: {
        announce: "forbidden error",
      },
    },
    {
      path: "/not_acceptable",
      name: "not_acceptable",
      component: NotAcceptable,
      metadata: {
        announce: "not acceptable error",
      },
    },
    {
      path: "/request_timeout",
      name: "request_timeout",
      component: RequestTimeout,
      metadata: {
        announce: "request timeout error",
      },
    },
    {
      path: "/internal_server",
      name: "internal_server",
      component: InternalServer,
      metadata: {
        announce: "internal server error",
      },
    },
    {
      path: "/bad_gateway",
      name: "bad_gateway",
      component: BadGateway,
      metadata: {
        announce: "bad gateway error",
      },
    },
    {
      path: "/service_unavailable",
      name: "service_unavailable",
      component: ServiceUnavailable,
      metadata: {
        announce: "service unavailable error",
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
    {
      path: "/special_editions/:id(\\d+)",
      name: "specialEdition",
      component: SpecialEdition,
      meta: {
        title: (route) => {
          return "Special Edition";
        },
      },
    },
    {
      path: "/special_editions",
      name: "specialEditions",
      component: SpecialEditions,
      meta: {
        title: (route) => {
          return "Manage Special Editions";
        },
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
