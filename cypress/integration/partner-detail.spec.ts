import { navigateTo, search } from '../support/po';

describe('Partner detail', () => {
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
      url: '/api/v1/partnerships/partnerships?continent=Europe&partner=bc203071-e421-4a7c-94c1-b1794b4906f4',
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

  it('should show right data OUT', () => {
    // Open first partner
    cy.get('[title="See partnership"]').first().click();
    cy.wait('@getPartnerships');

    // Check if modal is open
    cy.get('.modal-dialog').should('exist');
    cy.get('.modal-title').should('have.text', ' Partnership with Johann Wolfgang Goethe-Universität Frankfurt am Main ');

    // Check level of study
    cy.contains('Level of study').next('dd')
      .should('have.text', ' Bachelor, Master ');

    cy.contains('Faculty/School').next('dd')
      .should('have.text', 'PSAD');
  });

  it('should show right data IN', () => {
    // Open first partner
    cy.get('[title="See partnership"]').first().click();
    cy.wait('@getPartnerships');

    // Check if modal is open
    cy.get('.modal-dialog').should('exist');
    cy.get('.modal-title').should('have.text', ' Partnership with Johann Wolfgang Goethe-Universität Frankfurt am Main ');

    cy.contains(' Information for incoming students ').click();
    cy.contains(' Information for incoming students ').should('have.have.class', 'active');

    cy.contains('Contact person IN').next('dd')
      .should('have.text', 'Maria Rodrigues Leal Moitinho De Almeidamaria.rodrigues@gmail.com');
  });
});
