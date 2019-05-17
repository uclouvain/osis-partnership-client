import { Component, OnInit } from '@angular/core';
import Partnership from 'src/app/interfaces/partnership';
import { getMobilityType } from 'src/app/helpers/partnerships.helpers';
import { ActivatedRoute, Router } from '@angular/router';
import { PartnershipsService } from 'src/app/services/partnerships.service';

@Component({
  selector: 'app-partnership-detail',
  templateUrl: './partnership-detail.component.html',
  styleUrls: ['./partnership-detail.component.css']
})
export class PartnershipDetailComponent implements OnInit {

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

    this.route.queryParams.subscribe(({uniquePartnership}) => {
      this.showBackButton = !uniquePartnership;
    });
  }

  get mobilityType() {
    return getMobilityType(this.data);
  }

  isValidated(status) {
    if (status.status === 'Validated' || status.status === 'validated') {
      return true;
    }
    return false;
  }
}
