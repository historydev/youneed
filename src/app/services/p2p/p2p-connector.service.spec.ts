import { TestBed } from '@angular/core/testing';

import { P2pConnectorService } from './p2p-connector.service';

describe('P2pService', () => {
  let service: P2pConnectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(P2pConnectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
