import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPatientsComponent } from './request-patients.component';

describe('RequestPatientsComponent', () => {
  let component: RequestPatientsComponent;
  let fixture: ComponentFixture<RequestPatientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestPatientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPatientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
