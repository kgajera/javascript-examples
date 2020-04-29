import { TestBed } from '@angular/core/testing';

import { HttpClientAxiosAdapterService } from './http-client-axios-adapter.service';

describe('HttpClientAxiosAdapterService', () => {
  let service: HttpClientAxiosAdapterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpClientAxiosAdapterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
