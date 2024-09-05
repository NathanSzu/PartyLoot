/// <reference types='cypress' />
import { v4 as uuidv4 } from 'uuid';
import { addEntry, saveDraft, fillCompendiumFields, openNewCompendiumEntry, deleteEntry } from '../../support/features/compendium';
let uid = uuidv4().substring(0, 8);
let uid2 = uuidv4().substring(0, 8);
let caseAllFields = {
  uid,
  charges: 10,
  setting: 'adyjf2348713ba',
  description: 'Example description',
  categories: [1],
  acknowledgement: true,
};

describe('Compendium CRUD', () => {
  before(() => {
    cy.login();
  });

  it('navigate to compendium', () => {
    cy.get('[data-cy="navbar-toggle"]').click();
    cy.get('[data-cy="navbar-compendium"]').click();
    cy.get('[data-cy="filters-tab-toggle"]').click();
  });

  it('add compendium entry', () => {
    openNewCompendiumEntry();
    fillCompendiumFields(caseAllFields);
    addEntry(uid);
  });

  it('save compendium draft', () => {
    caseAllFields.uid = uid2;
    openNewCompendiumEntry();
    fillCompendiumFields(caseAllFields);
    saveDraft(uid2);
  });

  it('delete compendium entries', () => {
    cy.get('[data-cy="my-discoveries"]').click();
    deleteEntry(uid);
    deleteEntry(uid2);
  });
});
