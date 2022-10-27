# Requisite

Next-generation system for gathering requirements, managing work, and documentating your products.

In my experience (or opinion really), most work management tools today have the following limitations:
- They tend to be very generic and customizations become time consuming to set up.  The end result is inconsistency in how work is managed, leading to product team confusion.
- They tend to focus on getting work done.  This isn't necessarily a bad thing, but once the work is complete - then what?  How do you know what was done without extensive data-mining?  Why put all that work into gathering requirements for work, just to never look at them again once the work is done.
- They tend to focus on moments in time or individual efforts rather than a holistic system.
- Estimating the sizing of new work and roadmapping the future is hard - it mostly comes down to gut instinct which is error-prone.  These tasks should be more data-driven in order to improve accuracy.
- Many product teams have funding come from different sources and tracking funding (money/hours) is a separate concept from task sizing that many tools don't handle well.

Requisite uses an opinionated flow of events for managing the lifecycle of your product and attempts to guide you step-by-step along the way.  Guardrails prevent you from moving to the next step before the requirements of the preceeding step are complete.  The current goals for the requisite system are:

1. Requirements are gathered as versioned stories.  Stories are meant to be granular use cases.  New versions are added to an overall backlog of work for the product.  The process of gathering requirements for a story revision is targeted at specific pieces of information instead of just freeform text.  Examples include:
    - Persona (constituent) impacted
    - Business requirement description - including the "why's"
    - Acceptance criteria
    - Mockups if applicable
    - Funding id for tracking funding if applicable
1. Once a new version and its acceptance criteria are approved, it can be moved into a work state, where tasks for completion can be added and the overall effort can be sized.
    - When sizing, the system will attempt to give suggestions for sizing based on past work.
1. Once the level of effort is known, a version can be added to a work cycle (iteration/sprint).
    - When planning a work cycle, the system will guide the team through the appropriate work to add based on past performance and projected team availability
    - Past performance is normalized against team availability.  At the end of a work cycle, the team availability information is updated with actuals so that the past performance statistics are accurate.
1. While in the work cycle state, a normal kanban flow can be used - New, In Progress, Testing, Blocked, Completed.  This is usually the bread-and-butter of all work management systems, but in requisite it only represents one part of the entire system.
1. Upon successful completion of the work item, the following events happen for the story revision:
    - The revision has the opportuntity to update its sizing (was it bigger or smaller than originally intended) - this is crucial for context when sizing future work
    - The story revision can be added to a release.  There is an important distinction between finishing work and releasing it to users.  Releases allow the product team to tie version updates and release notes back to a set of work.
    - Once added to a release, the story revision becomes the current version represented in the product documentation
1. A roadmapping feature can analyze the sized story revisions in the backlog and attempt to project where they will fall in a timeline based on priority, size, past team performance, and average team availability
1. A funding dashboard can track billing ids across work cycles and even across products - combining time spent with task size in hopes of providing better insights into budgeting for organizations

This will be an ambitious undertaking, therefore I will be targeting certain MVP milestones.  The first milestone is to get far enough along with requisite so that it can be used to actually manage itself.  To get there, I will initially focus on bare-bones implementations of many of these features.  I feel this is an extremely important goal for many reasons:
- It gives me something to demo.  As they say, a picture speaks a thousand words.
- It forces me to eat my own cooking.  What better way to find issues or improvements than to be an actual user?

For more technical details on the project, click the following links for more information:
- [Architectural Design Decisions](./README_ARCH.md)
- [Development Guide](./README_DEV.md)
- [Dependency Notes](./README_DEPS.md)
- [Current Things TODO](./README_TODO.md)
- [Ideation](./README_IDEAS.md)