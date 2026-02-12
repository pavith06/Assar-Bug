import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseHistoryPopupComponent } from './purchase-history-popup.component';

describe('PurchaseHistoryPopupComponent', () => {
  let component: PurchaseHistoryPopupComponent;
  let fixture: ComponentFixture<PurchaseHistoryPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseHistoryPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseHistoryPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
