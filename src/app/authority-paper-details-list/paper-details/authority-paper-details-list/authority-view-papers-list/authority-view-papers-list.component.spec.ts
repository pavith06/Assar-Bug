import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityViewPapersListComponent } from './authority-view-papers-list.component';

describe('AuthorityViewPapersListComponent', () => {
  let component: AuthorityViewPapersListComponent;
  let fixture: ComponentFixture<AuthorityViewPapersListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorityViewPapersListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityViewPapersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
