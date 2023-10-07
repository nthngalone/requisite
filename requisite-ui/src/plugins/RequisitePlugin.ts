import { type App } from 'vue';
import router from '../router';
import RequisiteAlert from '../components/common/RequisiteAlert.vue';
import RequisiteAlertMessage from '../components/common/RequisiteAlertMessage.vue';
import RequisiteAvatar from '../components/common/RequisiteAvatar.vue';
import RequisiteButton from '../components/common/RequisiteButton.vue';
import RequisiteCheckbox from '../components/common/RequisiteCheckbox.vue';
import RequisiteForm from '../components/common/RequisiteForm.vue';
import RequisiteLink from '../components/common/RequisiteLink.vue';
import RequisiteNavBar from '../components/common/RequisiteNavBar.vue';
import RequisitePassword from '../components/common/RequisitePassword.vue';
import RequisiteTextbox from '../components/common/RequisiteTextbox.vue';
import RequisiteDropdownMenu from '../components/common/RequisiteDropdownMenu.vue';
import RequisiteCard from '../components/common/RequisiteCard.vue';
import RequisiteFormControls from '../components/common/RequisiteFormControls.vue';

import { Inkline, components } from '@inkline/inkline';
import '../css/variables/index.scss';
import '@inkline/inkline/css/index.scss';
import '@inkline/inkline/css/utilities.scss';

export default {
    install(app: App /*, options?: any */): void {

        // Install Vue Router
        app.use(router);

        app.use(Inkline, { components });

        // Install custom UI wrapper components
        app.component('r-alert', RequisiteAlert);
        app.component('r-alert-message', RequisiteAlertMessage);
        app.component('r-avatar', RequisiteAvatar);
        app.component('r-button', RequisiteButton);
        app.component('r-card', RequisiteCard);
        app.component('r-checkbox', RequisiteCheckbox);
        app.component('r-dropdown-menu', RequisiteDropdownMenu);
        app.component('r-form', RequisiteForm);
        app.component('r-form-controls', RequisiteFormControls);
        app.component('r-link', RequisiteLink);
        app.component('r-navbar', RequisiteNavBar);
        app.component('r-password', RequisitePassword);
        app.component('r-textbox', RequisiteTextbox);
    }
};
