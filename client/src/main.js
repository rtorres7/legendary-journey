import { createApp } from 'vue'
import axios from './wireAxios'
import App from './App.vue'
import router from './router'
import store from './store'
import "vue3-carousel/dist/carousel.css";
import './index.css'
import CKEditor from '@ckeditor/ckeditor5-vue';

const app = createApp(App);
app.provide('$axios', axios);
app.use(store).use(router).use(router).use(CKEditor).mount('#app')
