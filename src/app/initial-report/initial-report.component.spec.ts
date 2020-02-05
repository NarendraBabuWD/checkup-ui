import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialReportComponent } from './initial-report.component';

describe('InitialReportComponent', () => {
  let component: InitialReportComponent;
  let fixture: ComponentFixture<InitialReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitialReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
