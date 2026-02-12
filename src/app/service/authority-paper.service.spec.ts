import { TestBed } from '@angular/core/testing';

import { AuthorityPaperService } from './authority-paper.service';

describe('AuthorityPaperService', () => {
  let service: AuthorityPaperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthorityPaperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
