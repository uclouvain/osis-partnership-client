import {Component, OnInit} from '@angular/core';
import Partnership from 'src/app/interfaces/partnership';
import {getMobilityType} from 'src/app/helpers/partnerships.helpers';
import {ActivatedRoute} from '@angular/router';
import {PartnershipsService} from 'src/app/services/partnerships.service';
import {TranslateService} from '@ngx-translate/core';
import {combineLatest} from 'rxjs';
import {Type} from '../../interfaces/partnership_type';

const UCL_ROOT_ENTITY_NAME = 'UCL';

@Component({
  selector: 'app-partnership-detail',
  templateUrl: './partnership-detail.component.html',
  styleUrls: ['./partnership-detail.component.css']
})
export class PartnershipDetailComponent implements OnInit {
  public data: Partnership;

  public showBackButton = false;
  public showEllipsis = true;
  public showAllPartners = false;

  constructor(
    private route: ActivatedRoute,
    private partnershipsService: PartnershipsService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    combineLatest([this.route.parent && this.route.parent.params, this.route.params]).subscribe(([parentParam, { id }]): any => {
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

  get isMobility() {
    return this.data.partnership_type === Type.Mobility;
  }

  get isCoorganisation() {
    return [Type.Course, Type.Doctorate].includes(this.data.partnership_type);
  }

  get uclEntityParentDisplay() {
    if (this.data.ucl_entity.acronym !== UCL_ROOT_ENTITY_NAME && this.entityIsNotFaculty()) {
      return `${this.data.ucl_faculty.title} (${this.data.ucl_sector}/${this.data.ucl_faculty.acronym})`;
    }
    return '';
  }

  private entityIsNotFaculty() {
    return this.data.ucl_faculty.acronym && this.data.ucl_faculty.acronym !== this.data.ucl_entity.acronym;
  }

  get uclEntityDisplay() {
    let ret = '';
    if (this.data.ucl_entity.acronym === UCL_ROOT_ENTITY_NAME) {
      return this.translate.instant('Institutional partnership');
    }
    ret += `${this.data.ucl_entity.title} (`;
    if (this.data.ucl_sector) {
      ret += `${this.data.ucl_sector}/`;
    }
    if (this.entityIsNotFaculty()) {
      ret += `${this.data.ucl_faculty.acronym}/`;
    }
    ret += `${this.data.ucl_entity.acronym})`;
    return ret;
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
