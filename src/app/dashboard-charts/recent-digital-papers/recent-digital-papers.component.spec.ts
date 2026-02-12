import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentDigitalPapersComponent } from './recent-digital-papers.component';

describe('RecentDigitalPapersComponent', () => {
  let component: RecentDigitalPapersComponent;
  let fixture: ComponentFixture<RecentDigitalPapersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecentDigitalPapersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentDigitalPapersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
