/// <reference types='cypress' />
import { v4 as uuidv4 } from 'uuid';
const loot = require('../../support/features/loot');
import {
  clearContainerFields,
  createContainer,
  deleteContainer,
  editContainer,
  openContainerFromList,
  openContainerModal,
} from '../../support/features/container';

describe('Container actions', () => {
  let uid;
  let containerName;

  beforeEach(() => {
    uid = uuidv4().substring(0, 8);
    containerName = `Test Container ${uid}`;
    
    cy.login();
    cy.addGroup(uid);
    cy.selectGroup(uid);
  });

  afterEach(() => {
    cy.removeGroup(uid);
  });

  it('add item to container', () => {
    openContainerModal();
    createContainer(containerName);
    loot.addItem();
    cy.get('.accordion-header').contains(containerName).should('not.exist');
    cy.contains('#loot-accordion', 'New item').eq(0).click();
    cy.get('[data-cy=edit-item]').click();
    cy.get('[data-cy=container-select]').select(containerName);
    cy.get('[data-cy=save-item]').click();
    cy.get('.accordion-header').contains(containerName).should('be.visible');
  });

  it('edit container', () => {
    const newContainerName = `Updated Container ${uid}`;
    
    openContainerModal();
    createContainer(containerName);
    
    openContainerModal();
    editContainer(containerName, newContainerName);
    cy.closeDialog('create-container-form');
  });

  it('clear container fields', () => {
    openContainerModal();
    createContainer(containerName);
    
    openContainerModal();
    openContainerFromList(containerName);
    clearContainerFields(containerName);
    cy.closeDialog('create-container-form');
  });

  it('delete container', () => {
    openContainerModal();
    createContainer(containerName);
    
    openContainerModal();
    openContainerFromList(containerName);
    deleteContainer();
  });
});
