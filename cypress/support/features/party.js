/**
 * Adds a party member to the current group
 * @param {string} memberName - The name of the member to add
 * @returns {Cypress.Chainable} - The Cypress chain for chaining commands
 */
export const addPartyMember = (memberName) => {
  cy.get('[data-cy=modal-party]').click();
  cy.get('[data-cy=new-member-input]').type(memberName);
  cy.get('[data-cy=save-new-member]').click();
  cy.get(`[data-cy=${memberName}]`).should('exist');
  cy.closeDialog('edit-party-dialog');
}; 