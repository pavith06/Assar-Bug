import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldConfigureComponent } from './field-configure.component';

describe('FieldConfigureComponent', () => {
  let component: FieldConfigureComponent;
  let fixture: ComponentFixture<FieldConfigureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FieldConfigureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldConfigureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
