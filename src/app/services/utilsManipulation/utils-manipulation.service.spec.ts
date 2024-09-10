import { TestBed } from '@angular/core/testing';

import { UtilsManipulationService } from './utils-manipulation.service';

describe('UtilsManipulationService', () => {
  let service: UtilsManipulationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilsManipulationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
