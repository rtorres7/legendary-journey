import { createRouter, createWebHistory } from "vue-router";
import { isProduction } from "@/shared/helpers";

// Demo
import MockWorkspaceView from "@/domains/demo/views/MockWorkspaceView.vue";

// Current
import CurrentAttachmentView from "@current/views/AttachmentView.vue";
import CurrentEditProductView from "@current/views/EditProductView.vue";
import CurrentHomeView from "@current/views/HomeView.vue";
import CurrentNotFoundView from "@current/views/NotFoundView.vue";
import CurrentProductView from "@current/views/ProductView.vue";
import CurrentPublishProductView from "@current/views/PublishProductView.vue";
import CurrentSearchView from "@current/views/SearchView.vue";
import CurrentSearchTipsView from "@current/views/SearchTipsView.vue";
import CurrentSpecialEditionView from "@current/views/SpecialEditionView.vue";
import CurrentSpecialEditionsManagerView from "@current/views/SpecialEditionsManagerView.vue";

const currentRoutes = [
  {
    path: "/",
    name: "home",
    component: CurrentHomeView,
    meta: {
      domain: "current",
      title: "Current",
    },
  },
  {
    path: "/product/:doc_num/preview",
    name: "product-preview",
    component: CurrentProductView,
    meta: {
      domain: "current",
    },
  },
  {
    path: "/product/:doc_num",
    name: "product",
    component: CurrentProductView,
    meta: {
      domain: "current",
    },
  },
  {
    path: "/attachment/:url?",
    name: "attachment",
    component: CurrentAttachmentView,
    props: true,
    meta: {
      domain: "current",
      viewType: "attachment",
    },
  },
  {
    path: "/issues/:name",
    name: "issues",
    component: CurrentSearchView,
    meta: {
      domain: "current",
      viewType: "search",
    },
  },
  {
    path: "/regions/:name",
    name: "regions",
    component: CurrentSearchView,
    meta: {
      domain: "current",
      viewType: "search",
    },
  },
  {
    path: "/subregions/:name",
    name: "subregions",
    component: CurrentSearchView,
    meta: {
      domain: "current",
      viewType: "search",
    },
  },
  {
    path: "/countries/:name",
    name: "countries",
    component: CurrentSearchView,
    meta: {
      domain: "current",
      viewType: "search",
    },
  },
  {
    path: "/search",
    name: "search",
    component: CurrentSearchView,
    meta: {
      domain: "current",
      viewType: "search",
    },
  },
  {
    path: "/search_tips",
    name: "searchTips",
    component: CurrentSearchTipsView,
    meta: {
      domain: "current",
      title: "Advanced Search Tips",
    },
  },
  {
    path: "/:date/products",
    name: "products",
    component: CurrentPublishProductView,
    meta: {
      domain: "current",
      title: "Manage Products",
    },
  },
  {
    path: "/special_editions/:id(\\d+)",
    name: "specialEdition",
    component: CurrentSpecialEditionView,
    meta: {
      domain: "current",
      title: "Special Edition",
    },
  },
  {
    path: "/special_editions",
    name: "specialEditions",
    component: CurrentSpecialEditionsManagerView,
    meta: {
      domain: "current",
      title: "Manage Special Editions",
    },
  },
  {
    path: "/product/:date/:id/:doc_num/edit",
    name: "edit",
    component: CurrentEditProductView,
    meta: {
      domain: "current",
      title: "Edit Product",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notFound",
    component: CurrentNotFoundView,
    meta: {
      domain: "current",
      title: "Page Not Found",
    },
  },
];

// Studio
import StudioHomeView from "@studio/views/HomeView.vue";
import StudioSearchView from "@studio/views/SearchView.vue";
import StudioSavedView from "@studio/views/SavedView.vue";
import StudioPortfolioView from "@studio/views/PortfolioView.vue";
import StudioLiveView from "@studio/views/LiveView.vue";
import StudioCalendarView from "@studio/views/CalendarView.vue";
import StudioIssuesView from "@studio/views/IssuesView.vue";
import StudioProductsView from "@studio/views/ProductsView.vue";
import StudioIssueDetailView from "@studio/views/IssueDetailView.vue";
import StudioIssueMetricsView from "@studio/views/IssueMetricsView.vue";

const studioRoutes = [
  {
    path: "/studio",
    name: "studio",
    component: StudioHomeView,
    meta: {
      domain: "studio",
      title: "Current Studio",
    },
  },
  {
    path: "/studio/find",
    name: "studio-find",
    component: StudioSearchView,
    meta: {
      domain: "studio",
      title: "Find",
    },
  },
  {
    path: "/studio/saved",
    name: "studio-saved",
    component: StudioSavedView,
    meta: {
      domain: "studio",
      title: "Saved",
    },
  },
  {
    path: "/studio/portfolio",
    name: "studio-portfolio",
    component: StudioPortfolioView,
    meta: {
      domain: "studio",
      title: "Portfolio",
    },
  },
  {
    path: "/studio/live",
    name: "studio-live",
    component: StudioLiveView,
    meta: {
      domain: "studio",
      title: "Live Issue",
    },
  },
  {
    path: "/studio/calendar",
    name: "studio-calendar",
    component: StudioCalendarView,
    meta: {
      domain: "studio",
      title: "Calendar",
    },
  },
  {
    path: "/studio/issues",
    name: "studio-issues",
    component: StudioIssuesView,
    meta: {
      domain: "studio",
      title: "Issues",
    },
  },
  {
    path: "/studio/products",
    name: "studio-products",
    component: StudioProductsView,
    meta: {
      domain: "studio",
      title: "Products",
    },
  },
  {
    path: "/studio/issue/:id",
    name: "studio-issue-detail",
    component: StudioIssueDetailView,
    meta: {
      domain: "studio",
      title: "Issue Detail",
    },
  },
  {
    path: "/studio/issue/:id/metrics",
    name: "studio-issue-metrics",
    component: StudioIssueMetricsView,
    meta: {
      domain: "studio",
      title: "Issue Metrics",
    },
  },
];

//Workspace
import DashboardView from "@workspace/views/DashboardView.vue";
import MyProductsView from "@workspace/views/MyProductsView.vue";
import SavedProductsView from "@workspace/views/SavedProductsView.vue";

const workspaceRoutes = [
  {
    path: "/workspace",
    name: "dashboard",
    component: DashboardView,
    meta: {
      domain: "workspace",
      title: "Dashboard",
    },
  },
  {
    path: "/workspace/products",
    name: "myProducts",
    component: MyProductsView,
    meta: {
      domain: "workspace",
      title: "My Products",
    },
  },
  {
    path: "/workspace/saved",
    name: "saved",
    component: SavedProductsView,
    meta: {
      domain: "workspace",
      title: "Saved",
    },
  },
];

let routes = [...currentRoutes];

if (!isProduction()) {
  routes = [...currentRoutes, ...studioRoutes, ...workspaceRoutes];
  routes.push({
    path: "/demo",
    name: "demo",
    component: MockWorkspaceView,
    meta: {
      domain: "demo",
      title: "Workspace Demo",
    },
  });
}

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      window.scrollTo(0, 0);
    }
  },
});

router.beforeEach((to, from, next) => {
  if (to.meta.viewType) {
    switch (to.meta.viewType) {
      case "attachment":
        document.title = to.params.url;
        break;
      case "search":
        document.title = to.params.name ? to.params.name : "Search";
        break;
    }
  } else {
    document.title = to.meta.title ? to.meta.title : "Current";
  }
  next();
});

export default router;
