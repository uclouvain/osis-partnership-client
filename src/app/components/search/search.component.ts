import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { LoadingService } from 'src/app/services/loading.service.js';
import { getFormattedItemsList } from 'src/app/helpers/list.helpers.js';
import { Configuration } from 'src/app/interfaces/configuration.js';
import {
  getCleanParams,
  getPartnerParams
} from 'src/app/helpers/partnerships.helpers.js';
import { Type } from 'src/app/interfaces/partnership_type';
import { TranslateService } from '@ngx-translate/core';
import {
  CombinedSearchItem,
  FundingElement,
  IdLabel, ValueLabel
} from '../../interfaces/common';
import { HtmlElementPropertyService } from '../../services/html-element-property.service';
import { PartnershipsService } from '../../services/partnerships.service';
import { LngLatBounds } from 'mapbox-gl';
import { BBoxChangedEvent } from '../../interfaces/events';

const defaultModel = {
  type: null,
  continent: null,
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
  partner_tag: null,
  tag: null,
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
  public continents: IdLabel[];
  public countries: IdLabel[];
  public cities: IdLabel[];
  public partners: IdLabel[];
  public tags: IdLabel[];
  public partnerTags: IdLabel[];
  public fundings: FundingElement[];

  // Other options
  public uclEntities: ValueLabel[];
  public partnershipTypes: IdLabel[];

  public educationLevels: ValueLabel[];
  public yearOffers: IdLabel[];
  public mobilityTypeItems: IdLabel[] = [
    { id: 'student', label: this.translate.instant('Student') },
    { id: 'staff', label: this.translate.instant('Staff') },
  ];

  public loaderStatus: boolean;
  private loaderStatus$: Subscription;

  public Type = Type;

  public forceUclEntity?: string;
  public forcePartnershipType?: string;
  public exportEnabled: boolean;

  public bbox: LngLatBounds;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private configurationService: ConfigurationService,
    private loading: LoadingService,
    private translate: TranslateService,
    private htmlElementPropertyService: HtmlElementPropertyService,
    private partnershipsService: PartnershipsService,
) {
    // add delay to prevent expression has changed after it was checked
    this.loaderStatus$ = this.loading.status.pipe(
      delay(0)).subscribe(status => (this.loaderStatus = status)
    );

    this.exportEnabled = htmlElementPropertyService.get('enable-export') === 'true';

    // Get a forced config from attributes
    this.forceUclEntity = htmlElementPropertyService.get('ucl-entity');
    this.forcePartnershipType = htmlElementPropertyService.get('partnership-type');
    this.model = {
      ...defaultModel,
      ucl_entity: this.forceUclEntity,
      type: this.forcePartnershipType,
    };
  }

  ngOnDestroy(): void {
    this.loaderStatus$.unsubscribe();
  }

  ngOnInit() {
    // Init form with url params
    this.route.queryParams
      .subscribe(params => {
        this.initFormFields(params);
        // Resetting params set by subcomponents
        const cleanedParams = {
          ...params,
          uniquePartnership: null,
          closingModal: null,
        };
        // Injecting into model
        this.model = {
          ...this.model,
          ...cleanedParams,
          with_children: params.with_children !== 'false',
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
        this.continents = getFormattedItemsList(config.continents.map(({ name }) => name));
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
        if (this.forceUclEntity) {
          // If uclEntity is pre-selected, look for child entities in list
          const rootLabel = config.ucl_universities.find(
            ({ value }) => value === this.forceUclEntity
          ).label.split('-')[0];
          this.uclEntities = config.ucl_universities.filter(
            ({ label }) => label.startsWith(rootLabel)
          );
        }

        this.partnershipTypes = config.partnership_types;
      });
  }

  private initCombinedSearch(params) {
    this.combinedSearch = [
      {
        id: 'continent',
        label: this.translate.instant('Continent'),
        label_plural: this.translate.instant('Continent'),
        children: this.continents.map(elem => ({
          ...elem,
          type: 'continent'
        })),
      },
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
  searchPartners(event?: any): void {
    if (event) {
      event.preventDefault();
    }
    this.router.navigate([''], {
      queryParams: {
        ...getCleanParams(this.model),
        // This resets state after using the partnerships modal and changing search
        partnerFilter: null,
      },
    });
  }

  /**
   * Reset all form fields
   */
  resetForm(event: any): void {
    event.preventDefault();
    this.model = {
      ...defaultModel,
      ucl_entity: this.forceUclEntity,
      type: this.forcePartnershipType,
    };
    this.combinedSearchValue = null;
    this.searchPartners();
  }

  combinedSearchValueChanged(value) {
    // Reset every possible combined value
    this.model = {
      ...this.model,
      partner: null,
      continent: null,
      country: null,
      city: null,
      funding_source: null,
      funding_type: null,
      funding_program: null,
      tag: null,
      partner_tag: null,
    };
    if (value) {
      this.model[value.type] = value.id;
    }
  }

  partnershipTypeChanged() {
    // Reset hidden values so that they do not interfere
    if (!this.isTargetFilterShown()) {
      this.model.mobility_type = null;
    }
    if (!this.isEducationLevelFilterShown()) {
      this.model.education_level = null;
    }
    if (!this.isYearOfferFilterShown()) {
      this.model.offer = null;
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
    return this.model.ucl_entity && (!this.forceUclEntity || this.uclEntities);
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

  export() {
    const query = getPartnerParams(this.model);
    query.bbox = this.bbox.toArray().toString();
    this.partnershipsService.getExportUrl(query).subscribe(
      ({ url }) => window.open(url)
    );
  }

  onBBoxChanged(event: BBoxChangedEvent) {
    this.bbox = event.bbox;
  }
}
