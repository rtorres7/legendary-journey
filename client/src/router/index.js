import { createRouter, createWebHistory } from "vue-router";
import { metadata } from "@/config";
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
import DniView from "../views/DniView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: {
      title: metadata.application_name,
    },
  },
  { path: "/dni/", name: "dni", component: DniView },
  {
    path: "/product/:doc_num/preview",
    name: "product-preview",
    component: ProductView,
  },
  {
    path: "/product/:doc_num",
    name: "product",
    component: ProductView,
  },
  {
    path: "/attachment/:url?",
    name: "attachment",
    component: AttachmentView,
    props: true,
    meta: {
      viewType: "attachment",
    },
  },
  {
    path: "/issues/:name",
    name: "issues",
    component: SearchView,
    meta: {
      viewType: "search",
    },
  },
  {
    path: "/regions/:name",
    name: "regions",
    component: SearchView,
    meta: {
      viewType: "search",
    },
  },
  {
    path: "/subregions/:name",
    name: "subregions",
    component: SearchView,
    meta: {
      viewType: "search",
    },
  },
  {
    path: "/countries/:name",
    name: "countries",
    component: SearchView,
    meta: {
      viewType: "search",
    },
  },
  {
    path: "/search",
    name: "search",
    component: SearchView,
    meta: {
      viewType: "search",
    },
  },
  {
    path: "/search_tips",
    name: "searchTips",
    component: SearchTipsView,
    meta: {
      title: "Advanced Search Tips",
    },
  },
  {
    path: "/:date/products",
    name: "products",
    component: PublishProductView,
    meta: {
      title: "Manage Products",
    },
  },
  {
    path: "/special_editions/:id(\\d+)",
    name: "specialEdition",
    component: SpecialEditionView,
    meta: {
      title: "Special Edition",
    },
  },
  {
    path: "/special_editions",
    name: "specialEditions",
    component: SpecialEditionsManagerView,
    meta: {
      title: "Manage Special Editions",
    },
  },
  {
    path: "/product/:date/:id/:doc_num/edit",
    name: "edit",
    component: EditProductView,
    meta: {
      title: "Edit Product",
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notFound",
    component: NotFoundView,
    meta: { title: "Page Not Found" },
  },
];

if (import.meta.env.MODE !== "production") {
  routes.push({
    path: "/workspace",
    name: "workspace",
    component: MockWorkspaceView,
    meta: {
      title: "Workspace",
      demo: true,
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
    document.title = to.meta.title ? to.meta.title : metadata.application_name;
  }
  next();
});

export default router;
