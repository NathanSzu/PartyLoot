/// <reference types='cypress' />
import { v4 as uuidv4 } from 'uuid'
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
});

describe('check login views', () => {
  before(() => {
    indexedDB.deleteDatabase('firebaseLocalStorageDb');
    cy.visit('/');
  });

  it('welcome message displayed', () => {
    cy.get('[data-cy=welcome-message]');
    cy.get('[data-cy=navbar-toggle]').should('not.exist');
  });

  it('login and signup options exist', () => {
    cy.get('[data-cy=get-started]').click();
    cy.get('[data-cy=login-check-password]').should('not.exist');
    cy.get('[data-cy=forgot-password]').should('exist');
    cy.get('[data-cy=sign-up-here]').click();
    cy.get('[data-cy=login-check-password]').should('exist');
    cy.get('[data-cy=sign-up-here]').click();
  });
});

describe('check navigation', () => {
  before(() => {
    cy.login();
  });

  it('re-route from /root to /groups if user is logged in', () => {
    cy.visit('/');
    cy.url().should('include', '/groups');
    cy.get('.btn-close').click();
  });

  it('check navbar options', () => {
    cy.get('[data-cy=navbar-toggle]').click();
    cy.get('.nav-link').should('have.length', 2);
    cy.contains('.nav-link', 'Groups').should('not.exist');
  });

  it('add test group', () => {
    cy.addGroup(uid);
  });

  it('view loot', () => {
    cy.get('[data-cy=group0]').click();
    cy.url().should('include', 'http://localhost:3000/loot');
    cy.get('[data-cy=navbar-toggle]').click();
    cy.get('.nav-link').should('have.length', 3);
    cy.get('[data-cy=navbar-toggle]').click();
  });

  it('view settings', () => {
    cy.get('[data-cy=navbar-toggle]').click();
    cy.get('[data-cy=navbar-settings]').click();
    cy.url().should('include', 'http://localhost:3000/user-settings');
    cy.get('[data-cy=navbar-toggle]').click();
    cy.contains('.nav-link', 'Settings').should('not.exist');
    cy.get('.nav-link').should('have.length', 2);
    cy.get('[data-cy=navbar-toggle]').click();
  });

  it('view groups', () => {
    cy.get('[data-cy=navbar-toggle]').click();
    cy.get('[data-cy=navbar-groups]').click();
    cy.url().should('include', 'http://localhost:3000/groups');
    cy.get('[data-cy=navbar-toggle]').click();
  });

  it('remove test group', () => {
    cy.removeGroup(uid, uid2);
  });
});
