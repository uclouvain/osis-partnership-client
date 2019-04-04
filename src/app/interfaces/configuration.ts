import { ValueLabel } from "./common";

export interface Country {
  name: string,
  cities: string[]
}

export interface Continent {
  name: string,
  countries: Country[]
}

export default interface Configuration {
  continents: Continent[]
  partners: ValueLabel[],
  ucl_universities: ValueLabel[],
  ucl_university_labo: ValueLabel[],
  supervisors: ValueLabel[],
  education_fields: ValueLabel[]
}