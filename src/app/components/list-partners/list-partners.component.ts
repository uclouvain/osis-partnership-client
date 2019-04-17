import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import Partner from 'src/app/interfaces/partners.js';
import { ResultPartners } from 'src/app/interfaces/partners';

import { ActivatedRoute, Router } from '@angular/router';
import { PartnershipsService } from 'src/app/services/partnerships.service.js';

@Component({
  selector: 'app-list-partners',
  templateUrl: './list-partners.component.html',
  styleUrls: ['./list-partners.component.css']
})
export class ListPartnersComponent implements OnInit {
  @ViewChild('partnershipSummaryCell')
  partnershipSummaryCell: TemplateRef<any>;

  public queryParams = {};
  public rows: Partner[];
  public page = {
    totalElements: 0,
    totalPages: 0,
    pageNumber: 0,
    size: 25
  };

  loadingIndicator = true;
  reorderable = true;

  modalRef: BsModalRef;
  constructor(
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
    private partnershipsService: PartnershipsService
  ) {
  }

  openModal(template: TemplateRef<any>, e: any) {
    e.preventDefault();
    this.modalRef = this.modalService.show(template);
  }

  ngOnInit() {
    this.route.queryParams.subscribe((queryParams: any): any => {
      this.queryParams = queryParams;
      this.fetchPartners(queryParams);
    });
  }

  fetchPartners(queryParams): void {
    this.partnershipsService.partners(queryParams)
      .subscribe((response: ResultPartners) => {
        if (response.results) {
          this.page.totalElements = response.count;
          this.page.totalPages = Math.ceil(this.page.totalElements / +this.page.size);
          this.page.pageNumber = Math.floor(queryParams.offset / +this.page.size);

          this.rows = response.results.map((partner: Partner) => ({
            ...partner,
            cellTemplate: this.partnershipSummaryCell
          }));
        }
      });
  }

  /**
   * Populate the table with new data based on the page number
   * @param page The page to select
   */
  setPage(pageInfo) {
    this.page.pageNumber = +pageInfo.offset;
    const offset = +pageInfo.offset * this.page.size;
    this.router.navigate(['/'], {
      queryParams: {
        ...this.queryParams,
        offset
      }
    });
  }
}
