import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingReportComponent } from './upcoming-report.component';

describe('UpcomingReportComponent', () => {
  let component: UpcomingReportComponent;
  let fixture: ComponentFixture<UpcomingReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpcomingReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpcomingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
