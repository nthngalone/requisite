// Helper class to build selector strings for common elements
// These should be roughly one-to-one with the components in
// @requisite/ui/src/components/common
//
// If design systems change, this utility should isolate most of that change
// from the individual page objects

export function navBarSelector(rootSelector: string, elementName: string) {
    return `${rootSelector} .r-navbar[data-name=${elementName}]`;
}

export function navElementSelector(rootSelector: string, elementName: string) {
    return `${rootSelector} .r-nav-element[data-name=${elementName}]`;
}

export function navElementTextSelector(rootSelector: string, elementName: string) {
    return `${rootSelector}] .r-nav-element[data-name=${elementName}] span`;
}

export function navElementLinkSelector(rootSelector: string, elementName: string) {
    return `${rootSelector} .r-nav-element[data-name=${elementName}] a`;
}

export function dropDownMenuSelector(rootSelector: string, menuName: string) {
    return `${rootSelector} .r-dropdown-menu[data-name=${menuName}]`;
}

export function dropDownMenuTextSelector(rootSelector: string, itemName: string) {
    return `${rootSelector} .r-dropdown-menu-item[data-name=${itemName}] span`;
}

export function dropDownMenuLinkSelector(rootSelector: string, itemName: string) {
    return `${rootSelector} .r-dropdown-menu-item[data-name=${itemName}] .r-link`;
}

export function avatarSelector(rootSelector: string, avatarName: string) {
    return `${rootSelector} .r-avatar[data-name=${avatarName}]`;
}

export function formSelector(rootSelector: string, formName: string) {
    return `${rootSelector} .r-form[data-name=${formName}]`;
}

export function formControlsSelector(rootSelector: string, formControlsName: string) {
    return `${rootSelector} .r-form-controls[data-name=${formControlsName}]`;
}

export function textboxInputSelector(rootSelector: string, textboxName: string) {
    return `${rootSelector} .r-textbox[data-name=${textboxName}] input[type=text]`;
}

export function passwordInputSelector(rootSelector: string, passwordName: string) {
    return `${rootSelector} .r-password[data-name=${passwordName}] input[type=password]`;
}

export function checkboxInputSelector(rootSelector: string, checkboxName: string) {
    return `${rootSelector} .r-checkbox[data-name=${checkboxName}] input[type=checkbox]`;
}

export function buttonSelector(rootSelector: string, buttonName: string) {
    return `${rootSelector} .r-button[data-name=${buttonName}]`;
}

export function linkSelector(rootSelector: string, linkName: string) {
    return `${rootSelector} .r-link[data-name=${linkName}]`;
}

export function alertSelector(rootSelector: string, alertName: string) {
    return `${rootSelector} .r-alert[data-name=${alertName}]`;
}

export function alertMessageSelector(
    rootSelector: string, alertName: string, messageName: string
) {
    return `${rootSelector} .r-alert[data-name=${alertName}] .r-alert-message[data-name=${messageName}]`;
}
