const url = 'http://localhost:4200';

export const navigateTo = () => cy.visit(url);

export const getH1 = () => cy.get('app-root h1');
