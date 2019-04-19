import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalListPartnershipsComponent } from './modal-list-partnerships.component';
import { SharedModule } from 'src/app/shared.module';

describe('ModalListPartnershipsComponent', () => {
  let component: ModalListPartnershipsComponent;
  let fixture: ComponentFixture<ModalListPartnershipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SharedModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalListPartnershipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
