import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import Partner from 'src/app/interfaces/partners.js';
import * as partners from '../../__mocks__/partners.json';
@Component({
  selector: 'app-list-partners',
  templateUrl: './list-partners.component.html',
  styleUrls: ['./list-partners.component.css']
})
export class ListPartnersComponent implements OnInit {
  @ViewChild('partnershipSummaryCell')
  partnershipSummaryCell: TemplateRef<any>;

  public rows: Partner[] = partners.results.map(partner => ({
    ...partner,
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
