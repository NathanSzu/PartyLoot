/// <reference types='cypress' />
import { v4 as uuidv4 } from 'uuid';
let uid = uuidv4().substring(0, 8);

describe('Settings', () => {
  before(() => {
    cy.login();
    cy.get('[data-cy=navbar-toggle]').click();
    cy.get('[data-cy="navbar-settings"]').click();
  });

  it('change username', () => {
    cy.get('[data-cy="change-username"]').click();
    cy.get('[data-cy="username-input"]').clear().type(uid);
    cy.get('[data-cy="save-username"]').click();
    cy.contains('div', uid);
  });
});
