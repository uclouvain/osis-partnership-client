const baseUrl = 'http://localhost:4200';

export const navigateTo = () => cy.visit(baseUrl);

export const search = () => cy.get('button#search-partners').click();
export const resetForm = () => cy.get('button#reset-search-partners').click();
