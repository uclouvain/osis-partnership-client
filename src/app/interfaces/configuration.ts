import { ValueLabel } from './common';

export interface Country {
  name: string;
  iso_code: string;
  cities: string[];
}

export interface Continent {
  name: string;
  countries: Country[];
}

export interface Configuration {
  continents: Continent[];
  partners: ValueLabel[];
  ucl_universities: ValueLabel[];
  // supervisors: ValueLabel[];
  education_fields: ValueLabel[];
  fundings: string[];
}
