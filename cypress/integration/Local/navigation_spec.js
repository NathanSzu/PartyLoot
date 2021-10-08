/// <reference types='cypress' />
import app from '../../../src/utils/firebase';

describe('Create user and login', () => {

    // after(() => {
    //     const auth = app.auth().getAuth();
    //     const user = auth.urrentUser;

    //     console.log(auth);
    //     console.log(currentUser)

    //     app.auth().deleteUser(user).then(() => {
    //         // User deleted.
    //       }).catch((error) => {
    //         // An error ocurred
    //         // ...
    //       });
    // })

    it('Welcome message displayed', () => {
        cy.visit('http://localhost:3000/')
        cy.get('[data-cy=welcome-message]')
    });
    it('Login and signup options exist', () => {
        cy.get('[data-cy=get-started]').click()
    });
    it('Signup form filled in', () => {
        cy.get('[data-cy=sign-up-here').click()
        cy.get('[data-cy=login-email').type('test@test.com')
        cy.get('[data-cy=login-password').type('password')
        cy.get('[data-cy=login-check-password').type('password')
    });
    // it('Account created', () => {
    //     cy.get('[data-cy=signup]').click()
    // })
})