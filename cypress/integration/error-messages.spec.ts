import { navigateTo, getH1, getInputStudent, getInputStaff, search, resetForm } from '../support/po';

describe('Error messages', () => {
  beforeEach(() => {
    cy.server();
  });

  it('should display error message for configuration load failed', () => {
    cy.route({
      method: 'GET',
      url: '/partnerships/v1/configuration',
      status: 500,
      response: {}
    }).as('getConfiguration');

    navigateTo();
    cy.wait('@getConfiguration');
    cy.get('.partnership__error').should('exist');
    cy.get('.partnership__error__title').first().should('have.text', 'Failed to load configuration');
  });

  it('should display error message for partners failed', () => {
    cy.route({
      method: 'GET',
      url: '/partnerships/v1/configuration',
      response: 'fixture:configuration.json'
    }).as('getConfiguration');

    cy.route({
      method: 'GET',
      url: '/partnerships/v1/partners?**',
      status: 500,
      response: {}
    }).as('getPartners');

    navigateTo();
    cy.wait('@getConfiguration');

    // Click on search to set params in url
    search();

    cy.wait('@getPartners');
    cy.get('.partnership__error').should('exist');
    cy.get('.partnership__error__title').should('have.text', 'Failed to load partners list');
  });

  it('should display error message for partner detail failed', () => {
    cy.route({
      method: 'GET',
      url: '/partnerships/v1/configuration',
      response: 'fixture:configuration.json'
    }).as('getConfiguration');

    cy.route({
      method: 'GET',
      url: '/partnerships/v1/partners?**',
      response: 'fixture:partners.json'
    }).as('getPartners');

    cy.route({
      method: 'GET',
      url: '/partnerships/v1/partnerships?**',
      status: 500,
      response: {}
    }).as('getPartnerships');

    navigateTo();
    cy.wait('@getConfiguration');

    // Click on search to set params in url
    search();

    cy.wait('@getPartners');

    cy.get('[id=list-button]').first().click();

    cy.get('[title="See partnership"]').first().click();
    cy.wait('@getPartnerships');

    cy.get('.partnership__error').should('exist');
    cy.get('.partnership__error__title').should('have.text', 'Failed to load partner detail');
  });
});
