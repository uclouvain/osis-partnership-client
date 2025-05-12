import {navigateTo, search} from '../support/po';

describe('Partner detail', () => {
  beforeEach(() => {
    cy.intercept('GET', '/partnerships/v1/configuration', {
      fixture: 'configuration.json'
    }).as('getConfiguration');

    cy.intercept('GET', /\/partnerships\/v1\/partners\?.*/i, {
      fixture: 'partners.json'
    }).as('getPartners');

    cy.intercept('GET', /\/partnerships\/v1\/partnerships\?.*/i, {
      fixture: 'partnerships.json'
    }).as('getPartnerships');

    navigateTo();
    cy.wait('@getConfiguration');

    // Click on search to set params in url
    search();
    cy.wait('@getPartners');
  });

  it('should show right data OUT', () => {
    cy.get('[id=list-button]').first().click();

    // Open first partner
    cy.get('[title="See partnership"]').first().click();
    cy.wait('@getPartnerships');

    // Check if modal is open
    cy.get('.modal-dialog').should('be.visible');
    cy.get('.modal-title').should('have.text', ' Partnership with Aarhus Universitet ');

    // Check level of study
    cy.contains('Level of study').next('dd')
      .should('have.text', ' Bachelor, Master ');

    cy.get('dl').contains('UCLouvain').next('dd')
      .should('contain.text', 'PSAD');
  });

  it('should show right data IN', () => {
    cy.get('[id=list-button]').first().click();

    // Open first partner
    cy.get('[title="See partnership"]').first().click();
    cy.wait('@getPartnerships');

    // Check if modal is open
    cy.get('.modal-dialog').should('be.visible');
    cy.get('.modal-title').should('have.text', ' Partnership with Aarhus Universitet ');

    cy.contains(' Information for incoming students ').click();
    cy.contains(' Information for incoming students ').should('have.class', 'active');

    cy.contains('Contact person IN').next('dd')
      .should('have.text', ' Maria Rodrigues Leal Moitinho De Almeida ');
  });
});
