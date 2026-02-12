import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityPaperDetailsCardComponent } from './authority-paper-details-card.component';

describe('AuthorityPaperDetailsCardComponent', () => {
  let component: AuthorityPaperDetailsCardComponent;
  let fixture: ComponentFixture<AuthorityPaperDetailsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorityPaperDetailsCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityPaperDetailsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
