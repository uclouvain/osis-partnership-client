import { Component, OnInit } from '@angular/core';
import Partnership from 'src/app/interfaces/partnership';
import { getMobilityType } from 'src/app/helpers/partnerships.helpers';
import { ActivatedRoute, Router } from '@angular/router';
import { PartnershipsService } from 'src/app/services/partnerships.service';

@Component({
  selector: 'app-modal-partnership',
  templateUrl: './modal-partnership.component.html',
  styleUrls: ['./modal-partnership.component.css']
})
export class ModalPartnershipComponent implements OnInit {

  public data: Partnership;
  public showBackButton = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private partnershipsService: PartnershipsService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(({ id }): any => {
      this.partnershipsService.getPartnership(id)
        .subscribe(partnership => {
          this.data = partnership;
        });
    });

    this.route.queryParams.subscribe(({ type }) => {
      this.showBackButton = type === 'partners';
    });
  }

  /**
   * Go back to partnerships list of current partner
   */
  goToList(partnerId: string) {
    this.router.navigate(['partner', partnerId], { queryParamsHandling: 'merge' });
  }

  goToSearch() {
    this.router.navigate([''], { preserveQueryParams: true });
  }

  get mobilityType() {
    return getMobilityType(this.data);
  }

}
