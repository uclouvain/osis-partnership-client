const baseUrl = 'http://localhost:4200';

export const navigateTo = () => cy.visit(baseUrl);

export const getH1 = () => cy.get('app-root h1');
export const getInputStudent = () => cy.get('input#student');
export const getInputStaff = () => cy.get('input#staff');

export const search = () => cy.get('button#search-partners').click();
