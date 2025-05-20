export function fillCompendiumFields(fields) {
  if (fields.name) cy.get('[data-cy="new-discovery-name"]').clear().type(fields.name);
  if (fields.charges) cy.get('[data-cy="new-discovery-charges"]').clear().type(fields.charges);
  if (fields.rarity) cy.get('[data-cy="rarity-select"]').select(fields.rarity);
  if (fields.type) cy.get('[data-cy="type-select"]').select(fields.type);
  if (fields.acknowledgement) cy.get('[data-cy="discovery-acknowledgement"]').check({ force: true });
}

export function openNewCompendiumEntry() {
  cy.get('[data-cy="navbar-toggle"]').click();
  cy.get('[data-cy="navbar-compendium"]').click();
  cy.get('#compendium-tabs-tab-community').click();
  cy.get('[data-cy="open-add-discovery"]').click();
}

export function addEntry(uid) {
  cy.get('[data-cy="compendium-save"]').click();
  cy.contains('.toast-header', 'Item recorded');
  cy.contains('.toast-body', uid).should('exist');
}

export function updateEntry(fields) {
  if (fields.description) {
    cy.get('[data-cy="compendium-description"]').clear().type(fields.description);
  }
  // Add more fields as needed
  cy.get('[data-cy="compendium-save"]').click();
}

export function saveDraft(uid) {
  cy.get('[data-cy="compendium-save-draft"]').click();
  cy.contains(uid).should('exist');
}

export function deleteEntry(uid) {
  cy.contains(uid)
    .parents('[data-cy="compendium-entry"]')
    .within(() => {
      cy.get('[data-cy="delete-compendium-entry"]').click();
    });
  cy.get('[data-cy="confirm-delete"]').click();
}

export function tryAddIncompleteEntry() {
  cy.get('[data-cy="compendium-save"]').click();
}

export function copyToGroup(sourceTab, groupName) {
  // Assumes you are already on the correct tab
  cy.get(`[data-cy="copy-to-group-${sourceTab}"]`).click();
  cy.get('[data-cy="group-select"]').select(groupName);
  cy.get('[data-cy="confirm-copy"]').click();
}
