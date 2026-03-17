import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import 'leaflet/dist/leaflet.css'
import './assets/css/global.css';
import '@fortawesome/fontawesome-free/css/all.css';

const app = createApp(App);

app.use(router);

app.mount('#app');
