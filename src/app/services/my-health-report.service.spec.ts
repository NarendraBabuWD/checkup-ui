import { TestBed } from '@angular/core/testing';

import { MyHealthReportService } from './my-health-report.service';

describe('MyHealthReportService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyHealthReportService = TestBed.get(MyHealthReportService);
    expect(service).toBeTruthy();
  });
});
