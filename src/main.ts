import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { draggable } from '@/directives/draggable';

const app = createApp(App)
app.use(router)
app.directive('draggable', draggable)
app.mount('#app')
