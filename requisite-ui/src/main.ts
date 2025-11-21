import { createApp } from 'vue';
import App from './App.vue';
import RequisitePlugin from './plugins/RequisitePlugin';
import router from './router';

createApp(App)
    .use(router)
    .use(RequisitePlugin)
    .mount('#app');
