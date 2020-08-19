export enum Type {
  General = 'GENERAL',
  Mobility = 'MOBILITY',
  Course = 'COURSE',
  Doctorate = 'DOCTORATE',
  Project = 'PROJECT',
}

export interface PartnershipType {
  id: Type;
  label: string;
}
