import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPartnershipsComponent } from './list-partnerships.component';

describe('ListPartnershipsComponent', () => {
  let component: ListPartnershipsComponent;
  let fixture: ComponentFixture<ListPartnershipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPartnershipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPartnershipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
