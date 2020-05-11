export interface ValueLabel {
  id: string;
  label: string;
}

export interface SearchParams {
  continent: string;
  country: string;
  city: string;
  partner: string;
  ucl_entity: string;
  supervisor: string;
  education_field: string;
  mobility_type: string[];
  funding: string[];
}
