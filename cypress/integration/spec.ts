import { navigateTo, getH1 } from '../support/po';

describe('Hello Angular', () => {
  beforeEach(navigateTo);

  it('should display welcome message', () => {
    getH1().contains('OSIS Partnership');
  });
});
