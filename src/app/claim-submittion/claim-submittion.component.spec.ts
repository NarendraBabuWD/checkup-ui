import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimSubmittionComponent } from './claim-submittion.component';

describe('ClaimSubmittionComponent', () => {
  let component: ClaimSubmittionComponent;
  let fixture: ComponentFixture<ClaimSubmittionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimSubmittionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimSubmittionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
