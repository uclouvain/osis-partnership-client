import { Component, OnInit } from '@angular/core';
import { getPartnershipParams } from 'src/app/helpers/partnerships.helpers';
import { ResultPartnerships } from 'src/app/interfaces/partnership';
import Partner from 'src/app/interfaces/partners';
import { ActivatedRoute, Router } from '@angular/router';
import { PartnershipsService } from 'src/app/services/partnerships.service';

@Component({
  selector: 'app-modal-partner',
  templateUrl: './modal-partner.component.html',
  styleUrls: ['./modal-partner.component.css']
})
export class ModalPartnerComponent implements OnInit {
  public partner: Partner;
  public partnerDetail: any;
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

    this.route.params.subscribe((params: any): any => {
      this.route.queryParams.subscribe((queryParams: any): any => {
        this.fetchPartnerships(queryParams, params);
      });
    });
  }

  /**
   * Close modal, come back to partners list
   */
  goToSearch() {
    this.router.navigate([''], {
      queryParamsHandling: 'merge',
      queryParams: {
        partnerFilter: undefined,
        uniquePartnership: undefined,
        offsetPartnership: undefined,
        orderingPartnership: undefined
      }
    });
  }

  /**
   * Fetch partnrships for this partner, if there's only a single partnership,
   * redirect to this partnership's detail view
   */
  fetchPartnerships({ partnerFilter, ...queryParams}, { id }): void {
    this.partnershipsService.searchPartnerships(getPartnershipParams({ ...queryParams, partner: partnerFilter}))
      .subscribe((response: ResultPartnerships) => {
        if (response && response.results && response.results.length === 1) {
          this.partnerDetail = response.results;
          // If single partnership, go to detail of this partnership
          const partnership = response.results[0];
          const partnershipId = partnership.url.split('/').reverse()[1];
          this.router.navigate([`partner/${id}/partnership/${partnershipId}`], {
            queryParamsHandling: 'merge',
            queryParams: {
              uniquePartnership: true,
            }
          });
        }
      });
  }
}
