import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionPopupComponent } from './section-popup.component';

describe('SectionPopupComponent', () => {
  let component: SectionPopupComponent;
  let fixture: ComponentFixture<SectionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SectionPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
