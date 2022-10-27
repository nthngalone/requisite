// Helper class to build selector strings for common elements
// These should be roughly one-to-one with the components in
// @requisite/ui/src/components/common
//
// If design systems change, this utility should isolate most of that change
// from the individual page objects

export function navElementSelector(rootSelector: string, elementName: string) {
    return `nav[data-name=${rootSelector}] [data-name=${elementName}]`;
}

export function navElementTextSelector(rootSelector: string, elementName: string) {
    return `nav[data-name=${rootSelector}] [data-name=${elementName}] span`;
}

export function navElementLinkSelector(rootSelector: string, elementName: string) {
    return `nav[data-name=${rootSelector}] [data-name=${elementName}] a`;
}

export function avatarSelector(rootSelector: string, avatarName: string) {
    return `${rootSelector} .avatar[data-name=${avatarName}]`;
}

export function formSelector(rootSelector: string, formName: string) {
    return `${rootSelector} form[data-name=${formName}]`;
}

export function textboxInputSelector(rootSelector: string, textboxName: string) {
    return `${rootSelector} [data-name=${textboxName}] input[type=text]`;
}

export function passwordInputSelector(rootSelector: string, passwordName: string) {
    return `${rootSelector} [data-name=${passwordName}] input[type=password]`;
}

export function checkboxInputSelector(rootSelector: string, checkboxName: string) {
    return `${rootSelector} [data-name=${checkboxName}] input[type=checkbox]`;
}

export function buttonSelector(rootSelector: string, buttonName: string) {
    return `${rootSelector} button[data-name=${buttonName}]`;
}

export function linkSelector(rootSelector: string, linkName: string) {
    return `${rootSelector} a[data-name=${linkName}]`;
}

export function alertSelector(rootSelector: string, alertName: string) {
    return `${rootSelector} .alert[data-name=${alertName}]`;
}

export function alertMessageSelector(
    rootSelector: string, alertName: string, messageName: string
) {
    return `${rootSelector} .alert[data-name=${alertName}] .${messageName}`;
}
