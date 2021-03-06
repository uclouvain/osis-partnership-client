export interface IdLabel {
  id: string;
  label: string;
}

export interface ValueLabel {
  value: string;
  label: string;
}

export interface FundingElement {
  value: string;
  text: string;
}

export interface SearchItemChild {
  id: string;
  label: string;
  type: string;
}

export interface CombinedSearchItem {
  id: string;
  label: string;
  label_plural: string;
  children: Array<SearchItemChild>;
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
