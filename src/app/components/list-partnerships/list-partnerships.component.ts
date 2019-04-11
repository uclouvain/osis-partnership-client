import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import Partnership from 'src/app/interfaces/partnership.js';
import { getMobilityType } from 'src/app/helpers/partnerships.helpers';

import * as partnerships from '../../__mocks__/partnerships.json';

@Component({
  selector: 'app-list-partnerships',
  templateUrl: './list-partnerships.component.html',
  styleUrls: ['./list-partnerships.component.css']
})
export class ListPartnershipsComponent implements OnInit {
  @ViewChild('partnershipSummaryCell')
  partnershipSummaryCell: TemplateRef<any>;

  public rows: any[] = partnerships.results.map(partnership => ({
    ...partnership,
    mobility_type: getMobilityType(partnership),
    cellTemplate: this.partnershipSummaryCell
  }));

  loadingIndicator = true;
  reorderable = true;

  modalRef: BsModalRef;
  constructor(private modalService: BsModalService) {}

  openModal(template: TemplateRef<any>, e: any) {
    e.preventDefault();
    this.modalRef = this.modalService.show(template);
  }

  ngOnInit() {
  }
}
