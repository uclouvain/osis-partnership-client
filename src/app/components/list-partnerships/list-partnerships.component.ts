import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import Partnership, { ResultPartnerships } from 'src/app/interfaces/partnership.js';
import { getMobilityType } from 'src/app/helpers/partnerships.helpers';

import * as partnerships from '../../__mocks__/partnerships.json';
import { ActivatedRoute } from '@angular/router';
import { PartnershipsService } from 'src/app/services/partnerships.service.js';

@Component({
  selector: 'app-list-partnerships',
  templateUrl: './list-partnerships.component.html',
  styleUrls: ['./list-partnerships.component.css']
})
export class ListPartnershipsComponent implements OnInit {
  @ViewChild('partnershipSummaryCell')
  partnershipSummaryCell: TemplateRef<any>;

  public rows: any[];

  loadingIndicator = true;
  reorderable = true;

  modalRef: BsModalRef;
  constructor(
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private partnershipsService: PartnershipsService
  ) {}

  openModal(template: TemplateRef<any>, e: any) {
    e.preventDefault();
    this.modalRef = this.modalService.show(template);
  }

  ngOnInit() {
    this.route.queryParams.subscribe((queryParams: any): any => {
      this.fetchPartnerships(queryParams);
    });
  }

  fetchPartnerships(queryParams): void {
    this.partnershipsService.partnerships(queryParams)
      .subscribe((response: ResultPartnerships) => {
        if (response && response.results) {
          this.rows = response.results.map((partner: Partnership) => ({
            ...partner,
            cellTemplate: this.partnershipSummaryCell
          }));
        }
      });
  }
}
