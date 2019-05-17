import { navigateTo, getH1, getInputStudent, getInputStaff, search, resetForm } from '../support/po';

describe('Error messages', () => {
  beforeEach(() => {
    cy.server();
  });

  it('should display error message for configuration load failed', () => {
    cy.route({
      method: 'GET',
      url: '/api/v1/partnerships/configuration',
      status: 500,
      response: {}
    }).as('getConfiguration');

    navigateTo();
    cy.wait('@getConfiguration');
    cy.get('.partnership__error').should('exist');
    cy.get('.partnership__error__title').first().should('have.text', 'Failed to load configuration');
  });

  it('should display warning message on search if no params', () => {
    cy.route({
      method: 'GET',
      url: '/api/v1/partnerships/configuration',
      status: 500,
      response: {}
    }).as('getConfiguration');

    navigateTo();
    cy.wait('@getConfiguration');

    // Click on search
    search();

    // Should show warning message
    cy.get('.partnership__warning').should('exist');
    cy.get('.partnership__warning__message').first().should('have.text', 'You must select at least one filter');
  });

  it('should display error message for partners failed', () => {
    cy.route({
      method: 'GET',
      url: '/api/v1/partnerships/configuration',
      response: 'fixture:configuration.json'
    }).as('getConfiguration');

    cy.route({
      method: 'GET',
      url: '/api/v1/partnerships/partners?continent=Europe',
      status: 500,
      response: {}
    }).as('getPartners');

    navigateTo();
    cy.wait('@getConfiguration');

    // Set continent filter
    cy.get('[name=continent]')
      .type('Eur')
      .type('{enter}');

    // Click on search to set params in url
    search();

    cy.wait('@getPartners');
    cy.get('.partnership__error').should('exist');
    cy.get('.partnership__error__title').should('have.text', 'Failed to load partners list');
  });

  it('should display error message for partner detail failed', () => {
    cy.route({
      method: 'GET',
      url: '/api/v1/partnerships/configuration',
      response: 'fixture:configuration.json'
    }).as('getConfiguration');

    cy.route({
      method: 'GET',
      url: '/api/v1/partnerships/partners?continent=Europe',
      response: 'fixture:partners.json'
    }).as('getPartners');

    cy.route({
      method: 'GET',
      url: '/api/v1/partnerships/partnerships?continent=Europe&partner=bc203071-e421-4a7c-94c1-b1794b4906f4',
      status: 500,
      response: {}
    }).as('getPartnerships');

    navigateTo();
    cy.wait('@getConfiguration');

    // Set continent filter
    cy.get('[name=continent]')
      .type('Eur')
      .type('{enter}');

    // Click on search to set params in url
    search();

    cy.wait('@getPartners');

    cy.get('[title="See partnership"]').first().click();
    cy.wait('@getPartnerships');

    cy.get('.partnership__error').should('exist');
    cy.get('.partnership__error__title').should('have.text', 'Failed to load partner detail');
  });
});
