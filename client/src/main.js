import { createApp } from 'vue'
import axios from './wireAxios'
import SimpleTypeahead from 'vue3-simple-typeahead';
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import App from './App.vue'
import router from './router'
import store from './store'
import "vue3-carousel/dist/carousel.css";
import './index.css'
import * as CKEditor from '@ckeditor/ckeditor5-vue';

const requireComponent = require.context(
  './components/base',
  false,
  /Base[A-Z]\w+\.(vue|js)$/
)

const app = createApp(App);

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)

  const componentName = upperFirst(
    camelCase(fileName.replace(/^\.\/(.*)\.\w+$/, '$1'))
  )

  app.component(componentName, componentConfig.default || componentConfig)
})

app.provide('$axios', axios);
app.use(SimpleTypeahead).use(store).use(router).use(CKEditor).mount('#app')