import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImplementConfigComponent } from './implement-config.component';

describe('ImplementConfigComponent', () => {
  let component: ImplementConfigComponent;
  let fixture: ComponentFixture<ImplementConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImplementConfigComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImplementConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
