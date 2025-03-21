/// <reference types='cypress' />
import { v4 as uuidv4 } from 'uuid';
let uid = uuidv4().substring(0, 8);
let uid2 = uuidv4().substring(0, 8);

describe('Group actions', () => {
  before(() => {
    cy.login();
    cy.addGroup(uid);
  });

  after(() => {
    cy.removeGroup(uid, uid2);
  });

  it('edit group', () => {
    cy.get('[data-cy=edit-group]').eq(0).click();
    cy.get('[data-cy=edit-group-name]').clear().type(uid2);
    cy.get('[value=Save]').click();
    cy.contains('div', uid2).should('have.length', 1);
  });

  it('add and remove group member', () => {
    cy.get('[data-cy=edit-group]').eq(0).click();
    cy.get('[data-cy=enter-group-code]').type('Q2U0C8');
    cy.get('[data-cy=add-member]').click();
    cy.contains('div', 'Cool_Guy1').should('exist');
    cy.get('[data-cy=remove-member]').click();
    cy.contains('div', 'Cool_Guy1').should('not.exist');
  });
});
