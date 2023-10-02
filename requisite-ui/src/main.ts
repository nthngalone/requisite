import { createApp } from 'vue';
import App from './App.vue';
import RequisitePlugin from './plugins/RequisitePlugin';

createApp(App).use(RequisitePlugin).mount('#app');
