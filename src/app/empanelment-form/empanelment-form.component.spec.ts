import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpanelmentFormComponent } from './empanelment-form.component';

describe('EmpanelmentFormComponent', () => {
  let component: EmpanelmentFormComponent;
  let fixture: ComponentFixture<EmpanelmentFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpanelmentFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpanelmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
