import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPartnerComponent } from './modal-partner.component';

describe('ModalPartnerComponent', () => {
  let component: ModalPartnerComponent;
  let fixture: ComponentFixture<ModalPartnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPartnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
