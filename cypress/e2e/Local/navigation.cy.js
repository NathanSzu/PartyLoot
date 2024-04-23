/// <reference types='cypress' />
import { v4 as uuidv4 } from 'uuid';
let uid = uuidv4();
let uid2 = uuidv4();

describe('routing protection', () => {
  before(() => {
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
    cy.visit('/');
  });

  it('re-route from /groups to /root if user is not logged in', () => {
    cy.visit('/groups');
    cy.url().should('eq', 'http://localhost:3000/');
  });
  it('re-route from /user-settings to /root if user is not logged in', () => {
    cy.visit('/user-settings');
    cy.url().should('eq', 'http://localhost:3000/');
  });
  it('re-route from /loot to /root if user is not logged in', () => {
    cy.visit('/loot');
    cy.url().should('eq', 'http://localhost:3000/');
  });
  it('re-route from /compendium to /root if user is not logged in', () => {
    cy.visit('/compendium');
    cy.url().should('eq', 'http://localhost:3000/');
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
  });

  it('check navbar options', () => {
    cy.get('[data-cy=navbar-toggle]').click();
    cy.contains('.nav-link', 'Groups');
    cy.contains('.nav-link', 'Compendium');
    cy.contains('.nav-link', 'Settings');
    cy.contains('.nav-link', 'Logout');
  });

  it('add test group', () => {
    cy.addGroup(uid);
  });

  it('view loot', () => {
    cy.get('[data-cy=group0]').click();
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

  it('remove test group', () => {
    cy.removeGroup(uid, uid2);
  });
});
