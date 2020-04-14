import { TestBed } from '@angular/core/testing';

import { PipelineDetailService } from './pipeline-detail.service';

describe('PipelineDetailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PipelineDetailService = TestBed.get(PipelineDetailService);
    expect(service).toBeTruthy();
  });
});
