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
    cy.get('#map-influence').click();

    cy.get('[id=list-button]').first().click();
  });

  const firstResult = 'Aarhus Universitet';
  it('should display a total of 179 results', () => {
    cy.get('.page-count').should('have.text', ' 179 total ');
    cy.get('.datatable-row-group').first()
      .get('.datatable-body-cell').first()
      .should('have.text', firstResult);
  });

  it('should open modal on click on partner detail', () => {
    // Open first partner
    cy.get('[title="See partnership"]').first().click();
    cy.wait('@getPartnerships');

    // Check if modal is open
    cy.get('.modal-dialog').should('exist');
    cy.get('.modal-title').should('have.text', ' Partnership with ' + firstResult + ' ');
  });

  const firstResultOf2ndpage = 'Institut d\'Etudes Politiques de Paris';
  it('should returns to page 1 on filters changed', () => {
    // Go to page 2
    cy.get('[aria-label="page 2"]').first().click();

    // Check if first item changed
    cy.get('.partners-list__name').first()
      .should('have.text', firstResultOf2ndpage);

    // Set filter
    cy.get('[id=combined-search]')
      .type('Toulouse')
      .type('{enter}');

    // Click on search to set params in url
    search();

    // Check if url dosn't contain offset
    cy.url().should('contain', 'city=Toulouse');
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
