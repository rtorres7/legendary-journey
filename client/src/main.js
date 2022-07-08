import { createApp } from 'vue'
import axios from './wireAxios'
import SimpleTypeahead from 'vue3-simple-typeahead';
import App from './App.vue'
import router from './router'
import store from './store'
import "vue3-carousel/dist/carousel.css";
import './index.css'

const app = createApp(App);
app.provide('$axios', axios);
app.use(SimpleTypeahead).use(store).use(router).use(router).mount('#app')
