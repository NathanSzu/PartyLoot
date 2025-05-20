/// <reference types='cypress' />
import { v4 as uuidv4 } from 'uuid';
import {
  addEntry,
  updateEntry,
  saveDraft,
  fillCompendiumFields,
  openNewCompendiumEntry,
  deleteEntry,
  tryAddIncompleteEntry,
  copyToGroup,
} from '../../support/features/compendium';

describe('Compendium CRUD & Group Copy', () => {
  let uid = uuidv4().substring(0, 8);
  let uid2 = uuidv4().substring(0, 8);
  let allFields = {
    name: uid,
    type: 'Weapon',
    charges: 10,
    rarity: 'common',
    acknowledgement: true,
  };

  before(() => {
    cy.login();
  });

  beforeEach(() => {
    openNewCompendiumEntry();
    fillCompendiumFields(allFields);
    addEntry(uid);
  });

  afterEach(() => {
    cy.get(`[data-cy="open-edit-discovery-${uid}"]`).click();
    cy.get(`[data-cy="compendium-delete-${uid}"]`).click();
    cy.get(`[data-cy="compendium-delete-confirmation-${uid}"]`).click();
  });

  it.only('add compendium entry with all fields', () => {
    cy.get('[data-cy="search-filter-button"]').eq(1).click();
  });

  it('update a compendium entry', () => {
    cy.get(`[data-cy="open-edit-discovery-${uid}"]`).click();
    updateEntry({ type: 'Potion' });
    cy.contains('Updated description').should('exist');
  });

  it('save a compendium entry as a draft', () => {
    allFields.uid = uid2;
    openNewCompendiumEntry();
    fillCompendiumFields(allFields);
    saveDraft(uid2);
    cy.contains(uid2).should('exist');
    cy.contains('Draft').should('exist');
  });

  it('delete a compendium entry', () => {
    cy.get('[data-cy="my-discoveries"]').click();
    deleteEntry(uid);
    deleteEntry(uid2);
    cy.contains(uid).should('not.exist');
    cy.contains(uid2).should('not.exist');
  });

  it('try to add an incomplete compendium entry', () => {
    openNewCompendiumEntry();
    tryAddIncompleteEntry();
    cy.get('[data-cy="form-error"]').should('exist');
  });

  it('copy open source content to a group', () => {
    cy.visit('/compendium');
    cy.get('[data-cy="open-source-tab"]').click();
    copyToGroup('open-source', 'Test Group');
    cy.get('[data-cy="group-content"]').should('contain', 'Copied');
  });

  it('copy community homebrew to a group', () => {
    cy.visit('/compendium');
    cy.get('[data-cy="community-homebrew-tab"]').click();
    copyToGroup('community-homebrew', 'Test Group');
    cy.get('[data-cy="group-content"]').should('contain', 'Copied');
  });
});
