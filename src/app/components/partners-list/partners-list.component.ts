import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';

import Partner from 'src/app/interfaces/partners.js';
import { ResultPartners } from 'src/app/interfaces/partners';

import { ActivatedRoute, Params, Router } from '@angular/router';
import { PartnershipsService } from 'src/app/services/partnerships.service';
import { getPartnerParams } from 'src/app/helpers/partnerships.helpers';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-partners-list',
  templateUrl: './partners-list.component.html',
  styleUrls: ['./partners-list.component.css']
})
export class PartnersListComponent implements OnInit {
  @ViewChild('partnershipSummaryCell')

  partnershipSummaryCell: TemplateRef<any>;

  public rows: Partner[];
  public partnersError = false;
  public loading = true;
  public empty = true;
  public page = {
    totalElements: 0,
    totalPages: 0,
    pageNumber: 0,
    size: 25
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private partnershipsService: PartnershipsService
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe((queryParams: Params): any => {
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
    this.loading = true;
    // Only search if there are filters sent through queryParams
    if (Object.keys(queryParams).length) {
      this.empty = false;
      this.partnershipsService.searchPartners(getPartnerParams(queryParams))
        .pipe(
          catchError((): any => {
            this.partnersError = true;
            this.loading = false;
            document.getElementById('partners-list').scrollIntoView();
          })
        )
        .subscribe((response: ResultPartners) => {
          this.partnersError = false;
          this.loading = false;
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
    } else {
      this.empty = true;
      this.rows = [];
      this.page = {
        totalElements: 0,
        totalPages: 0,
        pageNumber: 0,
        size: 25
      };
    }
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

  /**
   * Add ordering filter
   * Reset offset to 0 to redirect to page 1
   */
  onSort(event) {
    const order = event.newValue;
    let orderColumn = event.column.prop;
    if (orderColumn === 'name') {
      orderColumn = 'partner';
    }

    if (orderColumn === 'country') {
      orderColumn = 'country_en';
    }

    const ordering = (order === 'asc' ? '' : '-') + orderColumn;
    this.router.navigate(['/'], {
      queryParamsHandling: 'merge',
      queryParams: {
        ordering,
        offset: undefined
      }
    });
  }
}
