import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseStockPopupComponent } from './purchase-stock-popup.component';

describe('PurchaseStockPopupComponent', () => {
  let component: PurchaseStockPopupComponent;
  let fixture: ComponentFixture<PurchaseStockPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseStockPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseStockPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
