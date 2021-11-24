/// <reference types='cypress' />

describe('Routing protection', () => {
	before(() => {
		indexedDB.deleteDatabase('firebaseLocalStorageDb');
		cy.visit('http://localhost:3000/');
	});

	it('Re-route from /groups to /root if user is not logged in', () => {
		cy.visit('http://localhost:3000/groups');
		cy.url().should('eq', 'http://localhost:3000/');
	});
	it('Re-route from /user-settings to /root if user is not logged in', () => {
		cy.visit('http://localhost:3000/user-settings');
		cy.url().should('eq', 'http://localhost:3000/');
	});
	it('Re-route from /loot to /root if user is not logged in', () => {
		cy.visit('http://localhost:3000/loot');
		cy.url().should('eq', 'http://localhost:3000/');
	});
});

describe('Login', () => {
	before(() => {
		indexedDB.deleteDatabase('firebaseLocalStorageDb');
		cy.visit('http://localhost:3000/');
	});

	it('Welcome message displayed', () => {
		cy.get('[data-cy=welcome-message]');
        cy.get('[data-cy=navbar-toggle]').should('not.exist');
	});

	it('Login and signup options exist', () => {
		cy.get('[data-cy=get-started]').click();
        cy.get('[data-cy=login-check-password]').should('not.exist');
        cy.get('[data-cy=forgot-password]').should('exist');
        cy.get('[data-cy=sign-up-here]').click();
        cy.get('[data-cy=login-check-password]').should('exist');
        cy.get('[data-cy=sign-up-here]').click();
	});

	it('Complete Login', () => {
		cy.get('[data-cy=login-email]').type('test@test.com');
		cy.get('[data-cy=login-password]').type('password');
		cy.get('[data-cy=login]').click();
	});

	it('Routed to /groups', () => {
		cy.url().should('eq', 'http://localhost:3000/groups');
	});

    it('Check navbar options', () => {
        cy.get('[data-cy=navbar-toggle]').click();
        cy.get('[data-cy=navbar-groups]').should('not.exist');
    })

	it('Re-route from /root to /groups if user is logged in', () => {
		cy.visit('http://localhost:3000/');
		cy.url().should('eq', 'http://localhost:3000/groups');
	});
});

describe('Cycle through navigation', () => {
	it('View loot', () => {
		cy.get('[data-cy=group0]').click();
		cy.url().should('include', 'http://localhost:3000/loot');
		cy.get('[data-cy=navbar-toggle]').click();
		cy.get('[data-cy=navbar-groups]');
		cy.get('[data-cy=navbar-settings]');
		cy.get('[data-cy=navbar-toggle]').click();
	});

	it('View settings', () => {
		cy.get('[data-cy=navbar-toggle]').click();
		cy.get('[data-cy=navbar-settings]').click();
		cy.url().should('include', 'http://localhost:3000/user-settings');
		cy.get('[data-cy=navbar-toggle]').click();
        cy.get('[data-cy=navbar-settings]').should('not.exist');
		cy.get('[data-cy=navbar-toggle]').click();
	});

	it('View groups', () => {
		cy.get('[data-cy=navbar-toggle]').click();
		cy.get('[data-cy=navbar-groups]').click();
		cy.url().should('include', 'http://localhost:3000/groups');
		cy.get('[data-cy=navbar-toggle]').click();
        cy.get('[data-cy=navbar-groups]').should('not.exist');
		cy.get('[data-cy=navbar-toggle]').click();
	});

});

describe('Logout user', () => {
	it('Click menu and logout', () => {
		cy.get('[data-cy=navbar-toggle').click();
		cy.get('[data-cy=navbar-logout').click();
	});
});
