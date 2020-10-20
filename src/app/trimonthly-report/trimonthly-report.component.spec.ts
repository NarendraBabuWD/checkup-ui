import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrimonthlyReportComponent } from './trimonthly-report.component';

describe('TrimonthlyReportComponent', () => {
  let component: TrimonthlyReportComponent;
  let fixture: ComponentFixture<TrimonthlyReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrimonthlyReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrimonthlyReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
