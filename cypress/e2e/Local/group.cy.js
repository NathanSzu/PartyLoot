/// <reference types='cypress' />
import { v4 as uuidv4 } from 'uuid';
let uid = uuidv4().substring(0, 8);
let uid2 = uuidv4().substring(0, 8);

describe('Group actions', () => {
  beforeEach(() => {
    cy.login();
    cy.addGroup(uid);
  });

  afterEach(() => {
    cy.removeGroup(uid, uid2);
  });

  it('edit group', () => {
    cy.get('[data-cy=edit-group]').eq(0).click();
    cy.get('[data-cy=edit-group-name]').clear().type(uid2);
    cy.get('[data-cy=save-group]').click();
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

  it('assign and remove GM role', () => {
    cy.get('[data-cy=edit-group]').eq(0).click();
    cy.get('[data-cy=assign-gm]').click();
    cy.get('[data-cy="gm-badge"]');
    cy.get('[data-cy=assign-gm]').click();
    cy.get('[data-cy="gm-badge"]').should('not.exist');
  });
});
