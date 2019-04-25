import { navigateTo, getH1, getInputStudent, getInputStaff } from '../support/po';

describe('Partners list', () => {
  beforeEach(navigateTo);

  it('should display welcome message', () => {
    getH1().contains('OSIS Partnership');
  });
});
