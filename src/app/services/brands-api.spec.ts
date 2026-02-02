import { TestBed } from '@angular/core/testing';

import { BrandsApi } from './brands-api';

describe('BrandsApi', () => {
  let service: BrandsApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrandsApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
