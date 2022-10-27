# Architectural Design Decisions

## Pipeline

A simple CI/CD pipeline was implemented using the Gulp.js library.  This was done for a few reasons:

- This repo was originally a private/local project.  Having a pipeline that I could easily run locally was essential.
- Again, since this repo was originally a private/local project, paying for a cloud service was out, and setting up yet another tool locally was "meh"
- Using Gulp.js allows me to keep the core language for the system in the JavaScript/TypeScript family.

> Side note... out of the multitude of JavaScript projects out there, I'm surprised that there's no CI/CD system built on JavaScript.  Maybe that would be an interesting side project one day...

The Gulp pipeline has also been integrated with GitHub actions so that the same quality checks are made upon pushes and merges.

## User Interface Component Library Usage

Component libraries offer a lot of advantages, namely:
- rich user interactions
- built-in accessibility (a11y) capabilities
- built-in responsiveness capabilities
- integration with well-known design frameworks

Any one of the items above can be an extremely large amount of investment when developing a custom user interface - all of them combined just make it obvious that using a component library makes sense.

Since they typically represent the smallest building block in the user interface though, they also represent a large amount of potential library lock-in.
This became evident upon attempting to upgrade from Vue 2 to Vue 3.  During the early days of designing Requisite, the user interface used the BootstrapVue component library.  While working on the upgrade Vue 3, I discovered that BootstrapVue did not support Vue 3 yet.  In fact, upon researching options, very few of the well known component libraries supported Vue 3 yet (or at least not in a stable release candidate) - even a year+ after Vue 3 was formally released as stable.

This type of lock-in felt dangerous to the long-term maintainability of the user interface - so in light of that, a thin abstraction (wrapper) has been introduced to shield the user interface from change.  The wrapper was initially started with PrimeVUE as it was just about the only one that had Vue 3 support at the time, but dissapointment in the PrimeVUE library has led me to just implement some basic components with my own styling using Bootstrap instead.   Thankfully, this was discovered very early in the design/development of Requisite, so refactoring the UI code was a small amount of effort.  I would not want to have to do this once Requisite was closer to being a full application.  I hope to switch back to BootstrapVue in the near future once it has Vue3 support available (or at least a published compatibility layer).

That being said, the goal is that if a change to a component library is desired (such as switching from PrimeVUE back to BootstrapVue), the wrapper components in the `./components/common` directory are the only things that need to change.  In reality, the wrapper components are just "theory" and we won't know if they stand the test of time until at least one library change is made - but hopefully any changes to the rest of the user interface are at least drastically minimized by the wrapper components.

## User Interface Separation of Concerns

The user interface is split into 2 high level layers:
- presentation logic layer
- business logic layer

The presentation logic layer is represented by the `./components`, `./router`, and `./views` directories and uses the Vue framework as its driver.  The business logic layer is represented by the `./services` and `./state-managers` directories.  By design, the business logic layer implements the core logic for the user interface and does not have any dependency on Vue.  This keeps the business layer logic agnositic of any presentation frameworks and easily testable.  If a change to the underlying framework for the presentation layer is needed, the business logic layers should not be impacted.

## Testing Methodologies

There are three basic types of tests - unit, integration, and end-to-end.  The use of these types of tests has so far been tailored to the different areas of the application.  This may not be a perfect testing strategy, but it is a balance of time, stability, and ROI.  The following sections describe the testing strategy for the 3 main areas of source for the system.

### UI

The individual components are unit tested and the views are integration tested with the components.  End-to-end tests are then created to test the full system together.  Since all (most) UI testing revolves around interacting with the same elements, a suite of page objects is maintained representing the individual chunks of UI.  These page objects are then used in all UI tests.  The theory is that if something in the UI layout changes, but does not affect the overall functionality of the page, the page object can be updated and all of the tests (unit, integration, and end-to-end) are good to go.  The page objects are meant to abstract away the brittle nature of the DOM from the tests themselves so that they are simpler and more stable.  Accessibility testing will also eventually be built into all UI tests using a library such as aXe.

### API

API testing has focused primarily on integration and end-to-end tests.  Ideally, there would be unit tests as well, but with limited time to work on this project, integration tests have provided a larger ROI as each API represents a chain of middleware and resource modules.  Supertest has been used for this integration testing as it allows us to test the API from a perspective of a RESTful HTTP request instead of just method calls.

### Utils

Utility testing is focused on just unit testing.  As these are basic utilities (simple inputs and outputs), unit testing is easy and the best route to make sure all use cases are covered.
