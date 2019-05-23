import Partner from './partners';
import Contact from './contact';
import Funding from './funding';

export default interface Partnership {
  uuid: string;
  partner: Partner;
  education_field:	string;
  ucl_university: AcronymEntity;
  ucl_university_labo: AcronymEntity;
  supervisor: string;
  mobility_type: 'student' | 'studies' | 'short_term' | 'training';
  status?: {
    status: boolean
    valid_years: string
  };
  out_education_level: string[];
  out_entities: AcronymEntity[];
  out_university_offer: string[];
  out_contact: Contact;
  out_portal: string;
  out_funding: Funding;
  out_partner_contacts: Contact[];
  in_contact: Contact;
  in_portal: string;
  staff_contact_name: string;
  staff_partner_contacts: Contact[];
  staff_funding: Funding;
  url: string;
  partner_entity: string;
  education_fields: string[];
  out_education_levels: string[];
  out_university_offers: string[];
  medias: {
    name: string;
    url: string;
  }[];
}

export interface ResultPartnerships {
  count: number;
  next: string;
  previous: string;
  results: Partnership[];
}

export interface PartnershipParams {
  campus?: string;
  city?: string;
  continent?: string;
  country?: string;
  education_field?: string;
  limit?: number;
  offset?: number;
  partner?: string;
  supervisor?: string;
  type?: string;
  ucl_university?: string;
  ucl_university_labo?: string;
  mobility_type?: string[];
  funding?: string[];
  ordering?: string;
}

export interface AcronymEntity {
  title: string;
  acronym: string;
}
