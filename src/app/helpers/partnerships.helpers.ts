import { PartnershipParams, PartnerParams } from '../services/partnerships.service';

const STUDENT_TYPES = [
  'is_sms',
  'is_smp',
  'is_smst'
];

const STAFF_TYPES = [
  'is_sta',
  'is_stt'
];

/**
 * Returns true if partnership is a student type
 *
 * @export
 * @returns boolean
 */
export function isStudent(partnership) {
  return STUDENT_TYPES.filter(type => partnership[type]).length !== 0;
}

/**
 * Returns true if partnership is a staff type
 *
 * @export
 * @returns boolean
 */
export function isStaff(partnership) {
  return STAFF_TYPES.filter(type => partnership[type]).length !== 0;
}

/**
 * Return mobility type for a partnership
 *
 * @export
 * @returns string
 */
export function getMobilityType(partnership) {
  let mobilityType = '';
  const student = isStudent(partnership);
  const staff = isStaff(partnership);

  if (student && !staff) {
    if (partnership.is_sms) {
      mobilityType = 'Student (studies)';
    }
    if (partnership.is_smp) {
      mobilityType = 'Student (training)';
    }
    if (partnership.is_smst) {
      mobilityType = 'Student (short term)';
    }
  }

  if (student && staff) {
    if (partnership.is_sms) {
      mobilityType = 'Student (studies) / Staff';
    }
    if (partnership.is_smp) {
      mobilityType = 'Student (training) / Staff';
    }
    if (partnership.is_smst) {
      mobilityType = 'Student (short term) / Staff';
    }
  }

  if (!student && staff) {
    mobilityType = 'Staff';
  }

  return mobilityType;
}

export function getPartnershipParams(query: any): PartnershipParams {
  return {
    campus: query.campus || '',
    city: query.city || '',
    continent: query.continent || '',
    country: query.country || '',
    education_field: query.education_field || '',
    limit: query.limit || '',
    offset: query.offset || '',
    partner: query.partner || '',
    supervisor: query.supervisor || '',
    type: query.type || '',
    ucl_university: query.ucl_university || '',
    ucl_university_labo: query.ucl_university_labo || '',
  };
}

export function getPartnerParams(query: any): PartnerParams {
  return {
    campus: query.campus || '',
    city: query.city || '',
    continent: query.continent || '',
    country: query.country || '',
    education_field: query.education_field || '',
    limit: query.limit || '',
    offset: query.offset || '',
    supervisor: query.supervisor || '',
    type: query.type || '',
    ucl_university: query.ucl_university || '',
    ucl_university_labo: query.ucl_university_labo || '',
  };
}
