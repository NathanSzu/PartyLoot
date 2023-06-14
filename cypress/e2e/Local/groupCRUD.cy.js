/// <reference types='cypress' />
import { v4 as uuidv4 } from 'uuid'
let uid = uuidv4();
let uid2 = uuidv4();

describe('Group actions', () => {
  before(() => {
    cy.login();
  });

  it('add test group', () => {
    cy.addGroup(uid);
  });

  it('edit group', () => {
    cy.get('[data-cy=edit-group]').eq(0).click();
    cy.get('[data-cy=edit-group-name]').clear().type(`${uid2}{enter}`);
    cy.contains('button', uid2).should('have.length', 1);
  });

  it('add and remove group member', () => {
    cy.get('[data-cy=edit-group]').eq(0).click();
    cy.get('[data-cy=enter-group-code]').type('Q2U0C8');
    cy.get('[data-cy=add-member]').click();
    cy.contains('div', 'Cool_Guy1').should('exist');
    cy.get('[data-cy=remove-member]').click();
    cy.contains('div', 'Cool_Guy1').should('not.exist');
  });

  it('remove test group', () => {
    cy.removeGroup(uid, uid2);
  });
});
