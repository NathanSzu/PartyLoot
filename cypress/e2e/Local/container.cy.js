/// <reference types='cypress' />
import { v4 as uuidv4 } from 'uuid';
import {
  clearContainerFields,
  createContainer,
  deleteContainer,
  editContainer,
  openContainerFromList,
  openContainerModal,
} from '../../support/features/container';

let uid = uuidv4();
let uid2 = uuidv4();

let currencyKeys = ['currency1', 'currency2', 'currency3', 'currency4', 'currency5', 'currency6'];

describe('Container actions', () => {
  before(() => {
    cy.login();
    cy.addGroup(uid);
    cy.selectGroup(uid);
  });

  after(() => {
    cy.removeGroup(uid, uid2);
  });

  it('create a container', () => {
    openContainerModal();
    createContainer();
    cy.closeDialog('create-container-form');

  });

  it('edit container', () => {
    openContainerModal();
    editContainer();
    cy.closeDialog('create-container-form');
  });

  it('clear container fields', () => {
    openContainerModal();
    openContainerFromList('A much better name');
    clearContainerFields();
    cy.closeDialog('create-container-form');
  });

  it('delete container', () => {
    openContainerModal();
    openContainerFromList('A much better name');
    deleteContainer();
  });
});
