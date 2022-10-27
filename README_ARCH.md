# Architectural Design Decisions

## User Interface Component Library Usage

Component libraries offer a lot of advantages, namely:
- rich user interactions
- built-in accessibility (a11y) capabilities
- built-in responsiveness capabilities
- integration with well-known design frameworks

Any one of the items above can be an extremely large amount of investment when developing a custom user interface - all of them combined just make it obvious that using a component library makes sense.

Since they typically represent the smallest building block in the user interface though, they also represent a large amount of potential library lock-in.
This became evident upon attempting to upgrade from Vue 2 to Vue 3.  During the early days of designing Requisite, the user interface used the BootstrapVue component library.  While working on the upgrade Vue 3, I discovered that BootstrapVue did not support Vue 3 yet.  In fact, upon researching options, very few of the well known component libraries supported Vue 3 yet (or at least not in a stable release candidate) - even 10 months after Vue 3 was formally released as stable.

This type of lock-in felt dangerous to the long-term maintainability of the user interface - so in light of that, a thin abstraction (wrapper) has been introduced to shield the user interface from change.  The wrapper will initially use PrimeVUE (it was just about the only one that had Vue 3 support at the time), but differences between PrimeVUE and BootstrapVue are taken into account and noted in the wrapper components in hopes of one day switching back. Thankfully, this was discovered very early in the design/development of Requisite, so refactoring the UI code was a small amount of effort.  I would not want to have to do this once Requisite was closer to being a full application.

That being said, the goal is that if a change to a component library is desired (such as switching from PrimeVUE back to BootstrapVue), the wrapper components in the `./components/common` directory are the only things that need to change.  In reality, the wrapper components are just "theory" and we won't know if they stand the test of time until at least one library change is made - but hopefully any changes to the rest of the user interface are at least drastically minimized by the wrapper components.

## User Interface Separation of Concerns

The user interface is split into 2 high level layers:
- presentation logic layer
- business logic layer

The presentation logic layer is represented by the `./components`, `./router`, and `./views` directories and uses the Vue framework as its driver.  The business logic layer is represented by the `./services` and `./state-managers` directories.  By design, the business logic layer implements the core logic for the user interface and does not have any dependency on Vue.  This keeps the business layer logic agnositic of any presentation frameworks and easily testable.  If a change to the underlying framework for the presentation layer is needed, the business logic layers should not be impacted.
