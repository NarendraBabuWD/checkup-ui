import { TestBed } from '@angular/core/testing';

import { MyHealthDataService } from './my-health-data.service';

describe('MyHealthDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyHealthDataService = TestBed.get(MyHealthDataService);
    expect(service).toBeTruthy();
  });
});
