import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthInfoBitsComponent } from './health-info-bits.component';

describe('HealthInfoBitsComponent', () => {
  let component: HealthInfoBitsComponent;
  let fixture: ComponentFixture<HealthInfoBitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HealthInfoBitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthInfoBitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
