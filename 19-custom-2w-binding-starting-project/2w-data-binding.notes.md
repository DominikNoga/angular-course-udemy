# 2-way data binding

## NgModel
This is the default way of implementing 2w db in Angular.
It applies to form fields. We can connect a class property to the input value.
In example below updating the form will update the newTicketData. And vice versa.

````ts
class Test {
    newTicketData: NewTicketDto = {
        title: '',
        request: ''
    };
}
````

````html
<app-form-control label="Title">
    <input name="title" id="title" [(ngModel)]="newTicketData.title"  #input />
</app-form-control>
<app-form-control label="Request">
    <textarea name="request" id="request" rows="3" [(ngModel)]="newTicketData.request" #input></textarea>
</app-form-control>
````

## Custom 2w db
If we want to create a property which will be binded in two ways.
We can do this in 2 ways. Either by combining input and output properties. Using the naming convention.
Or since Angular 17, using model function. Which provides a signal and works in both ways.

````ts
export class RectComponent {
  size = input.required<Rect>();
  // Name HAS TO be equal to `input-name + Change`   
  sizeChange = output<Rect>();

  size = model.required<Rect>(); // easier than the version above
  
  onReset2() {
    this.sizeChange.emit({width: '100', height: '100'})
  }

  onReset() {
    this.size.set({ width: '100', height: '100' });
  }
}
````

````html
<!-- Used just like ngModel directive -->
<app-rect [(size)]="rectSize" />
````