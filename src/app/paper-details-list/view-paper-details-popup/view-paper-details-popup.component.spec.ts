import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPaperDetailsPopupComponent } from './view-paper-details-popup.component';

describe('ViewPaperDetailsPopupComponent', () => {
  let component: ViewPaperDetailsPopupComponent;
  let fixture: ComponentFixture<ViewPaperDetailsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPaperDetailsPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPaperDetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
