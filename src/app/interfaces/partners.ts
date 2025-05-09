import {Type} from './partnership_type';
import * as GeoJSON from 'geojson';

export default interface Partner {
  name: string;
  city: string;
  country: string;
  country_iso: string;
  erasmus_code: string;
  uuid: string;
  partnerships_count: number;
  location: GeoJSON.Geometry;
  website: string;
};

export interface PartnerParams {
  education_level?: string;
  city?: string;
  continent?: string;
  country?: string;
  education_field?: string;
  limit?: number;
  offset?: number;
  type?: Type;
  ucl_entity?: string;
  mobility_type?: string;
  funding?: string;
  ordering?: string;
  bbox?: string;
}
