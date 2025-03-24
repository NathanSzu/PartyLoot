/// <reference types='cypress' />
import { v4 as uuidv4 } from 'uuid';
import { addPartyMember } from '../../support/features/party';
import { addItem } from '../../support/features/loot';

describe('Party actions', () => {
  let groupId;
  let memberId;
  let updatedMemberId;

  beforeEach(() => {
    groupId = uuidv4().substring(0, 8);
    memberId = uuidv4().substring(0, 8);
    updatedMemberId = uuidv4().substring(0, 8);
    cy.login();
    cy.addGroup(groupId);
    cy.selectGroup(groupId);
  });

  afterEach(() => {
    cy.removeGroup(groupId);
  });

  it('update a party member', () => {
    // First add a member to update
    addPartyMember(memberId);

    // Then update the member
    cy.get('[data-cy=modal-party]').click();
    cy.get(`[data-cy=${memberId}]`).click();
    cy.get('[data-cy=edit-member-input]').clear();
    cy.get('[data-cy=edit-member-input]').type(updatedMemberId);
    cy.get('[data-cy=save-member-input]').click();
    cy.get(`[data-cy=${updatedMemberId}]`).should('exist');
  });

  it('favorite a party member', () => {
    addItem();
    addPartyMember(memberId);

    // Then favorite the member
    cy.get('[data-cy=modal-party]').click();
    cy.get(`[data-cy=${memberId}]`).click();
    cy.get('[data-cy=set-unfavorite]').should('not.exist');
    cy.get('[data-cy=set-favorite]').click();
    cy.get('#loot-accordion').should('not.be.visible');
    cy.contains('select', memberId);
    
    // Then unfavorite the member
    cy.get('[data-cy=modal-party]').click();
    cy.get(`[data-cy=${memberId}]`).click();
    cy.get('[data-cy=set-favorite]').should('not.exist');
    cy.get('[data-cy=set-unfavorite]').click();
    cy.get('#loot-accordion').should('be.visible');
    cy.contains('select', 'Party');
  });

  it('delete a party member', () => {
    // First add a member to delete
    addPartyMember(memberId);

    // Then delete the member
    cy.get('[data-cy=modal-party]').click();
    cy.get(`[data-cy=${memberId}]`).click();
    cy.get('[data-cy=delete-member]').click();
    cy.get('[data-cy=confirm-delete-member]').click();
    cy.get('[data-cy=modal-party]').click();
    cy.get('#partyAccordion').within(() => {
      cy.get('.accordion-item').should('not.exist');
    });
    cy.closeDialog('edit-party-dialog');
  });
});
