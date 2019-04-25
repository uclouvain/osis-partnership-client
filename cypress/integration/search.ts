import { navigateTo, getH1, getInputStudent, getInputStaff } from '../support/po';

describe('Search form', () => {
  beforeEach(() => {
    cy.server();
    cy.route({
      method: 'GET',
      url: '/api/v1/partnerships/configuration/',
      response: 'fixture:configuration.json'
    }).as('getConfiguration');

    navigateTo();
  });

  it('should display welcome message', () => {
    getH1().contains('OSIS Partnership');
  });

  it('should display Student selected checkbox', () => {
    getInputStudent().should('be.checked');
  });

  it('should display Staff not selected checkbox', () => {
    getInputStaff().should('not.be.checked');
  });

  it('should have Erasmus and Test as checkbox options for funding', () => {
    cy.wait('@getConfiguration');
    cy.get('input#Erasmus').should('exist');
    cy.get('input#Test').should('exist');
  });

  it('should open a list of ', () => {
    cy.get('[name=continent]').type('Eur');
  });
});
