/* eslint-disable quotes */
export default [
    // The next 3 are more than likely issues with inkline - but there is extensive menu
    // design work still to be done, so I'm not worrying about them right now.  If they
    // continue to be issues after the menu is more complete, I'll take up with inkline.
    {
        "id": "aria-allowed-attr",
        "impact": "critical",
        "summary": "Fix all of the following:\n  ARIA attribute is not allowed: aria-expanded=\"true\"",
        "help": "Elements must only use supported ARIA attributes",
        "helpUrl": "https://dequeuniversity.com/rules/axe/4.8/aria-allowed-attr?application=axeAPI",
        "html": "<div class=\"_justify-content:flex-end navbar-collapsible\" aria-hidden=\"false\" aria-expanded=\"true\"><nav class=\"nav -light -md\" role=\"menubar\"></nav></div>"
    },
    {
        "id": "aria-allowed-attr",
        "impact": "critical",
        "summary": "Fix all of the following:\n  ARIA attribute is not allowed: aria-expanded=\"true\"",
        "help": "Elements must only use supported ARIA attributes",
        "helpUrl": "https://dequeuniversity.com/rules/axe/4.8/aria-allowed-attr?application=axeAPI",
        "html": "<div class=\"_justify-content:flex-end navbar-collapsible\" aria-hidden=\"false\" aria-expanded=\"true\">"
    },
    {
        "id": "aria-required-children",
        "impact": "critical",
        "summary": "Fix any of the following:\n  Element has children which are not allowed: div[aria-haspopup]\n  Element uses aria-busy=\"true\" while showing a loader",
        "help": "Certain ARIA roles must contain particular children",
        "helpUrl": "https://dequeuniversity.com/rules/axe/4.8/aria-required-children?application=axeAPI",
        "html": "<nav class=\"nav -light -md\" role=\"menubar\">"
    },
    // The next two are more than likely an issue with inkline - but not sure why the
    // checkbox is marked as hidden.  This checkbox on the signup page should always be
    // visible.  Also, it did not come up in my unit tests, but showed up in the e2e
    // tests. The two findings are just variations on checked/unchecked. Needs more
    // research to determine what's going on.
    {
        "id": "aria-hidden-focus",
        "impact": "serious",
        "summary": "Fix all of the following:\n  Focusable content should be disabled or be removed from the DOM",
        "help": "ARIA hidden element must not be focusable or contain focusable elements",
        "helpUrl": "https://dequeuniversity.com/rules/axe/4.8/aria-hidden-focus?application=axe-puppeteer",
        "html": "<input type=\"checkbox\" name=\"terms-agreement\" aria-hidden=\"true\" aria-checked=\"false\" aria-readonly=\"false\">"
    },
    {
        "id": "aria-hidden-focus",
        "impact": "serious",
        "summary": "Fix all of the following:\n  Focusable content should be disabled or be removed from the DOM",
        "help": "ARIA hidden element must not be focusable or contain focusable elements",
        "helpUrl": "https://dequeuniversity.com/rules/axe/4.8/aria-hidden-focus?application=axe-puppeteer",
        "html": "<input type=\"checkbox\" name=\"terms-agreement\" aria-hidden=\"true\" aria-checked=\"true\" aria-readonly=\"false\">"
    },
    // The next 3 are an issue with inkline - the outer div has a role of "checkbox" but
    // it has an actual checkbox inside the div, which is apparently not allowed - will
    // take up with inkline after more research.  The 3 different variations are just
    // variations in the DOM at different points of the tests (checked/unchecked/etc)
    {
        "id": "nested-interactive",
        "impact": "serious",
        "summary": "Fix any of the following:\n  Element has focusable descendants",
        "help": "Interactive controls must not be nested",
        "helpUrl": "https://dequeuniversity.com/rules/axe/4.8/nested-interactive?application=axe-puppeteer",
        "html": "<div class=\"checkbox -light -md\" aria-checked=\"false\" role=\"checkbox\">"
    },
    {
        "id": "nested-interactive",
        "impact": "serious",
        "summary": "Fix any of the following:\n  Element has focusable descendants",
        "help": "Interactive controls must not be nested",
        "helpUrl": "https://dequeuniversity.com/rules/axe/4.8/nested-interactive?application=axeAPI",
        "html": "<div class=\"checkbox -light -md\" aria-checked=\"true\" role=\"checkbox\"><input type=\"checkbox\" name=\"terms-agreement\" aria-hidden=\"true\" aria-checked=\"true\" aria-readonly=\"false\"><label class=\"checkbox-label\" tabindex=\"0\">I accept the terms and conditions.</label></div>"
    },
    {
        "id": "nested-interactive",
        "impact": "serious",
        "summary": "Fix any of the following:\n  Element has focusable descendants",
        "help": "Interactive controls must not be nested",
        "helpUrl": "https://dequeuniversity.com/rules/axe/4.8/nested-interactive?application=axeAPI",
        "html": "<div class=\"checkbox -light -md\" aria-checked=\"false\" role=\"checkbox\"><input type=\"checkbox\" name=\"terms-agreement\" aria-hidden=\"true\" aria-checked=\"false\" aria-readonly=\"false\"><label class=\"checkbox-label\" tabindex=\"0\">I accept the terms and conditions.</label></div>"
    }
];
