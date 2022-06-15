import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ArticleView from '../views/ArticleView.vue'
import AttachmentView from '../views/AttachmentView.vue'
import NotFoundView from '../views/NotFoundView.vue'

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
    path: '/article/:id',
    name: 'article',
    component: ArticleView,
    meta: {
      title: 'Article - ',
    },
    props: true
  },
  {
    path: '/attachment/:url?',
    name: 'attachment',
    component: AttachmentView,
    props: true
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
  document.title = `${to.meta.title}`;
  next();
});

export default router
