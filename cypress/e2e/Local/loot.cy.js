/// <reference types='cypress' />
import { v4 as uuidv4 } from 'uuid';
const loot = require('../../support/features/loot');
let uid = uuidv4().substring(0, 8);
let uid2 = uuidv4().substring(0, 8);
let ownerUid = uuidv4().substring(0, 8);

let currencyKeys = ['currency1', 'currency2', 'currency3', 'currency4', 'currency5', 'currency6'];

describe('Item actions', () => {
  beforeEach(() => {
    cy.login();
    cy.addGroup(uid);
    cy.selectGroup(uid);
  });

  afterEach(() => {
    cy.removeGroup(uid, uid2);
    cy.contains(uid).should('not.exist');
  });

  it('edit item', () => {
    loot.addItem();
    cy.contains('#loot-accordion', 'New item').eq(0).click();
    cy.get('[data-cy=edit-item]').click();
    cy.get('[data-cy=item-name]').type(' (edited)');
    cy.get('[data-cy=item-tags]').type(', valuable');
    cy.get('[data-cy=save-item]').click();
    cy.contains('#loot-accordion', 'New item (edited)');
  });

  it('sell one item', () => {
    loot.addItem(20);
    loot.fillSellFields(1);
    cy.get('[data-cy=confirm-sell-item]').click();
    cy.contains('#gold-tracker-accordion', 'Party Gold').click();
    loot.checkCurrencyValues(1);
    cy.contains('#loot-accordion', 'x19');
  });

  it('sell an item with no qty', () => {
    loot.addItem();
    loot.fillSellFields();
    cy.get('[data-cy=confirm-sell-item]').click();
    cy.contains('#gold-tracker-accordion', 'Party Gold').click();
    loot.checkCurrencyValues(1);
    cy.get('#loot-accordion').children().should('not.exist');
  });

  it('sell one item to a different party member', () => {
    loot.addItem(19);
    cy.get('[data-cy=modal-party]').click();
    cy.get('[data-cy=new-member-input]').type(ownerUid);
    cy.get('[data-cy=save-new-member]').click();
    cy.closeDialog('edit-party-dialog');
    loot.fillSellFields();
    loot.selectItemOwner(ownerUid);
    cy.get('[data-cy=confirm-sell-item]').click();
    cy.contains('#gold-tracker-accordion', 'Party Gold').click();
    loot.checkCurrencyValues(0);
    cy.get('[data-cy=owner-select]').select(ownerUid);
    loot.checkCurrencyValues(1);
    cy.get('[data-cy=owner-select]').select('party');
    cy.contains('#loot-accordion', 'x18');
  });

  it('sell max qty item', () => {
    loot.addItem(19);
    cy.contains('#loot-accordion', 'New item').eq(0).click();
    cy.get('[data-cy=sell-item]').click();
    cy.get('[data-cy=sell-max-qty]').click();
    cy.get('[role=dialog]').within(() => {
      currencyKeys.forEach((key) => {
        cy.get(`[data-cy=${key}]`).type(1);
      });
    });
    cy.get('[data-cy=confirm-sell-item]').click();
    cy.contains('#gold-tracker-accordion', 'Party Gold').click();
    loot.checkCurrencyValues(19);
    cy.contains('#loot-accordion', 'New item').should('not.exist');
  });

  it('delete item', () => {
    loot.addItem();
    cy.contains('#loot-accordion', 'New item').eq(0).click();
    cy.get('[data-cy=delete-item]').click();
    cy.get('[data-cy=confirm-item-delete]').click();
    cy.contains('#loot-accordion', 'New item').should('not.exist');
  });

  it('manually set gold totals', () => {
    cy.contains('#gold-tracker-accordion', 'Party Gold').click();
    cy.get('[data-cy="edit-currency"]').click();
    cy.get('[role=dialog]').within(() => {
      currencyKeys.forEach((key) => {
        cy.get(`[data-cy=${key}]`).clear().type(12345);
      });
    });
    cy.get('[data-cy="save-currency"]').click();
    cy.get('[data-cy="save-currency"]').should('not.exist');
    loot.checkCurrencyValues(12345);
  });
});
