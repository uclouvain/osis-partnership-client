import { navigateTo, getH1, getInputStudent, getInputStaff } from '../support/po';

describe('OSIS Partnership', () => {
  beforeEach(navigateTo);

  it('should display welcome message', () => {
    getH1().contains('OSIS Partnership');
  });

  it('should display Student selected checkbox', () => {
    getInputStudent().should('be.checked');
  });

  it('should display Staff not selected checkbox', () => {
    getInputStaff().should('not.be.checked');
  });
});
