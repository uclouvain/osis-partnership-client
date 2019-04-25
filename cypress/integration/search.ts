import { navigateTo, getH1, getInputStudent, getInputStaff } from '../support/po';

describe('Search form', () => {
  beforeEach(() => {
    cy.server();
    cy.route({
      method: 'GET',
      url: '/api/v1/partnerships/configuration/',
      response: 'fixture:configuration.json'
    }).as('getConfiguration');

    navigateTo();
  });

  it('should display welcome message', () => {
    getH1().contains('OSIS Partnership');
  });

  it('should display Student selected checkbox', () => {
    getInputStudent().should('be.checked');
  });

  it('should display Staff not selected checkbox', () => {
    getInputStaff().should('not.be.checked');
  });

  it('should have Erasmus and Test as checkbox options for funding', () => {
    cy.wait('@getConfiguration');
    cy.get('input#Erasmus').should('exist');
    cy.get('input#Test').should('exist');
  });

  it('ucl_university field open typeahead', () => {
    cy.wait('@getConfiguration');
    cy.get('[name=ucl_university]')
      .type('A')
      .siblings('typeahead-container')
      .should('exist');
  });

  it('supervisor field open typeahead', () => {
    cy.wait('@getConfiguration');
    cy.get('[name=supervisor]')
      .type('A')
      .siblings('typeahead-container')
      .should('exist');
  });

  it('continent field open typeahead, then show country field', () => {
    cy.wait('@getConfiguration');
    cy.get('[name=continent]')
      .type('Eur')
      .siblings('typeahead-container')
      .should('exist');

    cy.get('[name=continent]')
      .type('{enter}')
      .should('have.value', 'Europe')
      .get('[name=country]')
      .should('exist');

    cy.get('[name=country]')
      .type('Belg')
      .type('{enter}')
      .should('have.value', 'Belgique');
  });

  it('partner field open typeahead', () => {
    cy.wait('@getConfiguration');
    cy.get('[name=partner]')
      .type('A')
      .siblings('typeahead-container')
      .should('exist');
  });

  it('education_field field open typeahead', () => {
    cy.wait('@getConfiguration');
    cy.get('[name=education_field]')
      .type('A')
      .siblings('typeahead-container')
      .should('exist');
  });
});
