import { TestBed } from '@angular/core/testing';

import { CallWindowService } from './call-window.service';

describe('CallWindowService', () => {
  let service: CallWindowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CallWindowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
