import { navigateTo } from '../support/po';

describe('Partner detail', () => {
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

  it('should show right data OUT', () => {
    // Open first partner
    cy.get('[title="See partnership"]').first().click();
    cy.wait('@getPartnerships');

    // Check if modal is open
    cy.get('.modal-dialog').should('exist');
    cy.get('.modal-title').should('have.text', ' Partnership with Middle East Technical University ');

    // Check level of study
    cy.contains('Level of study').next('dd')
      .should('have.text', 'First cycle / Bachelor’s or equivalent level (EQF-6)Second cycle / Master’s or equivalent level (EQF-7)');

    cy.contains('Faculty/School').next('dd')
      .should('have.text', 'EPSY');
  });

  it('should show right data IN', () => {
    // Open first partner
    cy.get('[title="See partnership"]').first().click();
    cy.wait('@getPartnerships');

    // Check if modal is open
    cy.get('.modal-dialog').should('exist');
    cy.get('.modal-title').should('have.text', ' Partnership with Middle East Technical University ');

    cy.contains(' Information for incoming students ').click();
    cy.contains(' Information for incoming students ').should('have.have.class', 'active');

    cy.contains('Contact person IN').next('dd')
      .should('have.text', 'Maria Rodrigues Leal Moitinho De Almeidamaria.rodrigues@gmail.com');
  });
});
