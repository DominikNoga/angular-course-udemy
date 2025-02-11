# Life-cycle components
Actions that happen at some specific moment of a component live cycle.

## Events order
- CONSTRUCTOR 
    - runs first, it has nothing to do with Angular
    - you should not do complex operations and initializatios
    - does not have access to input values

- ngOnChanges
    - executes whenever input props change
    - gives a possibility to access simpleChanges object

- ngOnInit
    - has access to input values
    - good for init of complex props

- ngDoCheck
    - runs always when something changes in whole Angular app
    - therfore it runs very often
    - so we should not use it for most cases

- ngAfterContentInit
    - content is everything that can be projected to the component with ng-content
    - we can access the content that is projected
    - rarely used

- ngAfterContentChecked
    - used when angular checks the content
    - rarely used

- ngAfterViewInit
    - view is an element HTML template, so this is what is rendered to the DOM
    - it refers to the whole html template for our component
    - runs when we render the component to our DOM 
    - rarely used

- ngAfterViewChecked
    - runs when we detect changes in the template
    - rarely used

- ngOnDestroy -> component is removed from DOM, for example it is rendered conditionally