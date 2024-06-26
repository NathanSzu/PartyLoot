Cypress.Commands.add('closeDialog', (selector) => {
  cy.get(`[data-cy=${selector}]`).within(() => {
    cy.get('.btn-close').click();
  });
});

Cypress.Commands.add('login', (email = 'test@test.com', password = 'Password123!') => {
  indexedDB.deleteDatabase('firebaseLocalStorageDb');
  cy.visit('/');
  cy.get('[data-cy="get-started"]').click();
  cy.get('[data-cy="login-email"]').type(email);
  cy.get('[data-cy="login-password"]').type(password);
  cy.get('[data-cy="login"]').click();
  cy.closeDialog('view-patchnotes-dialog');
});

Cypress.Commands.add('addGroup', (uid = 'Cool group') => {
  cy.get('[data-cy="create-group"]').click();
  cy.get('[data-cy="new-group-name"]').type(uid);
  cy.contains('button', 'Create').click();
  cy.contains('div', uid).should('have.length', 1);
});

Cypress.Commands.add('removeGroup', (uid = 'Cool group', uid2 = 'Cool group #2') => {
  cy.visit('/');
  cy.get('[data-cy="navbar-toggle"]').click();
  cy.get('[data-cy="navbar-groups"]').click();
  cy.closeDialog('view-patchnotes-dialog');
  cy.get('[data-cy="edit-group"]').eq(0).click();
  cy.get('[data-cy="delete"]').click();
  cy.get('[data-cy="confirm-delete"]').click();
  cy.contains('button', uid).should('not.exist');
  cy.contains('button', uid2).should('not.exist');
});

Cypress.Commands.add('fillItemFields', () => {
  cy.get('[data-cy="item-name"]').type('New item');
  cy.get('[data-cy="item-qty"]').type(20);
  cy.get('[data-cy="charge"]').type(5);
  cy.get('[data-cy="charge-max"]').type(7);
  cy.get('.ql-editor').type('A grand item description! 1234567890');
  cy.get('[data-cy="item-tags"]').type('scroll, consumable');
});
