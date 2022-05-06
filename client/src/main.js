import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "vue3-carousel/dist/carousel.css";
import './index.css'


createApp(App).use(store).use(router).use(router).mount('#app')
