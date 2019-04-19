import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';

import Partnership, { ResultPartnerships } from 'src/app/interfaces/partnership.js';
import { getMobilityType } from 'src/app/helpers/partnerships.helpers';

import { ActivatedRoute, Router } from '@angular/router';
import { PartnershipsService } from 'src/app/services/partnerships.service';

@Component({
  selector: 'app-list-partnerships',
  templateUrl: './list-partnerships.component.html',
  styleUrls: ['./list-partnerships.component.css']
})
export class ListPartnershipsComponent implements OnInit {
  @ViewChild('partnershipSummaryCell')
  partnershipSummaryCell: TemplateRef<any>;

  public rows: any[];
  public page = {
    totalElements: 0,
    totalPages: 0,
    pageNumber: 0,
    size: 25
  };

  loadingIndicator = true;
  reorderable = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private partnershipsService: PartnershipsService
  ) {}

  goToPartnershipDetail(e: any, partnership: Partnership) {
    e.preventDefault();
    const uuid = partnership.url.split('/').reverse()[1];
    this.router.navigate(['partnership', uuid], { queryParamsHandling: 'merge' });
  }

  ngOnInit() {
    this.route.queryParams.subscribe((queryParams: any): any => {
      this.fetchPartnerships(queryParams);
    });
  }

  fetchPartnerships(queryParams): void {
    this.partnershipsService.searchPartnerships(queryParams)
      .subscribe((response: ResultPartnerships) => {
        if (response && response.results) {
          this.page.totalElements = response.count;
          this.page.totalPages = Math.ceil(this.page.totalElements / +this.page.size);
          this.page.pageNumber = Math.floor(queryParams.offset / +this.page.size);

          if (response.results) {
            this.rows = response.results.map((partner: Partnership) => ({
              ...partner,
              mobility_type: partner && getMobilityType(partner),
              cellTemplate: this.partnershipSummaryCell
            }));
          }
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
      queryParamsHandling: 'merge',
      queryParams: {
        offset
      }
    });
  }
}
