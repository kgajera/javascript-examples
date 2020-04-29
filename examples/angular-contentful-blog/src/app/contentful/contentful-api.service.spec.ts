import { TestBed } from '@angular/core/testing';

import { ContentfulApiService } from './contentful-api.service';

describe('ContentfulApiService', () => {
  let service: ContentfulApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentfulApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
