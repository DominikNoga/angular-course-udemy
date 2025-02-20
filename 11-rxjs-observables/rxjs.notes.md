# Rxjs and observables
docs: https://rxjs.dev/api

Rxjs is a library, which is separate from Angular. But it is highly used in Angular.

This library is focusing on Observables, which are creating in order to work with the data stream.

They are allowing for listening to changes in the data stream

## What is an observable?
It is an object, which can receive, produce and modify the stream of data.

In order to receive data you need to set up the subscription. Otherwise Observable won't be triggered

It is very important to remove the subscription when the component is destroyed
````ts
/*
    Subscription provides 3 methods
    - next: runs when the next value is passed
    - error: runs when the error is thrown
    - complete: runs when the data stream is finished. In this case never
*/
ngOnInit(): void {
    const sub = interval(5000).subscribe(
      {
        next: (count) => {
          console.log(`Count: ${count}`);
        },
        error: (error) => {
          console.error(`Error: ${error}`);
        },
        complete: () => {
          console.log('Data stream is finished');
        }
      }
    );
    this.destroyRef.onDestroy(() => {
      sub.unsubscribe();
    });
}
````

## Rxjs operators
Before executing next function, we can perform some kind of operation on the emitted value

In the example below we use map operator which will multiply each value by 2
````ts
const sub = interval(2000)
      .pipe(
        map((value) => value * 2)
      )
      .subscribe(
        {
          next: (count) => {
            console.log(`Count: ${count}`);
          }
        }
      );
````

## Signlas vs Observables
- Singlas have an initial values, observables don't
- Observable will only trigger when it has at least one subscriber
- You can look into the signal in any moment of time
- Signals are great for application srtate
- Obserables are better for managing events and streamed async data

## Converting signal to observable
We can easily convert signal using the "ToObservable" function provided by Angular

````ts
import { toObservable } from '@angular/core/rxjs-interop';

export class AppComponent implements OnInit {
  clickCount = signal(0);

  constructor() {
    toObservable(this.clickCount).subscribe((count) => {
      console.log(`Clicked ${count} times`);
    });
  }
}
````

## Converting observable to signal
Same as above we can convert observable to a signal

````ts
export class AppComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  clickCount = signal(0);
  interval$ = interval(1000);
  intervalSignal = toSignal(this.interval$, {
    initialValue: 0
  });
}
````

## Creating custom observable

````ts
class Test {
  customInterval$ = new Observable<number>((subscriber) => {
      let count = 0;
      const intervalId = setInterval(() => {
        if (count > 10) {
          clearInterval(intervalId);
          subscriber.complete();
        } else if (count > 7) {
          throw Error('Value equal or over 7. ERROR');
        }
        subscriber.next(count++); // Here we decide when a next value is emitted
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
  });

  constructor() {
    this.customInterval$.subscribe({
      // Here we can define what happens when the value is emitted
      next: (count) => {
        console.log(`Custom interval count: ${count}`);
      },
      complete: () => {
        console.log('Value over 10, stream has completed');
      },
      error: (error) => {
        console.error(error.message);
      }
    });
  }
}

````