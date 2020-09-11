import Partner from './partners';
import Contact from './contact';
import Funding from './funding';
import { Type } from './partnership_type';

export default interface Partnership {
  description: string;
  subtype: string;
  uuid: string;
  partner: Partner;
  education_field:	string;
  ucl_faculty: AcronymEntity;
  ucl_entity: AcronymEntity;
  ucl_sector: string;
  supervisor: string;
  funding_program: string;
  id_number: string;
  project_title: string;
  mobility_type: 'student' | 'studies' | 'short_term' | 'training';
  status?: {
    status: string,
    valid_years: string,
    start_date: string,
    end_date: string,
  };
  out_education_level: string[];
  out_entities: AcronymEntity[];
  out_university_offer: string[];
  out_contact: Contact;
  out_portal: string;
  out_funding: Funding;
  out_partner_contacts: Contact[];
  out_course_catalogue: {
    fr: {
      text: string,
      url: string,
    },
    en: {
      text: string,
      url: string,
    },
  };
  in_contact: Contact;
  in_portal: string;
  staff_contact: Contact;
  staff_partner_contacts: Contact[];
  staff_funding: Funding;
  url: string;
  partner_entity: string;
  education_fields: string[];
  out_education_levels: string[];
  out_university_offers: string[];
  medias: Media[];
  out_summary_tables: Media[];
  out_useful_links: Media[];
  partnership_type: Type;
  type: string;
  missions: string;
  bilateral_agreements: {
    name: string,
    url: string,
  }[];
}

export interface ResultPartnerships {
  count: number;
  next: string;
  previous: string;
  results: Partnership[];
}

export interface PartnershipParams {
  [key: string]: unknown;
  city?: string;
  country?: string;
  education_field?: string;
  education_level?: string;
  offer?: string;
  limit?: number;
  offset?: number;
  partner?: string;
  type?: string;
  ucl_entity?: string;
  mobility_type?: string;
  funding_source?: number;
  funding_program?: number;
  funding_type?: number;
  partner_tag?: string;
  tag?: string;
}

export interface AcronymEntity {
  title: string;
  acronym: string;
}

export interface Media {
  name: string;
  url: string;
}
