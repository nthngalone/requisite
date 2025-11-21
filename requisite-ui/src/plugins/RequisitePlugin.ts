import { type App } from 'vue';
import RequisiteRouterLink from '../components/common/RequisiteRouterLink.vue';
import RequisiteUxPlugin from '@requisite/ux/lib/plugins/RequisiteUxPlugin';

export default {
    install(app: App /*, options?: any */): void {

        app.use(RequisiteUxPlugin);

        // Install custom UI wrapper components
        app.component('r-router-link', RequisiteRouterLink);
    }
};
