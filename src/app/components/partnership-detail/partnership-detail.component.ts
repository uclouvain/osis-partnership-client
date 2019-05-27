import { Component, OnInit } from '@angular/core';
import Partnership from 'src/app/interfaces/partnership';
import { getMobilityType } from 'src/app/helpers/partnerships.helpers';
import { ActivatedRoute, Router } from '@angular/router';
import { PartnershipsService } from 'src/app/services/partnerships.service';
import { TranslateService } from '@ngx-translate/core';

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
    private partnershipsService: PartnershipsService,
    private translate: TranslateService
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

  getCourseCatalogueUrl() {
    const lang = this.translate.currentLang || this.translate.defaultLang;
    const courseCatalogue = this.data.out_course_catalogue[lang];
    if (courseCatalogue === undefined) {
      return null;
    }
    return courseCatalogue.url;
  }

  getCourseCatalogueText() {
    const lang = this.translate.currentLang || this.translate.defaultLang;
    const courseCatalogue = this.data.out_course_catalogue[lang];
    if (courseCatalogue === undefined) {
      return null;
    }
    return courseCatalogue.text;
  }

  isValidated(status) {
    return status.status === 'Validated' || status.status === 'validated';
  }
}
