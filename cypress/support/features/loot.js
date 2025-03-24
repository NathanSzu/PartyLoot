let currencyKeys = ['currency1', 'currency2', 'currency3', 'currency4', 'currency5', 'currency6'];

const fillItemFields = (qty) => {
  cy.get('[data-cy="item-name"]').type('New item');
  qty && cy.get('[data-cy="item-qty"]').type(qty);
  cy.get('[data-cy="charge"]').type(5);
  cy.get('[data-cy="charge-max"]').type(7);
  cy.get('.ql-editor').type('A grand item description! 1234567890');
  cy.get('[data-cy="item-tags"]').type('scroll, consumable');
  cy.get('[data-cy="rarity-select"]').select('common');
};

const addItem = (qty) => {
  cy.get('[data-cy=add-item]').click();
  fillItemFields(qty);
  cy.get('[data-cy=create-item]').click();
  cy.contains('#loot-accordion', 'New item');
};

const fillSellFields = (qty) => {
  cy.contains('#loot-accordion', 'New item').eq(0).click();
  cy.get('[data-cy=sell-item]').click();
  qty && cy.get('[data-cy=sell-qty]').clear().type(qty);
  cy.get('[role=dialog]').within(() => {
    currencyKeys.forEach((key) => {
      cy.get(`[data-cy=${key}]`).type(1);
    });
  });
};

const selectItemOwner = (ownerName) => {
    cy.get('[role=dialog]').within(() => {
        cy.get('[data-cy=owner-select]').select(ownerName);
      });
};

const checkCurrencyValues = (value) => {
  currencyKeys.forEach((key) => {
    cy.get(`[data-cy=${key}]`).within(() => {
      cy.contains('div', value);
    });
  });
};

module.exports = {
  addItem,
  fillItemFields,
  fillSellFields,
  selectItemOwner,
  checkCurrencyValues
};
