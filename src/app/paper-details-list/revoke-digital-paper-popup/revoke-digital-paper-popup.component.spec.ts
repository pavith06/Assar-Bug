import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevokeDigitalPaperPopupComponent } from './revoke-digital-paper-popup.component';

describe('RevokeDigitalPaperPopupComponent', () => {
  let component: RevokeDigitalPaperPopupComponent;
  let fixture: ComponentFixture<RevokeDigitalPaperPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevokeDigitalPaperPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RevokeDigitalPaperPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
