import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPurchaseStockPopupComponent } from './view-purchase-stock-popup.component';

describe('ViewPurchaseStockPopupComponent', () => {
  let component: ViewPurchaseStockPopupComponent;
  let fixture: ComponentFixture<ViewPurchaseStockPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewPurchaseStockPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPurchaseStockPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
