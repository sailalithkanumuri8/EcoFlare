import { createApp } from 'vue';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import { createMemoryHistory, createRouter } from 'vue-router';
import Upload from './components/Upload.vue';
import Home from './components/Home.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/upload', component: Upload },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})


const app = createApp(App);

app.use(PrimeVue);
app.use(router)    
app.use(ToastService);  
app.mount('#app');
