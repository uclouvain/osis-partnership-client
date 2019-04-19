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
  }

  goToSearch() {
    this.router.navigate([''], { preserveQueryParams: true });
  }

  get mobilityType() {
    return getMobilityType(this.data);
  }

}
