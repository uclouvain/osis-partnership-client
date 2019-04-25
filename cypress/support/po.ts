const url = 'http://localhost:4200';

export const navigateTo = () => cy.visit(url);

export const getH1 = () => cy.get('app-root h1');
export const getInputStudent = () => cy.get('input#Student');
export const getInputStaff = () => cy.get('input#Staff');
