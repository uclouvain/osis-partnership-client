import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { LoadingService } from 'src/app/services/loading.service.js';
import { getFormattedItemsList } from 'src/app/helpers/list.helpers.js';
import { Configuration } from 'src/app/interfaces/configuration.js';
import { getCleanParams } from 'src/app/helpers/partnerships.helpers.js';
import { Type } from 'src/app/interfaces/partnership_type';
import { TranslateService } from '@ngx-translate/core';
import {
  CombinedSearchItem,
  FundingElement,
  ValueLabel
} from '../../interfaces/common';

const defaultModel = {
  type: null,
  country: null,
  city: null,
  partner: null,
  ucl_entity: null,
  education_level: null,
  education_field: null,
  offer: null,
  mobility_type: null,
  funding_source: null,
  funding_type: null,
  funding_program: null,
  with_children: true,
};

const compareObjectLabels = (a, b) => {
  if (a.label > b.label) {
    return  1;
  } else if (a.label < b.label) {
    return -1;
  }
  return 0;
};


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  public model = { ...defaultModel };

  public configError = false;

  public config: Configuration;

  // Combined search options
  public combinedSearch: CombinedSearchItem[];
  public combinedSearchValue: any;
  public countries: ValueLabel[];
  public cities: ValueLabel[];
  public partners: ValueLabel[];
  public tags: ValueLabel[];
  public partnerTags: ValueLabel[];
  public fundings: FundingElement[];

  // Other options
  public uclEntities: ValueLabel[];
  public partnershipTypes: ValueLabel[];

  public educationLevels: ValueLabel[];
  public yearOffers: ValueLabel[];
  public mobilityTypeItems: ValueLabel[] = [
    { id: 'student', label: this.translate.instant('Student') },
    { id: 'staff', label: this.translate.instant('Staff') },
  ];

  public loaderStatus: boolean;
  private loaderStatus$: Subscription;

  public Type = Type;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private configurationService: ConfigurationService,
    private loading: LoadingService,
    private translate: TranslateService
  ) {
    // add delay to prevent expression has changed after it was checked
    this.loaderStatus$ = this.loading.status.pipe(
      delay(0)).subscribe(status => (this.loaderStatus = status)
    );
  }

  ngOnDestroy(): void {
    this.loaderStatus$.unsubscribe();
  }

  ngOnInit() {
    // Init form with url params
    this.route.queryParams
      .subscribe(params => {
        this.initFormFields(params);
        this.model = {
          ...this.model,
          ...params,
        };
      });
  }

  /**
   * Init input fields with params from url
   * Load full labels of params with configuration service
   */
  initFormFields(params) {
    // Fetch configuration data from server
    this.configurationService.all()
      .pipe(
        catchError((): any => {
          this.configError = true;
        })
      )
      .subscribe((config: Configuration) => {
        this.configError = false;
        this.config = config;

        // Combined search options
        this.countries = getFormattedItemsList([].concat.apply(
          // Get countries and flatten
          [], config.continents.map(continent => continent.countries)
        )).sort(compareObjectLabels);
        this.cities = getFormattedItemsList([].concat.apply(
          // Get cities and flatten
          [], [].concat.apply([], config.continents.map(continent => continent.countries)).map(country => country.cities)
        ).filter(
          // Remove duplicates
          (city, index, self) => self.indexOf(city) === index
        )).sort(compareObjectLabels);
        this.partners = getFormattedItemsList(config.partners);
        this.fundings = config.fundings;
        this.tags = getFormattedItemsList(config.tags);
        this.partnerTags = getFormattedItemsList(config.partner_tags);
        this.yearOffers = getFormattedItemsList(config.offers);

        this.initCombinedSearch(params);

        this.educationLevels = config.education_levels;
        this.uclEntities = config.ucl_universities;
        this.partnershipTypes = config.partnership_types;
      });
  }

  private initCombinedSearch(params) {
    this.combinedSearch = [
      {
        id: 'country',
        label: this.translate.instant('Country'),
        label_plural: this.translate.instant('Countries'),
        children: this.countries.map(elem => ({
          ...elem,
          type: 'country'
        })),
      },
      {
        id: 'city',
        label: this.translate.instant('City'),
        label_plural: this.translate.instant('Cities'),
        children: this.cities.map(elem => ({ ...elem, type: 'city' })),
      },
      {
        id: 'partner',
        label: this.translate.instant('Partner'),
        label_plural: this.translate.instant('Partners'),
        children: this.partners.map(elem => ({
          ...elem,
          type: 'partner'
        })),
      },
      {
        id: 'funding_source',
        label: this.translate.instant('Funding source'),
        label_plural: this.translate.instant('Funding sources'),
        children: this.fundings.filter(
          elem => elem.value.split('-')[0] === 'fundingsource'
        ).map(elem => ({
          id: elem.value.split('-')[1],
          label: elem.text,
          type: 'funding_source'
        })),
      },
      {
        id: 'funding_program',
        label: this.translate.instant('Funding program'),
        label_plural: this.translate.instant('Funding programs'),
        children: this.fundings.filter(
          elem => elem.value.split('-')[0] === 'fundingprogram'
        ).map(elem => ({
          id: elem.value.split('-')[1],
          label: elem.text,
          type: 'funding_program'
        })),
      },
      {
        id: 'funding_type',
        label: this.translate.instant('Funding type'),
        label_plural: this.translate.instant('Funding types'),
        children: this.fundings.filter(
          elem => elem.value.split('-')[0] === 'fundingtype'
        ).map(elem => ({
          id: elem.value.split('-')[1],
          label: elem.text,
          type: 'funding_type'
        })),
      },
      {
        id: 'tag',
        label: this.translate.instant('Tag'),
        label_plural: this.translate.instant('Tags'),
        children: [
          ...this.tags.map(elem => ({ ...elem, type: 'tag' })),
          ...this.partnerTags.map(elem => ({ ...elem, type: 'partner_tag' })),
        ],
      },
    ];

    // Init combinedSearch value
    this.combinedSearch.map(group => {
      if (params[group.id]) {
        this.combinedSearchValue = group.children.find(elem => elem.id === params[group.id]);
      }
    });
  }

  /**
   * Change route to add choosen options in url params
   * Then modal-partner component will fetch data with these new params
   */
  searchPartners(event: any): void {
    event.preventDefault();
    this.router.navigate([''], { queryParams: getCleanParams(this.model) });
  }

  /**
   * Reset all form fields
   */
  resetForm(event: any): void {
    event.preventDefault();
    this.model = { ...defaultModel };
    this.combinedSearchValue = null;
    this.router.navigate(['']);
  }

  combinedSearchValueChanged(value) {
    if (value) {
      this.model[value.type] = value.id;
    } else {
      this.model = {
        ...this.model,
        country: null,
        city: null,
        funding_source: null,
        funding_type: null,
        funding_program: null,
      };
    }
  }
  uclEntityValueChanged(value) {
    if (value) {
      this.model.ucl_entity = value.value;
    } else {
      this.model = {
        ...this.model,
        ucl_entity: null,
      };
    }
  }

  isWithChildrenFilterShown() {
    return this.model.ucl_entity;
  }

  isTargetFilterShown() {
    return this.model.type === Type.Mobility;
  }

  isEducationLevelFilterShown() {
    return (this.model.type === Type.Mobility && this.model.mobility_type === 'student')
      || this.model.type === Type.Course || Type.Doctorate === this.model.type;
  }

  isYearOfferFilterShown() {
    return [Type.Mobility, Type.Course, Type.Doctorate].includes(this.model.type);
  }
}
