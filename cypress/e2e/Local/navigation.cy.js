/// <reference types='cypress' />
import { v4 as uuidv4 } from 'uuid';
let uid = uuidv4().substring(0, 8);
let uid2 = uuidv4().substring(0, 8);

const pages = ['/groups', '/user-settings', '/loot', '/compendium'];

describe('routing protection', () => {
  before(() => {
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
    cy.visit('/');
  });

  pages.forEach(page => {
    it(`re-route from ${page} to /root if user is not logged in`, () => {
      cy.visit(page);
      cy.url().should('eq', 'http://localhost:3000/');
    });
  });

  it('login option exists', () => {
    cy.get('[data-cy=navbar-toggle]').click();
    cy.get('[data-cy=navbar-login]');
    cy.get('#basic-navbar-nav').within(() => {
      cy.get('a').should('have.length', 1);
    });
  });
});

describe('check navigation', () => {
  before(() => {
    cy.login();
    cy.addGroup(uid);
  });

  after(() => {
    cy.removeGroup(uid, uid2);
  });

  it('check navbar options', () => {
    cy.get('[data-cy=navbar-toggle]').click();
    cy.contains('.nav-link', 'Groups');
    cy.contains('.nav-link', 'Compendium');
    cy.contains('.nav-link', 'Settings');
    cy.contains('.nav-link', 'Logout');
  });

  it('view loot', () => {
    cy.selectGroup(uid);
    cy.url().should('include', '/loot');
  });

  it('view settings', () => {
    cy.get('[data-cy=navbar-toggle]').click();
    cy.get('[data-cy=navbar-settings]').click();
    cy.url().should('include', '/settings');
  });

  it('view groups', () => {
    cy.get('[data-cy=navbar-toggle]').click();
    cy.get('[data-cy=navbar-groups]').click();
    cy.url().should('include', '/groups');
    cy.closeDialog('view-patchnotes-dialog');
  });

  it('view compendium', () => {
    cy.get('[data-cy=navbar-toggle]').click();
    cy.get('[data-cy=navbar-compendium]').click();
    cy.url().should('include', '/compendium');
  });
});
