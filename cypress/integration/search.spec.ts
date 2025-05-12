import {navigateTo, resetForm, search} from '../support/po';

describe('Search url params', () => {
  beforeEach(() => {
    cy.intercept('GET', '/partnerships/v1/configuration', {
      fixture: 'configuration.json'
    }).as('getConfiguration');

    cy.intercept('GET', '/partnerships/v1/partners*').as('getSearch');
  });

  it('should add url params and clear it if removed', () => {
    navigateTo();
    cy.wait('@getConfiguration');
    cy.wait('@getSearch');

    // Country text and clear
    cy.get('[name=combined_search]')
      .type('Japo')
      .type('{enter}');

    search();
    cy.url().should('include', 'country=JP');
    cy.wait('@getSearch').its('request.url').should('include', 'country=JP');

    resetForm();
    cy.url().should('not.include', 'country=JP');
  });

  it('should add custom filters in url', () => {
    navigateTo();
    cy.wait('@getConfiguration');
    cy.wait('@getSearch');

    cy.get('[name=ucl_entity]')
      .type('philo')
      .type('{enter}')
      .find('.ng-value-label')
      .should('contain.text', 'SSH / FIAL - Faculté de philosophie, arts et lettres');

    search();
    cy.url().should('include', 'ucl_entity=e3afa5b4-433d-4eb6-a187-eebb7f759d3b');
    cy.wait('@getSearch').its('request.url').should('include', 'ucl_entity=e3afa5b4-433d-4eb6-a187-eebb7f759d3b');

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

    search();
    cy.wait('@getSearch').its('request.url')
      .should('include', 'partner=c598f1d6-a322-49fd-8b84-d294de39bef5')
      .should('include', 'ucl_entity=e3afa5b4-433d-4eb6-a187-eebb7f759d3b')
      .should('include', 'type=MOBILITY');
    cy.url()
      .should('include', 'partner=c598f1d6-a322-49fd-8b84-d294de39bef5')
      .should('include', 'ucl_entity=e3afa5b4-433d-4eb6-a187-eebb7f759d3b')
      .should('include', 'type=MOBILITY');
  });

  it('should add funding filters in url', () => {
    navigateTo();
    cy.wait('@getConfiguration');
    cy.wait('@getSearch');

    cy.get('[name=combined_search]')
      .type('MakinaFundingSource')
      .type('{enter}');
    search();
    cy.wait('@getSearch').its('request.url')
      .should('include', 'funding_source=4');

    cy.get('[name=combined_search]')
      .type('MakinaFundingProgram')
      .type('{enter}');
    search();
    cy.wait('@getSearch').its('request.url')
      .should('not.include', 'funding_source=4')
      .should('include', 'funding_program=4');

    cy.get('[name=combined_search]')
      .type('MakinaFundingType')
      .type('{enter}');
    search();
    cy.wait('@getSearch').its('request.url')
      .should('not.include', 'funding_source=4')
      .should('not.include', 'funding_program=4')
      .should('include', 'funding_type=8');
  });

  it('should add tags filters in url', () => {
    navigateTo();
    cy.wait('@getConfiguration');
    cy.wait('@getSearch');

    cy.get('[name=combined_search]')
      .type('CLUSTER')
      .type('{enter}');
    search();
    cy.wait('@getSearch').its('request.url')
      .should('include', 'tag=CLUSTER');
  });

  it('should add partner tags filters in url', () => {
    navigateTo();
    cy.wait('@getConfiguration');
    cy.wait('@getSearch');

    cy.get('[name=combined_search]')
      .type('The Guild')
      .type('{enter}');
    search();
    cy.wait('@getSearch').its('request.url')
      .should('include', 'partner_tag=The%20Guild');
  });

  it('should show correct filters', () => {
    navigateTo();
    cy.wait('@getConfiguration');
    cy.wait('@getSearch');

    cy.get('[name=partnership_type]')
      .click()
      .find('.ng-option-label')
      .contains('mobilité')
      .click();

    cy.get('[name=target_group]')
      .click()
      .find('.ng-option-label')
      .contains('Student')
      .click();

    cy.get('[name=education_level]')
      .click()
      .find('.ng-option-label')
      .contains('Second')
      .click();

    search();
    cy.wait('@getSearch').its('request.url')
      .should('include', 'mobility_type=student')
      .should('include', 'education_level=ISCED-7');

    cy.get('[name=partnership_type]')
      .click()
      .find('.ng-option-label')
      .contains('doctorat')
      .click();

    search();
    cy.wait('@getSearch').its('request.url')
      .should('not.include', 'mobility_type=student')
      .should('include', 'education_level=ISCED-7');
  });

  it('should retrieve url params in form', () => {
    // eslint-disable-next-line max-len
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
