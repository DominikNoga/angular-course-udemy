import { Component, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { interval, map, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  clickCount = signal(0);
  interval$ = interval(1000);
  intervalSignal = toSignal(this.interval$, {
    initialValue: 0
  });

  customInterval$ = new Observable<number>((subscriber) => {
    let count = 0;
    const intervalId = setInterval(() => {
      subscriber.next(count++);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  });

  constructor() {
    effect(() => {
      console.log(`Clicked ${this.clickCount()} times, with effect`);
    });

    toObservable(this.clickCount).subscribe((count) => {
      console.log(`Clicked ${count} times, with observable`);
    });

    this.customInterval$.subscribe((count) => {
      console.log(`Custom interval count: ${count}`);
    });
  }

  ngOnInit(): void {
    const sub = interval(2000 * 1000)
      .pipe(
        map((value) => value * 2)
      )
      .subscribe(
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

  onClick() {
    this.clickCount.update((prevCount) =>  ++prevCount);
  }
}
