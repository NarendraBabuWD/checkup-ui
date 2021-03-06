import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyHealthReportComponent } from './my-health-report.component';

describe('MyHealthReportComponent', () => {
  let component: MyHealthReportComponent;
  let fixture: ComponentFixture<MyHealthReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyHealthReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyHealthReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
