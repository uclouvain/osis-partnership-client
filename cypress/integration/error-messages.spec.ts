import {navigateTo, search} from '../support/po';

describe('Error messages', () => {
  it('should display error message for configuration load failed', () => {
    cy.intercept('GET', '/partnerships/v1/configuration', {
      statusCode: 500,
      body: {}
    }).as('getConfiguration');

    navigateTo();
    cy.wait('@getConfiguration');
    cy.get('.partnership__error').should('exist');
    cy.get('.partnership__error__title').first().should('have.text', 'Failed to load configuration');
  });

  it('should display error message for partners failed', () => {
    cy.intercept('GET', '/partnerships/v1/configuration', {
      fixture: 'configuration.json'
    }).as('getConfiguration');

    cy.intercept('GET', '/partnerships/v1/partners**', {
      statusCode: 500,
      body: {}
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
    cy.intercept('GET', '/partnerships/v1/configuration', {
      fixture: 'configuration.json'
    }).as('getConfiguration');

    cy.intercept('GET', '/partnerships/v1/partners**', {
      fixture: 'partners.json'
    }).as('getPartners');

    cy.intercept('GET', '/partnerships/v1/partnerships**', {
      statusCode: 500,
      body: {}
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
