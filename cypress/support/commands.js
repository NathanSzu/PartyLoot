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
  cy.visit('http://localhost:3000/');
  cy.get('[data-cy=get-started]').click();
  cy.get('[data-cy=login-email]').type(email);
  cy.get('[data-cy=login-password]').type(password);
  cy.get('[data-cy=login]').click();
  cy.url().should('include', '/groups');
  cy.get('.close').click();
});

Cypress.Commands.add('addGroup', () => {
  cy.get('[data-cy=create-group]').click();
  cy.get('[data-cy=new-group-name]').type('Cool group{enter}');
  cy.contains('button', 'Cool group').should('have.length', 1);
});

Cypress.Commands.add('removeGroup', () => {
    cy.visit('http://localhost:3000/groups');
    cy.get('.close').click();
    cy.get('[data-cy=edit-group]').eq(0).click();
    cy.get('[data-cy=delete]').click();
    cy.get('[data-cy=confirm-delete]').click();
    cy.contains('button', 'Cool group').should('not.exist');
    cy.contains('button', 'Better group name').should('not.exist');
});

Cypress.Commands.add('fillItemFields', () => {
  cy.get('[data-cy=item-name]').type('New item');
  cy.get('[data-cy=item-qty]').type(20);
  cy.get('[data-cy=charge]').type(5);
  cy.get('[data-cy=charge-max]').type(7);
  cy.get('.ql-editor').type('A grand item description! 1234567890');
  cy.get('[data-cy=item-tags]').type('scroll, consumable');
});
