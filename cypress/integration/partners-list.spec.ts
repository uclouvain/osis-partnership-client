import { navigateTo, search } from '../support/po';

describe('Partner list', () => {
  beforeEach(() => {
    cy.server();

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
      url: '/api/v1/partnerships/partners?continent=Europe&offset=25',
      response: 'fixture:partners-2.json'
    }).as('getPartners2');

    cy.route({
      method: 'GET',
      url: '/api/v1/partnerships/partners?continent=Europe&ordering=city',
      response: 'fixture:partners-ordering-city.json'
    }).as('getPartnersCityOrdered');
``
    cy.route({
      method: 'GET',
      url: '/api/v1/partnerships/partnerships?continent=Europe?partner=bc203071-e421-4a7c-94c1-b1794b4906f4',
      response: 'fixture:partnerships.json'
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
  });

  it('should display a total of 372 results', () => {
    cy.get('.page-count').should('have.text', ' 372 total ');
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
    cy.wait('@getPartners2');

    // Check if first item changed
    cy.get('.partners-list__name').first()
      .should('have.text', 'Universidad de Salamanca');

    // Set continent filter
    cy.get('[name=city]')
      .type('Toulouse')
      .type('{enter}');

    // Click on search to set params in url
    search();

    // Check if url dosn't contain offset
    cy.url().should('contain', '?continent=Europe&city=Toulouse');
    cy.url().should('not.contain', 'offset');
  });

  it('should returns to page 1 on sort changed', () => {
    // Go to page 2
    cy.get('[aria-label="page 2"]').first().click();
    cy.wait('@getPartners2');

    // Check if first item changed
    cy.get('.partners-list__name').first()
      .should('have.text', 'Universidad de Salamanca');

    // Click on city table head
    cy.get('datatable-header-cell[title=City]')
      .find('span.datatable-header-cell-wrapper').click();

    // Wait until ordering data loaded
    cy.wait('@getPartnersCityOrdered');

    // Check if url dosn't contain offset
    cy.url().should('contain', 'ordering=city');
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
