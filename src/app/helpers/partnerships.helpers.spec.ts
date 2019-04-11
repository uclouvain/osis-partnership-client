import { getMobilityType, isStudent, isStaff } from './partnerships.helpers';

describe('isStudent', () => {
  it('should returns false if empty object provided', () => {
    expect(isStudent({})).toEqual(false);
  });

  it('should returns false if everything is false', () => {
    expect(isStudent({
      is_sms: false,
      is_smp: false,
      is_smst: false,
      is_sta: false,
      is_stt: false,
    })).toEqual(false);
  });

  it('should returns false if is_sta is true', () => {
    expect(isStudent({
      is_sms: false,
      is_smp: false,
      is_smst: false,
      is_sta: true,
      is_stt: false,
    })).toEqual(false);
  });

  it('should returns false if is_stt is true', () => {
    expect(isStudent({
      is_sms: false,
      is_smp: false,
      is_smst: false,
      is_sta: false,
      is_stt: true,
    })).toEqual(false);
  });

  it('should returns true if is_sms is true', () => {
    expect(isStudent({
      is_sms: true,
      is_smp: false,
      is_smst: false,
      is_sta: false,
      is_stt: false,
    })).toEqual(true);
  });

  it('should returns true if is_smp is true', () => {
    expect(isStudent({
      is_sms: false,
      is_smp: true,
      is_smst: false,
      is_sta: false,
      is_stt: false,
    })).toEqual(true);
  });

  it('should returns true if is_smst is true', () => {
    expect(isStudent({
      is_sms: false,
      is_smp: false,
      is_smst: true,
      is_sta: false,
      is_stt: false,
    })).toEqual(true);
  });
});

describe('isStaff', () => {
  it('should returns false if empty object provided', () => {
    expect(isStaff({})).toEqual(false);
  });

  it('should returns false if everything is false', () => {
    expect(isStaff({
      is_sms: false,
      is_smp: false,
      is_smst: false,
      is_sta: false,
      is_stt: false,
    })).toEqual(false);
  });

  it('should returns true if is_sta is true', () => {
    expect(isStaff({
      is_sms: false,
      is_smp: false,
      is_smst: false,
      is_sta: true,
      is_stt: false,
    })).toEqual(true);
  });

  it('should returns true if is_stt is true', () => {
    expect(isStaff({
      is_sms: false,
      is_smp: false,
      is_smst: false,
      is_sta: false,
      is_stt: true,
    })).toEqual(true);
  });

  it('should returns false if is_sms is true', () => {
    expect(isStaff({
      is_sms: true,
      is_smp: false,
      is_smst: false,
      is_sta: false,
      is_stt: false,
    })).toEqual(false);
  });

  it('should returns false if is_smp is true', () => {
    expect(isStaff({
      is_sms: false,
      is_smp: true,
      is_smst: false,
      is_sta: false,
      is_stt: false,
    })).toEqual(false);
  });

  it('should returns false if is_smst is true', () => {
    expect(isStaff({
      is_sms: false,
      is_smp: false,
      is_smst: true,
      is_sta: false,
      is_stt: false,
    })).toEqual(false);
  });
});

describe('getMobilityType', () => {
  it('should returns empty everything is false', () => {
    const input = {
      is_sms: false,
      is_smp: false,
      is_smst: false,
      is_sta: false,
      is_stt: false,
    };

    expect(getMobilityType(input)).toEqual('');
  });

  it('should returns "Student (studies)" if is_sms is true', () => {
    const input = {
      is_sms: true,
      is_smp: false,
      is_smst: false,
      is_sta: false,
      is_stt: false,
    };

    expect(getMobilityType(input)).toEqual('Student (studies)');
  });

  it('should returns "Student (training)" if is_smp is true', () => {
    const input = {
      is_sms: false,
      is_smp: true,
      is_smst: false,
      is_sta: false,
      is_stt: false,
    };

    expect(getMobilityType(input)).toEqual('Student (training)');
  });

  it('should returns "Student (short term)" if is_smst is true', () => {
    const input = {
      is_sms: false,
      is_smp: false,
      is_smst: true,
      is_sta: false,
      is_stt: false,
    };

    expect(getMobilityType(input)).toEqual('Student (short term)');
  });

  it('should returns "Student (studies) / Staff" if is_sms and is_sta are true', () => {
    const input = {
      is_sms: true,
      is_smp: false,
      is_smst: false,
      is_sta: true,
      is_stt: false,
    };

    expect(getMobilityType(input)).toEqual('Student (studies) / Staff');
  });

  it('should returns "Student (studies) / Staff" if is_sms and is_stt are true', () => {
    const input = {
      is_sms: true,
      is_smp: false,
      is_smst: false,
      is_sta: false,
      is_stt: true,
    };

    expect(getMobilityType(input)).toEqual('Student (studies) / Staff');
  });

  it('should returns "Student (studies) / Staff" if is_sms, is_sta and is_stt are true', () => {
    const input = {
      is_sms: true,
      is_smp: false,
      is_smst: false,
      is_sta: true,
      is_stt: true,
    };

    expect(getMobilityType(input)).toEqual('Student (studies) / Staff');
  });

  it('should returns "Student (training) / Staff" if is_smp, is_sta are true', () => {
    const input = {
      is_sms: false,
      is_smp: true,
      is_smst: false,
      is_sta: true,
      is_stt: false,
    };

    expect(getMobilityType(input)).toEqual('Student (training) / Staff');
  });

  it('should returns "Student (short term) / Staff" if is_smst, is_sta are true', () => {
    const input = {
      is_sms: false,
      is_smp: false,
      is_smst: true,
      is_sta: true,
      is_stt: false,
    };

    expect(getMobilityType(input)).toEqual('Student (short term) / Staff');
  });

  it('should returns "Staff" if is_sta is true', () => {
    const input = {
      is_sms: false,
      is_smp: false,
      is_smst: false,
      is_sta: true,
      is_stt: false,
    };

    expect(getMobilityType(input)).toEqual('Staff');
  });

  it('should returns "Staff" if is_stt is true', () => {
    const input = {
      is_sms: false,
      is_smp: false,
      is_smst: false,
      is_sta: false,
      is_stt: true,
    };

    expect(getMobilityType(input)).toEqual('Staff');
  });
});
