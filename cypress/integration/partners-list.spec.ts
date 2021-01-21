import { navigateTo, search } from '../support/po';

describe('Partner list', () => {
  beforeEach(() => {
    cy.server();

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
      url: '/partnerships/v1/partnerships/?**',
      response: 'fixture:partnerships.json'
    }).as('getPartnerships');

    navigateTo();
    cy.wait('@getConfiguration');

    // Set filter
    cy.get('[id=combined-search]')
      .type('France')
      .type('{enter}');

    // Click on search to set params in url
    search();
    cy.wait('@getPartners');

    cy.get('[id=list-button]').first().click();
  });

  it('should display a total of 179 results', () => {
    cy.get('.page-count').should('have.text', ' 179 total ');
    cy.get('.datatable-row-group').first()
      .get('.datatable-body-cell').first()
      .should('have.text', 'Johann Wolfgang Goethe-Universität Frankfurt am Main');
  });

  it('should open modal on click on partner detail', () => {
    // Open first partner
    cy.get('[title="See partnership"]').first().click();
    cy.wait('@getPartnerships');

    // Check if modal is open
    cy.get('.modal-dialog').should('exist');
    cy.get('.modal-title').should('have.text', ' Partnership with Johann Wolfgang Goethe-Universität Frankfurt am Main ');
  });

  it('should returns to page 1 on filters changed', () => {
    // Go to page 2
    cy.get('[aria-label="page 2"]').first().click();

    // Check if first item changed
    cy.get('.partners-list__name').first()
      .should('have.text', 'Universidad de Salamanca');

    // Set filter
    cy.get('[id=combined-search]')
      .type('Toulouse')
      .type('{enter}');

    // Click on search to set params in url
    search();

    // Check if url dosn't contain offset
    cy.url().should('contain', '?country=FR&city=Toulouse');
    cy.url().should('not.contain', 'offset');
  });

  it('should returns to page 1 on sort changed', () => {
    // Go to page 2
    cy.get('[aria-label="page 2"]').first().click();

    // Check if first item changed
    cy.get('.partners-list__name').first()
      .should('have.text', 'Universidad de Salamanca');

    // Click on city table head
    cy.get('datatable-header-cell[title=City]')
      .find('span.datatable-header-cell-wrapper').click();

    // Wait until ordering data loaded
    cy.wait('@getPartners');

    // Check if url dosn't contain offset
    cy.url().should('contain', 'ordering=-city');
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
