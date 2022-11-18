/// <reference types='cypress' />

describe('Group actions', () => {
  before(() => {
    cy.login();
  });

  it('add test group', () => {
    cy.addGroup();
  });

  it('edit group', () => {
    cy.get('[data-cy=edit-group]').eq(0).click();
    cy.get('[data-cy=edit-group-name]').clear().type('Better group name{enter}');
    cy.contains('button', 'Better group name').should('have.length', 1);
  });

  it('add and remove group member', () => {
    cy.get('[data-cy=edit-group]').eq(0).click();
    cy.get('[data-cy=enter-group-code]').type('Q2U0C8');
    cy.get('[data-cy=add-member]').click();
    cy.contains('div', 'Excited Bard').should('exist');
    cy.get('[data-cy=remove-member]').click();
    cy.contains('div', 'Excited Bard').should('not.exist');
  });

  it('remove test group', () => {
    cy.removeGroup();
  });
});