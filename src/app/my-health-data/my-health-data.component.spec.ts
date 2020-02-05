import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyHealthDataComponent } from './my-health-data.component';

describe('MyHealthDataComponent', () => {
  let component: MyHealthDataComponent;
  let fixture: ComponentFixture<MyHealthDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyHealthDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyHealthDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
