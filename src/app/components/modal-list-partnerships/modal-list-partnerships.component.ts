import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PartnershipsService } from 'src/app/services/partnerships.service';
import Partner from 'src/app/interfaces/partners';
import Partnership, { ResultPartnerships } from 'src/app/interfaces/partnership';
import { getMobilityType, getPartnershipParams } from 'src/app/helpers/partnerships.helpers';

@Component({
  selector: 'app-modal-list-partnerships',
  templateUrl: './modal-list-partnerships.component.html',
  styleUrls: ['./modal-list-partnerships.component.css']
})
export class ModalListPartnershipsComponent implements OnInit {
  @ViewChild('partnershipSummaryCell')
  partnershipSummaryCell: TemplateRef<any>;

  public rows: any[];
  public page = {
    totalElements: 0,
    totalPages: 0,
    pageNumber: 0,
    size: 25
  };

  public partner: Partner;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private partnershipsService: PartnershipsService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(({ id }): any => {
      this.partnershipsService.getPartner(id)
        .subscribe((partner) => {
          this.partner = partner;
        });
    });

    this.route.queryParams.subscribe((queryParams: any): any => {
      this.fetchPartnerships(queryParams);
    });
  }

  goToSearch() {
    this.router.navigate([''], { preserveQueryParams: true });
  }

  fetchPartnerships({ partnerFilter, ...queryParams}): void {
    this.partnershipsService.searchPartnerships(getPartnershipParams({ ...queryParams, partner: partnerFilter}))
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

  goToPartnershipDetail(e: any, partnership: Partnership) {
    e.preventDefault();
    const uuid = partnership.url.split('/').reverse()[1];
    this.router.navigate(['partnership', uuid], { queryParamsHandling: 'merge' });
  }
}
