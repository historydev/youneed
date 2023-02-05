import { TestBed } from '@angular/core/testing';

import { MediaDevicesService } from './media-devices.service';

describe('MediaStreamService', () => {
  let service: MediaDevicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediaDevicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
