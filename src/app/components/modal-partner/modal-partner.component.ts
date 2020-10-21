import { Component, OnInit } from '@angular/core';
import Partner from 'src/app/interfaces/partners';
import { ActivatedRoute, Router } from '@angular/router';
import { PartnershipsService } from 'src/app/services/partnerships.service';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-modal-partner',
  templateUrl: './modal-partner.component.html',
  styleUrls: ['./modal-partner.component.css']
})
export class ModalPartnerComponent implements OnInit {
  public partner: Partner;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private partnershipsService: PartnershipsService
  ) { }

  ngOnInit() {
    this.route.params.pipe(
      mergeMap((params) => this.partnershipsService.getPartner(params.id))
    ).subscribe((partner) => {
      this.partner = partner;
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
}
