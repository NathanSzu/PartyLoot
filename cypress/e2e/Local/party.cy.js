/// <reference types='cypress' />
import { v4 as uuidv4 } from 'uuid';
let uid = uuidv4();
let uid2 = uuidv4();

describe('Party actions', () => {
  before(() => {
    cy.login();
    cy.addGroup(uid);
    cy.get('[data-cy=group0]').click();
  });

  after(() => {
    cy.removeGroup(uid, uid2);
  });

  it('add a party member', () => {
    cy.get('[data-cy=modal-party]').click();
    cy.get('[data-cy=new-member-input]').type(uid);
    cy.get('[data-cy=save-new-member]').click();
  });

  it('update a party member', () => {
    cy.get(`[data-cy=${uid}]`).click();
    cy.get('[data-cy=edit-member-input]').clear();
    cy.get('[data-cy=edit-member-input]').type(uid2);
    cy.get('[data-cy=save-member-input]').click();
  });

  it('favorite a party member', () => {
    cy.get('[data-cy=modal-party]').click();
    cy.get(`[data-cy=${uid2}]`).click();
    cy.get('[data-cy=set-unfavorite]').should('not.exist');
    cy.get('[data-cy=set-favorite]').click();
    cy.contains('select', uid2);
    cy.get('[data-cy=modal-party]').click();
    cy.get(`[data-cy=${uid2}]`).click();
    cy.get('[data-cy=set-favorite]').should('not.exist');
    cy.get('[data-cy=set-unfavorite]').click();
    cy.contains('select', 'Party');
  });

  it('delete a party member', () => {
    cy.get('[data-cy=modal-party]').click();
    cy.get(`[data-cy=${uid2}]`).click();
    cy.get('[data-cy=delete-member]').click();
    cy.get('[data-cy=confirm-delete-member]').click();
    cy.get('[data-cy=modal-party]').click();
    cy.get('#partyAccordion').within(() => {
      cy.get('.accordion-item').should('not.exist');
    });
    cy.closeDialog('edit-party-dialog');
  });
});
