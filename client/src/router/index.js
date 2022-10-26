import { createRouter, createWebHashHistory } from 'vue-router'
import store from "@/store"
import { metadata } from "@/config";
import HomeView from '../views/HomeView.vue'
import ArticleView from '../views/ArticleView.vue'
import DemoArticleView from '../views/DemoArticleView.vue'
import AttachmentView from '../views/AttachmentView.vue'
import SearchView from '../views/SearchView.vue'
//import DemoSearchView from '../views/SearchView.vue'
import EditDocumentView from '../views/EditDocumentView.vue'
import ProfileView from '../views/ProfileView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import PublishArticleView from '../views/PublishArticleView.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: metadata.application_name,
    },
  },
  {
    path: '/article/:doc_num',
    name: 'article',
    component: ArticleView,
    props: true
  },
  {
    path: '/demo-article/:doc_num',
    name: 'demo-article',
    component: DemoArticleView,
    props: true,
    meta: {
      demo: true
    }
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
      title: 'Issues',
    }
  },
  {
    path: '/regions/:name',
    name: 'regions',
    component: SearchView,
    meta: {
      title: 'Regions',
    }
  },
  {
    path: '/subregions/:name',
    name: 'subregions',
    component: SearchView,
    meta: {
      title: 'Subregions',
    }
  },
  {
    path: '/countries/:name',
    name: 'countries',
    component: SearchView,
    meta: {
      title: 'Countries',
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
  // {
  //   path: '/demo-search',
  //   name: 'demo-search',
  //   component: DemoSearchView,
  //   meta: {
  //     title: 'Search (Demo)',
  //     demo: true
  //   }
  // },
  {
    path: '/publish',
    name: 'publish',
    component: PublishArticleView,
    meta: {
      title: 'Publish an Article',
      demo: true
      // admin: true,
    },
  },
  {
    path: '/demo-article/new',
    name: 'new',
    component: EditDocumentView,
    meta: {
      title: 'New Document',
      // admin: true,
      demo: true
    }
  },
  {
    path: '/demo-article/edit/:id',
    name: 'edit',
    component: EditDocumentView,
    meta: {
      title: 'Edit Document',
      // admin: true,
      demo: true
    },
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: {
      title: 'Profile',
      // admin: true,
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
      if (
        to.name === 'issues' ||
        to.name === 'regions' ||
        to.name === 'subregions' ||
        to.name === 'countries' &&
        to.params.name
      ) {
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
