import { navigateTo } from '../support/po';

describe('Partner list', () => {
  beforeEach(() => {
    cy.server();

    cy.route({
      method: 'GET',
      url: '/api/v1/partnerships/configuration/',
      response: 'fixture:configuration.json'
    }).as('getConfiguration');

    cy.route({
      method: 'GET',
      url: '/api/v1/partnerships/partners/?',
      response: 'fixture:partners.json'
    }).as('getPartners');

    cy.route({
      method: 'GET',
      url: '/api/v1/partnerships/partnerships/?partner=32c48e52-229e-485a-aa3a-9e9904971af5',
      response: 'fixture:partnerships.json'
    }).as('getPartnerships');

    navigateTo();
    cy.wait('@getConfiguration');
    cy.wait('@getPartners');
  });

  it('should display a total of 516 results', () => {
    cy.get('.page-count').should('have.text', ' 516 total ');
    cy.get('.datatable-row-group').first()
      .get('.datatable-body-cell').first()
      .should('have.text', ' Middle East Technical University ');
  });

  it('should open modal on click on partner detail', () => {
    cy.get('[title="See partnership"]').first().click();
    cy.wait('@getPartnerships');

    cy.get('.modal-dialog').should('exist');
    cy.get('.modal-title').should('have.text', ' Partnership with Middle East Technical University ');
  });

  // it('should display a total of 516 results', () => {
  //   cy.get('[title="See partnership"]').first().click();
  //   cy.wait('@getPartners');

  //   cy.get('.page-count').should('have.text', '516 total');
  // });

  // it('should display error message for configuration load failed', () => {
  //   cy.get('[title="See partnership"]').first().click();
  //   cy.wait('@getPartnerships');

  //   cy.get('.partnership__error').should('exist');
  //   cy.get('.partnership__error__title').should('have.text', 'Failed to load configuration');
  // });
});
