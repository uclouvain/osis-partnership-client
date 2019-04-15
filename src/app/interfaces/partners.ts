export default interface Partner {
  name: string;
  erasmus_code: string;
  partner_type: string;
  city: string;
  country: string;
}

export interface ResultPartners {
  count: number;
  next: string;
  previous: string;
  results: Partner[];
}
