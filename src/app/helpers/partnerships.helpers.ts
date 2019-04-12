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
