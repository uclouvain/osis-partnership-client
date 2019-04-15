import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import Partner from 'src/app/interfaces/partners.js';
import { ResultPartners } from 'src/app/interfaces/partners';

import { ActivatedRoute } from '@angular/router';
import { PartnershipsService } from 'src/app/services/partnerships.service.js';

@Component({
  selector: 'app-list-partners',
  templateUrl: './list-partners.component.html',
  styleUrls: ['./list-partners.component.css']
})
export class ListPartnersComponent implements OnInit {
  @ViewChild('partnershipSummaryCell')
  partnershipSummaryCell: TemplateRef<any>;

  public rows: Partner[];

  loadingIndicator = true;
  reorderable = true;

  modalRef: BsModalRef;
  constructor(
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private partnershipsService: PartnershipsService
  ) {
  }

  openModal(template: TemplateRef<any>, e: any) {
    e.preventDefault();
    this.modalRef = this.modalService.show(template);
  }

  ngOnInit() {
    this.route.queryParams.subscribe((queryParams: any): any => {
      this.fetchPartners(queryParams);
    });
  }

  fetchPartners(queryParams): void {
    this.partnershipsService.partners(queryParams)
      .subscribe((response: ResultPartners) => {
        if (response.results) {
          this.rows = response.results.map((partner: Partner) => ({
            ...partner,
            cellTemplate: this.partnershipSummaryCell
          }));
        }
      });
  }
}
