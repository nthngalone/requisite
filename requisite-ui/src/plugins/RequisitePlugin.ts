import { App } from 'vue';
import router from '../router';
import RequisiteAlert from '../components/common/RequisiteAlert.vue';
import RequisiteAvatar from '../components/common/RequisiteAvatar.vue';
import RequisiteButton from '../components/common/RequisiteButton.vue';
import RequisiteCheckbox from '../components/common/RequisiteCheckbox.vue';
import RequisiteForm from '../components/common/RequisiteForm.vue';
import RequisiteLink from '../components/common/RequisiteLink.vue';
import RequisiteNavBar from '../components/common/RequisiteNavBar.vue';
import RequisitePassword from '../components/common/RequisitePassword.vue';
import RequisiteTextbox from '../components/common/RequisiteTextbox.vue';
import RequisiteAvatarMenu from '../components/common/RequisiteAvatarMenu.vue';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

export default {
    install(app: App /*, options?: any */): void {

        // Install Vue Router
        app.use(router);

        // Install custom PrimeVUE wrapper components
        app.component('r-alert', RequisiteAlert);
        app.component('r-avatar', RequisiteAvatar);
        app.component('r-button', RequisiteButton);
        app.component('r-checkbox', RequisiteCheckbox);
        app.component('r-form', RequisiteForm);
        app.component('r-link', RequisiteLink);
        app.component('r-navbar', RequisiteNavBar);
        app.component('r-avatar-menu', RequisiteAvatarMenu);
        app.component('r-password', RequisitePassword);
        app.component('r-textbox', RequisiteTextbox);
    }
};
