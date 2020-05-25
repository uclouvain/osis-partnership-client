import { Component, OnInit } from '@angular/core';
import Partnership from 'src/app/interfaces/partnership';
import { getMobilityType } from 'src/app/helpers/partnerships.helpers';
import { ActivatedRoute, Router } from '@angular/router';
import { PartnershipsService } from 'src/app/services/partnerships.service';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest } from 'rxjs';

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
    combineLatest(this.route.parent.params, this.route.params).subscribe(([parentParam, { id }]): any => {
      this.partnershipsService.getPartnership(parentParam.id, id).subscribe(partnership => {
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

  getEducationLevels() {
    const levels = {
      'ISCED-6': this.translate.instant('Bachelor'),
      'ISCED-7': this.translate.instant('Master'),
      'ISCED-8': this.translate.instant('Doctorat'),
    };

    return this.data.out_education_levels.map((level: string) => {
      if (levels[level] !== undefined) {
        return levels[level];
      }
      return level;
    }).join(', ');
  }

  isValidated(status) {
    // This may be translated, so rely on the first letter
    return status.status.toLowerCase().substring(0, 5) === 'valid';
  }
}
