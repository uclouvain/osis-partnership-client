import { navigateTo, getH1, getInputStudent, getInputStaff, search, resetForm } from '../support/po';

describe('Search fields', () => {
  beforeEach(() => {
    cy.server();
    cy.route({
      method: 'GET',
      url: '/partnerships/v1/configuration',
      response: 'fixture:configuration.json'
    }).as('getConfiguration');

    navigateTo();
  });

  it('should display welcome message', () => {
    getH1().contains('OSIS Partnership');
  });

  it('should display Student selected checkbox', () => {
    getInputStudent().should('be.not.checked');
  });

  it('should display Staff not selected checkbox', () => {
    getInputStaff().should('be.not.checked');
  });

  it('ucl_entity field open typeahead', () => {
    cy.wait('@getConfiguration');
    cy.get('[name=ucl_entity]')
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

describe('Search url params', () => {
  beforeEach(() => {
    cy.server();
    cy.route({
      method: 'GET',
      url: '/partnerships/v1/configuration',
      response: 'fixture:configuration.json'
    }).as('getConfiguration');
  });

  it('should add url params and clear it if removed', () => {
    navigateTo();
    cy.wait('@getConfiguration');

    // Country text and clear
    cy.get('[name=continent]')
      .type('Asia')
      .type('{enter}')
      .should('have.value', 'Asia');

    cy.get('[name=country]')
      .type('Japo')
      .type('{enter}')
      .should('have.value', 'Japon');

    search();
    cy.url().should('include', '?continent=Asia&country=JP');

    resetForm();
    cy.url().should('include', '');
  });

  it('should add custom filters in url', () => {
    navigateTo();
    cy.wait('@getConfiguration');

    cy.get('[name=ucl_entity]')
      .type('AR')
      .type('{enter}')
      .should('have.value', 'ARKE - Commission de programme en histoire de l\'art et archéologie');

    search();
    cy.url().should('include', '?ucl_entity=75799811-6f67-46f7-9143-1e3da672f473');

    cy.get('[name=continent]')
      .type('Asia')
      .type('{enter}')
      .should('have.value', 'Asia');

    cy.get('[name=country]')
      .type('Jap')
      .type('{enter}')
      .should('have.value', 'Japon');

    cy.get('[name=city]')
      .type('Tokyo');

    cy.get('[name=partner]')
      .type('Toulouse')
      .type('{enter}')
      .should('have.value', 'Université Paul Sabatier Toulouse III');

    cy.get('[name=education_field]')
      .type('science')
      .type('{enter}')
      .should('have.value', 'Education science');

    search();
// tslint:disable-next-line: max-line-length
    cy.url().should('include', '?continent=Asia&country=JP&city=Tokyo&partner=19335648-29ae-4eaa-ab6d-ca28df5268e4&ucl_entity=75799811-6f67-46f7-9143-1e3da672f473&education_field=cf5422b0-8117-42b6-8c81-1d67cd899a27');
  });

  it('should retrieve url params in form', () => {
    // tslint:disable-next-line: max-line-length
    cy.visit('http://localhost:4200/#/?continent=Asia&country=JP&city=Tokyo&partner=19335648-29ae-4eaa-ab6d-ca28df5268e4&ucl_entity=75799811-6f67-46f7-9143-1e3da672f473&education_field=cf5422b0-8117-42b6-8c81-1d67cd899a27');
    cy.wait('@getConfiguration');

    cy.get('[name=ucl_entity]').should('have.value', 'ARKE - Commission de programme en histoire de l\'art et archéologie');
    cy.get('[name=continent]').should('have.value', 'Asia');
    cy.get('[name=country]').should('have.value', 'Japon');
    cy.get('[name=city]').should('have.value', 'Tokyo');
    cy.get('[name=partner]').should('have.value', 'Université Paul Sabatier Toulouse III');
    cy.get('[name=education_field]').should('have.value', 'Education science');
  });
});
