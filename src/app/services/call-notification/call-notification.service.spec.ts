import { TestBed } from '@angular/core/testing';

import { CallNotificationService } from './call-notification.service';

describe('CallWindowService', () => {
  let service: CallNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CallNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
