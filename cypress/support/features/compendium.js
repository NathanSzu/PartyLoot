const fillCompendiumFields = (data) => {
  data?.uid && cy.get('[data-cy="new-discovery-name"]').type(data.uid);
  data?.charges && cy.get('[data-cy="new-discovery-charges"]').type(data.charges);
  data?.setting && cy.get('[data-cy="discovery-setting"]').select(data.setting);
  data?.description && cy.get('.ql-editor').type(data.description);
  data?.categories &&
    data.categories.forEach((category) => {
      cy.get(`[data-cy="discovery-category${category}"]`).click();
    });
  data?.acknowledgement && cy.get('[data-cy="discovery-acknowledgement"]').click();
};

const openNewCompendiumEntry = () => {
  cy.get('[data-cy=my-discoveries]').click();
  cy.get('[data-cy=add-discovery]').click();
};

const addEntry = (uid) => {
  cy.get('[data-cy="add-entry"]').click();
  cy.contains('.toast-body', `You have successfully recorded your item "${uid}" in the compendium.`);
  cy.get('[data-dismiss="toast"]').click();
  cy.get('[data-cy="search-input"]').type(uid);
  cy.contains('.list-group-item', uid);
  cy.get('[data-cy=all-discoveries]').click();
  cy.get('[data-cy="search-input"]').type(uid);
  cy.contains('.list-group-item', uid);
};

const saveDraft = (uid) => {
  cy.get('[data-cy="save-draft"]').click();
  cy.contains('.toast-body', `You have successfully recorded your item "${uid}" in the compendium.`);
  cy.get('[data-dismiss="toast"]').click();
  cy.get('[data-cy="search-input"]').type(uid);
  cy.contains('.list-group-item', uid);
  cy.get('[data-cy=all-discoveries]').click();
  cy.get('[data-cy="search-input"]').type(uid);
  cy.contains('.list-group-item', uid).should('not.exist');
};

module.exports = {
  fillCompendiumFields,
  openNewCompendiumEntry,
  addEntry,
  saveDraft,
};
