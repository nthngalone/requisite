# TODO

| Feature         | Sketch | Req | UI | UI Tests | API | API Tests | E2E Tests |
|-----------------|:------:|:---:|:--:|:--------:|:---:|:---------:|:---------:|
| Login           |   N/A  |     |    |          |     |           |           |
| Registration    |   N/A  |     |    |          |     |           |           |
| Forgot Pass     |        |     |    |          |     |           |           |
| Secure Home     |        |     |    |          |     |           |           |
| User Profile    |        |     |    |          |     |           |           |
| Organization    |        |     |    |          |     |           |           |
| Team            |        |     |    |          |     |           |           |
| Product         |        |     |    |          |     |           |           |
| Product Backlog |        |     |    |          |     |           |           |
| Product Work    |        |     |    |          |     |           |           |
| Product Roadmap |        |     |    |          |     |           |           |
| Product Docs    |        |     |    |          |     |           |           |
| Story           |        |     |    |          |     |           |           |
| SysAdmin Users  |        |     |    |          |     |           |           |
| SysAdmin Orgs   |        |     |    |          |     |           |           |

- Core Security Context APIs
    - Create and test system admin apis
    - Create and test teams apis
    - Create and test team membership apis
    - Create and test product epic apis
    - Create and test product feature stories/revisions apis
    - Create and test product story task apis
    - create and test authz middleware

- GUIs to support Core Security Context APIs
    - create homepage GUI with orgs and products
    - create profile update GUI
    - create system admin administration GUI
    - create org administration GUIs
        - create org
        - update org (with memberships)
        - remove org
    - create product administration GUIs
        - create product
        - update product (with memberships)
        - remove product

- Pipeline:
    - start kubernetes if not started?
        - maybe also check for addons?
    - add quality scans (sonar? npm audit?)
    - sonar info
        - https://blog.logrocket.com/how-to-use-static-code-analysis-to-write-quality-javascript-typescript/
        - https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/
    - add switches for ui or api only runs that modify buildContext flags
    - provision & destroy temp namespace? ci run as opposed to ci/cd
    - change pgadmin-servers.json to an ejs template and inject password?
    - only install db/admin if not present and add switch to force redeploy of db
    - give pods specific names
    - if pod fails to start run and display `kubectl describe pod <pod-name>`
    - update logger format/timestamps to match gulp log format/timestamps
    - add a release flag/switch to bump version and publish new tags
    - change gulp callback syntax to async
        - https://gulpjs.com/docs/en/getting-started/async-completion
