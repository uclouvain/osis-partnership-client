import { navigateTo, getH1, getInputStudent, getInputStaff, search, resetForm } from '../support/po';

describe('Search fields', () => {
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

describe('Search url params', () => {
  beforeEach(() => {
    cy.server();
    cy.route({
      method: 'GET',
      url: '/api/v1/partnerships/configuration/',
      response: 'fixture:configuration.json'
    }).as('getConfiguration');
  });

  it('should add default filters in url', () => {
    navigateTo();
    cy.wait('@getConfiguration');

    search();
    cy.url().should('include', '?mobility_type=student');
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
    cy.url().should('include', '?continent=Asia&country=JP&mobility_type=student');

    resetForm();
    cy.url().should('include', '?mobility_type=student');
  });

  it('should add custom filters in url', () => {
    navigateTo();
    cy.wait('@getConfiguration');

    cy.get('[name=ucl_university]')
      .type('FIA')
      .type('{enter}')
      .should('have.value', 'FIAL');

    cy.get('[name=ucl_university_labo]')
      .type('A')
      .type('{enter}')
      .should('have.value', 'ARKE');

    cy.get('[name=supervisor]')
      .type('BRAGA')
      .type('{enter}')
      .should('have.value', 'BRAGARD, Véronique');

    search();
// tslint:disable-next-line: max-line-length
    cy.url().should('include', '?ucl_university=e3afa5b4-433d-4eb6-a187-eebb7f759d3b&ucl_university_labo=75799811-6f67-46f7-9143-1e3da672f473&supervisor=74ad955c-88b8-4a95-877d-9340b60cc26a&mobility_type=student');

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
      .type('Middle')
      .type('{enter}')
      .should('have.value', 'Middle East Technical University');

    cy.get('[name=education_field]')
      .type('science')
      .type('{enter}')
      .should('have.value', 'Education science');

    search();
// tslint:disable-next-line: max-line-length
    cy.url().should('include', '?continent=Asia&country=JP&city=Tokyo&partner=Middle%20East%20Technical%20University&ucl_university=e3afa5b4-433d-4eb6-a187-eebb7f759d3b&ucl_university_labo=75799811-6f67-46f7-9143-1e3da672f473&supervisor=74ad955c-88b8-4a95-877d-9340b60cc26a&education_field=cf5422b0-8117-42b6-8c81-1d67cd899a27&mobility_type=student');
  });

  it('should retrieve url params in form', () => {
    // tslint:disable-next-line: max-line-length
    cy.visit('http://localhost:4200/#/?continent=Asia&country=JP&city=Tokyo&partner=Middle%20East%20Technical%20University&ucl_university=e3afa5b4-433d-4eb6-a187-eebb7f759d3b&ucl_university_labo=75799811-6f67-46f7-9143-1e3da672f473&supervisor=74ad955c-88b8-4a95-877d-9340b60cc26a&education_field=cf5422b0-8117-42b6-8c81-1d67cd899a27&mobility_type=student');
    cy.wait('@getConfiguration');

    cy.get('[name=ucl_university]').should('have.value', 'FIAL');
    cy.get('[name=ucl_university_labo]').should('have.value', 'ARKE');
    cy.get('[name=supervisor]').should('have.value', 'BRAGARD, Véronique');
    cy.get('[name=continent]').should('have.value', 'Asia');
    cy.get('[name=country]').should('have.value', 'Japon');
    cy.get('[name=city]').should('have.value', 'Tokyo');
    cy.get('[name=partner]').should('have.value', 'Middle East Technical University');
    cy.get('[name=education_field]').should('have.value', 'Education science');
  });

});
