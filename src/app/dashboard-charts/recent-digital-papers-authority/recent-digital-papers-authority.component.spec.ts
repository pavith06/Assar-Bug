import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentDigitalPapersAuthorityComponent } from './recent-digital-papers-authority.component';

describe('RecentDigitalPapersAuthorityComponent', () => {
  let component: RecentDigitalPapersAuthorityComponent;
  let fixture: ComponentFixture<RecentDigitalPapersAuthorityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentDigitalPapersAuthorityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentDigitalPapersAuthorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
