import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';

import Partner from 'src/app/interfaces/partners.js';
import { ResultPartners } from 'src/app/interfaces/partners';

import { ActivatedRoute, Router } from '@angular/router';
import { PartnershipsService } from 'src/app/services/partnerships.service';
import { getPartnerParams } from 'src/app/helpers/partnerships.helpers';

@Component({
  selector: 'app-partners-list',
  templateUrl: './partners-list.component.html',
  styleUrls: ['./partners-list.component.css']
})
export class PartnersListComponent implements OnInit {
  @ViewChild('partnershipSummaryCell')

  partnershipSummaryCell: TemplateRef<any>;

  public rows: Partner[];
  public page = {
    totalElements: 0,
    totalPages: 0,
    pageNumber: 0,
    size: 25
  };

  loadingIndicator = true;
  reorderable = true;
  partnerDetail: Partner;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private partnershipsService: PartnershipsService
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe((queryParams: any): any => {
      this.fetchPartners(queryParams);
    });
  }

  /**
   * Back button, come back to partner
   */
  goToPartnerships(e: any, value: Partner) {
    e.preventDefault();
    // If multiple partnerships, go to partnership list modal
    this.router.navigate(['partner', value], {
      queryParamsHandling: 'merge',
      queryParams: {
        partnerFilter: value
      }
    });
  }

  /**
   * Fetch partner's list with url filters params
   */
  fetchPartners(queryParams): void {
    this.partnershipsService.searchPartners(getPartnerParams(queryParams))
      .subscribe((response: ResultPartners) => {
        if (response.results) {
          this.page.totalElements = response.count;
          this.page.totalPages = Math.ceil(this.page.totalElements / +this.page.size);
          this.page.pageNumber = Math.ceil((+queryParams.offset || 0) / +this.page.size);
          this.rows = response.results.map((partner: Partner) => ({
            ...partner,
            cellTemplate: this.partnershipSummaryCell
          }));
        }
      });
  }

  /**
   * Populate the table with new data based on the page number
   */
  setPage(pageInfo) {
    this.page.pageNumber = +pageInfo.offset;
    const offset = +pageInfo.offset * this.page.size;
    this.router.navigate(['/'], {
      queryParamsHandling: 'merge',
      queryParams: {
        offset
      }
    });
  }
}
