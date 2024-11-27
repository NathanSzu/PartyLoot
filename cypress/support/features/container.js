const name1 = 'Test container name';
const name2 = 'A much better name';

const createContainer = (containerName = name1) => {
  cy.get('[data-cy="container-name"]').clear().type(containerName);
  cy.get('[data-cy="create-container"]').click();
  openContainerModal();
  cy.contains('.modal-footer', containerName);
};

const openContainerModal = () => cy.get('[data-cy="container-modal"]').click();

const openContainerFromList = (containerName = name1) => {
  cy.contains('.list-group-item', containerName).within(() => {
    cy.get('button').click();
  });
};

const clearContainerFields = (containerName = name2) => {
  cy.get('[data-cy="container-name"]').should('have.value', containerName);
  cy.get('[data-cy="clear-container-fields"]').click();
  cy.get('[data-cy="container-name"]').should('have.value', '');
};

const editContainer = (containerName = name1, containerName2 = name2) => {
  openContainerFromList();
  cy.contains('.modal-title', containerName);
  cy.get('[data-cy="container-name"]').should('have.value', containerName);
  cy.get('[data-cy="container-name"]').clear().type(containerName2);
  cy.get('[data-cy="save-container-changes"]').click();
  openContainerModal();
  cy.contains('.modal-footer', containerName2);
};

const deleteContainer = () => {
    cy.get('[data-cy="delete-container"]').click();
    cy.contains('button', 'I\'m sure, delete!');
    cy.get('[data-cy="delete-container"]').click();
    openContainerModal();
    cy.get('.modal-footer').should('not.exist');
};

module.exports = {
  createContainer,
  openContainerModal,
  openContainerFromList,
  clearContainerFields,
  editContainer,
  deleteContainer
};
