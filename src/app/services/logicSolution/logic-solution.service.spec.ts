import { TestBed } from '@angular/core/testing';

import { LogicSolutionService } from './logic-solution.service';

describe('LogicSolutionService', () => {
  let service: LogicSolutionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogicSolutionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
