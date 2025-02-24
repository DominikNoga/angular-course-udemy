import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupReactiveComponent } from './signup-reactive.component';

describe('SignupReactiveComponent', () => {
  let component: SignupReactiveComponent;
  let fixture: ComponentFixture<SignupReactiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignupReactiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupReactiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
