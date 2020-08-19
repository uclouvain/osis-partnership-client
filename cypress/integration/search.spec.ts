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

  it('ucl_entity field open typeahead', () => {
    cy.wait('@getConfiguration');
    cy.get('[name=ucl_entity]')
      .type('A')
      .children('ng-dropdown-panel')
      .should('exist');
  });

  it('open typeahead to input country', () => {
    cy.wait('@getConfiguration');
    cy.get('[name=combined_search]')
      .type('Fran')
      .children('ng-dropdown-panel')
      .should('exist');

    cy.get('[name=combined_search]')
      .type('{enter}');

    search();
    cy.url().should('include', 'country=FR');

    cy.get('[name=combined_search]')
      .type('Belg')
      .type('{enter}');
    cy.url().should('not.include', 'country=BE');

    search();
    cy.url().should('include', 'country=BE');
  });

  it('partner field open typeahead', () => {
    cy.wait('@getConfiguration');
    cy.get('[name=combined_search]')
      .type('Universität')
      .children('ng-dropdown-panel')
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
    cy.get('[name=combined_search]')
      .type('Japo')
      .type('{enter}');

    search();
    cy.url().should('include', 'country=JP');

    resetForm();
    cy.url().should('include', '');
  });

  it('should add custom filters in url', () => {
    navigateTo();
    cy.wait('@getConfiguration');

    cy.get('[name=ucl_entity]')
      .type('philo')
      .type('{enter}')
      .find('.ng-value-label')
      .should('contain.text', 'SSH / FIAL - Faculté de philosophie, arts et lettres');

    search();
    cy.url().should('include', 'ucl_entity=e3afa5b4-433d-4eb6-a187-eebb7f759d3b');

    cy.get('[name=combined_search]')
      .type('Paul Sabatier')
      .type('{enter}')
      .find('.ng-value-label')
      .should('contain.text', 'Université Paul Sabatier Toulouse III');

    cy.get('[name=partnership_type]')
      .click()
      .find('.ng-option-label')
      .contains('mobilité')
      .click();

    cy.get('[name=partnership_type]')
      .find('.ng-value-label')
      .should('contain.text', 'Partenariat de mobilité');

    search();

    cy.url()
      .should('include', 'partner=c598f1d6-a322-49fd-8b84-d294de39bef5')
      .should('include', 'ucl_entity=e3afa5b4-433d-4eb6-a187-eebb7f759d3b')
      .should('include', 'type=MOBILITY');
  });

  it('should retrieve url params in form', () => {
    // tslint:disable-next-line: max-line-length
    cy.visit('http://localhost:4200/#/?city=Tokyo&ucl_entity=e3afa5b4-433d-4eb6-a187-eebb7f759d3b&type=MOBILITY');
    cy.wait('@getConfiguration');

    cy.get('[name=combined_search]')
      .find('.ng-value-label')
      .should('contain.text', 'Tokyo');

    cy.get('[name=ucl_entity]')
      .find('.ng-value-label')
      .should('contain.text', 'SSH / FIAL - Faculté de philosophie, arts et lettres');

    cy.get('[name=partnership_type]')
      .find('.ng-value-label')
      .should('contain.text', 'Partenariat de mobilité');
  });
});
