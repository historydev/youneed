import { TestBed } from '@angular/core/testing';

import { MeetingsListService } from './meetings-list.service';

describe('MeetingsListService', () => {
  let service: MeetingsListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeetingsListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
