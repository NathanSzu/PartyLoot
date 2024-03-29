/// <reference types='cypress' />
import { v4 as uuidv4 } from 'uuid';
let uid = uuidv4();
let uid2 = uuidv4();

let currencyKeys = ['currency1', 'currency2', 'currency3', 'currency4', 'currency5', 'currency6'];

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
      currencyKeys.forEach((key) => {
        cy.get(`[data-cy=${key}]`).type(1);
      });
    });
    cy.get('[data-cy=confirm-sell-item]').click();
    cy.contains('#gold-tracker-accordion', 'Party Gold').click();
    currencyKeys.forEach((key) => {
      cy.get(`[data-cy=${key}]`).within(() => {
        cy.contains('div', '1');
      });
    });
    cy.contains('#loot-accordion', 'x19');
  });

  it('sell max qty item', () => {
    cy.contains('#loot-accordion', 'New item (edited)').eq(0).click();
    cy.get('[data-cy=sell-item]').click();
    cy.get('[data-cy=sell-max-qty]').click();
    cy.get('[role=dialog]').within(() => {
      currencyKeys.forEach((key) => {
        cy.get(`[data-cy=${key}]`).type(1);
      });
    });
    cy.get('[data-cy=confirm-sell-item]').click();
    cy.contains('#gold-tracker-accordion', 'Party Gold').click();
    currencyKeys.forEach((key) => {
      cy.get(`[data-cy=${key}]`).within(() => {
        cy.contains('div', '20');
      });
    });
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
    cy.get('[data-cy="edit-currency"]').click();
    cy.get('[role=dialog]').within(() => {
      currencyKeys.forEach((key) => {
        cy.get(`[data-cy=${key}]`).clear();
      });
    });
    cy.get('[data-cy="save-currency"]').click();
    currencyKeys.forEach((key) => {
      cy.get(`[data-cy=${key}]`).within(() => {
        cy.contains('div', '20').should('not.exist');
        cy.contains('div', '0');
      });
    });
  });

  it('check history', () => {
    cy.get('[data-cy=button-history]').click();
    cy.url().should('include', '/history');
    cy.get('.list-group-item').should('have.length', 5);
    cy.get('[data-cy=button-loot]').click();
    cy.url().should('include', '/loot');
  });

  it('remove test group', () => {
    cy.removeGroup(uid, uid2);
  });
});
