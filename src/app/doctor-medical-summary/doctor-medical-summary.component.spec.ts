import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorMedicalSummaryComponent } from './doctor-medical-summary.component';

describe('DoctorMedicalSummaryComponent', () => {
  let component: DoctorMedicalSummaryComponent;
  let fixture: ComponentFixture<DoctorMedicalSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorMedicalSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorMedicalSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
