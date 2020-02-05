import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriberAppointmentComponent } from './subscriber-appointment.component';

describe('SubscriberAppointmentComponent', () => {
  let component: SubscriberAppointmentComponent;
  let fixture: ComponentFixture<SubscriberAppointmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscriberAppointmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriberAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
