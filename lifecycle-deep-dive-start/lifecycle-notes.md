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
    - here you can access the contentChild value
    - rarely used

- ngAfterContentChecked
    - used when angular checks the content
    - rarely used

- ngAfterViewInit
    - view is an element HTML template, so this is what is rendered to the DOM
    - it refers to the whole html template for our component
    - runs when we render the component to our DOM 
    - here we can access viewChild content
    - rarely used

- ngAfterViewChecked
    - runs when we detect changes in the template
    - rarely used

- ngOnDestroy 
    - component is removed from DOM, for example it is rendered conditionally
    - ALTERNATIVE: DestroyRef -> from Angular 16 -> Advantage is that we can use it in services, and can be used multiple times
    ````ts
    @Component({
  selector: 'app-traffic-chart',
  standalone: true,
  imports: [DashboardTileComponent],
  templateUrl: './traffic-chart.component.html',
  styleUrl: './traffic-chart.component.css'
    })
    export class TrafficChartComponent implements OnInit {
        trafficData = input.required<TrafficData>();
        maxTraffic!: number;
        // this can be used instad of ngOnDestroy
        private destroyRef = inject(DestroyRef);

        ngOnInit(): void {
            this.maxTraffic = Math.max(...this.trafficData().map((data) => data.value));
            const interval = setInterval(() => {
            console.log('some interval');
            }, 1_000_000);

            this.destroyRef.onDestroy(() => {
            clearInterval(interval);
            });
        }
    }
    ````

## AfterRender, AfterNextRender
Hooks defined in the controller that allows running some code after each re-render in the application.
Or once per every component render

````ts
class RenderExample {
    constructor() {
    afterRender(() => {
      // It happens after any changes in the whole Angular application
      // Any re-render in any component will cause this function running
      // Useful for continous updates after each render
      console.log('after render')
    });

    afterNextRender(() => {
      // This also runs for the whole application, but it will run only for the first component render
      // useful for third party UI elements initialization
      // JUST once per component instance
      console.log('after next render');
    })
  }
}

````