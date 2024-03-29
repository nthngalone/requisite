# Ideas

These are ideas that I have or technologies that I come across that I think are worth investigating.

- fix css linting in ui and add to main lint script
  https://redfin.engineering/node-modules-at-war-why-commonjs-and-es-modules-cant-get-along-9617135eeca1
- update jest super tests to use all async for consistency
- create work backlog/work item apis
- create work backlog/work item GUIs
- change expired authentication to prompt user for new password
- add blocked/locked authentication scenario
- add password strength meter & validation to registration
- enhance log levels with more granular trace strings
- add security questions to registration ui/model/api
- create user profile update UI/api
- add loading animations to UI
- develop a custom theme for requisite
- update JWT to only store username/id and auth handler looks user up every time
- add config to nginx to resolve vue routes to index
- enhance deployment script
- figure out .dockerignore for shared modules
- update termsAgreement in registration to create a termsAcceptedDate property on profile
- add a custom date/time model?
- add a forgot password feature
- add a11y checks to tests
- create an environment variable utility to add some robustness
- look at adding an elk container for log aggregation (https://hub.docker.com/r/sebp/elk)
- feature flagging framework
- look at incorporating semantic-release (https://github.com/semantic-release/semantic-release)
- look at generating API docs.  openApi?
- should I include a WAF?  Node? NGINX?  (probably nginx for best security)  look at ngx-waf
- axe and lighthouse checks
- cucumber?
- js security linter (eslint-plugin-security)
- add a sast (static analysis security testing) tool - synk code?
- dast tool?  contrast security?
- add a static analysis tool - sonar?
- postgREST?  is this worth it?  replace ORM?  postgrest.org
- use pm2 for local autotesting - github actions?
- component UI testing approaches - https://storybook.js.org/blog/how-to-actually-test-uis/
- look at using p-series and p-map for async for each utils
- look at clinicjs.org - MIT licensed node profiling - looks pretty sweet
- add upvote/consensus vote for stories - requirements to add to sprint
- define maintenance schedule: https://nodesource.com/blog/the-Node.js-application-maintainer-guide
- look at apostrophejs cms system or tenseijs (https://tenseijs.com/docs/getting-started)
- or strapi cms
- look at madge for dependency analysis
- look at using cypress for e2e testing
- write up recommendations on unit vs integration vs e2e testing
- review security header recommendations listed at: https://web.dev/security-headers/
- look at xstate for statemachines (or use patterns to model custom statemachine)
- upgrade to Vue 3
- in kanban style - buttons for move all to next phase (release)
- look at using awilix for IoC/DI capabilities in the API
- add a work effort api.  work efforts belong to an org and story revisions reference them
  - work effort roles - project management?
  - work effort details/requirements?
  - additional apis can be added for reporting across products
- use gravatar for avatars?
- docker resources: https://dev.to/ankit01oss/7-github-projects-to-supercharge-your-docker-practices-2i80
- Look at using artillery for load testing https://blog.appsignal.com/2021/11/10/a-guide-to-load-testing-nodejs-apis-with-artillery.html
- look a ssshape for some graphics
- vuestic component library? https://github.com/epicmaxco/vuestic-ui
- Look at auto for release workflows and tagging
- look at chroma.js for generating color palletes for custom themes
- favicon guide: https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs
- distributed tracing: https://dev.to/signoz/implementing-distributed-tracing-in-a-nodejs-application-5369
- Use https://www.npmjs.com/package/npm-check-updates to manage dependency updates
- github action pr-compliance-action - consider setting up for transition to OSS
- look at fluxcd.io for gitops processes on k8s - app & infrastructure
    - continuous deployment
    - progressive delivery (feature flags/canary/etc)
- add story types
  - spike
  - architecturally significant
  - analysis
  - infrastructure
- look at Nx for monorepo management
- look at humaaans for people graphics https://www.humaaans.com
- look at https://github.com/nitnelave/lldap for user/ldap support
- look at apprise for notifications: https://github.com/caronc/apprise
- think about an analytics module, workflow analysis, process indicators (look at swarmia as an example)
- set up content site with mock demo - requisite.dev
- look at express-openapi and openapi-request-validator and openapi-response-validator
- Look at dagger for pipelines (https://dagger.io/)
- look at dflex for drag'n'drop
- look at integrating memlab for memory leak testing (https://engineering.fb.com/2022/09/12/open-source/memlab/?utm_source=tldrnewsletter)
- look at coroot for microservice monitoring https://github.com/coroot/coroot?utm_source=tldrnewsletter
- look at modern-errors for custom error classes https://www.npmjs.com/package/modern-errors
- look at vale.sh - looks like linting for markdown files
- Look at BlockSuite for creating content editors - https://github.com/toeverything/blocksuite
- look at [inkline](https://www.inkline.io/) for a design/component library option
- look at [winded](https://winded.inttodouble.com/) for testing multiple viewport sizes
- [typescript + esm docs](https://www.typescriptlang.org/docs/handbook/esm-node.html)
- look at building a guided tours of requisite with [drive.js](https://driverjs.com/)
- [maildev](https://maildev.github.io/maildev/) - test email server
- look at [infisical](https://github.com/Infisical/infisical) for secret management

Color palette possibilities:
https://venngage.com/tools/accessible-color-palette-generator
- Primary #D2AD97
  - Vibrant Palette
    #c3bdc1, #000000
    #d2cccd, #000000
    #d2ad97, #000000
    #cfba86, #000000
    #a2ab82, #000000
  - Pastel Contrasting Palette 1
    #bbd0dd, #000000
    #cee0eb, #000000
    #fcebe2, #000000
    #f1dbd0, #000000
    #e6ccbd, #000000
  - Pastel Contrasting Palette 2
    #d7d5e2, #000000
    #e4e2ee, #000000
    #f1dbd0, #000000
    #c2d8cc, #000000
    #a7c3b5, #000000