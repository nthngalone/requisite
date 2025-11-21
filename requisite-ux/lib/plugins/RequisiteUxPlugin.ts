import { type App } from 'vue';
import RequisiteAlert from '../components/RequisiteAlert.vue';
import RequisiteAlertMessage from '../components/RequisiteAlertMessage.vue';
import RequisiteAvatar from '../components/RequisiteAvatar.vue';
import RequisiteButton from '../components/RequisiteButton.vue';
import RequisiteCheckbox from '../components/RequisiteCheckbox.vue';
import RequisiteForm from '../components/RequisiteForm.vue';
import RequisiteGrid from '../components/RequisiteGrid.vue';
import RequisiteGridRow from '../components/RequisiteGridRow.vue';
import RequisiteGridColumn from '../components/RequisiteGridColumn.vue';
import RequisiteLink from '../components/RequisiteLink.vue';
import RequisiteNavBar from '../components/RequisiteNavBar.vue';
import RequisiteTextboxSensitive from '../components/RequisiteTextboxSensitive.vue';
import RequisiteTextbox from '../components/RequisiteTextbox.vue';
import RequisiteDropdownMenu from '../components/RequisiteDropdownMenu.vue';
import RequisiteCard from '../components/RequisiteCard.vue';
import RequisiteCardBlock from '../components/RequisiteCardBlock.vue';
import RequisiteFormControls from '../components/RequisiteFormControls.vue';
import RequisiteIcon from '../components/RequisiteIcon.vue';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default {
    install(app: App /*, options?: any */): void {

        // Install custom UX wrapper components
        app.component('r-alert', RequisiteAlert);
        app.component('r-alert-message', RequisiteAlertMessage);
        app.component('r-avatar', RequisiteAvatar);
        app.component('r-button', RequisiteButton);
        app.component('r-card', RequisiteCard);
        app.component('r-card-block', RequisiteCardBlock);
        app.component('r-checkbox', RequisiteCheckbox);
        app.component('r-dropdown-menu', RequisiteDropdownMenu);
        app.component('r-form', RequisiteForm);
        app.component('r-form-controls', RequisiteFormControls);
        app.component('r-grid', RequisiteGrid);
        app.component('r-grid-row', RequisiteGridRow);
        app.component('r-grid-col', RequisiteGridColumn);
        app.component('r-icon', RequisiteIcon);
        app.component('r-link', RequisiteLink);
        app.component('r-navbar', RequisiteNavBar);
        app.component('r-textbox', RequisiteTextbox);
        app.component('r-textbox-sensitive', RequisiteTextboxSensitive);
    }
};
