import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPartnershipComponent } from './modal-partnership.component';
import { SharedModule } from 'src/app/shared.module';

describe('ModalPartnershipComponent', () => {
  let component: ModalPartnershipComponent;
  let fixture: ComponentFixture<ModalPartnershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SharedModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPartnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
