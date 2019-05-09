import { Component, ElementRef, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { map, delay, first, catchError } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { CheckboxItem } from '../checkbox-group/checkbox-group.component';
import { ValueLabel } from 'src/app/interfaces/common';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { LoadingService } from 'src/app/services/loading.service.js';
import { getValueLabelList, getFormattedItemsList, getLabel } from 'src/app/helpers/list.helpers.js';
import { Configuration } from 'src/app/interfaces/configuration.js';
import { getCleanParams } from 'src/app/helpers/partnerships.helpers.js';

const defaultModel = {
  continent: '',
  country: '',
  city: '',
  partner: '',
  ucl_university: '',
  ucl_university_labo: '',
  campus: '',
  supervisor: '',
  education_field: '',
  mobility_type: [],
  funding: [],
  limit: 25,
  offset: 0
};

const defaultFields = {
  country: '',
  uclUniversity: '',
  uclUniversityLabo: '',
  supervisor: '',
  educationField: '',
  partner: '',
};

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  public model = {...defaultModel};
  public fields = {...defaultFields};

  public configError = false;

  public config: Configuration;
  public continents: ValueLabel[];
  public countries: ValueLabel[];
  public educationFields: ValueLabel[];
  public partners: ValueLabel[];
  public supervisors: ValueLabel[];
  public uclUniversities: ValueLabel[];
  public uclUniversitiesLabo: ValueLabel[];

  public noContinent = false;
  public mobilityTypesOptions = [
    new CheckboxItem('student', 'Student'),
    new CheckboxItem('staff', 'Staff'),
  ];
  public fundingOptions: CheckboxItem[] = [];

  public loaderStatus: boolean;
  private loaderStatus$: Subscription;

  @ViewChild('continent') continentElement: ElementRef;
  @ViewChild('country') countryElement: ElementRef;
  @ViewChild('partner') partnerElement: ElementRef;
  @ViewChild('supervisor') supervisorElement: ElementRef;
  @ViewChild('educationField') educationFieldElement: ElementRef;
  @ViewChild('uclUniversity') uclUniversityElement: ElementRef;
  @ViewChild('uclUniversityLabo') uclUniversityLaboElement: ElementRef;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private configurationService: ConfigurationService,
    private loading: LoadingService
  ) {
    // add delay to prevent expression has changed after it was checked
    this.loaderStatus$ = this.loading.status.pipe(delay(0)).subscribe(status => (this.loaderStatus = status));
  }

  ngOnDestroy(): void {
    this.loaderStatus$.unsubscribe();
  }

  ngOnInit() {
    // Init form with url params
    this.route.queryParams
      .pipe(
        first(),
        // mobility_type and funding need to be arrays
        map(params => ({
          ...this.model,
          ...params,
          mobility_type: params.mobility_type
            ? typeof params.mobility_type === 'string' ? [params.mobility_type] : [...params.mobility_type]
            : this.model.mobility_type,
          funding: params.funding
            ? typeof params.funding === 'string' ? [params.funding] : [...params.funding]
            : this.model.funding
          })
        )
      )
      .subscribe(params => {
        this.initFormFields(params);
        this.model = params;
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
      // Fundings options
      config.fundings.map(funding => {
        this.fundingOptions.push(new CheckboxItem(funding, funding));
      });
      // Typeahead list options
      this.continents = getValueLabelList(config.continents);
      this.educationFields = getFormattedItemsList(config.education_fields);
      this.partners = getFormattedItemsList(config.partners);
      this.supervisors = getFormattedItemsList(config.supervisors);
      this.uclUniversities = getFormattedItemsList(config.ucl_universities);

      // Init default  values from url params
      if (params.continent) {
        this.onContinentSelect({ value: params.continent });
        if (params.country) {
          this.fields.country = getLabel(this.countries, params.country);
        }
      }

      if (params.ucl_university) {
        this.fields.uclUniversity = getLabel(this.uclUniversities, params.ucl_university);
        this.onUclUniversitySelect({ value: this.fields.uclUniversity });
        if (params.ucl_university_labo) {
          this.fields.uclUniversityLabo = getLabel(this.uclUniversitiesLabo, params.ucl_university_labo);
        }
      }

      if (params.supervisor) {
        this.fields.supervisor = getLabel(this.supervisors, params.supervisor);
      }

      if (params.partner) {
        this.fields.partner = getLabel(this.partners, params.partner);
      }

      if (params.education_field) {
        this.fields.educationField = getLabel(this.educationFields, params.education_field);
      }
    });
  }

  /**
   * Show a warning message if selected continent is not valid
   */
  typeaheadNoContinent(event: boolean): void {
    this.noContinent = event;
  }

  /**
   * Set country list for selected continent
   */
  onContinentSelect = (event: any): void => {
    if (event.value && this.config) {
      this.countries = getValueLabelList(this.config.continents, { name: 'countries', value: event.value });
    }
    if (this.continentElement) {
      this.continentElement.nativeElement.focus();
    }
  }

  /**
   * Set country code in model for request
   */
  onCountrySelect = (event: any): void => {
    this.model.country = event.item ? event.item.id : '';
    if (this.countryElement) {
      this.countryElement.nativeElement.focus();
    }
  }

  onCountryChange(value) {
    if (value === '') {
      this.model.country = '';
    }
  }

  /**
   * Set ucl_university uuid in model for request
   * Set uclUniversitiesLabo for this ucl_university
   */
  onUclUniversitySelect = (event: any): void => {
    if (event.value && this.config) {
      this.uclUniversitiesLabo = getValueLabelList(this.config.ucl_universities, { name: 'ucl_university_labos', value: event.value });
    }

    this.model.ucl_university = event.item ? event.item.id : '';
    if (this.uclUniversityElement) {
      this.uclUniversityElement.nativeElement.focus();
    }
  }

  onUclUniversityChange(value) {
    if (value === '') {
      this.model.ucl_university = '';
    }
  }

  /**
   * Set ucl_university_labo uuid in model for request
   */
  onUclUniversityLaboSelect = (event: any): void => {
    this.model.ucl_university_labo = event.item ? event.item.id : '';
    if (this.uclUniversityLaboElement) {
      this.uclUniversityLaboElement.nativeElement.focus();
    }
  }


  onUclUniversityLaboChange(value) {
    if (value === '') {
      this.model.ucl_university_labo = '';
    }
  }

  /**
   * Set supervisor uuid in model for request
   */
  onSupervisorSelect = (event: any): void => {
    this.model.supervisor = event.item ? event.item.id : '';
    if (this.supervisorElement) {
      this.supervisorElement.nativeElement.focus();
    }
  }

  onSupervisorChange(value) {
    if (value === '') {
      this.model.supervisor = '';
    }
  }

  /**
   * Set partner uuid in model for request
   */
  onPartnerSelect = (event: any): void => {
    this.model.partner = event.item ? event.item.id : '';
  }


  onPartnerChange(value) {
    if (value === '') {
      this.model.partner = '';
    }
  }

  /**
   * Set education_field uuid in model for request
   */
  onEducationFieldSelect = (event: any): void => {
    this.model.education_field = event.item ? event.item.id : '';
    if (this.educationFieldElement) {
      this.educationFieldElement.nativeElement.focus();
    }
  }


  onEducationFieldChange(value) {
    if (value === '') {
      this.model.education_field = '';
    }
  }

  /**
   * Set mobility_type value
   */
  onMobilityTypesChange(value) {
    this.model.mobility_type = value;
  }

  /**
   * Set funding value
   */
  onFundingChange(value) {
    this.model.funding = value;
  }

  /**
   * Change route to add choosen options in url params
   * Then modal-partner component will fetch data with these new params
   */
  searchPartners(event: any): void {
    event.preventDefault();
    // Reset current page to 1
    this.model.offset = 0;
    this.router.navigate(['/'], { queryParams: getCleanParams(this.model) });
  }

  /**
   * Reset all form fields
   * Usefull because ngx-typeahead components (autocomplete) will not clear data
   * when we remove text of inputs and keep last selected item.
   */
  resetForm(event: any): void {
    event.preventDefault();
    this.fields = {...defaultFields};
    this.model = {...defaultModel};
    this.router.navigate(['/']);
  }
}
