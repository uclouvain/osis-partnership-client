import { navigateTo, search } from '../support/po';

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
      url: '/api/v1/partnerships/partners/?offset=25',
      response: 'fixture:partners-2.json'
    }).as('getPartners2');

    cy.route({
      method: 'GET',
      url: '/api/v1/partnerships/partners/?ordering=city',
      response: 'fixture:partners-ordering-city.json'
    }).as('getPartnersCityOrdered');

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
      .should('have.text', 'Middle East Technical University');
  });

  it('should open modal on click on partner detail', () => {
    // Open first partner
    cy.get('[title="See partnership"]').first().click();
    cy.wait('@getPartnerships');

    // Check if modal is open
    cy.get('.modal-dialog').should('exist');
    cy.get('.modal-title').should('have.text', ' Partnership with Middle East Technical University ');
  });

  it('should returns to page 1 on filters changed', () => {
    // Go to page 2
    cy.get('[aria-label="page 2"]').first().click();
    cy.wait('@getPartners2');

    // Check if first item changed
    cy.get('.partners-list__name').first()
      .should('have.text', 'Georg-August-Universität Göttingen');

    // Set continent filter
    cy.get('[name=continent]')
      .type('Eur')
      .type('{enter}');

    // Click on search to set params in url
    search();

    // Check if url dosn't contain offset
    cy.url().should('contain', '/#/?continent=Europe');
    cy.url().should('not.contain', 'offset');
  });

  it('should returns to page 1 on sort changed', () => {
    // Go to page 2
    cy.get('[aria-label="page 2"]').first().click();
    cy.wait('@getPartners2');

    // Check if first item changed
    cy.get('.partners-list__name').first()
      .should('have.text', 'Georg-August-Universität Göttingen');

    // Click on city table head
    cy.get('datatable-header-cell[title=City]')
      .find('span.datatable-header-cell-wrapper').click();

    // Wait until ordering data loaded
    cy.wait('@getPartnersCityOrdered');

    // Check if url dosn't contain offset
    cy.url().should('contain', '/#/?ordering=city');
    cy.url().should('not.contain', 'offset');
  });

  it('should reset partners params on close modal', () => {
    // Open first partner
    cy.get('[title="See partnership"]').first().click();
    cy.wait('@getPartnerships');

    // Close modal
    cy.get('[aria-label="Close"]').first().click();
    cy.url().should('not.contain', 'partnerFilter');
  });
});
