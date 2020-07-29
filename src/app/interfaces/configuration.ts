import { FundingElement, ValueLabel } from './common';
import { PartnershipType } from './partnership_type';

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
  education_levels: ValueLabel[];
  education_fields: ValueLabel[];
  fundings: FundingElement[];
  tags: string[];
  partner_tags: string[];
  partnership_types: PartnershipType[];
}
