# Defferable views
Guide -> https://angular.dev/guide/templates/defer

Instead of loading the route in a lazy way, we can load the component lazily.
It can be useful, when the page is quite large, and we want to load the components as we scroll down.

It can be easily achieved using @defer block inside the template.

````html
    @defer {
        <large-component />
    }
````

## Configuration
- By default without any config browser will load it when it is idle.
Which means it does not perform any heavy operations right now.
- There are bunch of conditions/triggers that will decide when to load the component.
    - We are adding the trigger using 'on' keyword.
    ````html
        <!-- In this example we are loading element when we scroll to the element -->
        @defer (on viewport) {
            <large-component />
        } @placeholder {
            <!-- It requires a placeholder, which is element rendered before loading the component -->
            <p>Here will be an offer</p>
        }
    ````
    - 'on interaction' -> load the component when there was a click on the placeholder or other component.
        ````html
            <!-- Example 1 -->
            @defer (on interaction) {
                <offer-component />
            } @placeholder {
                <p>Click here to see the custom offer</p>
            }
            <!-- Example 2 -->
            <button #offerLoad>Load an offer</button>
            @defer (on interaction(offerLoad)) {
                <offer-component />
            } @placeholder {
                <p>Here the offer will show up</p>
            }
            <!-- Example 3 - With prefeching -->
            <button #offerLoad>Load an offer</button>
            <!-- It will be shown on click, but will be loaded on hover -->
            @defer (on interaction(offerLoad); prefetch on hover) {
                <offer-component />
            } @placeholder {
                <p>Here the offer will show up</p>
            }
        ````
    - Fallbacks
        ````html
            @defer(on viewport) {
                <offer-component />
            } @loading() {
                loading...
            } @error() {

            }
        ````