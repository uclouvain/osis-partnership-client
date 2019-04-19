import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalListPartnershipsComponent } from './modal-list-partnerships.component';

describe('ModalListPartnershipsComponent', () => {
  let component: ModalListPartnershipsComponent;
  let fixture: ComponentFixture<ModalListPartnershipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalListPartnershipsComponent ]
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
