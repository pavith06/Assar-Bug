import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingExpiryDigitalPapersComponent } from './upcoming-expiry-digital-papers.component';

describe('UpcomingExpiryDigitalPapersComponent', () => {
  let component: UpcomingExpiryDigitalPapersComponent;
  let fixture: ComponentFixture<UpcomingExpiryDigitalPapersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpcomingExpiryDigitalPapersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpcomingExpiryDigitalPapersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
