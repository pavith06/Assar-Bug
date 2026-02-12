import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityPaperDetailsListComponent } from './authority-paper-details-list.component';

describe('AuthorityPaperDetailsListComponent', () => {
  let component: AuthorityPaperDetailsListComponent;
  let fixture: ComponentFixture<AuthorityPaperDetailsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorityPaperDetailsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityPaperDetailsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
