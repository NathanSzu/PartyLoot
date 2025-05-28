export function fillCompendiumFields(fields) {
  if (fields.name) cy.get('[data-cy="new-discovery-name"]').clear().type(fields.name);
  if (fields.charges) cy.get('[data-cy="new-discovery-charges"]').clear().type(fields.charges);
  if (fields.rarity) cy.get('[data-cy="rarity-select"]').select(fields.rarity);
  if (fields.type) cy.get('[data-cy="type-select"]').select(fields.type);
  if (fields.acknowledgement) cy.get('[data-cy="discovery-acknowledgement"]').check({ force: true });
}

export function openCompendiumEntry(uid, tab = '#compendium-tabs-tab-community') {
  cy.get('[data-cy="navbar-toggle"]').click();
  cy.get('[data-cy="navbar-compendium"]').click();
  cy.get(tab).click();
  cy.get(`[data-cy=${uid ? 'open-edit-discovery-' + uid : 'open-add-discovery'}]`).click();
}

export function addEntry(uid) {
  cy.get('.modal.show').within(() => {
    cy.get('[data-cy="compendium-save"]').click();
  });
  cy.contains('.toast-header', 'Item recorded');
  cy.contains('.toast-body', uid).should('be.visible');
  cy.get('[data-dismiss="toast"]').click();
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

export function clearFields(fields) {
  if (fields.name) cy.get('[data-cy="new-discovery-name"]').clear();
  if (fields.charges) cy.get('[data-cy="new-discovery-charges"]').clear();
  if (fields.rarity) cy.get('[data-cy="rarity-select"]').select([]);
  if (fields.type) cy.get('[data-cy="type-select"]').select([]);
  if (fields.acknowledgement) cy.get('[data-cy="discovery-acknowledgement"]').uncheck({ force: true });
}

export function copyToGroup(sourceTab, groupName) {
  // Assumes you are already on the correct tab
  cy.get(`[data-cy="copy-to-group-${sourceTab}"]`).click();
  cy.get('[data-cy="group-select"]').select(groupName);
  cy.get('[data-cy="confirm-copy"]').click();
}

export function filterAndFindEntry(uid, showMyEntries = false) {
  cy.get('#compendium-tabs-tabpane-community').within(() => {
    cy.get('[data-cy="search-filter-button"]').click();
    if (showMyEntries) {
      cy.get('[data-cy="show-my-entries"]').click();
    }
    cy.get('[data-cy="compendium-search"]').clear().type(uid);
    cy.contains('.list-group-item', uid, { timeout: 20000 }).should('be.visible');
  });
}

export function deleteCompendiumEntry(itemId) {
  cy.get(`[data-cy="open-edit-discovery-${itemId}"]`).click();
  cy.get(`[data-cy="compendium-delete-${itemId}"]`).click();
  cy.get(`[data-cy="compendium-delete-confirmation-${itemId}"]`).click();
  cy.contains('.toast-header', 'Item deleted').should('be.visible');
  cy.contains('.toast-body', itemId).should('be.visible');
  cy.get('[data-dismiss="toast"]').click();
}
