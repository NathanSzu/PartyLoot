/// <reference types='cypress' />
import { v4 as uuidv4 } from 'uuid'
let uid = uuidv4();
let uid2 = uuidv4();

describe('Item actions', () => {
  before(() => {
    cy.login();
  });

  it('add test group', () => {
    cy.addGroup(uid);
    cy.get('[data-cy=group0]').click();
  });

  it('add an item', () => {
    cy.get('[data-cy=add-item]').click();
    cy.fillItemFields();
    cy.get('[data-cy=create-item]').click();
    cy.contains('#loot-accordion', 'New item');
  });

  it('edit item', () => {
    cy.contains('#loot-accordion', 'New item').eq(0).click();
    cy.get('[data-cy=edit-item]').click();
    cy.get('[data-cy=item-name]').type(' (edited)');
    cy.get('[data-cy=item-tags]').type(', valuable');
    cy.get('[data-cy=save-item]').click();
    cy.contains('#loot-accordion', 'New item (edited)');
  });

  it('sell one item', () => {
    cy.contains('#loot-accordion', 'New item (edited)').eq(0).click();
    cy.get('[data-cy=sell-item]').click();
    cy.get('[data-cy=sell-qty]').type(1);
    cy.get('[role=dialog]').within(() => {
      cy.get('[data-cy=currency1]').type(1);
      cy.get('[data-cy=currency2]').type(1);
      cy.get('[data-cy=currency3]').type(1);
      cy.get('[data-cy=currency4]').type(1);
      cy.get('[data-cy=currency5]').type(1);
      cy.get('[data-cy=currency6]').type(1);
    });
    cy.get('[data-cy=confirm-sell-item]').click();
    cy.contains('#gold-tracker-accordion', 'Party Gold').click();
    cy.get('[data-cy=currency1]').should('have.value', 1);
    cy.get('[data-cy=currency2]').should('have.value', 1);
    cy.get('[data-cy=currency3]').should('have.value', 1);
    cy.get('[data-cy=currency4]').should('have.value', 1);
    cy.get('[data-cy=currency5]').should('have.value', 1);
    cy.get('[data-cy=currency6]').should('have.value', 1);
    cy.contains('#loot-accordion', 'x19');
  });

  it('sell max qty item', () => {
    cy.contains('#loot-accordion', 'New item (edited)').eq(0).click();
    cy.get('[data-cy=sell-item]').click();
    cy.get('[data-cy=sell-max-qty]').click();
    cy.get('[role=dialog]').within(() => {
      cy.get('[data-cy=currency1]').type(1);
      cy.get('[data-cy=currency2]').type(1);
      cy.get('[data-cy=currency3]').type(1);
      cy.get('[data-cy=currency4]').type(1);
      cy.get('[data-cy=currency5]').type(1);
      cy.get('[data-cy=currency6]').type(1);
    });
    cy.get('[data-cy=confirm-sell-item]').click();
    cy.contains('#gold-tracker-accordion', 'Party Gold').click();
    cy.get('[value=20]').should('have.length', 6);
    cy.contains('#loot-accordion', 'New item').should('not.exist');
  });

  it('delete item', () => {
  cy.get('[data-cy=add-item]').click();
  cy.fillItemFields();
  cy.get('[data-cy=create-item]').click();
    cy.contains('#loot-accordion', 'New item').eq(0).click();
    cy.get('[data-cy=delete-item]').click();
    cy.get('[data-cy=confirm-item-delete]').click();
    cy.contains('#loot-accordion', 'New item').should('not.exist');
  });

  it('reset gold totals', () => {
    cy.contains('#gold-tracker-accordion', 'Party Gold').click();
    cy.get('.accordion').within(() => {
      cy.get('[data-cy=currency1]').clear();
      cy.get('[data-cy=currency2]').clear();
      cy.get('[data-cy=currency3]').clear();
      cy.get('[data-cy=currency4]').clear();
      cy.get('[data-cy=currency5]').clear();
      cy.get('[data-cy=currency6]').clear();
    });
  });

  it('check history', () => {
    cy.get('[data-cy=button-history]').click();
    cy.url().should('include', '/history');
    cy.get('.list-group-item').should('have.length', 4)
    cy.get('[data-cy=button-loot]').click();
    cy.url().should('include', '/loot');
  })

  it('remove test group', () => {
    cy.removeGroup(uid, uid2);
  });
});
