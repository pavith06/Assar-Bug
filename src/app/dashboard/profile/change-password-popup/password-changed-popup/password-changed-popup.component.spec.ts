import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordChangedPopupComponent } from './password-changed-popup.component';

describe('PasswordChangedPopupComponent', () => {
  let component: PasswordChangedPopupComponent;
  let fixture: ComponentFixture<PasswordChangedPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordChangedPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordChangedPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
