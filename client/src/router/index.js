import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ArticleView from '../views/ArticleView.vue'
import AttachmentView from '../views/AttachmentView.vue'
import NotFoundView from '../views/NotFoundView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/article/:id',
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
  { path: '/:pathMatch(.*)*', name: 'notFound', component: NotFoundView },
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
})

export default router
