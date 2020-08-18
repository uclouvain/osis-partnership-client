export default interface Partner {
  name: string;
  city: string;
  country: string;
  uuid: string;
  partnerships_count: number;
  location: GeoJSON.Geometry;
}

export interface PartnerParams {
  [key: string]: unknown;
  campus?: string;
  city?: string;
  continent?: string;
  country?: string;
  education_field?: string;
  limit?: number;
  offset?: number;
  supervisor?: string;
  type?: string;
  ucl_entity?: string;
  mobility_type?: string[];
  funding?: string[];
  ordering?: string;
}
