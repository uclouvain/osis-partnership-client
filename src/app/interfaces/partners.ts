export default interface Partner {
  name: string;
  erasmus_code: string;
  partner_type: string;
  city: string;
  country: string;
  uuid: string;
}

export interface ResultPartners {
  count: number;
  next: string;
  previous: string;
  results: Partner[];
}

export interface PartnerParams {
  campus: string;
  city: string;
  continent: string;
  country: string;
  education_field: string;
  limit: number;
  offset: number;
  supervisor: string;
  type: string;
  ucl_university: string;
  ucl_university_labo: string;
  mobility_type: string[];
  funding: string[];
}
