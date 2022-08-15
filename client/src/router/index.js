import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ArticleView from '../views/ArticleView.vue'
import AttachmentView from '../views/AttachmentView.vue'
import SearchView from '../views/SearchView.vue'
import EditDocumentView from '../views/EditDocumentView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import store from "@/store"

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Home',
    },
  },
  {
    path: '/article/:doc_num',
    name: 'article',
    component: ArticleView,
    props: true
  },
  {
    path: '/attachment/:url?',
    name: 'attachment',
    component: AttachmentView,
    props: true
  },
  {
    path: '/issues/:name',
    name: 'issues',
    component: SearchView,
    meta: {
      title: 'Issues'
    }
  },
  {
    path: '/regions/:name',
    name: 'regions',
    component: SearchView,
    meta: {
      title: 'Regions'
    }
  },
  {
    path: '/subregions/:name',
    name: 'subregions',
    component: SearchView,
    meta: {
      title: 'Subregions'
    }
  },
  {
    path: '/countries/:name',
    name: 'countries',
    component: SearchView,
    meta: {
      title: 'Countries'
    }
  },
  {
    path: '/search',
    name: 'search',
    component: SearchView,
    meta: {
      title: 'Search',
    }
  },
  {
    path: '/edit',
    name: 'edit',
    component: EditDocumentView,
    meta: {
      title: 'Edit Document',
      admin: true
    },
  },
  { path: '/:pathMatch(.*)*', name: 'notFound', component: NotFoundView, meta: { title: 'Page Not Found', } },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      window.scrollTo(0, 0)
    }
  }
});

router.beforeEach((to, from, next) => {
  //TODO: Handle 403s appropriately for admin-level pages
  if (to.meta.admin) {
    if (store.state.admin) {
      next()
    } else {
      next({ name: 'home' })
    }
  } else {
    if (to.meta.title) {
      if (to.name === 'issues' && to.params.name) {
        document.title = to.params.name
      } else {

        document.title = `${to.meta.title}`;
      }
      next();
    }
    else if (to.params.url) {
      document.title = `${to.params.url}`;
      next();
    }
    else {
      next();
    }
  }

});

export default router
