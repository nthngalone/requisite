# Requisite

Next-generation system for gathering requirements, managing work, and documentating your products.

In my experience, most work tools today have the following limitations:
- They tend to be very generic and customizations become time consuming to set up.  The end result is inconsistency in how work is managed, leading to product team confusion.
- They tend to focus on getting work done.  Once the work is complete - then what?  How do you know what was done without extensive datamining?
- They tend to focus on moments in time or individual efforts rather than a holistic system.
- Estimating the sizing of new work and roadmapping the future is hard - it mostly comes down to gut instinct which is error-prone.

Requisite uses an opinionated flow of events for managing the lifecycle of your product and attempts to guide you step-by-step along the way.  Guardrails prevent you from moving to the next step before the requirements of the preceeding step are complete.

1. Requirements are gathered as versioned stories.  New versions are added to an overall backlog of work for the product.
1. Once a new version and its acceptance criteria are approved, it can be moved into a work state, where tasks for completion can be added and the overall effort can be sized.
    - When sizing, the system will attempt to give suggestions for sizing based on past work.
1. Once the level of effort is known, a version can be added to a work cycle (iteration/sprint).
    - When planning a work cycle, the system will guide the team through the appropriate work to add based on past performance and projected team availability
    - Past performance is normalized against team availability.  At the end of a work cycle, the team availability information is updated with actuals so that the past performance statistics are accurate.
1. While in the work cycle state, a normal kanban flow can be used - New, In Progress, Testing, Blocked, Completed.  This is usually the bread-and-butter of all work management systems, but in requisite it only represents one part of the entire system.
1. Upon successful completion of the work item, the following events happen for the story revision:
    - The new version becomes the current version represented in the product documentation
    - The revision has the opportuntity to update its sizing (was it bigger or smaller than originally intended) - this is crucial for context when sizing future work
1. A roadmapping feature can analyze the sized story revisions in the backlog and attempt to project where they will fall in a timeline based on priority, size, past team performance, and average team availability

This will be an ambitious undertaking, therefore I will be targeting certain MVP milestones.  The first milestone is to get far enough along with requisite so that it can be used to actually manage itself.  To get there, I will initially focus on bare-bones implementations of many of these features.  I feel this is an extremely important goal for many reasons:
- It gives me something to demo.  As they say, a picture speaks a thousand words.
- It forces me to eat my own cooking.  What better way to find issues or improvements than to be an actual user?

For more technical details on the project, click the following links for more information:
- [Architectural Design Decisions](./README_ARCH.md)
- [Development Guide](./README_DEV.md)
- [Dependency Notes](./README_DEPS.md)
- [Current Things TODO](./README_TODO.md)
- [Ideation](./README_IDEAS.md)
