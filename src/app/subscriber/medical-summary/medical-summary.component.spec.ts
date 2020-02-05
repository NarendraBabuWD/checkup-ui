import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalSummaryComponent } from './medical-summary.component';

describe('MedicalSummaryComponent', () => {
  let component: MedicalSummaryComponent;
  let fixture: ComponentFixture<MedicalSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
