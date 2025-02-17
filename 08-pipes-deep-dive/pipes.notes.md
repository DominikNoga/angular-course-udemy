# Pipes
Those are special operators, we declare them in the Angular template using '|' symbol.
They are used to transform data inside the template.
There are two types of pipes:
- Pure -> depends only on input value and runs only when it changes. Better for perf, because of caching. They are good for:
    - Strings
    - Numbers
    - Dates
- Impure -> runs on every change detection cycle. Used for mutable objects. Where we need real time changes:
    - Objects
    - Arrays

## Difference between pipes and directives
- Pipes are assigned inside the expressions -> {{}} | Where directives are assigned onto the element or as a structural html
- Pipes just modify the data in the | Where directives can modify DOM and add some behavoiur to elements
- Pipes works just on the text values inside the template | Where directives works on elements, attributes or whole components

## Built-in pipes
Resource: https://angular.dev/guide/templates/pipes#built-in-pipes

## Creating custom pipes
Pipe like almost anything in Angular is a class with a special @Pipe decorator which should implement PipeTransform interface.
Each pipe needs to have one method called 'transform' which takes from one to infinite parameters.
First param is always a value that we are transforming. Rest are some configurations, we can make them optional or assign default values,
like to any ts function.

````ts
@Pipe({
  name: 'sort',
  standalone: true
})
export class SortPipe implements PipeTransform {

  transform(arr: string[] | number[], order: 'asc' | 'desc' = 'asc'): string[] | number[] {
    return arr;
  }

}
````

## When not to use an unpure pipe?
When our values are changing internally and they do not contain a unique identifier
