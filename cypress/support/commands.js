// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (email = 'test@test.com', password = 'password') => {
  indexedDB.deleteDatabase('firebaseLocalStorageDb');
  cy.visit('/');
  cy.get('[data-cy=get-started]').click();
  cy.get('[data-cy=login-email]').type(email);
  cy.get('[data-cy=login-password]').type(password);
  cy.get('[data-cy=login]').click();
  cy.url().should('include', '/groups');
  cy.get('.btn-close', { timeout: 10000 }).click();
});

Cypress.Commands.add('addGroup', (uid = 'Cool group') => {
  cy.get('[data-cy=create-group]').click();
  cy.get('[data-cy=new-group-name]').type(`${uid}{enter}`);
  cy.contains('a', uid).should('have.length', 1);
});

Cypress.Commands.add('removeGroup', (uid = 'Cool group', uid2 = 'Cool group #2') => {
    cy.visit('/groups');
    cy.get('.btn-close', { timeout: 10000 }).click();
    cy.get('[data-cy=edit-group]').eq(0).click();
    cy.get('[data-cy=delete]').click();
    cy.get('[data-cy=confirm-delete]').click();
    cy.contains('button', uid).should('not.exist');
    cy.contains('button', uid2).should('not.exist');
});

Cypress.Commands.add('fillItemFields', () => {
  cy.get('[data-cy=item-name]').type('New item');
  cy.get('[data-cy=item-qty]').type(20);
  cy.get('[data-cy=charge]').type(5);
  cy.get('[data-cy=charge-max]').type(7);
  cy.get('.ql-editor').type('A grand item description! 1234567890');
  cy.get('[data-cy=item-tags]').type('scroll, consumable');
});
