/// <reference types='cypress' />

import { getByAltText } from '@testing-library/react';

describe('Item actions', () => {
  before(() => {
    cy.login();
  });

  it('add test group', () => {
    cy.addGroup();
  });

  it('add an item', () => {
    cy.get('[data-cy=group0]').click();
    cy.get('[data-cy=add-item]').click();
    cy.fillItemFields();
    cy.get('[data-cy=create-item]').click();
    cy.contains('.card-header', 'New item');
  });

  it('edit item', () => {
    cy.contains('.card-header', 'New item').eq(0).click();
    cy.get('[data-cy=edit-item]').click();
    cy.get('[data-cy=item-name]').type(' (edited)');
    cy.get('[data-cy=item-tags]').type(', valuable');
    cy.get('[data-cy=save-item]').click();
    cy.contains('.card-header', 'New item (edited)');
  });

  it('sell one item', () => {
    cy.contains('.card-header', 'New item (edited)').eq(0).click();
    cy.get('[data-cy=sell-item]').click();
    cy.get('[data-cy=sell-qty]').type(1);
    cy.get('[role=dialog]').within(() => {
      cy.get('[data-cy=currency1]').type(1);
      cy.get('[data-cy=currency2]').type(1);
      cy.get('[data-cy=currency3]').type(1);
      cy.get('[data-cy=currency4]').type(1);
      cy.get('[data-cy=currency5]').type(1);
      cy.get('[data-cy=currency6]').type(1);
    });
    cy.get('[data-cy=confirm-sell-item]').click();
    cy.contains('.card-header', 'Party Gold').click();
    cy.get('[data-cy=currency1]').should('have.value', 1);
    cy.get('[data-cy=currency2]').should('have.value', 1);
    cy.get('[data-cy=currency3]').should('have.value', 1);
    cy.get('[data-cy=currency4]').should('have.value', 1);
    cy.get('[data-cy=currency5]').should('have.value', 1);
    cy.get('[data-cy=currency6]').should('have.value', 1);
    cy.contains('.card-header', 'x19');
  });

  it('sell max qty item', () => {
    cy.contains('.card-header', 'New item (edited)').eq(0).click();
    cy.get('[data-cy=sell-item]').click();
    cy.get('[data-cy=sell-max-qty]').click();
    cy.get('[role=dialog]').within(() => {
      cy.get('[data-cy=currency1]').type(1);
      cy.get('[data-cy=currency2]').type(1);
      cy.get('[data-cy=currency3]').type(1);
      cy.get('[data-cy=currency4]').type(1);
      cy.get('[data-cy=currency5]').type(1);
      cy.get('[data-cy=currency6]').type(1);
    });
    cy.get('[data-cy=confirm-sell-item]').click();
    cy.contains('.card-header', 'Party Gold').click();
    cy.get('[value=20]').should('have.length', 6);
    cy.contains('.card-header', 'New item').should('not.exist');
  });

  it('delete item', () => {
  cy.get('[data-cy=add-item]').click();
  cy.fillItemFields();
  cy.get('[data-cy=create-item]').click();
    cy.contains('.card-header', 'New item').eq(0).click();
    cy.get('[data-cy=delete-item]').click();
    cy.get('[data-cy=confirm-item-delete]').click();
    cy.contains('.card-header', 'New item').should('not.exist');
  });

  it('reset gold totals', () => {
    cy.contains('.card-header', 'Party Gold').click();
    cy.get('.accordion').within(() => {
      cy.get('[data-cy=currency1]').clear();
      cy.get('[data-cy=currency2]').clear();
      cy.get('[data-cy=currency3]').clear();
      cy.get('[data-cy=currency4]').clear();
      cy.get('[data-cy=currency5]').clear();
      cy.get('[data-cy=currency6]').clear();
    });
  });

  it('remove test group', () => {
    cy.removeGroup();
  });
});
