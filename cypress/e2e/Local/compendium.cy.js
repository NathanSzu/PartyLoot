/// <reference types='cypress' />
import { v4 as uuidv4 } from 'uuid';
import {
  addEntry,
  fillCompendiumFields,
  openCompendiumEntry,
  filterAndFindEntry,
  clearFields,
  deleteCompendiumEntry,
} from '../../support/features/compendium';

describe('Compendium CRUD', () => {
  let uid = uuidv4().substring(0, 8);
  let allFields = {
    name: uid,
    type: 'Weapon',
    charges: 10,
    rarity: 'common',
    acknowledgement: true,
  };
  let updateFields = {
    type: 'Potion',
    charges: 5,
    rarity: 'rare',
  };

  beforeEach(() => {
    cy.login();
    openCompendiumEntry();
    fillCompendiumFields(allFields);
    addEntry(uid);
  });

  afterEach(() => {
    deleteCompendiumEntry(uid);
  });

  it('add compendium entry with all fields', () => {
    cy.get('#compendium-tabs-tabpane-community').within(() => {
      cy.get('[data-cy="search-filter-button"]').click();
      cy.get('[data-cy="compendium-search"]').clear().type(uid);
      cy.contains('.list-group-item', uid, { timeout: 50000 }).should('be.visible');
    });
  });

  it('update a compendium entry', () => {
    cy.get(`[data-cy="open-edit-discovery-${uid}"]`).click();
    cy.get('.modal.show').within(() => {
      fillCompendiumFields(updateFields);
      cy.get('[data-cy="compendium-save"]').click();
    });
    cy.checkToastAndDismiss('Item changes saved', uid);
    filterAndFindEntry(uid);
  });

  it('save a compendium entry as a draft', () => {
    openCompendiumEntry(uid);
    cy.get('.modal.show').within(() => {
      fillCompendiumFields(updateFields);
      cy.get(`[data-cy="compendium-save-draft-${uid}"]`).click();
    });
    cy.checkToastAndDismiss('Item changes saved', uid);
    filterAndFindEntry(uid, true);
  });

  it('try to add an incomplete compendium entry', () => {
    const invalidMessages = [
      'Item name is required!',
      'Select an item type!',
      'Select an item rarity!',
      'Please review the acknowledgement!',
    ];
    openCompendiumEntry(uid);
    cy.get('.modal.show').within(() => {
      clearFields(allFields);
      cy.get('[data-cy="compendium-save"]').click();
      invalidMessages.forEach((msg) => {
        cy.contains('.invalid-feedback', msg).should('be.visible');
      });
      cy.get('.btn-close').click();
    });
  });
});

describe('Compendium Copy to Group', () => {
  let itemId = uuidv4().substring(0, 8);
  let groupId = uuidv4().substring(0, 8);

  let allFields = {
    name: itemId,
    type: 'Weapon',
    charges: 10,
    rarity: 'common',
    acknowledgement: true,
  };

  beforeEach(() => {
    cy.login();
    cy.addGroup(groupId);
  });

  afterEach(() => {
    cy.removeGroup(groupId);
    cy.wait(1000); // Wait for group removal to complete
  });

  it('copy open source content to a group', () => {
    cy.get('[data-cy="navbar-toggle"]').click();
    cy.get('[data-cy="navbar-compendium"]').click();
    cy.get('[data-cy="compendium-details-Aberrant Agreement"]', { timeout: 50000 }).click();
    cy.get('#groupSelect').select(groupId);
    cy.get('[data-cy="save-to-group"]').click();
    cy.checkToastAndDismiss('Item copied to group', 'Aberrant Agreement');
  });

  it('copy community homebrew to a group', () => {
    openCompendiumEntry();
    cy.get('.modal.show').within(() => {
      fillCompendiumFields(allFields);
    });
    addEntry(itemId);
    cy.get('#compendium-tabs-tabpane-community').within(() => {
      cy.get('[data-cy="search-filter-button"]').click();
      cy.get('[data-cy="compendium-search"]').clear().type(itemId);
    });
    cy.get(`[data-cy="compendium-details-${itemId}"]`, { timeout: 50000 }).click();
    cy.get('#groupSelect').select(groupId);
    cy.get('[data-cy="save-to-group"]').click();
    cy.checkToastAndDismiss('Item copied to group', itemId);
    deleteCompendiumEntry(itemId);
  });
});
