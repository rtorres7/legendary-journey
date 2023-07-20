import { createRouter, createWebHistory } from "vue-router";
import AttachmentView from "../views/AttachmentView.vue";
import EditProductView from "../views/EditProductView.vue";
import HomeView from "../views/HomeView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import ProductView from "../views/ProductView.vue";
import PublishProductView from "../views/PublishProductView.vue";
import SearchView from "../views/SearchView.vue";
import SearchTipsView from "../views/SearchTipsView.vue";
import SpecialEditionView from "../views/SpecialEditionView.vue";
import SpecialEditionsManagerView from "../views/SpecialEditionsManagerView.vue";
import MockWorkspaceView from "@/demo/views/MockWorkspaceView.vue";
import { isProduction } from "@/helpers";

// Studio
import MockStudioView from "@/demo-studio/views/MockStudioView.vue";

import StudioHomeView from "@/studio/views/StudioHomeView.vue";
import StudioLiveView from "@/studio/views/StudioLiveView.vue";
import StudioIssuesView from "@/studio/views/StudioIssuesView.vue";
import StudioIssueDetailView from "@/studio/views/StudioIssueDetailView.vue";
import StudioIssueMetricsView from "@/studio/views/StudioIssueMetricsView.vue";

//Workspace
// import WorkspaceView from "../workspace/views/WorkspaceView.vue";
import DashboardView from "../workspace/views/DashboardView.vue";
import MyProductsView from "../workspace/views/MyProductsView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: {
      domain: "current",
      title: "Current",
    },
  },
  {
    path: "/product/:doc_num/preview",
    name: "product-preview",
    component: ProductView,
    meta: {
      domain: "current",
    },
  },
  {
    path: "/product/:doc_num",
    name: "product",
    component: ProductView,
    meta: {
      domain: "current",
    },
  },
  {
    path: "/attachment/:url?",
    name: "attachment",
    component: AttachmentView,
    props: true,
    meta: {
      domain: "current",
      viewType: "attachment",
    },
  },
  {
    path: "/issues/:name",
    name: "issues",
    component: SearchView,
    meta: {
      domain: "current",
      viewType: "search",
    },
  },
  {
    path: "/regions/:name",
    name: "regions",
    component: SearchView,
    meta: {
      domain: "current",
      viewType: "search",
    },
  },
  {
    path: "/subregions/:name",
    name: "subregions",
    component: SearchView,
    meta: {
      domain: "current",
      viewType: "search",
    },
  },
  {
    path: "/countries/:name",
    name: "countries",
    component: SearchView,
    meta: {
      domain: "current",
      viewType: "search",
    },
  },
  {
    path: "/search",
    name: "search",
    component: SearchView,
    meta: {
      domain: "current",
      viewType: "search",
    },
  },
  {
    path: "/search_tips",
    name: "searchTips",
    component: SearchTipsView,
    meta: {
      domain: "current",
      title: "Advanced Search Tips",
    },
  },
  {
    path: "/:date/products",
    name: "products",
    component: PublishProductView,
    meta: {
      domain: "current",
      title: "Manage Products",
    },
  },
  {
    path: "/special_editions/:id(\\d+)",
    name: "specialEdition",
    component: SpecialEditionView,
    meta: {
      domain: "current",
      title: "Special Edition",
    },
  },
  {
    path: "/special_editions",
    name: "specialEditions",
    component: SpecialEditionsManagerView,
    meta: {
      domain: "current",
      title: "Manage Special Editions",
    },
  },
  {
    path: "/product/:date/:id/:doc_num/edit",
    name: "edit",
    component: EditProductView,
    meta: {
      domain: "current",
      title: "Edit Product",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notFound",
    component: NotFoundView,
    meta: {
      domain: "current",
      title: "Page Not Found",
    },
  },
];

if (!isProduction()) {
  routes.push({
    path: "/workspace-demo",
    name: "workspace-demo",
    component: MockWorkspaceView,
    meta: {
      domain: "workspace",
      title: "Workspace",
      demo: true,
    },
  });
}

if (!isProduction()) {
  routes.push(
    // {
    //   path: "/workspace",
    //   name: "workspace",
    //   component: WorkspaceView,
    //   meta: {
    //     domain: "workspace",
    //     title: "Workspace",
    //     // demo: true,
    //   },
    // },
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
      path: "/workspace/my-products",
      name: "myProducts",
      component: MyProductsView,
      meta: {
        domain: "workspace",
        title: "My Products",
      },
    }
  );
  routes.push({
    path: "/studio",
    name: "studio",
    component: MockStudioView,
    meta: {
      domain: "workspace",
      title: "Current Studio",
      demo: true,
    },
  });
  routes.push(
    {
      path: "/new-studio",
      name: "new-studio",
      component: StudioHomeView,
      meta: {
        domain: "studio",
        title: "Current Studio",
      },
    },
    {
      path: "/new-studio/issue/:id",
      name: "studio-issue-detail",
      component: StudioIssueDetailView,
      meta: {
        domain: "studio",
        title: "Issue Detail",
      },
    },
    {
      path: "/new-studio/issue/:id/metrics",
      name: "studio-issue-metrics",
      component: StudioIssueMetricsView,
      meta: {
        domain: "studio",
        title: "Issue Metrics",
      },
    },
    {
      path: "/new-studio/issues",
      name: "studio-issues",
      component: StudioIssuesView,
      meta: {
        domain: "studio",
        title: "Issues",
      },
    },
    {
      path: "/new-studio/live",
      name: "studio-live",
      component: StudioLiveView,
      meta: {
        domain: "studio",
        title: "Live Issue",
      },
    }
  );
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
